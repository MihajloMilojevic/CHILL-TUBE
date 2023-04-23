import { useRouter } from "next/router";
import { useState } from "react";
import API from "../services/api";
import { useStateContext } from "../services/context/ContextProvider";
import {Layout} from "../components";

const initialFormData = {
	username: "",
	email: "",
	password: "",
	confirm: ""
}

export default function RegisterPage() {

	const {createNotification, notificationTypes} = useStateContext();
	const [formData, setFormData] = useState(initialFormData);
	const [buttonDisabled, setButtonDisabled] = useState(false);
	const router = useRouter();

	async  function handleSubmit(e) {
		e.preventDefault();
		setButtonDisabled(true);
		// sends api request
		const {error, data} = await API.UserAPI.register(formData)
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
                message: "You have successfully registered you will be redirected to homepage soon"
            })
			router.push("/");
        }
		setButtonDisabled(false);
 	}

	async function handleChange(e) {
		setFormData({...formData, [e.target.name]: e.target.value});
	}

	return (
		<Layout user={null}>
			<form onSubmit={handleSubmit}>
				<label htmlFor="username">Username:</label>
				<input type="text" id="username" name="username" onChange={handleChange} value={formData.username} />
				<br/>
				<label htmlFor="email">Email:</label>
				<input type="text" id="email" name="email" onChange={handleChange} value={formData.email} />
				<br/>
				<label htmlFor="password">Password: </label>
				<input type="password" id="password" name="password" onChange={handleChange} value={formData.password} />
				<br/>
				<label htmlFor="confirm">Confirm password: </label>
				<input type="password" id="confirm" name="confirm" onChange={handleChange} value={formData.confirm} />
				<br/>
				<button disabled={buttonDisabled} type="submit">Register</button>
			</form>
		</Layout>
	);
}