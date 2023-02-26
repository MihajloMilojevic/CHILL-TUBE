import styles from "./Footer.module.css";
import {BiPhone, BiEnvelope} from "react-icons/bi"
import {BsInstagram } from "react-icons/bs"

const links = [
	{
		icon: <BiPhone style={{ fill: "url(#footer-gradient)"}}/>,
		text: <a href="tel:+381695466205"  target="_blank" rel="noreferrer">+381695466205</a>
	},
	{
		icon: <BiEnvelope style={{ fill: "url(#footer-gradient)"}}/>,
		text: <a href="mailto:thereptilehouse.info@gmail.com" target="_blank" rel="noreferrer">thereptilehouse.info@gmail.com</a>
	},
	{
		icon: <BsInstagram style={{ fill: "url(#footer-gradient)"}}/>,
		text: <a href="https://www.instagram.com/thereptilehouse__/" target="_blank" rel="noreferrer">thereptilehouse__</a>
	}
]

function Link({icon, text}) {
	return (
		<div className={styles.footer__links_link}>
			{icon}
			{text}
		</div>
	)
}

function Footer() {

	return (
		<footer className={styles.footer}>
			<svg width="0" height="0" style={{visibility: "hidden"}}>
				<linearGradient id="footer-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
					<stop stopColor="#0283E9" offset="-18.13%" />
					<stop stopColor="#FC01CA" offset="120.27%" />
				</linearGradient>
			</svg>
			<div className={styles.footer__links}>
				{
					links.map((link, index) => (<Link key={index} {...link} />))
				}
			</div>
			<p className={styles.footer__copy}>Copyright &copy; {(new Date).getFullYear()} ЕСТШ {'"'}Никола Тесла{'"'} </p>
		</footer>
	)
}

export default Footer