import '../styles/globals.css'
import 'react-notifications/lib/notifications.css';
import ContextProvider from "../services/context/ContextProvider";

function MyApp({ Component, pageProps }) {

	return (
		<ContextProvider>
			<Component {...pageProps} /> 
		</ContextProvider>
	)
}

export default MyApp
