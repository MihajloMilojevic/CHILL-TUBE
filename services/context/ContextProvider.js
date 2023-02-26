import {createContext, useContext, useState, useEffect} from "react";
import useWindowSize from "../hooks/useWindowSize";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {Modal} from "../../components";

const StateContext = createContext();

// component that provides context to the enitre app
export default function ContextProvider({children}) {
	// defines state of the aplication and helper functions
	const windowSize = useWindowSize();
	const [activeMenu, setActiveMenu] = useState(true);
	const [korisnik, setKorisnik] = useState(null);
	const [navHeight, setNavHeight] = useState(0);
	const [modalOpen, setModalOpen] = useState(false);
	const [modalChildren, setModalChildren] = useState(null);

	useEffect(() => {
		setActiveMenu(windowSize.width > 900)
	}, [windowSize])

	// types of notifications - each has its own styles
	const notificationTypes = {
		INFO: "info",
		SUCCESS: "success",
		WARNING: "warning",
		ERROR: "error"
	}

	// function that creates notification 
	// params is on object that has:
	// - type of the notification
	// - title of the notification
	// - callback of the notification - function that is called once user interacts with notification
	// - prioriry of the notifiaction
	function createNotification(params) {
		const [
			message, 
			title, 
			timeout, 
			callback, 
			priority
		] = [
			params?.message ?? "",
			params?.title ?? "",
			params?.timeout ?? 5000,
			params?.callback ?? (() => {}),
			params?.priority ?? false
		]
		// create new notification based on its type
		switch (params.type) {
			case notificationTypes.INFO:
				NotificationManager.info(message, title, timeout, callback, priority);
				break;
			case notificationTypes.SUCCESS:
				NotificationManager.success(message, title, timeout, callback, priority);
				break;
			case notificationTypes.WARNING:
				NotificationManager.warning(message, title, timeout, callback, priority);
				break;
			case notificationTypes.ERROR:
				NotificationManager.error(message, title, timeout, callback, priority);
				break;
			default:
				console.error(`${params.type} is invalid type. Try one of following: ${Object.keys(notificationTypes).join(", ")}`)
				break;
		}
	}

	return (
		<StateContext.Provider
			value={{  // all variables and function availabe for any component inside context provider by using useStateContext hook
				windowSize,
				activeMenu, setActiveMenu,
				notificationTypes, createNotification,
				korisnik, setKorisnik,
				navHeight, setNavHeight,
				setModalChildren, setModalOpen,
			}}
		>	
			{children}
			<NotificationContainer/> {/* this is used to show notifications */}
			<Modal show={modalOpen}>
				{modalChildren}
			</Modal>
		</StateContext.Provider>	
	)
}

// hook that allows us to use context created above
export function useStateContext() {
	return useContext(StateContext)
}