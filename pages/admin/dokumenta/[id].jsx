import React, { useState, useRef } from 'react'
import AdminLayout from "../../../components/AdminLayout/AdminLayout";
import { SSRSession } from '../../../services/sessions/get-session';
import auth from '../../../services/middleware/authentication';
import { PageTitle, Plus, DragDropFile } from '../../../components';
import { useRouter } from 'next/router';
import { useStateContext } from '../../../services/context/ContextProvider';
import Dokument from '../../../services/database/controllers/dokument';
import DokumentAPI from '../../../services/api/Dokument';


function Stranica({user, kategorije, dokument}) {
	const [kategorija, setKategorija] = useState(dokument.kategorijaId)
	const [naziv, setNaziv] = useState(dokument.naziv)
	const [opis, setOpis] = useState(dokument.opis)
	const [fajlovi, setFajlovi] = useState(dokument.fajlovi || []);
	const [title, setTitle] = useState(dokument.naziv);

	const {createNotification, notificationTypes, setModalOpen, setModalChildren} = useStateContext();
	const router = useRouter();
	
	function removeFile(index) {
		setFajlovi([...fajlovi.filter((_, i) => i !== index) ])
	}

	async function handleSubmit(e) {
		e.preventDefault();
		// console.log({kategorija, naziv, opis});
		if(!naziv) {
			return createNotification({
				type: notificationTypes.ERROR,
				title: "Грешка",
				message: "Назив је обавезан"
			})
		}
		if(!kategorija) {
			return createNotification({
				type: notificationTypes.ERROR,
				title: "Грешка",
				message: "Категорија је обавезна"
			})
		}
		if(fajlovi.length === 0) {
			return createNotification({
				type: notificationTypes.ERROR,
				title: "Грешка",
				message: "Морате одабрати макар један документ"
			})
		}
		let newFiles = [];
		let oldFiles = [];

		for (const file of fajlovi) {
			if(file.name) newFiles.push(file);
			if(file.naziv) oldFiles.push(file);
		}
		console.log({newFiles, oldFiles, json: JSON.stringify([])});
		const {error, data} = await DokumentAPI.Update(newFiles, oldFiles, kategorija, naziv, opis, dokument.id);
		if(error) {
            createNotification({
                type: notificationTypes.ERROR,
                title: "Грешка",
                message: error.message
            })
        }
        else {
			setNaziv(data.dokument.naziv);
			setKategorija(data.dokument.kategorija);
			setOpis(data.dokument.opis);
			setFajlovi(JSON.parse(data.dokument.fajlovi));
            createNotification({
                type: notificationTypes.SUCCESS,
                title: "Успех",
                message: "Успешно сте изменили документ"
            })
			setTitle(naziv);
        }
	}
	return (
		<AdminLayout user={user}>
			<PageTitle>{title}</PageTitle>
			<button 
				onClick={() => {
					setModalChildren(<DeleteModal id={dokument.id} naziv={title} />);
					setModalOpen(true);
				}}
			>
				Обриши
			</button>
			<form onSubmit={handleSubmit}>
				<button type="submit">Сачувај</button> <br/>
				<label htmlFor='naziv'>Назив: </label>
				<input id='naziv' name='naziv' value={naziv} onChange={e => setNaziv(e.target.value)} /> <br/>
				<label htmlFor='kategorija'>Категорија: </label>
				<select value={kategorija} onChange={e => setKategorija(e.target.value)}>
					<option value={""}></option>
					{kategorije.map(kat => (<option key={kat.id} value={kat.id}>{kat.naziv}</option>))}
				</select> <br/>
				<label htmlFor='opis'>Опис: </label> <br/>
				<textarea id='opis' name='opis' value={opis} onChange={e => setOpis(e.target.value)} /> <br/>
				<div style={{display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 20}}>
					<label>Фајлови: </label> 
					<Plus onClick={() => {
						setModalChildren(<DodavanjeNoveSlike dodajNovu={novi => setFajlovi([...fajlovi, ...novi])} />);
						setModalOpen(true)
					}} />
				</div>
				{
					fajlovi.length === 0 ? (<p>Нема додатих докумената.</p>) : (
						fajlovi.map((f, index) => (
							<p key={index}>
								{index + 1}. - <i>{f.naziv ? <a style={{textDecoration: "underline"}} href={f.src} target="_blank" rel="noreferrer">{f.naziv}</a> : f.name}</i>
								<button 
									type="button"
									onClick={() => {
										setModalChildren(<RemoveFileModal naziv={f.naziv || f.name} onYes={() => removeFile(index)}/>);
										setModalOpen(true);
									}}
								>
									X
								</button>
							</p>
						))
					)
				}
			</form>
		</AdminLayout>
	)
}

export default Stranica

function RemoveFileModal({naziv, onYes}) {

	const {createNotification, notificationTypes, setModalOpen, setModalChildren} = useStateContext();
	const router = useRouter();
	async function handleYes() {
		onYes();
		setModalOpen(false);
	}
	async function handleNo() {
		setModalOpen(false);
	}

	return (
		<div>
			<h3>Уклањање фајла</h3>
			<p>Да ли сте сигурни да желите да уклоните фајл {naziv}</p>
			<button onClick={handleYes}>Да</button>
			<button onClick={handleNo}>Не</button>
		</div>
	);
}

function DeleteModal({id, naziv}) {

	const {createNotification, notificationTypes, setModalOpen,} = useStateContext();
	const router = useRouter();
	async function handleYes() {
		const {error, data} = await DokumentAPI.Delete({id});
		if(error) {
            createNotification({
                type: notificationTypes.ERROR,
                title: "Грешка",
                message: error.message
            })
        }
        else {
            createNotification({
                type: notificationTypes.SUCCESS,
                title: "Успех",
                message: "Успешно сте обрисали документ " + naziv
            })
			router.push("/admin/dokumenta");
        }
		setModalOpen(false);
	}
	async function handleNo() {
		setModalOpen(false);
	}

	return (
		<div>
			<h3>Брисање докумената</h3>
			<p>Да ли сте сигурни да желите да обришете докуменат {naziv}?</p>
			<button onClick={handleYes}>Да</button>
			<button onClick={handleNo}>Не</button>
		</div>
	);
}

function DodavanjeNoveSlike({dodajNovu}) {
	const {setModalOpen} = useStateContext();
	const inputRef = useRef(null);
	return (
		<div 
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				alignItems: "center",
				gap: "1.5rem"
			}}
		>
			<div 
				style={{
					flex: 1, 
					overflow: "hidden",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<DragDropFile inputRef={inputRef} />
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: "1.5rem"
				}}
			>
				<button 
					onClick={() => {
						dodajNovu(inputRef.current.files);
						setModalOpen(false)
					}}
				>
					Odaberi
				</button>
				<button 
					style={{background: "white", color: "black"}}
					className="box-shadow"
					onClick={() => {
						setModalOpen(false);
					}}
				>
					Odustani
				</button>
			</div>
		</div>
	)
}

export const getServerSideProps = SSRSession(async ({req, res, query}) => {
	const user = await auth(req, res);
	if(!user) return {
		redirect: {
			destination: "/admin/login",
			permanent: false
		}
	}
	if(req.session.user.promeniLozinku) return {
		redirect: {
			destination: "/admin/promeni-lozinku",
			permanent: false
		}
	}
	const [kategorijaRes, dokumentRes] = await Promise.all([Dokument.SveKategorije(), Dokument.ById(query.id)]);
	if(kategorijaRes.error) 
		return {
			redirect: {
				destination: "/error?msg="+kategorijaRes.error.message,
				permanent: false
			}
		}
	if(dokumentRes.error) 
		return {
			redirect: {
				destination: "/error?msg="+ dokumentRes.error.message,
				permanent: false
			}
		}
	if(dokumentRes.data.length == 0) 
		return {
			notFound: true
		}
	const dokument = {
		id: dokumentRes.data[0].id,
		naziv: dokumentRes.data[0].naziv,
		opis: dokumentRes.data[0].opis,
		datum: 	new Date(dokumentRes.data[0]).datum,
		kategorijaId: dokumentRes.data[0].kategorijaId,
		arhivirano: Boolean(dokumentRes.data[0].arhivirano),
		fajlovi: JSON.parse(dokumentRes.data[0].fajlovi)
	}
	return {
		props: {
			user,
			kategorije: JSON.parse(JSON.stringify(kategorijaRes.data)),
			dokument: JSON.parse(JSON.stringify(dokument))
		}
	}
})

