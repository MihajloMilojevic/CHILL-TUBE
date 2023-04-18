import React, {useCallback, useEffect, useRef, useState} from 'react'
import { useStateContext } from '../../services/context/ContextProvider'
import { useRouter } from 'next/router';
import API from '../../services/api';
function doubleDigit(number) {
	if(number > 9) return `${number}`
	return `0${number}`;
}
export default function EpisodePlayer({anime, episodeNumber}) {
	const playerRef = useRef(null);
	const {user, setModalChildren, setModalOpen} = useStateContext();
	const [episode, setEpisode] = useState(anime.episodes.find(({orderNumber}) => orderNumber === episodeNumber))
	const router = useRouter();

	const saveWatchedTime = useCallback(async function() {
		const time = localStorage.getItem(`${anime.id}-${episodeNumber}`);
		console.log(time)
		if(!time) return;
		console.log("Watch Timestamp Update")
		await API.AnimeAPI.Watch(anime.id, episodeNumber, parseInt(time));
	}, [])	
	
	useEffect(() => {
		const interval = setInterval(() => {saveWatchedTime(); console.log("INTERVAL")}, 10 * 1000);
		return () => {
			clearInterval(interval);
		}
	}, [])


	useEffect(() => {
		const time = localStorage.getItem(`${anime.id}-${episodeNumber}`);
		if(!time  || parseInt(time) === 0 || !playerRef.current) return;
		setModalChildren(
			<ContinueWhereLeftModal 
				onConfirm={() => playerRef.current.currentTime = parseInt(time)}
				time={`${doubleDigit(parseInt(time/360))}:${doubleDigit(parseInt((time%360)/60))}:${doubleDigit((time%360)%60)}`}
			/>
		);
		setModalOpen(true);
	}, [playerRef, playerRef.current])

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
		
	}
	return (
		<div>
			{user && (
				<button onClick={markEpisode}>Mark As {episode.watched ? "Not" : ""} Completed {episode.watched ? "+" : "-"}</button>
			)}
			<br/>
			<button disabled={episodeNumber === 1} onClick={handlePrevious}>Previous Episode</button>
			<button disabled={episodeNumber === anime.episodes.length} onClick={handleNext}>Next Episode</button>
			<br/>
			<video onTimeUpdate={handleTimeUpdate} src={episode.video} controls ref={playerRef} style={{width: "100%", maxHeight: "90vh", maxWidth: 1024, margin: "auto", display: "block"}}/>
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
			<h3>Continue Watching</h3>
			<p>Do you want to continue watching this episide from {time}</p>
			<button onClick={handleYes}>Yes</button>
			<button onClick={handleNo}>No</button>
		</div>
	)
}