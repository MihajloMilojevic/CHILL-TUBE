import React, { useState, useRef } from 'react'
import AdminLayout from "../../../components/AdminLayout/AdminLayout";
import { SSRSession } from '../../../services/sessions/get-session';
import auth from '../../../services/middleware/authentication';
import { PageTitle, Plus, DragDropFile } from '../../../components';
import { useRouter } from 'next/router';
import { useStateContext } from '../../../services/context/ContextProvider';
import Dokument from '../../../services/database/controllers/dokument';
import DokumentAPI from '../../../services/api/Anime';


function KreirajDokument({user, kategorije}) {
	const [kategorija, setKategorija] = useState("")
	const [naziv, setNaziv] = useState("")
	const [opis, setOpis] = useState("")
	const [fajlovi, setFajlovi] = useState([]);

	const {createNotification, notificationTypes, setModalOpen, setModalChildren} = useStateContext();
	const router = useRouter();


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

		const {error} = await DokumentAPI.Create(fajlovi, kategorija, naziv, opis);
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
                message: "Успешно сте додали документ"
            })
			router.push("/admin/dokumenta");
        }
	}
	
	return (
		<AdminLayout user={user}>
			<PageTitle>Додај документ</PageTitle>
			<form onSubmit={handleSubmit}>
				<button type="submit">Додај</button> <br/>
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
							<p key={index}>{index + 1}. - <i>{f.name}</i></p>
						))
					)
				}
			</form>
		</AdminLayout>
	)
}

export default KreirajDokument

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
	const {error, data} = await Dokument.SveKategorije();

	if(error) 
	return {
		redirect: {
			destination: "/error?msg="+error.message,
			permanent: false
		}
	}

	return {
		props: {
			user,
			kategorije: JSON.parse(JSON.stringify(data))
		}
	}
})
