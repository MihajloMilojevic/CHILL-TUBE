import React from 'react'
import AdminLayout from "../../../components/AdminLayout/AdminLayout";
import { SSRSession } from '../../../services/sessions/get-session';
import auth from '../../../services/middleware/authentication';
import { PageTitle } from '../../../components';
import User from '../../../services/database/controllers/users';
import { useRouter } from 'next/router';
import { useState } from 'react';
import sveDozvole from "../../../services/constants/dozvole.json";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import KorisnikAPI from '../../../services/api/Korisnik';
import { useStateContext } from '../../../services/context/ContextProvider';

function getInitalDozvole(dozvole) {
	return sveDozvole.map((doz) => ({id: doz.id, naziv: doz.naziv.toLowerCase().replace(/_/g, " ") , selected: (dozvole.findIndex((dId) => doz.id===dId) >= 0)}))
}

function Korisnik({user, korisnik}) {
	const [podaci, setPodaci] = useState({ime: korisnik.ime, prezime: korisnik.prezime, korisnickoIme: korisnik.korisnickoIme})
	const [dozvole, setDozvole] = useState(getInitalDozvole(korisnik.dozvole))
	const {createNotification, notificationTypes, setModalOpen, setModalChildren} = useStateContext();
	const [title, setTitle] = useState(korisnik.ime + " " + korisnik.prezime);
	const router = useRouter();
	function handleChange(e) {
		setPodaci({...podaci, [e.target.name]: e.target.value})
	}
	async function handleSubmit(e) {
		e.preventDefault();
		// console.log({id: korisnik.id, ...podaci, dozvole: dozvole.filter(d => d.selected).map(d => d.id)});
		const {error, data} = await KorisnikAPI.edit({id: korisnik.id, ...podaci, dozvole: dozvole.filter(d => d.selected).map(d => d.id)});
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
                message: "Успешно сте сачували промене"
            })
			setTitle(podaci.ime + " " + podaci.prezime)
        }
	}
	return (
		<AdminLayout user={user}>
			<PageTitle>{title}</PageTitle>
			<button 
				onClick={() => {
					setModalChildren(<DeleteModal id={korisnik.id} naziv={title} />);
					setModalOpen(true);
				}}
			>
				Обриши
			</button>
			<button 
				onClick={() => {
					setModalChildren(<ResetPasswordModal id={korisnik.id} naziv={title} />);
					setModalOpen(true);
				}}
			>
				Ресетуј лозинку
			</button>
			<form onSubmit={handleSubmit}>
				<button type='submit'>Сачувај</button> <br/>
				<label htmlFor='ime'>Име: </label>
				<input id='ime' name='ime' value={podaci.ime} onChange={handleChange} /> <br/>
				<label htmlFor='prezime'>Презиме: </label>
				<input id='prezime' name='prezime' value={podaci.prezime} onChange={handleChange} /> <br/>
				<label htmlFor='korisnickoIme'>Корисничко име: </label>
				<input id='korisnickoIme' name='korisnickoIme' value={podaci.korisnickoIme} onChange={handleChange} /> <br/>
				<p>Дозволе:</p>
				<div>
					{dozvole.map((dozvola, index) => (
						<div key={dozvola.id} >
						<FormControlLabel 
							
							control={
								<Switch 
									checked={dozvola.selected}
									onChange={() => {
										let dozvoleCopy = [...dozvole];
										dozvoleCopy[index].selected = !dozvoleCopy[index].selected
										setDozvole(dozvoleCopy)
									}}
								/>
							} 
							label={dozvola.naziv} 	
						/>
						</div>
					))}
				</div>
			</form>
		</AdminLayout>
	)
}

export default Korisnik


function DeleteModal({id, naziv}) {

	const {createNotification, notificationTypes, setModalOpen, setModalChildren} = useStateContext();
	const router = useRouter();
	async function handleYes() {
		const {error, data} = await KorisnikAPI.delete({id});
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
                message: "Успешно сте обрисали корисника " + naziv
            })
			router.push("/admin/korisnici");
        }
		setModalOpen(false);
	}
	async function handleNo() {
		setModalOpen(false);
	}

	return (
		<div>
			<h3>Брисање корисника</h3>
			<p>Да ли сте сигурни да желите да обришете корисника {naziv}</p>
			<button onClick={handleYes}>Да</button>
			<button onClick={handleNo}>Не</button>
		</div>
	);
}

function ResetPasswordModal({id, naziv}) {

	const {createNotification, notificationTypes, setModalOpen, setModalChildren} = useStateContext();
	const router = useRouter();
	async function handleYes() {
		const {error, data} = await KorisnikAPI.resetPassword({id});
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
                message: "Успешно сте ресетовали лозинку кориснику " + naziv
            })
        }
		setModalOpen(false);
	}
	async function handleNo() {
		setModalOpen(false);
	}

	return (
		<div>
			<h3>Ресетовање лозинке</h3>
			<p>Да ли сте сигурни да желите да ресетујете лозинку кориснику {naziv}</p>
			<button onClick={handleYes}>Да</button>
			<button onClick={handleNo}>Не</button>
		</div>
	);
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
	const queryResult = await User.getUserById(query.id);
	if(queryResult.error) 
		return {
			redirect: {
				destination: "/error?msg="+ queryResult.error.message,
				permanent: false
			}
		}
	if(queryResult.data.length == 0) 
		return {
			notFound: true
		}
	const korisnikSve = queryResult.data[0];
	// console.log(korisnikSve.dozvole);
	const korisnik = {
		id: korisnikSve.id,
		korisnickoIme: korisnikSve.korisnickoIme,
		ime: korisnikSve.ime,
		prezime: korisnikSve.prezime,
		dozvole: JSON.parse(korisnikSve.dozvole) || []
	}
	return {
		props: {
			user,
			korisnik
		}
	}
})
