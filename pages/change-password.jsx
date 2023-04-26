import {SSRSession} from "../services/sessions/get-session"
import auth from "../services/middleware/authentication"
import { Layout } from "../components";
import { useState } from "react";
import API from "../services/api";
import { useStateContext } from "../services/context/ContextProvider";
import {AiOutlineEyeInvisible} from "@react-icons/all-files/ai/AiOutlineEyeInvisible";
import {AiOutlineEye} from "@react-icons/all-files/ai/AiOutlineEye"
import styles from "../styles/UserForms.module.css";

const initialFormData = {
	oldPassword: "",
	newPassword: "",
	confirm: ""
}

export default function ChangePasswordPage({user}) {

	const {createNotification, notificationTypes} = useStateContext();
	const [formData, setFormData] = useState(initialFormData);
	const [buttonDisabled, setButtonDisabled] = useState(false);
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

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
        }
		setButtonDisabled(false);
		setFormData(initialFormData);
 	}

	async function handleChange(e) {
		setFormData({...formData, [e.target.name]: e.target.value});
	}
	return (
		<Layout user={user}>
			<div className={styles.form_wrapper}>
				<form onSubmit={handleSubmit} className={styles.form}>
					<h1>Change Password Page</h1>
					<div className={styles.group}>
						<label className={`${styles.label}`} htmlFor="oldPassword">Old password: </label>
						<div className={styles.password}>
							<input placeholder="Enter your old password..." type={showOldPassword ? "text" : "password"} id="oldPassword" name="oldPassword" onChange={handleChange} value={formData.oldPassword} className={`${styles.input}`} />
							{showOldPassword ? <AiOutlineEyeInvisible size={23} onClick={() => setShowOldPassword(false)} /> : <AiOutlineEye size={23}  onClick={() => setShowOldPassword(true)} />}
						</div>
					</div>
					<div className={styles.group}>
						<label className={`${styles.label}`} htmlFor="newPassword">New password: </label>
						<div className={styles.password}>
							<input placeholder="Enter your new password..." type={showNewPassword ? "text" : "password"} id="newPassword" name="newPassword" onChange={handleChange} value={formData.newPassword} className={`${styles.input}`} />
							{showNewPassword ? <AiOutlineEyeInvisible size={23} onClick={() => setShowNewPassword(false)} /> : <AiOutlineEye size={23}  onClick={() => setShowNewPassword(true)} />}
						</div>
					</div>
					<div className={styles.group}>
						<label className={`${styles.label}`} htmlFor="confirm">Confirm password: </label>
						<div className={styles.password}>
							<input placeholder="Confirm your new password..." type={showConfirmedPassword ? "text" : "password"} id="confirm" name="confirm" onChange={handleChange} value={formData.confirm} className={`${styles.input}`} />
							{showConfirmedPassword ? <AiOutlineEyeInvisible size={23} onClick={() => setShowConfirmedPassword(false)} /> : <AiOutlineEye size={23}  onClick={() => setShowConfirmedPassword(true)} />}
						</div>
					</div>
					<button className={`button ${styles.submit_button}`} disabled={buttonDisabled} type="submit">Change Password</button>
				</form>
			</div>
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