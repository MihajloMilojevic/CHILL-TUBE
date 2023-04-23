import {useStateContext} from "../../services/context/ContextProvider";
import {useRouter} from "next/router";
import styles from "./Profile.module.css";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {AiOutlineClose} from "@react-icons/all-files/ai/AiOutlineClose"
import {RiLockPasswordLine} from "@react-icons/all-files/ri/RiLockPasswordLine";
import {RiLogoutCircleRLine} from "@react-icons/all-files/ri/RiLogoutCircleRLine";
import {BsBook} from "@react-icons/all-files/bs/BsBook";
import {GrHistory} from "@react-icons/all-files/gr/GrHistory";
import {BsCardImage} from "@react-icons/all-files/bs/BsCardImage";
import API from "../../services/api/";


function Profile() {
	
	const [openDropdown, setOpenDropdown] = useState(false);
	const router = useRouter();
	const {user, createNotification, notificationTypes} = useStateContext();

	async function logout() {
		const {error, data} = await API.UserAPI.logout();
        if(error) {
            createNotification({
                type: notificationTypes.ERROR,
                title: "Error",
                message: error.message
            })
        }
        else {
            createNotification({
                type: notificationTypes.SUCCESS,
                title: "Success",
                message: "You have succesfully logged out"
            })
            router.push("/login");
        }
	}
    if(!user) return (<></>);

	return (
		<div className={styles.profile}>
			<div className={styles.profile_toggle} onClick={() => setOpenDropdown(prev => !prev)}  >
				<Image alt="profile-picture" src={user.picture} layout="fill" />
			</div>
			{
				openDropdown && (
					<div className={`${styles.profile_dropdown} box-shadow`}>
					<button className={styles.profile_close} 
								onClick={
									() => setOpenDropdown(false)
								}
							>
								<AiOutlineClose color="black" size={15} />
							</button>
						<div className={styles.profile_dropdown_header}>
								<h3>{user.username}</h3>
								<p>{user.email}</p>
						</div>
						<div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: 0, padding:0}}></div>
						<Link href="my-lists">
							<div className={styles.profile_dropdown_link} onClick={() => setOpenDropdown(false)}>
								<BsBook color="black"/>
								<span>My Lists</span>
							</div>
						</Link>
						<Link href="/history">
							<div className={styles.profile_dropdown_link} onClick={() => setOpenDropdown(false)}>
								<GrHistory color="black"/>
								<span>History</span>
							</div>
						</Link>
						<Link href="/change-picture">
							<div className={styles.profile_dropdown_link} onClick={() => setOpenDropdown(false)}>
								<BsCardImage color="black"/>
								<span>Change Profile Picture</span>
							</div>
						</Link>
						<Link href="/change-password">
							<div className={styles.profile_dropdown_link} onClick={() => setOpenDropdown(false)}>
								<RiLockPasswordLine color="black"/>
								<span>Change Password</span>
							</div>
						</Link>
						<div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: 0, padding:0}}></div>
						<div 
							className={styles.profile_dropdown_link}
							onClick={() => {setOpenDropdown(false); logout()}}
						>
							<RiLogoutCircleRLine />
							<span>Log out</span>
						</div>
					</div>
				)
			}
		</div>
	)
}

export default Profile