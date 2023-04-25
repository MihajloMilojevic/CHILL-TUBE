import React from 'react'
import styles from "./FilterSidebar.module.css";

export default function CustomCheckbox({checked, value, label, onChange}) {
	return (
		<div className={styles.custom_element} onClick={() => onChange({value, checked: !checked})}>
			<div className={styles.checkbox_outer}>{checked && (<div className={styles.checkbox_inner} />)}</div>
			<p>{label}</p>
		</div>
	)
}
