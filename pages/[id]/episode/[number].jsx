import { useEffect, useRef, useState } from "react";
import Layout from "../../../components/Layout/Layout";
import auth from "../../../services/middleware/authentication";
import {SSRSession} from "../../../services/sessions/get-session";
import Anime from "../../../services/database/controllers/anime";
import Link from "next/link";
import { AnimeDetails, CommentsSection, EpisodePlayer } from "../../../components";

export default function SingleAnime({user, anime: animeDB, episodeNumber}) {
	const [anime, setAnime] = useState(animeDB);
	return (
		<Layout user={user}>
			<h1>{anime.name} - Episode {episodeNumber}</h1>
			<EpisodePlayer anime={anime} setAnime={setAnime} episodeNumber={episodeNumber} />
			<AnimeDetails anime={anime} setAnime={setAnime} />
			<CommentsSection anime={anime} setAnime={setAnime} episodeNumber={episodeNumber} />
		</Layout>
	)
}

export const getServerSideProps = SSRSession(async ({req, res, query}) => {
	const user = await auth(req, res); // get currently logged user
	
	const {error, data} = await Anime.GetPersonalizedAnimeData(query.id, user?.id ?? null);
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
		genres: JSON.parse(data[0].genres ?? "[]") ?? [],
		lists: JSON.parse(data[0].lists ?? "[]") ?? [],
	}
	if(query.number > anime.episodes.length || query.number < 1) return {
		notFound: true
	}

	const commentsQ = await Anime.GetComments(query.number);
	if(commentsQ.error) anime.comments = [];
	else anime.comments = commentsQ.data.map(({json}) => JSON.parse(json))
	
	//console.log(anime);
	return {
		props: {
			user,
			anime: JSON.parse(JSON.stringify(anime)),
			episodeNumber: parseInt(query.number)
		}
	}
})
