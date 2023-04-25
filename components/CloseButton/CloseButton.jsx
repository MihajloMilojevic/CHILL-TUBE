import React from 'react'
import {AiOutlineClose} from "@react-icons/all-files/ai/AiOutlineClose"
import styles from "./CloseButton.module.css"

export default function CloseButton({onClick, buttonProps = {}, iconProps = {}}) {
	return (
		<button className={styles.close_button} onClick={onClick} {...buttonProps}>
			<AiOutlineClose color="white" size={20} {...iconProps}/>
		</button>
	)
}
