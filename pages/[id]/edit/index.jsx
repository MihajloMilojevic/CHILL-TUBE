import { useRef, useState } from "react";
import Layout from "../../../components/Layout/Layout";
import auth from "../../../services/middleware/authentication";
import {SSRSession} from "../../../services/sessions/get-session";
import { useStateContext } from '../../../services/context/ContextProvider';
import API from "../../../services/api";
import { useRouter } from "next/router";
import Anime from "../../../services/database/controllers/anime";
import AnimeAPI from "../../../services/api/Anime";

import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';


import {AiOutlineSave} from "@react-icons/all-files/ai/AiOutlineSave";
import {BsUpload} from "@react-icons/all-files/bs/BsUpload";
import styles from "../../../styles/Forms.module.css";
import Link from "next/link";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
	  color: "white",
	  background: "var(--color-light)"
    },
  },
  
  disablePortal: true 
};

export default function SingleAnime({user, anime: animeDB, genres}) {
	const [anime, setAnime] = useState(animeDB);
	const {createNotification, notificationTypes, setModalOpen, setModalChildren} = useStateContext();
	const [name, setName] = useState(anime.name);
	const [description, setDescription] = useState(anime.description);
	const [released, setReleased] = useState(anime.released);
	const [imageSrc, setImageSrc] = useState(anime.picture);
	const [genresSelect, setGenresSelect] = useState(anime.genres.map(({id}) => id));
	const pictureRef = useRef(null);
	const router = useRouter();
	const [saveInProgress, setSaveInPogress] = useState(false);
		
	async function handleSubmit(e) {
		e.preventDefault();
		//console.log({name, description, picture: pictureRef.current.files[0]});
		if(!name) {
			return createNotification({
				type: notificationTypes.ERROR,
				title: "Error",
				message: "Name is required"
			})
		}
		if(!released) {
			return createNotification({
				type: notificationTypes.ERROR,
				title: "Error",
				message: "Released is required"
			})
		}
		if(genresSelect.length === 0) {
			return createNotification({
				type: notificationTypes.ERROR,
				title: "Error",
				message: "Anime must have at least one genre selected"
			})
		}
		const file = pictureRef.current.files.length !== 0 ? pictureRef.current.files[0] : null;
		const {error, data} = await API.AnimeAPI.Update(anime.id, name, description, file, released, anime.picture, genresSelect);
		if(error) {
			return createNotification({
				type: notificationTypes.ERROR,
				title: "Error",
				message: error.message
			})
		}
		createNotification({
			type: notificationTypes.SUCCESS,
			title: "Success",
			message: "Anime succesfully updated"
		})
		setAnime(data.anime)
		pictureRef.current.value = "";
	}

	function handleDelete() {
		setModalChildren(
			<DeleteAnimeModal 
				onConfirm={async () => {
					const {error} = await AnimeAPI.Delete(anime.id);
					if(error) {
						return createNotification({
							type: notificationTypes.ERROR,
							title: "Error",
							message: error.message
						})
					}
					router.push("/admin")
				}}
			/>
		)
		setModalOpen(true)
	}
	
	const handleChange = (event) => {
		const {
		  target: { value },
		} = event;
		setGenresSelect(
		  // On autofill we get a stringified value.
		  typeof value === 'string' ? value.split(',') : value,
		);
	  };
	return (
		<Layout user={user}>
			<div className={styles.form_wrapper}>
				<form onSubmit={handleSubmit} className={styles.form}>
					<h1>{anime.name}</h1>
					<Link href={`/${anime.id}/edit/episodes`}>
						<div className={`button ${styles.edit_episodes_button}`}><AiOutlineSave size={20} /><span>Edit Episodes</span></div>
					</Link>
					<div className={styles.group}>
						<label className={styles.label} htmlFor="name">Name:</label>
						<textarea className={styles.textarea} id="name" value={name} onChange={e => {setName(e.target.value); handleTextAreaChange(e); }}  />
					</div>
					<div className={styles.group}>
						<label className={styles.label} htmlFor="released">Released:</label>
						<input className={styles.input} id="released" value={released} onChange={e => setReleased(e.target.value)}  />
					</div>
					<div className={styles.group}>
						<label className={styles.label} htmlFor="genres">Genres:</label>
						{/* select is copied from mui select chip example with values changed for this app and unnessery thing removed */}
						<Select
							id="genres"
							multiple
							value={genresSelect}
							onChange={handleChange}
							input={<OutlinedInput style={{border: "none"}}/>}
							renderValue={(selected) => (
								<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, }}>
									{selected.map((value) => (
										<Chip key={value} label={genres.find(({id}) => id === value).name} sx={{background: "var(--color-light)", color: "white"}} />
									))}
								</Box>
							)}
							MenuProps={MenuProps}
							sx={{
								background: "var(--color-mid)",
								'.MuiOutlinedInput-notchedOutline': { borderWidth: "0 !important" },
							}}
							>
							{genres.map((genre) => (
								<MenuItem
									key={genre.id}
									value={genre.id}
								>
									{genre.name}
								</MenuItem>
							))}
						</Select>
					</div>
					<label className={styles.label} htmlFor="picture">Picture:</label>
					<button type="button" className={`button ${styles.upload_button}`} onClick={() => pictureRef.current?.click()}><BsUpload size={20} /><span>Upload Photo</span></button>
					<input className={styles.file_input} 
						type="file" 
						ref={pictureRef} 
						onChange={
							e => {
								const [file] = e.target.files;
								if (file) {
									setImageSrc(URL.createObjectURL(file)) // generate url for uploded image so that it can be showned
								}
								else setImageSrc("")
							}
						} 
					/> 
					{imageSrc !== "" && (
						<div className={styles.anime_picture}>
							<img src={imageSrc}/>
						</div>
					)}
					<div className={styles.group}>
						<label className={styles.label} htmlFor="desc">Description:</label>
						<textarea className={styles.textarea} id="desc" value={description} onChange={e => {setDescription(e.target.value); handleTextAreaChange(e);}} />
					</div>
					<div className={styles.button_group}>
						<button type="submit" className={`button ${styles.save_button} ${styles.submit_button}`}><AiOutlineSave size={20} /><span>Save Anime</span></button>
						<button type="button" className={`button ${styles.submit_button}`} onClick={handleDelete}>Delete</button>
					</div>
				</form>
			</div>
		</Layout>
	)
}

export const getServerSideProps = SSRSession(async ({req, res, query}) => {
	const user = await auth(req, res); // get currently logged user
	if(!user) return { // if user isn't logged in redirect them to login page
		redirect: {
			destination: "/login",
			permanent: false
		}
	}
	// if user is not admin they can't access this page
	if(!user.admin) return {
		redirect: {
			destination: `/error?message=Only admins can access this page`,
			permanent: false
		}
	}
	const {error, data} = await Anime.GetById(query.id);
	if(error) return {
		redirect: {
			destination: `/error?message=${error.message}`,
			permanent: false
		}
	}
	if(data.length === 0) return {
		notFound: true
	}
	//console.log(data);
	const anime = {
		...data[0],
		episodes: JSON.parse(data[0].episodes ?? "[]") ?? [],
		genres: JSON.parse(data[0].genres ?? "[]") ?? []
	}
	
	const genresQ = await Anime.AllGenres();
	if(genresQ.error) {
		return {
			redirect: {
				destination: `/error?message=${genresQ.error.message}`,
				permanent: false
			}
		}
	}
	//console.log(anime);
	return {
		props: {
			user,
			anime: JSON.parse(JSON.stringify(anime)),
			genres: JSON.parse(JSON.stringify(genresQ.data))
		}
	}
})

function DeleteAnimeModal({onConfirm}) {

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
			<h3 className={`modal_title`}>Delete anime confirmation</h3>
			<p className={`modal_paragraph`}>Are you sure you want to delete this anime? Once performed this action can&apos;t be reversed.</p>
			<div className={`modal_buttons`}>
				<button onClick={handleYes} className={`modal_yes_button`}>Yes</button>
				<button onClick={handleNo} className={`modal_no_button`}>No</button>
			</div>
		</div>
	);
}
