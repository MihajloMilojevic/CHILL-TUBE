import { useStateContext } from "../../services/context/ContextProvider";
import {Navbar, ScrollToTop, Page} from "..";
import { useEffect } from "react";

function AdminLayout({children, user}) {

	const {activeMenu, windowSize, setUser} = useStateContext();

	useEffect(() => {
		setUser(user);
	}, []);

	return (
		<>
			<div
				style={{
					display: "flex",
					width: "100%",
					minHeight: "100vh",
					position: "relative"
				}}
			>
				<div 
					style={{
						width: "100%",
						height: "100%",
						position: "fixed",
						right: 0,
						overflowX: "hidden",
						zIndex: 3000
					}}
					id="content"
				>
					<Navbar />
					<Page>
						{children}
					</Page>
					<ScrollToTop />
				</div>
			</div>
		</>
	)
}

export default AdminLayout