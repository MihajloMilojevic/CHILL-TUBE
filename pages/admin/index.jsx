import AdminLayout from "../../components/AdminLayout/AdminLayout";
import auth from "../../services/middleware/authentication";
import {SSRSession} from "../../services/sessions/get-session";
import Anime from "../../services/database/controllers/anime";
import Link from "next/link";
import { useState } from "react";

export default function Admin({user, anime}) {
	const [search, setSearch] = useState("");
	return (
		<AdminLayout user={user}>
			<h1>Admin</h1>
			{/* <p>{JSON.stringify(user)}</p> */}
			<Link href="/admin/add"><p style={{padding: "1rem", background: "white", cursor: "pointer", display: "inline-block"}}>+</p></Link>
			<br />
			<input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
			<br/>
			{
				anime.length === 0 ? "No anime has been added" : (
					<div>
						{
							anime.filter(a => (search === "" ? true : a.name.toLowerCase().includes(search.toLowerCase()))).map(a => (
								<Link key={a.id} href={`/admin/${a.id}`}>
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
		</AdminLayout>
	)
}

export const getServerSideProps = SSRSession(async ({req, res}) => {
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