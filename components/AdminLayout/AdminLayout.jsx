import { useStateContext } from "../../services/context/ContextProvider";
import {SideBar, Footer, Navbar, ScrollToTop, Page} from "..";
import { useEffect } from "react";

function Layout({children, user}) {

	const {activeMenu, windowSize, setKorisnik} = useStateContext();

	useEffect(() => {
		setKorisnik(user);
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
				{
					activeMenu ?
					<div
						style={{
							width: "18rem",
							height: "100%",
							position: "fixed",
							zIndex: 5000,
							background: "white",
							paddingBottom: "2rem"
						}}	
						className="hover-scroll box-shadow"
					>
						<SideBar />
					</div> :
					<div style={{width: 0}}>
					</div>
				}
				<div 
					style={{
						width: (windowSize.width > 900 && activeMenu)  ? "calc(100% - 18rem)" : "100%",
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
					<Footer />
					<ScrollToTop />
				</div>
			</div>
		</>
	)
}

export default Layout


// import React from "react";
// import dozvole from "../../services/database/constants/dozvole.json";

// export default function AdminLayout({children, user}) {
//     return (
//         <div style={{
//             display: "flex"
//         }}>
//             <div style={{maxWidth: "30vw"}}>
//                 <ul>
//                     {user.dozvole.map(id => <li key={id}>{dozvole.find(doz => doz.id == id)?.naziv || "Hello"}</li>)}
//                 </ul>
//             </div>
//             <div>
//                 {children}
//             </div>
//         </div>
//     )
// }