import {SSRSession} from "../services/sessions/get-session"
import auth from "../services/middleware/authentication"
import { Layout } from "../components";


export default function HistoryPage({user}) {

	return (
		<Layout user={user}>
			<h1>History Page</h1>
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
	return {
		props: {
			user
		}
	}
})