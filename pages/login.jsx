import { useRouter } from "next/router";
import { useState } from "react";
import API from "../services/api";
import { useStateContext } from "../services/context/ContextProvider";
import {Layout} from "../components";
import {AiOutlineEyeInvisible} from "@react-icons/all-files/ai/AiOutlineEyeInvisible";
import {AiOutlineEye} from "@react-icons/all-files/ai/AiOutlineEye"
import styles from "../styles/Forms.module.css";

const initialFormData = {
	email: "",
	password: ""
}

export default function LoginPage() {

	const {createNotification, notificationTypes} = useStateContext();
	const [formData, setFormData] = useState(initialFormData);
	const [buttonDisabled, setButtonDisabled] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
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
			router.push("/");
        }
		setButtonDisabled(false);
 	}

	async function handleChange(e) {
		setFormData({...formData, [e.target.name]: e.target.value});
	}

	return (
		<Layout user={null}>
			<div className={styles.form_wrapper}>
				<form onSubmit={handleSubmit} className={styles.form}>
					<h1>Login Page</h1>
					<div className={styles.group}>
						<label htmlFor="email" className={`${styles.label}`}>Email:</label>
						<input type="text" id="email" placeholder="Enter your email..." name="email" onChange={handleChange} value={formData.email} className={`${styles.input}`} />
					</div>
					<div className={styles.group}>
						<label htmlFor="password" className={`${styles.label}`}>Password: </label>
						<div className={styles.password}>
							<input type={showPassword ? "text" : "password"} id="password" placeholder="Enter your password..." name="password" onChange={handleChange} value={formData.password} className={`${styles.input}`} />
							{showPassword ? <AiOutlineEyeInvisible size={23} onClick={() => setShowPassword(false)} /> : <AiOutlineEye size={23}  onClick={() => setShowPassword(true)} />}
						</div>
					</div>
					<button className={`button ${styles.submit_button}`} disabled={buttonDisabled} type="submit">Login</button>
				</form>
			</div>
		</Layout>
	);
}