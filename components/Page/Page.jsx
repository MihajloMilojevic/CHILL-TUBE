import styles from "./Page.module.css"

function Page({children, style}) {
	return (
		<div className={styles.page} style={style}>
			{children}
		</div>
	)
}

export default Page