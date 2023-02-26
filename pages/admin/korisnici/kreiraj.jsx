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
import { useEffect } from 'react';
import {osisaj, convert} from "../../../services/utils/translate"

function getInitalDozvole() {
	return sveDozvole.map((doz) => ({id: doz.id, naziv: doz.naziv.toLowerCase().replace(/_/g, " ") , selected: false}))
}

function Korisnik({user}) {
	const [ime, setIme] = useState("")
	const [prezime, setPrezime] = useState("")
	const [korisnickoIme, setKorisnickoIme] = useState("")
	const [dozvole, setDozvole] = useState(getInitalDozvole())
	const {createNotification, notificationTypes} = useStateContext();
	const router = useRouter();

	useEffect(() => {
		if(ime != "" && prezime != "")
			setKorisnickoIme(osisaj(convert(`${prezime}.${ime}`)).toLowerCase())
		else if (ime == "")
			setKorisnickoIme(osisaj(convert(`${prezime}`)).toLowerCase())
		else 
			setKorisnickoIme(osisaj(convert(`${ime}`)).toLowerCase())
	}, [ime, prezime])

	async function handleSubmit(e) {
		e.preventDefault();
		const {error, data} = await KorisnikAPI.create({ime, prezime, korisnickoIme, dozvole: dozvole.filter(d => d.selected).map(d => d.id)});
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
                message: "Успешно сте креирали корисника"
            })
			router.push("/admin/korisnici");
        }
	}
	return (
		<AdminLayout user={user}>
			<PageTitle>Додај корисника</PageTitle>
			<form onSubmit={handleSubmit}>
				<button type='submit'>Додај</button> <br/>
				<label htmlFor='ime'>Име: </label>
				<input id='ime' name='ime' value={ime} onChange={e => setIme(e.target.value)} /> <br/>
				<label htmlFor='prezime'>Презиме: </label>
				<input id='prezime' name='prezime' value={prezime} onChange={e => setPrezime(e.target.value)} /> <br/>
				<label htmlFor='korisnickoIme'>Корисничко име: </label>
				<input id='korisnickoIme' name='korisnickoIme' value={korisnickoIme} onChange={e => setKorisnickoIme(e.target.value)} /> <br/>
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
	
	return {
		props: {
			user,
		}
	}
})
