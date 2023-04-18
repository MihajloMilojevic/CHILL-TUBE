import React, { useState } from 'react'
import {useStateContext} from "../../services/context/ContextProvider";
import Image from 'next/image';
import API from '../../services/api';

export default function CommentsSection({anime, setAnime, episodeNumber}) {
	const {user, createNotification, notificationTypes} = useStateContext();
	const [commentText, setCommentText] = useState("");

	async function handleSubmit(e) {
		e.preventDefault();
		if(!commentText) return;
		const {error, data} = await API.AnimeAPI.Comment(anime.id, episodeNumber, commentText);
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
			setCommentText("");
            createNotification({
                type: notificationTypes.SUCCESS,
                title: "Success",
                message: "Your comment has successfully been saved."
            })
        }
	}
	return (
		<div>
			<h3>Comments:</h3>
			{user && (
				<form onSubmit={handleSubmit}>
					<button type='submit'>Leave A Comment</button> <br/>
					<textarea value={commentText} onChange={e => setCommentText(e.target.value)} />
				</form>
			)}
			{anime.comments && anime.comments.length > 0 ? (
				anime.comments.map(comm => <Comment key={comm.id} comment={comm} />)
			) : (
				<p>There are no comments for this episode. Leave a comment and be the first to comment.</p>
			)
			}
		</div>
	)
}

function Comment({comment}) {
	const date = new Date(comment.timestamp);
	const timestamp = `${doubleDigit(date.getDate())}.${doubleDigit(date.getMonth() + 1)}.${doubleDigit(date.getFullYear())} ${doubleDigit(date.getHours())}:${doubleDigit(date.getMinutes())}`
	return (
		<div>
			<div>
				<div style={{width: 50, height: 50, borderRadius: "50%", overflow: "hidden", display: "inline-block"}}>
					<img alt="comment-picture" src={comment.picture} style={{width: "100%", height: "100%", objectFit: "cover"}}/>
				</div>
				<span>{comment.username} </span>
				<span>{timestamp}</span>
			</div>
			<p>
				{comment.text}
			</p>
		</div>
	)
}

function doubleDigit(number) {
	if(number > 9) return `${number}`
	return `0${number}`;
}