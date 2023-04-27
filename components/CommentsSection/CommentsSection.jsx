import React, { useState } from 'react'
import {useStateContext} from "../../services/context/ContextProvider";
import Image from 'next/image';
import API from '../../services/api';
import {FaRegCommentDots} from "@react-icons/all-files/fa/FaRegCommentDots";
import styles from "./CommentSection.module.css";

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
	function handleTextAreaChange(e) {
		e.target.style.height = "";
		e.target.style.height = e.target.scrollHeight + "px";
	}
	return (
		<div className={styles.section}>
			<h3 style={{marginTop: 10, marginBottom: 5}}>Comments:</h3>
			{user && (
				<form onSubmit={handleSubmit} className={styles.form}>
					<button type='submit' className={`button ${styles.comment_button}`}><FaRegCommentDots size={20} /><span>Leave A Comment</span></button>
					<textarea 
						className={styles.textarea} 
						placeholder="Enter your comment here..." 
						value={commentText} 
						onChange={e => {setCommentText(e.target.value); handleTextAreaChange(e);}} 	
					/>
				</form>
			)}
			<div className={styles.comment_list}>
			{
				anime.comments && anime.comments.length > 0 ? (
					anime.comments.map(comm => <Comment key={comm.id} comment={comm} />)
				) : (
					<p>There are no comments for this episode. Leave a comment and be the first to comment.</p>
				)
			}
			</div>
		</div>
	)
}

function Comment({comment}) {
	const date = new Date(comment.timestamp);
	const timestamp = `${doubleDigit(date.getDate())}.${doubleDigit(date.getMonth() + 1)}.${doubleDigit(date.getFullYear())} ${doubleDigit(date.getHours())}:${doubleDigit(date.getMinutes())}`
	return (
		<div className={styles.comment}>
			<div className={styles.comment_image}>
				<img alt="comment-picture" src={comment.picture} style={{width: "100%", height: "100%", objectFit: "cover"}}/>
			</div>
			<div className={styles.comment_header}>
				<span>{comment.username} </span>
				<span>{timestamp}</span>
			</div>
			<div />
			<p className={styles.comment_text}>
				{comment.text}
			</p>
		</div>
	)
}

function doubleDigit(number) {
	if(number > 9) return `${number}`
	return `0${number}`;
}