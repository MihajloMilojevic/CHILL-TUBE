import { useEffect, useRef, useState } from "react";
import AdminLayout from "../../../components/Admin/AdminLayout/AdminLayout";
import auth from "../../../services/middleware/authentication";
import {SSRSession} from "../../../services/sessions/get-session";
import { useStateContext } from '../../../services/context/ContextProvider';
import API from "../../../services/api";
import { useRouter } from "next/router";
import Anime from "../../../services/database/controllers/anime";
import {EpisodeEditer} from "../../../components/Admin";

export default function SingleAnime({user, anime: animeDB}) {
	const [anime, setAnime] = useState(animeDB);
	return (
		<AdminLayout user={user}>
			<h1>{anime.name}</h1>
			<AnimeData anime={anime} setAnime={setAnime} />
			<Episodes anime={anime} setAnime={setAnime} />
		</AdminLayout>
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
		episodes: JSON.parse(data[0].episodes ?? "[]") ?? []
	}
	//console.log(anime);
	return {
		props: {
			user,
			anime: JSON.parse(JSON.stringify(anime))
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

function AnimeData({anime, setAnime}) {

	const {createNotification, notificationTypes} = useStateContext();
	const [name, setName] = useState(anime.name);
	const [description, setDescription] = useState(anime.description);
	const [type, setType] = useState(anime.type);
	const [released, setReleased] = useState(anime.released);
	const [imageSrc, setImageSrc] = useState(anime.picture);
	const pictureRef = useRef(null);
	const router = useRouter();
		
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
		const file = pictureRef.current.files.length !== 0 ? pictureRef.current.files[0] : null;
		const {error, data} = await API.AnimeAPI.Update(anime.id, name, description, file, type, released, anime.picture);
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

	return (
		<form onSubmit={handleSubmit}>
			<button type="submit">Save</button> <br/>
			<label htmlFor="name">Name:</label>
			<input id="name" value={name} onChange={e => setName(e.target.value)}  /> <br />
			<label htmlFor="type">Type:</label>
			<input id="type" value={type} onChange={e => setType(e.target.value)}  /> <br />
			<label htmlFor="released">Released:</label>
			<input id="released" value={released} onChange={e => setReleased(e.target.value)}  /> <br />
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