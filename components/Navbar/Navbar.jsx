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
					<Image src="/logo.png" alt="Logo" width={50} height={50}/>
					<span>Chill Tube</span>
				</div>
			</Link>
			<div className={styles.navbar_right}>
				{!!user ? (
					<Profile />
				) : (
					<>
						<Link href="/login">Login</Link>
						<Link href="/register">Register</Link>
					</>
				)}
			</div>
		</div>
	)
}

export default Navbar