import { useStateContext } from "../../services/context/ContextProvider";
import CloseButton from "../CloseButton/CloseButton";
import styles from "./Modal.module.css";

function Modal() {

	const {windowSize, modalOpen, modalChildren, setModalOpen} = useStateContext()

	if(!modalOpen)
		return <></>
	return (
		<div className={`overlay ${styles.modal_wrapper}`}>
			<div
				style={{
					width: windowSize.width <= 500 ? "100%" : windowSize.width <= 900 ? "80%" : "60%",
					maxHeight: windowSize.width <= 500 ? "100%" : "80%",
					padding: windowSize.width <= 500 ? "0.5rem" : "1rem",
				}}
				className={`box-shadow ${styles.modal_body}`}
			>
				<CloseButton onClick={() => setModalOpen(false)}/>
				{modalChildren}
			</div>
		</div>
	)
}

export default Modal