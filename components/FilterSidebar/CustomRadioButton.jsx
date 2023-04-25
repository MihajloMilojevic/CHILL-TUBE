import React from 'react'
import styles from "./FilterSidebar.module.css";

export default function CustomRadioButton({checked, value, label, onChange}) {
	return (
		<div className={styles.custom_element} onClick={() => onChange({value, checked: !checked})}>
			<div className={styles.radio_outer}>{checked && (<div className={styles.radio_inner} />)}</div>
			<p>{label}</p>
		</div>
	)
}
