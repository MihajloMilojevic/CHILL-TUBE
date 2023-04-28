import { useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout/Layout";
import auth from "../../services/middleware/authentication";
import {SSRSession} from "../../services/sessions/get-session";
import Anime from "../../services/database/controllers/anime";
import Link from "next/link";
import {AiOutlineEdit} from "@react-icons/all-files/ai/AiOutlineEdit";
import { AnimeDetails } from "../../components";
import styles from "../../styles/AnimePage.module.css"
import Head from "next/head";

export default function SingleAnime({user, anime: animeDB}) {
	const [anime, setAnime] = useState(animeDB);
	return (
		<Layout user={user}>
			<Head>
				<title>{`Chill Tube | ${anime.name}`}</title>
			</Head>
			<h1>{anime.name}</h1>
			{
				(user && user.admin) && (<>
					<Link href={`/${anime.id}/edit`}>
						<p className={`button ${styles.edit_button}`}><AiOutlineEdit size={20} /><span>Edit This Anime</span></p>
					</Link>
				</>
				)
			}
			<AnimeDetails anime={anime} setAnime={setAnime} />
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
	
	const commentsQ = await Anime.GetComments(query.number);
	if(commentsQ.error) anime.comments = [];
	else anime.comments = commentsQ.data.map(({json}) => JSON.parse(json))
	
	//console.log(anime);
	return {
		props: {
			user,
			anime: JSON.parse(JSON.stringify(anime)),
		}
	}
})
