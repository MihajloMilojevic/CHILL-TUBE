import { useStateContext } from "../../../services/context/ContextProvider";


function Modal({show, children}) {

	const {windowSize} = useStateContext()

	if(!show)
		return <></>
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				position: "fixed",
				top: 0,
				left: 0,
				zIndex: 99999999,
				background: "rgba(200, 200, 200, 0.75)",
				width: "100vw",
				height: "100vh",
				padding: "1rem"
			}}
		>
			<div
				style={{
					width: windowSize.width <= 500 ? "100%" : windowSize.width <= 900 ? "80%" : "60%",
					maxHeight: windowSize.width <= 500 ? "100%" : "80%",
					background: "white",
					padding: windowSize.width <= 500 ? "1rem" : "2rem",
					borderRadius: 15
				}}
				className="box-shadow"
			>
				{children}
			</div>
		</div>
	)
}

export default Modal