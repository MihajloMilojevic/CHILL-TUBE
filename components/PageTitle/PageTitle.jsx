import React from 'react'

function PageTitle({children, style, level, className}) {
	return (
		React.createElement(
			`h${level && (level >= 1 && level <= 6) ? level : 1}`,
			{
				style: {
					fontSize: 34,
					textAlign:"center",
					margin: "auto",
					marginBottom: "2rem",
					fontWeight: "bolder",
					width: "100%",
					...style
				},
				className: `gradient_text ${className}`
			},
			children
		)
	)
}

export default PageTitle