import React, {useState} from 'react'
import {TiStarFullOutline} from "@react-icons/all-files/ti/TiStarFullOutline";
import { AddToListButton, UserRating } from "..";
import Chip from '@mui/material/Chip';
import { useStateContext } from '../../services/context/ContextProvider';
import {AiOutlineCheck} from "@react-icons/all-files/ai/AiOutlineCheck";
import {AiOutlineClose} from "@react-icons/all-files/ai/AiOutlineClose";
import styles from "./AnimeDetails.module.css";

export default function AnimeDetails({anime, setAnime}) {
	const {user} = useStateContext();
	return (
		<div className={styles.wrapper}>
			<div className={styles.image_user}>
				<div className={styles.image_wrapper}>
					<img src={anime.picture} alt={anime.name}  />
				</div>
				{user && (
					<div className={styles.user_wrapper}>
						<p>
							<span>Rate this anime: </span>
							<UserRating anime={anime} setAnime={setAnime} />
						</p>
						<AddToListButton anime={anime} setAnime={setAnime} />
					</div>
				)}
			</div>
			<div className={styles.data_wrapper}>
				<h1>{anime.name}</h1>
				<div className={styles.short}>
					<p className={styles.rating}><span>{anime.rating ?? "0"}</span> <TiStarFullOutline size={20} /></p>
					<p>{anime.released}</p>
					<p>{(anime.episodes.length)} Episode{anime.episodes.length > 1 && "s"}</p>
				</div>
				<div className={styles.genres}>
				{
					anime.genres.map(genre => 
						<Chip key={genre.id} label={genre.name} sx={{background: "var(--color-light)", color: "white"}} />
					)
				}
				</div>
				<h2>Plot summary:</h2>
				<p>{anime.description}</p>
				<h2>Select episode to watch:</h2>
				<div className={styles.episode_list}>
				{
					anime.episodes.length === 0 ? (
						<p>There are no episodes uploded at the time.</p>
					) : (
						anime.episodes.map(episode => (
							<div 
								key={episode.id} 
								className={`${styles.episode}`}
							>
								<a href={`/${anime.id}/episode/${episode.orderNumber}`} className={styles.episode_text}>
									Episode {episode.orderNumber}.
								</a> 
								{
									!!episode.watched && 
										<AiOutlineCheck title="You have watched this episode" size={15} color="#00FF0A"/>
								}
							</div>
						))
					)
				}
				</div>
			</div>
		</div>
	)
}