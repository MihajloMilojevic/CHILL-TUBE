import Layout from "../components/Layout/Layout";
import auth from "../services/middleware/authentication";
import {SSRSession} from "../services/sessions/get-session";
import Anime from "../services/database/controllers/anime";
import Link from "next/link";
import { useState } from "react";

export default function AdminHomePage({user, anime}) {
	const [search, setSearch] = useState("");
	return (
		<Layout user={user}>
			{/* <p>{JSON.stringify(user)}</p> */}
			{ (user && user.admin) && 
				<Link href="/add"><p style={{padding: "1rem", background: "white", cursor: "pointer", display: "inline-block"}}>+</p></Link>
			}
			<br />
			<input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
			<br/>
			{
				anime.length === 0 ? "No anime has been added" : (
					<div>
						{
							anime.filter(a => (search === "" ? true : a.name.toLowerCase().includes(search.toLowerCase()))).map(a => (
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
		</Layout>
	)
}

export const getServerSideProps = SSRSession(async ({req, res}) => {
	const user = await auth(req, res); // get currently logged user
	
	// get a list of all anime
	const {data, error} = await Anime.GetAll();
	// if there was an error while fetching anime redirect to error page with error message
	if(error) return {
		redirect: {
			destination: `/error?message=${error.message}`,
			permanent: false
		}
	}
	return {
		props: {
			user,
			anime: JSON.parse(JSON.stringify(data)) // next has a problem serializing data return from query so we need to serialize it by converting it to json and back from json
		}
	}
})