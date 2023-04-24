import React from 'react'
import Link from "next/link";

function AnimeList({anime, pagination}) {
	return (
		<div style={{display: "flex", justifyContent: "flex-start", alignItems: "flex-start", gap: 10, flexWrap: "wrap"}}>
		{
			anime.map(a => (
				<Link key={a.id} href={`/${a.id}`}>
					<div style={{width: 100, height: 200, display: "inline-block"}}>
						<img src={a.picture} alt={a.name} style={{width: "100%", height: "80%", objectFit: "cover"}} />
						<p>{a.name}</p>
					</div>
				</Link>
			))
		}
		</div>
	)
}

export default AnimeList