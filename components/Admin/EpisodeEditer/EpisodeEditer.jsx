import React, { useEffect, useState, useRef } from 'react'
import styles from "./EpisodeEditer.module.css";

function EpisodeEditer({episode, anime, onVideoSave}) {
	const [videoUrl, setVideoUrl] = useState(episode?.video ?? "");
	const inputRef = useRef(null);

	useEffect(() => {
		setVideoUrl("");
		inputRef && inputRef.current && (inputRef.current.value = ""); 
	}, [episode])
	
	function showVideo(input) {
		const [file] = input.files;
		if (file) {
			setVideoUrl(URL.createObjectURL(file))
		}
		else setVideoUrl("")
	}
	
	if(!episode) return <></>
	return (
		<div className={styles.editor}>
			<h2>Episode {episode.number}</h2>
			<input ref={inputRef} type="file" onChange={e => {showVideo(e.currentTarget);}}/>
			{
				videoUrl !== "" && (
					<video controls width={"100%"} src={videoUrl}>

					</video>
				)
			}
		</div>
	)
}

export default EpisodeEditer