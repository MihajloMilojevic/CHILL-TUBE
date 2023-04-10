import React, { useEffect, useState, useRef, useMemo } from 'react'
import styles from "./EpisodeEditer.module.css";
import {AiOutlineClose } from '@react-icons/all-files/ai/AiOutlineClose';
import {AiOutlineSave } from '@react-icons/all-files/ai/AiOutlineSave';
import {AiOutlineDelete } from '@react-icons/all-files/ai/AiOutlineDelete';
import {GrEdit} from "@react-icons/all-files/gr/GrEdit";
import { useStateContext } from '../../../services/context/ContextProvider';

function generateVideoUrlFromEpisode(episode) {
	if(!episode) return "";
	if(!episode?.videoFile) return episode?.videoUrl ?? "";
	return URL.createObjectURL(episode?.videoFile);
}

function EpisodeEditer({episode, close, saveEpisode, deleteEpisode}) {
	const {createNotification, notificationTypes} = useStateContext();
	const [videoUrl, setVideoUrl] = useState(generateVideoUrlFromEpisode(episode));
	const [editMode, setEditMode] = useState(false);
	const inputRef = useRef(null);


	useEffect(() => {
		setEditMode(false);
		setVideoUrl(generateVideoUrlFromEpisode(episode));
		const dt = new DataTransfer();
		if(episode && episode.videoFile)
			dt.items.add(episode.videoFile);
		inputRef && inputRef.current && (inputRef.current.files = dt.files); 
	}, [episode])
	
	
	function videoSelect(e) {
		const [file] = e.currentTarget.files;
		if(!file) {
			setVideoUrl("");
			return;
		}
		if (file.type !== "video/mp4") {
			setVideoUrl("");
			inputRef.current.value = "";
			createNotification({
				type: notificationTypes.WARNING,
				title: "Warning",
				message: "Only mp4 format is allowed"
			})
			return;
		}
		setVideoUrl(URL.createObjectURL(file))
	}

	function handleEdit() {
		setEditMode(true)
	}
	function handleDelete() {
		deleteEpisode(episode.id)
	}
	function handleCancel() {
		inputRef.current.value = "";
		setVideoUrl(generateVideoUrlFromEpisode(episode));
		setEditMode(false)
	}
	function handleSave() {
		if(inputRef.current.files.length === 0) {
			return createNotification({
				type: notificationTypes.WARNING,
				title: "Warning",
				message: "You need to upload a video before saving an episode"
			})
		}
		saveEpisode(episode.id, inputRef.current.files[0])		
	}
	
	const VideoComponent = useMemo(() =>  <video controls width={"100%"} src={videoUrl}/>, [videoUrl])
	if(!episode) return <></>
	return (
		<div className={styles.editor}>
			<button className={styles.close} onClick={close}><AiOutlineClose color="black" size={15} /></button>
			<h2>Episode {episode.orderNumber}</h2>
			{
				editMode ? (
					<>
						<button onClick={handleCancel}><AiOutlineClose size={20} /></button>
						<button onClick={handleSave}><AiOutlineSave size={20} /></button>
					</>
				) : (
					<>
						<button onClick={handleEdit}><GrEdit size={20} /></button>
						<button onClick={handleDelete}><AiOutlineDelete size={20} /></button>
					</>
				)
			}
			<input style={{display: editMode ? "block" : "none"}} ref={inputRef} type="file" accept='video/*' onChange={videoSelect}/>
			{
				videoUrl !== "" ? VideoComponent : <p>You didn&apos;t select any video for this episode </p>
			}
		</div>
	)
}

export default EpisodeEditer