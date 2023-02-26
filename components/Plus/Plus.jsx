import { AiOutlinePlus, AiOutlineClose, AiOutlineFileAdd } from "react-icons/ai";

function Plus({style, onClick, ...props}) {
	return (
		<div
			onClick={onClick}
			style={{
				cursor: "pointer",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				padding: 0,
				width: 40,
				height: 40,
				borderRadius: "50%",
				background: "white",
				border: "1px solid black",
				...style
			}}
			{...props}
		>
			<AiOutlinePlus color="black" size={25} />	
		</div>
	)
}

export default Plus;