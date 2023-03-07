import {SSRSession} from "../services/sessions/get-session"
import auth from "../services/middleware/authentication"


export default function ChangePasswordPage() {

	return <div>
		<h1>Change Password</h1>
	</div>
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