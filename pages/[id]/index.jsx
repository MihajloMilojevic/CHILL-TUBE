import { useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout/Layout";
import auth from "../../services/middleware/authentication";
import {SSRSession} from "../../services/sessions/get-session";
import Anime from "../../services/database/controllers/anime";
import Link from "next/link";
import { AnimeDetails } from "../../components";

export default function SingleAnime({user, anime}) {
	return (
		<Layout user={user}>
			<h1>{anime.name}</h1>
			{
				(user && user.admin) && (<>
					<Link href={`/${anime.id}/edit`}>Edit</Link> <br/>
				</>
				)
			}
			<AnimeDetails anime={anime} />
		</Layout>
	)
}

export const getServerSideProps = SSRSession(async ({req, res, query}) => {
	const user = await auth(req, res); // get currently logged user
	
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
	let rating = null;
	if(user) {
		const ratingQ = await Anime.GetUserRatingOfAnime(anime.id, user.id);
		console.log(anime.id, user.id)
		console.log(ratingQ);
		if(ratingQ.data && ratingQ.data.length > 0) rating = ratingQ.data[0].rating;
	}
	anime.userRating = rating;
	
	//console.log(anime);
	return {
		props: {
			user,
			anime: JSON.parse(JSON.stringify(anime)),
		}
	}
})
