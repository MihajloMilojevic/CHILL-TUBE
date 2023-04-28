import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link rel="shortcut icon" href="/images/favicon.ico" />
				<link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png"/>
				<link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png"/>
				<meta 
					name="description" 
					content="
						Chill Tube is a website that allows you to browse and watch all your favourite animes withouts adds. 
						You can add anime to your custom lists to always be able to find your favourite anime. 
						Rate animes so others can enjoy in best animes. 
						Leave a comment on every new episode and tell everyone what you like and what you do not.
					"
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}