import {createContext, useContext, useState, useEffect} from "react";
import useWindowSize from "../hooks/useWindowSize";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {FilterSidebar, Modal} from "../../components";

const StateContext = createContext();

const filterOrderTypes = {
	"NAME_ASC": "Name Ascending",
	"NAME_DESC": "Name Descending",
	"RATING_ASC": "Rating Ascending",
	"RATING_DESC": "Rating Descending",
}

const genres = [
	{id: 1, name: "Action"},
	{id: 2, name: "Adventure"},
	{id: 3, name: "Comedy"},
	{id: 4, name: "Drama"},
	{id: 5, name: "Slice of Life"},
	{id: 6, name: "Fantasy"},
	{id: 7, name: "Magic"},
	{id: 8, name: "Supernatural"},
	{id: 9, name: "Horror"},
	{id: 10, name: "Mystery"},
	{id: 11, name: "Psychological"},
	{id: 12, name: "Romance"},
	{id: 13, name: "Sci-Fi"}
]

// types of notifications - each has its own styles
const notificationTypes = {
	INFO: "info",
	SUCCESS: "success",
	WARNING: "warning",
	ERROR: "error"
}

// component that provides context to the enitre app
export default function ContextProvider({children}) {
	// defines state of the aplication and helper functions
	const windowSize = useWindowSize();
	const [user, setUser] = useState(null);
	const [navHeight, setNavHeight] = useState(0);
	const [modalOpen, setModalOpen] = useState(false);
	const [modalChildren, setModalChildren] = useState(null);
	const [filterOpen, setFilterOpen] = useState(false);
	const [filterOrder, setFilterOrder] = useState(filterOrderTypes.NAME_DESC);
	const [selectedGenres, setSelectedGenres] = useState([]);
	const [releasedBoundries, setReleasedBoundries] = useState({min: 1900, max: (new Date().getFullYear())});
	const [releasedValue, setReleasedValue] = useState({min: 0, max: (new Date().getFullYear())});
	
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
				notificationTypes, createNotification,
				user, setUser,
				navHeight, setNavHeight,
				modalChildren, modalOpen,
				setModalChildren, setModalOpen,
				filterOpen, setFilterOpen,
				filterOrder, setFilterOrder,
				selectedGenres, setSelectedGenres,
				filterOrderTypes, genres,
				releasedBoundries, setReleasedBoundries,
				releasedValue, setReleasedValue,
			}}
		>	
			{children}
			<NotificationContainer/> {/* this is used to show notifications */}
			<Modal />
			<FilterSidebar />
		</StateContext.Provider>	
	)
}

// hook that allows us to use context created above
export function useStateContext() {
	return useContext(StateContext)
}