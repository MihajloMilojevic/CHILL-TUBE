import {AiOutlineMenu} from "react-icons/ai"
import { useStateContext } from "../../services/context/ContextProvider"
import styles from "./Navbar.module.css";
import { useState, useEffect, useRef } from "react";
import {Profile} from "..";

function Navbar() {

	const navRef = useRef(null);
	
	const {windowSize, setActiveMenu, korisnik, setNavHeight, navHeight} = useStateContext();

	useEffect(() => {
		setNavHeight(navRef.current.clientHeight);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [windowSize])

	return (
		<div className={`${styles.navbar} `}  ref={navRef}>
			{/* <div className={styles.navbar_remove_shadow} style={{height: navHeight}}/> */}
			<div className={styles.navbar_left}>
				<AiOutlineMenu onClick={() => setActiveMenu(prev => !prev)} size={25}/>
			</div>
			<div className={styles.navbar_right}>
				<Profile />
			</div>
		</div>
	)
}

export default Navbar