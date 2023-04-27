import React from 'react'
import Link from "next/link";
import {TiStarFullOutline} from "@react-icons/all-files/ti/TiStarFullOutline";
import styles from "./AnimeList.module.css";

export default function AnimeList({anime}) {
	return (
		<div className={styles.wrapper}>
		{
			anime.map(a => (
				<AnimeCard anime={a} key={a.id} />
			))
		}
		</div>
	)
}

function AnimeCard({anime}) {
	return (
		<Link key={anime.id} href={`/${anime.id}`}>
			<div className={styles.card}>
				<img src={anime.picture} alt={anime.name} />
				<div className={styles.data}>
					<p className={styles.name}>{anime.name}</p>
					<div className={styles.details}>
						<p className={styles.rating}><span>{anime.rating ?? "0"}</span> <TiStarFullOutline size={20} /></p>
						<p>{anime.released}</p>
					</div>
				</div>
			</div>
		</Link>
	)
}