import React, {useState} from 'react'
import {TiStarFullOutline} from "@react-icons/all-files/ti/TiStarFullOutline";
import { AddToListButton, UserRating } from "..";
import Link from "next/link";

export default function AnimeDetails({anime, setAnime}) {
	return (
		<>
			<img src={anime.picture} alt={anime.name}  />
			<h1>{anime.name}</h1>
			<p>{anime.rating} <TiStarFullOutline /></p>
			<p>{anime.released}</p>
			<p>{(anime.episodes.length)} Episode{anime.episodes.length > 1 && "s"}</p>
			<p>{anime.genres.map(genre => <span key={genre.id}>{genre.name}</span>)}</p>
			<h2>Plot summary:</h2>
			<p>{anime.description}</p>
			<h2>Select episode to watch:</h2>
			{
				anime.episodes.length > 0 ? (
					anime.episodes.map(episode => <p key={episode.id} ><a href={`/${anime.id}/episode/${episode.id}`}>Episode  {episode.orderNumber} {(episode.watched ? "+" : "")}</a></p>)
				) : (
					<p>There are no episodes uploded at the time.</p>
				)
			}
			<br/>
			<UserRating anime={anime} setAnime={setAnime} />
			<AddToListButton anime={anime} setAnime={setAnime} />
		</>
	)
}