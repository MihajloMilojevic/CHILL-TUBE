import { useStateContext } from "../../services/context/ContextProvider"
import styles from "./Navbar.module.css";
import { useState, useEffect, useRef } from "react";
import {Profile} from "..";
import Link from "next/link";
import Image from "next/image";

function Navbar() {

	const navRef = useRef(null);
	
	const {windowSize, setNavHeight, user} = useStateContext();

	useEffect(() => {
		setNavHeight(navRef.current.clientHeight);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [windowSize])

	return (
		<div className={`${styles.navbar} `}  ref={navRef}>
			<Link href="/">
				<div className={styles.navbar_left}>
					<img src="/logo.png" alt="Logo" height={windowSize.width > 400 ? 50 : 35}/>
				</div>
			</Link>
			<div className={styles.navbar_right}>
				{!!user ? (
					<Profile />
				) : (
					<>
						<Link href="/login"><div className={`button ${styles.login_button}`}>Login</div></Link>
						<Link href="/register"><div className={`button ${styles.register_button}`}>Register</div></Link>
					</>
				)}
			</div>
		</div>
	)
}

export default Navbar