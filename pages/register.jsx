import { useRouter } from "next/router";
import { useState } from "react";
import API from "../services/api";
import { useStateContext } from "../services/context/ContextProvider";
import {Layout} from "../components";
import {AiOutlineEyeInvisible} from "@react-icons/all-files/ai/AiOutlineEyeInvisible";
import {AiOutlineEye} from "@react-icons/all-files/ai/AiOutlineEye"
import styles from "../styles/UserForms.module.css";

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
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
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
			<div className={styles.form_wrapper}>
				<form onSubmit={handleSubmit} className={styles.form}>
					<h1>Register Page</h1>
					<div className={styles.group}>
						<label className={`${styles.label}`} htmlFor="username">Username:</label>
						<input placeholder="Enter your username..." type="text" id="username" name="username" onChange={handleChange} value={formData.username} className={`${styles.input}`} />
					</div>
					<div className={styles.group}>
						<label className={`${styles.label}`} htmlFor="email">Email:</label>
						<input placeholder="Enter your email..." type="text" id="email" name="email" onChange={handleChange} value={formData.email} className={`${styles.input}`} />
					</div>
					<div className={styles.group}>
						<label className={`${styles.label}`} htmlFor="password">Password: </label>
						<div className={styles.password}>
							<input placeholder="Enter your password..." type={showPassword ? "text" : "password"} id="password" name="password" onChange={handleChange} value={formData.password} className={`${styles.input}`} />
							{showPassword ? <AiOutlineEyeInvisible size={23} onClick={() => setShowPassword(false)} /> : <AiOutlineEye size={23}  onClick={() => setShowPassword(true)} />}
						</div>	
					</div>
					<div className={styles.group}>
						<label className={`${styles.label}`} htmlFor="confirm">Confirm password: </label>
						<div className={styles.password}>
							<input placeholder="Confirm your password..." type={showConfirmedPassword ? "text" : "password"} id="confirm" name="confirm" onChange={handleChange} value={formData.confirm} className={`${styles.input}`} />
							{showConfirmedPassword ? <AiOutlineEyeInvisible size={23} onClick={() => setShowConfirmedPassword(false)} /> : <AiOutlineEye size={23}  onClick={() => setShowConfirmedPassword(true)} />}
						</div>
					</div>
					<button className={`button ${styles.submit_button}`} disabled={buttonDisabled} type="submit">Register</button>
				</form>
			</div>
		</Layout>
	);
}