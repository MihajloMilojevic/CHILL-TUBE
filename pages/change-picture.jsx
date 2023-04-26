import {SSRSession} from "../services/sessions/get-session"
import auth from "../services/middleware/authentication"
import { useStateContext } from "../services/context/ContextProvider";
import { Layout } from "../components";
import { useEffect, useRef, useState } from "react";
import API from "../services/api";
import {FiCamera} from "@react-icons/all-files/fi/FiCamera"
import styles from "../styles/Forms.module.css";


export default function ChangePicturePage({user: userDB}) {
	const [user, setUser] = useState(userDB);
	const [pictureUrl, setPictureUrl] = useState(user.picture)
	const inputRef = useRef(null);
	const {createNotification, notificationTypes} = useStateContext();

	function handleChange() {
		if(!inputRef.current) return setPictureUrl(user.picture);
		if(!inputRef.current.value) return setPictureUrl(user.picture);
		setPictureUrl(URL.createObjectURL(inputRef.current.files[0]));
	}

	async function handleSave() {
		if(!inputRef.current.value) return createNotification({
			type: notificationTypes.ERROR,
			title: "Error",
			message: "You need to upload an image in order to change your profile picture"
		});
		if(!inputRef.current.files[0].type.startsWith("image"))return createNotification({
			type: notificationTypes.ERROR,
			title: "Error",
			message: "You need to upload an image file type"
		});
		const {error, data} = await API.UserAPI.changeProfilePicture(inputRef.current.files[0]);
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
                message: "You have successfully changed your profile picture"
            })
			setUser({...user, ...data.user});
			inputRef.current.value = "";
			setPictureUrl(data.user.picture);
        }
	}

	function handleCancel() {
		setPictureUrl(user.picture);
		inputRef.current.value = "";
	}

	return (
		<Layout user={user}>
			<div className={styles.form_wrapper}>
				<div className={styles.form}>
					<h1>Change Picture Page</h1>
					<div className={styles.button_group}>
						<button className={`button ${styles.submit_button}`} onClick={handleSave}>Save</button>
						<button className={`button ${styles.submit_button}`} onClick={handleCancel}>Cancel</button>
					</div>
					<div className={styles.image_preview}>
						<img src={pictureUrl} alt="profile"/>
						<div className={styles.change_picture} onClick={() => inputRef.current?.click()} >
							<FiCamera size={25} color="white"/>
						</div>
					</div>
					<input className={styles.file_input} type="file" accept="image/*" ref={inputRef} onChange={handleChange}/>
				</div>	
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