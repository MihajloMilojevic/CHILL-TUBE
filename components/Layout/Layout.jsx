import { useStateContext } from "../../services/context/ContextProvider";
import {Navbar, Footer} from "..";
import { useEffect } from "react";
import styles from "./Layout.module.css";

function Layout({children, user}) {

	const { setUser} = useStateContext();

	useEffect(() => {
		setUser(user);
	}, [user]);

	return (
		<div className={styles.wrapper}>
			<div className={styles.content}>
				<Navbar />
				<div className={styles.page}>
					{children}
				</div>
				<Footer />
			</div>
		</div>
	)
}

export default Layout