import { useRef, useState } from "react";
import Layout from "../components/Layout/Layout";
import auth from "../services/middleware/authentication";
import {SSRSession} from "../services/sessions/get-session";
import { useStateContext } from '../services/context/ContextProvider';
import API from "../services/api";
import { useRouter } from "next/router";
import Anime from "../services/database/controllers/anime";
import {AiOutlineSave} from "@react-icons/all-files/ai/AiOutlineSave";
import {BsUpload} from "@react-icons/all-files/bs/BsUpload";
import styles from "../styles/Forms.module.css";

// import all the component from mui for select
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Head from "next/head";

// copied from mui select example
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
  
  disablePortal: true // NEEDED for proper positiong of dropdown
};

export default function AddAnimePage({user, genres}) {
	const {createNotification, notificationTypes} = useStateContext();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [released, setReleased] = useState("");
	const [imageSrc, setImageSrc] = useState("");
	const [genresSelect, setGenresSelect] = useState([]);
	const pictureRef = useRef(null);
	const router = useRouter();

	// event handler - subming for and saving a anime to the db
	async function handleSubmit(e) {
		e.preventDefault();
		//console.log({name, description, picture: pictureRef.current.files[0]});

		// name is required
		if(!name) {
			return createNotification({
				type: notificationTypes.ERROR,
				title: "Error",
				message: "Name is required"
			})
		}

		// name is required
		if(!released) {
			return createNotification({
				type: notificationTypes.ERROR,
				title: "Error",
				message: "Released is required"
			})
		}
		// there has to be a picture uploaded
		if(pictureRef.current.files.length === 0) {
			return createNotification({
				type: notificationTypes.ERROR,
				title: "Error",
				message: "Picture is required"
			})
		}
		
		//anime must have at least one genre added
		if(genresSelect.length === 0) {
			return createNotification({
				type: notificationTypes.ERROR,
				title: "Error",
				message: "Anime must have at least one genre selected"
			})
		}
		// call API to create anime
		const {error} = await API.AnimeAPI.Create(name, description, pictureRef.current.files[0], released, genresSelect)
		// if API return error display it to the user
		if(error) {
			return createNotification({
				type: notificationTypes.ERROR,
				title: "Error",
				message: error.message
			})
		}
		// there was no error display confirmation message and redirect to admin homepage
		createNotification({
			type: notificationTypes.SUCCESS,
			title: "Success",
			message: "Anime succesfully created"
		})
		router.push("/");
	}

	// copied from mui select example - event that fires on value change of genre select
	const handleChange = (event) => {
		const {
		  target: { value },
		} = event;
		// value is in event.target.value and is string (like array.join()) so to set state as an array we need to split string at ',' into an array
		setGenresSelect(
		  // On autofill we get a stringified value.

		  typeof value === 'string' ? value.split(',') : value,
		);
	  };
	function handleTextAreaChange(e) {
		e.target.style.height = "";
		e.target.style.height = e.target.scrollHeight + "px";
	}
	return (
		<Layout user={user}>
			<Head>
				Chill Tube | Add New Anime
			</Head>
			<div className={styles.form_wrapper}>
				<form onSubmit={handleSubmit} className={styles.form}>
					<h1>Add Anime</h1>
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
					<button type="submit" className={`button ${styles.save_button} ${styles.submit_button}`}><AiOutlineSave size={20} /><span>Save Anime</span></button>
				</form>
			</div>
		</Layout>
	)
}

export const getServerSideProps = SSRSession(async ({req, res}) => {
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
	const genresQ = await Anime.AllGenres();
	if(genresQ.error) {
		return {
			redirect: {
				destination: `/error?message=${genresQ.error.message}`,
				permanent: false
			}
		}
	}
	return {
		props: {
			user,
			genres: JSON.parse(JSON.stringify(genresQ.data))
		}
	}
})