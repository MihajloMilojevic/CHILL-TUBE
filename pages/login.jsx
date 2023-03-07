import { useRouter } from "next/router";
import { useState } from "react";
import API from "../services/api";
import { useStateContext } from "../services/context/ContextProvider";

const initialFormData = {
	email: "",
	password: ""
}

export default function LoginPage() {

	const {createNotification, notificationTypes} = useStateContext();
	const [formData, setFormData] = useState(initialFormData);
	const [buttonDisabled, setButtonDisabled] = useState(false);
	const router = useRouter();

	async  function handleSubmit(e) {
		e.preventDefault();
		setButtonDisabled(true);
		// sends api request
		const {error, data} = await API.UserAPI.login(formData)
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
                message: "You have successfully logged in, you will be redirected to homepage soon"
            })
			// if user is admin redirect him to admin page and if user is regular user redirect to homapage
			if(data.user.admin) 
            	router.push("/admin");
			else
				router.push("/");
        }
		setButtonDisabled(false);
 	}

	async function handleChange(e) {
		setFormData({...formData, [e.target.name]: e.target.value});
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				<label htmlFor="email">Email:</label>
				<input type="text" id="email" name="email" onChange={handleChange} value={formData.email} />
				<br/>
				<label htmlFor="password">Password: </label>
				<input type="password" id="password" name="password" onChange={handleChange} value={formData.password} />
				<br/>
				<button disabled={buttonDisabled} type="submit">Login</button>
			</form>
		</>
	);
}