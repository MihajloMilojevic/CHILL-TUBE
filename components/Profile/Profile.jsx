import {useStateContext} from "../../services/context/ContextProvider";
import {useRouter} from "next/router";
import {AiOutlineClose} from "react-icons/ai"
import styles from "./Profile.module.css";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {RiLockPasswordLine, RiLogoutCircleRLine} from "react-icons/ri";
import KorisnikAPI from "../../services/api/User";


function Profile() {
	
	const [openDropdown, setOpenDropdown] = useState(false);
	const router = useRouter();
	const {korisnik, createNotification, notificationTypes} = useStateContext();

	async function logout() {
		const {error, data} = await KorisnikAPI.logout();
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
                message: "Успешно сте се одјавили"
            })
            router.push("/admin/login");
        }
	}
    if(!korisnik) return (<></>);

	return (
		<div className={styles.profile}>
			<div className={styles.profile_toggle} onClick={() => setOpenDropdown(prev => !prev)}  >
				<Image alt="profile-picture" src={korisnik.picture} layout="fill" />
			</div>
			{
				openDropdown && (
					<div className={`${styles.profile_dropdown} box-shadow`}>
						<div className={styles.profile_dropdown_header}>
							<h3>Кориснички профил</h3>
							<button 
								style={{
									borderRadius: "50%",
									width: 30,
									height: 30,
									padding: 0,
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}} 
								onClick={
									() => setOpenDropdown(false)
								}
							>
								<AiOutlineClose color="black" size={15} />
							</button>
						</div>
						<div className={styles.profile_dropdown_data}>
							<p className={styles.profile_dropdown_data_name}>{korisnik.ime} {korisnik.prezime}</p>
						</div>
						<div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: 0, padding:0}}></div>
						<Link href="/admin/promeni-lozinku">
							<div className={styles.profile_dropdown_link} onClick={() => setOpenDropdown(false)}>
								<RiLockPasswordLine color="black"/>
								<span>Промени лозинку</span>
							</div>
						</Link>
						<div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: 0, padding:0}}></div>
						<div 
							className={styles.profile_dropdown_link}
							onClick={() => {setOpenDropdown(false); logout()}}
						>
							<RiLogoutCircleRLine />
							<span>Одјави се</span>
						</div>
					</div>
				)
			}
		</div>
	)
}

export default Profile