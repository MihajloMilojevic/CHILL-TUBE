import {SSRSession} from "../services/sessions/get-session"
import auth from "../services/middleware/authentication"
import { AnimeList, Layout } from "../components";
import User from "../services/database/controllers/users";
import Head from "next/head";


export default function HistoryPage({user, history}) {

	return (
		<Layout user={user}>
			<Head>
				<title>Chill Tube | History Page</title>
			</Head>
			<h1>Your History</h1>
			<AnimeList 
				anime={history}
			/>
		</Layout>
	)
}

export const getServerSideProps = SSRSession(async ({req, res}) => {
	const user = await auth(req, res);
	if(!user) return {
		redirect: {
			destination: "/",
			permanent: false
		}
	}
	const historyQ = await User.GetHistory(user.id);
	if(historyQ.error) return {
		redirect: {
			destination: `/error?message=${historyQ.error.message}`,
			permanent: false
		}
	}
	return {
		props: {
			user,
			history: JSON.parse(JSON.stringify(historyQ.data ?? []))
		}
	}
})