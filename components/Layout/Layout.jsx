import { useStateContext } from "../../services/context/ContextProvider";
import {Navbar, ScrollToTop, Page} from "..";
import { useEffect } from "react";
import styles from "./Layout.module.css";

function Layout({children, user}) {

	const {activeMenu, windowSize, setUser} = useStateContext();

	useEffect(() => {
		setUser(user);
	}, []);

	return (
		<div className={styles.wrapper}>
			<div className={styles.content}>
				<Navbar />
				<div className={styles.page}>
					{children}
				</div>
			</div>
		</div>
	)
}

export default Layout