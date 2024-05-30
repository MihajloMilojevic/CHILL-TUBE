import {useStateContext} from "../../services/context/ContextProvider";
import {useRouter} from "next/router";
import styles from "./Profile.module.css";
import { useState } from "react";
import Link from "next/link";
import {RiLockPasswordLine} from "@react-icons/all-files/ri/RiLockPasswordLine";
import {RiLogoutCircleRLine} from "@react-icons/all-files/ri/RiLogoutCircleRLine";
import {BsBook} from "@react-icons/all-files/bs/BsBook";
import {BiHistory} from "@react-icons/all-files/bi/BiHistory";
import {BsCardImage} from "@react-icons/all-files/bs/BsCardImage";
import API from "../../services/api/";
import {CloseButton} from "..";


function Profile() {
	
	const [openDropdown, setOpenDropdown] = useState(false);
	const router = useRouter();
	const {user, createNotification, notificationTypes, windowSize} = useStateContext();

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
			{/* <span>{user.username}</span> */}
			<div className={styles.profile_toggle} onClick={() => setOpenDropdown(prev => !prev)}>
				{(windowSize.width > 450) && (<p><b>{user.username}</b></p>)}
				<div className={styles.profile_toggle_img}>
					<img alt="profile-picture" src={user.picture} />
				</div>
			</div>
			{
				openDropdown && (
					<div className={`${styles.profile_dropdown} box-shadow`}>
						<CloseButton onClick={() => setOpenDropdown(false)}/>
						<div className={styles.profile_dropdown_header}>
								<h3>{user.username}</h3>
								<p>{user.email}</p>
						</div>
						<div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: 0, padding:0}}></div>
						<Link href="/my-lists">
							<div className={styles.profile_dropdown_link} onClick={() => setOpenDropdown(false)}>
								<BsBook color="white" size={20}/>
								<span>My Lists</span>
							</div>
						</Link>
						<Link href="/history">
							<div className={styles.profile_dropdown_link} onClick={() => setOpenDropdown(false)}>
								<BiHistory color="white" size={20}/>
								<span>History</span>
							</div>
						</Link>
						<Link href="/change-picture">
							<div className={styles.profile_dropdown_link} onClick={() => setOpenDropdown(false)}>
								<BsCardImage color="white" size={20}/>
								<span>Change Profile Picture</span>
							</div>
						</Link>
						<Link href="/change-password">
							<div className={styles.profile_dropdown_link} onClick={() => setOpenDropdown(false)}>
								<RiLockPasswordLine color="white" size={20}/>
								<span>Change Password</span>
							</div>
						</Link>
						<div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: 0, padding:0}}></div>
						<div 
							className={styles.profile_dropdown_link}
							onClick={() => {setOpenDropdown(false); logout()}}
						>
							<RiLogoutCircleRLine color="white" size={20} />
							<span>Log out</span>
						</div>
					</div>
				)
			}
		</div>
	)
}

export default Profile