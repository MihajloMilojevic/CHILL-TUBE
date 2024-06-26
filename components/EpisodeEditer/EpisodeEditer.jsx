import React, { useEffect, useState, useRef, useMemo } from 'react'
import styles from "./EpisodeEditer.module.css";
import {AiOutlineClose } from '@react-icons/all-files/ai/AiOutlineClose';
import {AiOutlineSave } from '@react-icons/all-files/ai/AiOutlineSave';
import {AiOutlineDelete } from '@react-icons/all-files/ai/AiOutlineDelete';
import {AiOutlineEdit} from "@react-icons/all-files/ai/AiOutlineEdit";
import {BsUpload} from "@react-icons/all-files/bs/BsUpload";
import { useStateContext } from '../../services/context/ContextProvider';
import CloseButton from '../CloseButton/CloseButton';

function generateVideoUrlFromEpisode(episode) {
	if(!episode) return ""; //if there is no episode selected there can't be any url
	if(!episode?.videoFile) return episode?.videoUrl ?? ""; // if there is no file uploaded to the current episode use video from db or nothing
	return URL.createObjectURL(episode?.videoFile); // selected episode has a file uploaded ready to be uploaded to the server so generate url for it
}

function EpisodeEditer({episode, close, saveEpisode, deleteEpisode, index}) {
	const {createNotification, notificationTypes, setModalOpen, setModalChildren} = useStateContext();
	const [videoUrl, setVideoUrl] = useState(generateVideoUrlFromEpisode(episode)); // this is url for video component
	const [editMode, setEditMode] = useState(false);
	const inputRef = useRef(null);


	// every time episode object changes (user selects diffrent episode) reset all the parametars
	useEffect(() => {
		setEditMode(false); // close edit mode
		setVideoUrl(generateVideoUrlFromEpisode(episode)); // generate new video url
		// found on stackoverflow as a way to transfer videoFile object from the episode object to the input (as if user has just uploaded it)
		const dt = new DataTransfer(); 
		if(episode && episode.videoFile)
			dt.items.add(episode.videoFile);
		inputRef && inputRef.current && (inputRef.current.files = dt.files); 
	}, [episode])
	
	// event handler - input value change (video upload)
	function videoSelect(e) {
		const [file] = e.currentTarget.files;
		if(!file) {
			setVideoUrl(""); // if the user canceled the prompt and there is no file
			return;
		}
		// if uploded file isn't .mp4 video show error message and reset everything to empty values
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
		setVideoUrl(URL.createObjectURL(file)) // generate video url and show it in video component
	}

	// event handler - enter edit mode
	function handleEdit() {
		setEditMode(true)
	}
	// event handler - delete current episode by opening a modal for user confirmation and calling deleteEpisode function from the props
	function handleDelete() {
		setModalChildren(
			<DeleteEpisodeModal 
				onConfirm={ () => {
					deleteEpisode(episode.id)
				}}
			/>
		)
		setModalOpen(true)
	}

	// event handler - exit edit mode with user confirmation (opening confirmation modal)
	function handleCancel() {
		setModalChildren(
			<CancelEditModal 
				onConfirm={ () => {
					// deleting all changes
					inputRef.current.value = "";
					setVideoUrl(generateVideoUrlFromEpisode(episode));
					setEditMode(false)
				}}
			/>
		)
		setModalOpen(true)
	}
	// event handler - saving changes to the current episode
	function handleSave() {
		// file must be uploaded
		if(inputRef.current.files.length === 0) {
			return createNotification({
				type: notificationTypes.WARNING,
				title: "Warning",
				message: "You need to upload a video before saving an episode"
			})
		}
		// saveEpisode from the props
		saveEpisode(episode.id, inputRef.current.files[0])		
	}
	// event handler - uploadnig new video
	function handleUpload() {
		// open file selection window as if user clicked on input 
		inputRef.current?.click()
	}

	// memoizing a video component 
	const VideoComponent = useMemo(() =>  <video className={styles.video} controls width={"100%"} src={videoUrl}/>, [videoUrl])
	//if no episode is selected and passed as prop don't show anything
	if(!episode) return <></>
	return (
		<div className={styles.editor}>
			<CloseButton onClick={close} />
			<h3 style={{fontWeight: "normal"}}>Episode {index + 1}</h3>
			<div className={styles.button_group}>
			{
				// if edit mode is on show exit and save buttons and if it's off show edit and delete buttons
				editMode ? (
					<>
						<button className={`button ${styles.button}`} onClick={handleCancel}>
							<AiOutlineClose size={20} />
							<span>Close Edit Mode</span>
						</button>
						<button className={`button ${styles.button}`} onClick={handleSave}>
							<AiOutlineSave size={20} />
							<span>Save Changes</span>
						</button>
						<button className={`button ${styles.button}`} onClick={handleUpload}>
							<BsUpload size={20} />
							<span>Upload Video</span>
						</button>
					</>
				) : (
					<>
						<button className={`button ${styles.button}`} onClick={handleEdit}>
							<AiOutlineEdit size={20} />
							<span>Edit Video</span>
						</button>
						<button className={`button ${styles.button}`} onClick={handleDelete}>
							<AiOutlineDelete size={20} />
							<span>Delete Episode</span>
						</button>
					</>
				)
			}
			</div>
			<input className={styles.file_input} ref={inputRef} type="file" accept='video/*' onChange={videoSelect}/>
			{
				// if there is a video show it - if there isn't any video show text
				videoUrl !== "" ? VideoComponent : <p>You didn&apos;t select any video for this episode </p>
			}
		</div>
	)
}

export default EpisodeEditer


// modal for user to confirm deletion of an episode
function DeleteEpisodeModal({onConfirm}) {

	const {setModalOpen} = useStateContext();
	async function handleYes() {
		onConfirm();
		setModalOpen(false);
	}
	async function handleNo() {
		setModalOpen(false);
	}

	return (
		<div>
			<h3 className={`modal_title`}>Delete episode confirmation</h3>
			<p className={`modal_paragraph`}>Are you sure you want to delete this episode? Once performed this action can&apos;t be reversed.</p>
			<div className={`modal_buttons`}>
				<button onClick={handleYes} className={`modal_yes_button`}>Yes</button>
				<button onClick={handleNo} className={`modal_no_button`}>No</button>
			</div>
		</div>
	);
}

// modal for user to confirm exiting edit mode and discarding all the changes
function CancelEditModal({onConfirm}) {

	const {setModalOpen} = useStateContext();
	async function handleYes() {
		onConfirm();
		setModalOpen(false);
	}
	async function handleNo() {
		setModalOpen(false);
	}

	return (
		<div>
			<h3 className={`modal_title`}>Exit edit mode</h3>
			<p className={`modal_paragraph`}>Are you sure you want to exit edit mode? You will lose all your unsaved work.</p>
			<div className={`modal_buttons`}>
				<button onClick={handleYes} className={`modal_yes_button`}>Yes</button>
				<button onClick={handleNo} className={`modal_no_button`}>No</button>
			</div>
		</div>
	);
}