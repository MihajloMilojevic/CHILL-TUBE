import { useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout/Layout";
import auth from "../../services/middleware/authentication";
import {SSRSession} from "../../services/sessions/get-session";
import { useStateContext } from '../../services/context/ContextProvider';
import API from "../../services/api";
import { useRouter } from "next/router";
import Anime from "../../services/database/controllers/anime";
import {EpisodeEditer} from "../../components";
import AnimeAPI from "../../services/api/Anime";

import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';


export default function SingleAnime({user, anime: animeDB, genres}) {
	const [anime, setAnime] = useState(animeDB);
	return (
		<Layout user={user}>
			<h1>{anime.name}</h1>
			<AnimeData anime={anime} setAnime={setAnime} genres={genres} />
			<Episodes anime={anime} setAnime={setAnime} />
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

function generateEpisodesListFromDB(episodes) {
	return (episodes ?? []).map(({id, video}) => ({id, videoUrl: video ?? "", videoFile: null, new: false}))
}

function Episodes({anime, setAnime}) {

	const {createNotification, notificationTypes} = useStateContext();
	const [episodes, setEpisodes] = useState(generateEpisodesListFromDB(anime.episodes));
	const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(-1);
	const [saveInProgress, setSaveInProgress] = useState(false);

	function deleteEpisode(episodeId) {
		setEpisodes(episodes.filter(({id}) => id !== episodeId));
		setCurrentEpisodeIndex(-1);
	}
	function saveEpisode(id, file) {
		setEpisodes(episodes.map(episode => episode.id === id ? {...episode, videoFile: file} : episode));
	}

	async function handleSave() {
		if(episodes.length === 0) {
			return createNotification({
				type: notificationTypes.ERROR,
				title: "Error",
				message: "Anime must have at least one episode"
			})
		}
		if(episodes.some(ep => ep.videoFile == null && ep.videoUrl == null)) {
			return createNotification({
				type: notificationTypes.ERROR,
				title: "Error",
				message: "All episodes must have video uploaded"
			})
		}
		createNotification({
			type: notificationTypes.INFO,
			title: "Info",
			message: "Episodes upload started"
		})
		setSaveInProgress(true);
		const {error, data} = await API.AnimeAPI.SaveEpisodes(anime.id, episodes);
		setSaveInProgress(false);
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
			message: "Episodes succesfully updated"
		})
		setEpisodes(generateEpisodesListFromDB(data.anime.episodes));
		setAnime(data.anime)
	}

	function addNewEpisode() {
		const maxEpId = episodes.reduce((currMax, currEp) => {
			if(currMax == null && currEp.new === true) return null;
			if(currMax == null && currEp.new === false) return currEp.id;
			return Math.max(currMax, currEp.id);
		}, 0);
		const newEpisode = {
			id: Math.round(Math.random() * 1000000) + maxEpId,
			videoUrl: null,
			videoFile: null,
			new: true
		}
		setEpisodes([...episodes, newEpisode]);
	}

	return (
		<div style={{display: "flex"}}>
			<div style={{flex: 3}}>
				<button onClick={addNewEpisode}>
					Add episode
				</button>
				<button onClick={handleSave} disabled={saveInProgress}>
					Save Episodes
				</button>
				<ul>
					{
						episodes.length === 0 ? (
							<p>There are no episodes</p>
						) : (
							episodes.map((e, i) => (
								<li key={i} onClick={(e) => setCurrentEpisodeIndex(i)}>Episode {i+1}. {!e.videoUrl && !e.videoFile? <span title="This episode does not have video selected">-</span> : <span title="This episode has video selected">+</span>}</li>
							))
						)
					}
				</ul>
			</div>
			<EpisodeEditer 
				episode={currentEpisodeIndex < 0 ? null : episodes[currentEpisodeIndex]}
				index={currentEpisodeIndex}
				close={() => {setCurrentEpisodeIndex(-1)}}
				saveEpisode={saveEpisode}
				deleteEpisode={deleteEpisode}
			/>
		</div>
	)
}


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  
  disablePortal: true 
};

function AnimeData({anime, setAnime, genres}) {

	console.log(genres)
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
		<form onSubmit={handleSubmit}>
			<button type="submit" disabled={saveInProgress}>Save</button> 
			<button type="button" onClick={handleDelete}>Delete</button>
			<br/>
			<label htmlFor="name">Name:</label>
			<input id="name" value={name} onChange={e => setName(e.target.value)}  /> <br />
			<label htmlFor="released">Released:</label>
			<input id="released" value={released} onChange={e => setReleased(e.target.value)}  /> <br />
			<label htmlFor="genres">Genres:</label>
				<Select
					id="genres"
					style={{
						width: 300,
						padding: 0
					}}
					multiple
					value={genresSelect}
					onChange={handleChange}
					input={<OutlinedInput/>}
					renderValue={(selected) => (
						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
							{selected.map((value) => (
								<Chip key={value} label={genres.find(({id}) => id === value)?.name ?? ""} />
							))}
						</Box>
					)}
					MenuProps={MenuProps}
					>
					{genres.map((genre) => (
						<MenuItem
							key={genre.id}
							value={genre.id}
						>
							{genre.name}
						</MenuItem>
					))}
				</Select> <br/>
			<label htmlFor="picture">Picture:</label>
			<input 
				type="file" 
				ref={pictureRef} 
				onChange={
					e => {
						const [file] = e.target.files;
						if (file) {
							setImageSrc(URL.createObjectURL(file))
						}
						else setImageSrc("")
					}
				} 
			/> 
			<br />
			{imageSrc !== "" && (<img src={imageSrc} width={100} height={100} style={{objectFit: "contain", display:"block"}} />)}
			<label htmlFor="desc">Description:</label>
			<textarea id="desc" value={description} onChange={e => setDescription(e.target.value)} /> <br />
		</form>
	);
}


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
