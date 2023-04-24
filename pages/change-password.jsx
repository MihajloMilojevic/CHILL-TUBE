import {SSRSession} from "../services/sessions/get-session"
import auth from "../services/middleware/authentication"
import { Layout } from "../components";
import { useState } from "react";
import API from "../services/api";
import { useStateContext } from "../services/context/ContextProvider";
import { useRouter } from "next/router";

const initialFormData = {
	oldPassword: "",
	newPassword: "",
	confirm: ""
}

export default function ChangePasswordPage({user}) {

	const {createNotification, notificationTypes} = useStateContext();
	const [formData, setFormData] = useState(initialFormData);
	const [buttonDisabled, setButtonDisabled] = useState(false);
	const router = useRouter();

	async  function handleSubmit(e) {
		e.preventDefault();
		setButtonDisabled(true);
		// sends api request
		const {error, data} = await API.UserAPI.changePassword(formData);
		if(error || !data.ok) { 
			// if an error occured create error notification
            createNotification({
                type: notificationTypes.ERROR,
                title: "Error",
                message: error.message || data.message
            })
        }
        else {
            createNotification({
                type: notificationTypes.SUCCESS,
                title: "Success",
                message: "You have successfully changed your password"
            })
			router.push("/");
        }
		setButtonDisabled(false);
		setFormData(initialFormData);
 	}

	async function handleChange(e) {
		setFormData({...formData, [e.target.name]: e.target.value});
	}
	return (
		<Layout user={user}>
			<h1>Change Password Page</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor="oldPassword">Old password: </label>
				<input type="password" id="oldPassword" name="oldPassword" onChange={handleChange} value={formData.oldPassword} />
				<br/>
				<label htmlFor="newPassword">New password: </label>
				<input type="password" id="newPassword" name="newPassword" onChange={handleChange} value={formData.newPassword} />
				<br/>
				<label htmlFor="confirm">Confirm password: </label>
				<input type="password" id="confirm" name="confirm" onChange={handleChange} value={formData.confirm} />
				<br/>
				<button disabled={buttonDisabled} type="submit">Change Password</button>
			</form>
		</Layout>
	)
}

export const getServerSideProps = SSRSession(async ({req, res}) => {
	const user = await auth(req, res);
	if(!user) return {
		redirect: {
			destination: "/",
			permanent: false
		}
	}
	return {
		props: {
			user
		}
	}
})