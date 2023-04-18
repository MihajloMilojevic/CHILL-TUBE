import React, {useEffect, useState} from 'react'
import {useStateContext} from "../../services/context/ContextProvider";
import Rating from '@mui/material/Rating';
import {TiStarFullOutline} from "@react-icons/all-files/ti/TiStarFullOutline";
import API from '../../services/api';

export default function UserRating({anime, setAnime}) {
	const {user, createNotification, notificationTypes} = useStateContext();
	const [rating, setRating] = useState(anime.userRating);
	const [inProgress, setInProgress] = useState(false);

	useEffect(() => {
		setRating(anime.userRating)
	}, [anime])

	async function handleChange(e, value) {
		if(inProgress || !value) return;
		setInProgress(true);
		const {error, data} = await API.AnimeAPI.Rate(anime.id, value);
		if(error || !data.ok) { 
			// if an error occured create error notification
            createNotification({
                type: notificationTypes.ERROR,
                title: "Error",
                message: error.message || data.message
            })
        }
        else {
			setAnime({...anime, ...data.anime})
            createNotification({
                type: notificationTypes.SUCCESS,
                title: "Success",
                message: "Your rating has successfully been saved."
            })
        }
		setInProgress(false);
	}
	if(!user) return null;
	return (
		<Rating
			value={rating}
			onChange={handleChange}
			name="rate-this-anime"
			icon={<TiStarFullOutline color={"#FFD700"} fontSize="inherit" />}
			emptyIcon={<TiStarFullOutline color={"#BDBDBD"} fontSize="inherit" />}
		/>
	)
}