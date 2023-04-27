import React, {useCallback, useEffect, useRef, useState} from 'react'
import { useStateContext } from '../../services/context/ContextProvider'
import { useRouter } from 'next/router';
import API from '../../services/api';
import {BsBookmark} from "@react-icons/all-files/bs/BsBookmark";
import {BsBookmarkFill} from "@react-icons/all-files/bs/BsBookmarkFill";
import {FiSkipBack} from "@react-icons/all-files/fi/FiSkipBack";
import {FiSkipForward} from "@react-icons/all-files/fi/FiSkipForward";
import styles from "./EpisodePlayer.module.css";

function doubleDigit(number) {
	if(number > 9) return `${number}`
	return `0${number}`;
}
export default function EpisodePlayer({anime, episodeNumber, setAnime}) {
	const playerRef = useRef(null);
	const {user, setModalChildren, setModalOpen, createNotification, notificationTypes} = useStateContext();
	const [episode, setEpisode] = useState(anime.episodes.find(({orderNumber}) => orderNumber === episodeNumber))
	const [firstPlay, setFirstPlay] = useState(true);
	const router = useRouter();

	const saveWatchedTime = useCallback(async function() {
		const time = localStorage.getItem(`${anime.id}-${episodeNumber}`);
		//console.log(time)
		if(!time) return;
		//console.log("Watch Timestamp Update")
		await API.AnimeAPI.Watch(anime.id, episodeNumber, parseInt(time));
	}, [])	
	
	useEffect(() => {
		if(!user) return;
		const interval = setInterval(() => {saveWatchedTime(); /*console.log("INTERVAL")*/}, 10 * 1000);
		return () => {
			clearInterval(interval);
		}
	}, [])

	useEffect(() => {
		setEpisode(anime.episodes.find(({orderNumber}) => orderNumber === episodeNumber))
	}, [anime, episodeNumber])

	function handlePlay() {
		if(!firstPlay) return;
		setFirstPlay(false);
		let time = localStorage.getItem(`${anime.id}-${episodeNumber}`);
		if(episode.timestamp > 0) time = episode.timestamp;
		if(!time  || parseInt(time) === 0 || !playerRef.current) return;
		setModalChildren(
			<ContinueWhereLeftModal 
				onConfirm={() => playerRef.current.currentTime = parseInt(time)}
				time={`${doubleDigit(parseInt(time/360))}:${doubleDigit(parseInt((time%360)/60))}:${doubleDigit((time%360)%60)}`}
			/>
		);
		setModalOpen(true);
	}

	function handlePrevious() {
		if(episodeNumber === 1) return;
		window.location.href = (`/${anime.id}/episode/${episodeNumber - 1}`);
	}
	function handleNext() {
		if(episodeNumber === anime.episodes.length) return;
		window.location.href = (`/${anime.id}/episode/${episodeNumber + 1}`);
	}
	function handleTimeUpdate(e) {
		localStorage.setItem(`${anime.id}-${episodeNumber}`, Math.trunc(e.target.currentTime));
	}
	async function markEpisode() {
		const {error, data} = await API.AnimeAPI.MarkEpisode(anime.id, episodeNumber, !episode.watched);
		if(error || !data.ok) { 
			// if an error occured create error notification
            createNotification({
                type: notificationTypes.ERROR,
                title: "Error",
                message: error.message || data.message
            })
        }
        else {
			createNotification({
				type: notificationTypes.SUCCESS,
                title: "Success",
                message: "Succesfully marked as " + (episode.watched ? "not" : "") + " completed",
				timeout: 1500
            })
			setAnime({...anime, ...data.anime})
        }
	}
	return (
		<div>
			<div className={styles.buttons}>
				{
					user ? (
						<button onClick={markEpisode} className={`button ${styles.mark_button}`} >{episode.watched ? <BsBookmarkFill size={20}/> : <BsBookmark size={20} />}<span>Mark As {episode.watched ? "Not" : ""} Completed </span></button>
					) : (
						<div />
					)
				}
				<div className={styles.button_group}>
					<button 
						className={`button ${styles.episode_button}`} 
						disabled={episodeNumber === 1} 
						onClick={handlePrevious}
					>
						<FiSkipBack size={20} />
						<span>Previous Episode</span>
					</button>
					<button 
						className={`button ${styles.episode_button}`} 
						disabled={episodeNumber === anime.episodes.length} 
						onClick={handleNext}
					>
						<span>Next Episode</span>
						<FiSkipForward size={20} />
					</button>
				</div>
			</div>
			<video onPlay={handlePlay} onTimeUpdate={handleTimeUpdate} src={episode.video} controls ref={playerRef} className={styles.video}/>
		</div>
	)
}

function ContinueWhereLeftModal({onConfirm, time}) {
	
	const {setModalOpen} = useStateContext();
	function handleYes() {
		onConfirm();
		setModalOpen(false);
	}
	function handleNo() {
		setModalOpen(false);
	}
	return (
		<div>
			<h3 className={`modal_title`}>Continue Watching</h3>
			<p className={`modal_paragraph`}>Do you want to continue watching this episide from {time}</p>
			<div className={`modal_buttons`}>
				<button onClick={handleYes} className={`modal_yes_button`}>Yes</button>
				<button onClick={handleNo} className={`modal_no_button`}>No</button>
			</div>
		</div>
	)
}