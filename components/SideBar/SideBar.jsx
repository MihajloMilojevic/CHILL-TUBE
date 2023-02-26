/* eslint-disable react-hooks/exhaustive-deps */
import styles from "./SideBar.module.css";
import Link from "next/link"
import Image from "next/image";
import { useRouter } from "next/router";
import {AiOutlineClose} from "react-icons/ai"
import { useStateContext } from "../../services/context/ContextProvider";
import { useEffect, useState } from "react";
import stranice from "../../services/constants/stranice.json";
import dozvole from "../../services/constants/dozvole.json";

function generateLinks(korisnickeDozvole) {
	const set = new Set();
	korisnickeDozvole.forEach(id => {
		const doz = dozvole.find(d => d.id === id);
		if(!doz?.link) return;
		set.add(doz.link);
	});
	const links = [];

	set.forEach(link => {
		const str = stranice.find(s =>  s.naziv === link);
		if(!str) return;
		links.push(str);
	})
	links.sort((a, b) => a.redosled - b.redosled);
	return links;
}

function SideBar() {

	const {windowSize, setActiveMenu, korisnik} = useStateContext();
	const router = useRouter();
	const [links, setLinks] = useState(generateLinks(korisnik?.dozvole ?? []));

	useEffect(() => {
		setLinks(generateLinks(korisnik?.dozvole ?? []))
	}, [korisnik])

	function linkClik() {
		if(windowSize.width <= 900) setActiveMenu(false);
	}

	return (
		<div className={styles.sidebar}>
			{
				windowSize.width <= 900 && 
				<button 
					style={{
						borderRadius: "50%",
						width: 30,
						height: 30,
						padding: 0,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						position: "absolute",
						top: "1.5rem",
						right: "1.5rem"
					}} 
					onClick={
						() => setActiveMenu(false)
					}
				>
					<AiOutlineClose color="white" size={15} />
				</button>
			}
			<div>
				<Link href="/admin">
					<div className={styles.sidebar_brand} onClick={linkClik}>
						<Image src="/logo-no-bg.png" alt="Logo" width={50} height={50}/>
						<span>ЕСТШ {'"'}Никола Тесла{'"'}</span>
					</div>
				</Link>
			</div>
			<div className={styles.sidebar_links}>
				{
					links.map((item, index) => (
						<Link 
							key={index} 
							href={`/admin${item.href}`} 
						>
							<p onClick={linkClik} className={`${styles.sidebar_link} ${(router.pathname.startsWith(`/admin${item.href}`) && item.href !== "/admin") || router.pathname === "/admin" && item.href === "/admin" ? "gradient text-white " : styles.sidebar_link_hoverable}`}>
								{item.text}
							</p>
						</Link>
					))
				}
			</div>
		</div>
	)
}

export default SideBar