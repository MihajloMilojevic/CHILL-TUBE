import { useState } from "react"
import { useRouter } from "next/router";
import { useStateContext } from "../../services/context/ContextProvider";
import KorisnikAPI from "../../services/api/Korisnik";
import {SSRSession} from "../../services/sessions/get-session"
import auth from "../../services/middleware/authentication"

const initalFormData = {
	stara: "",
	nova: "",
	potvrda: ""
}

export default function AdminPromeniLozinku() {

	const [formData, setFormData] = useState(initalFormData)
	const router = useRouter();
	const {createNotification, notificationTypes} = useStateContext();

	function handleChange(e) {
		setFormData({...formData, [e.target.name]: e.target.value});
	}

	async function handleSubmit(e) {
		e.preventDefault()
		// console.log(formData);
		if(formData.nova !== formData.potvrda) {
			createNotification({
                type: notificationTypes.ERROR,
                title: "Грешка",
                message: "Лозинке се не поклапају"
            })
			setFormData({...formData, nova: "", potvrda: ""})
			return;
		}
		const {error} = KorisnikAPI.promeniLozinku(formData.stara, formData.nova);
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
                message: "Успешно сте променили лозинку"
            })
            window.location.href = "/admin";
        }
	}

	return <div>
		<h1>Промени лозинку</h1>
		<form onSubmit={handleSubmit}>
			<label htmlFor="stara" >Стара лозинка: </label>
			<input type="password" id="stara" name="stara" onChange={handleChange} value={formData.stara} /> <br/>
			<label htmlFor="nova" >Нова лозинка: </label>
			<input type="password" id="nova" name="nova" onChange={handleChange} value={formData.nova} /> <br/>
			<label htmlFor="potvrda" >Потврди лозинку: </label>
			<input type="password" id="potvrda" name="potvrda" onChange={handleChange} value={formData.potvrda} /> <br/>
			<button type="submit">Promeni</button>
		</form>
	</div>
}

export const getServerSideProps = SSRSession(async ({req, res}) => {
	const user = await auth(req, res);
	if(!user) return {
		redirect: {
			destination: "/admin/login",
			permanent: false
		}
	}
	return {
		props: {
			user
		}
	}
})