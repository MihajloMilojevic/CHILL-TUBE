import { useState } from "react";
import Layout from "../../../components/Layout/Layout";
import auth from "../../../services/middleware/authentication";
import {SSRSession} from "../../../services/sessions/get-session";
import { useStateContext } from '../../../services/context/ContextProvider';
import API from "../../../services/api";
import Anime from "../../../services/database/controllers/anime";
import {EpisodeEditer} from "../../../components";

import {AiOutlineSave} from "@react-icons/all-files/ai/AiOutlineSave";
import {AiOutlinePlus} from "@react-icons/all-files/ai/AiOutlinePlus";
import {AiOutlineCheck} from "@react-icons/all-files/ai/AiOutlineCheck";
import {AiOutlineClose} from "@react-icons/all-files/ai/AiOutlineClose";
import styles from "../../../styles/EditEpisodes.module.css";
import Head from "next/head";


export default function SingleAnime({user, anime: animeDB, genres}) {
	const [anime, setAnime] = useState(animeDB);
	
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
		<Layout user={user}>
			<Head>
				<title>{`Chill Tube | Edit episodes - ${anime.name}`}</title>
			</Head>
			<div>
				<h1>{anime.name}</h1>
				<h3>Edit Episodes</h3>
				<div className={styles.button_group}>
					<button 
						onClick={addNewEpisode}
						className={`button ${styles.button} `}
					>
						<AiOutlinePlus size={20} />
						<span>Add New Episode</span>
					</button>
					<button 
						onClick={handleSave} 
						disabled={saveInProgress} 
						className={`button ${styles.button} `}
					>
						<AiOutlineSave size={20} />
						<span>Save Episodes</span>
					</button>
				</div>
				<div className={styles.episode_wrapper}>
					<div className={styles.episode_list}>
					{
						episodes.length === 0 ? (
							<p>There are no episodes</p>
						) : (
							episodes.map((e, i) => (
								<div 
									key={i} 
									onClick={(e) => setCurrentEpisodeIndex(i)}
									className={`${styles.episode} ${currentEpisodeIndex === i ? styles.active : ""}`}
								>
									<span className={styles.episode_text}>Episode {i+1}.</span> 
									{!e.videoUrl && !e.videoFile? 
										<AiOutlineClose title="This episode does not have video selected" size={15} color="#FF0000"/> : 
										<AiOutlineCheck title="This episode has video selected" size={15} color="#00FF0A"/>
									}
								</div>
							))
						)
					}
					</div>
					<EpisodeEditer 
						episode={currentEpisodeIndex < 0 ? null : episodes[currentEpisodeIndex]}
						index={currentEpisodeIndex}
						close={() => {setCurrentEpisodeIndex(-1)}}
						saveEpisode={saveEpisode}
						deleteEpisode={deleteEpisode}
					/>
				</div>
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

function generateEpisodesListFromDB(episodes) {
	return (episodes ?? []).map(({id, video}) => ({id, videoUrl: video ?? "", videoFile: null, new: false}))
}
