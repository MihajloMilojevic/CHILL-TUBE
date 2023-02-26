import AdminLayout from "../../components/AdminLayout/AdminLayout";
import auth from "../../services/middleware/authentication";
import {SSRSession} from "../../services/sessions/get-session";

export default function Admin({user}) {
	return (
		<AdminLayout user={user}>
			<h1>Admin</h1>
			<p>{JSON.stringify(user)}</p>
		</AdminLayout>
	)
}

export const getServerSideProps = SSRSession(async ({req, res}) => {
	const user = await auth(req, res);
	if(!user) return {
		redirect: {
			destination: "/admin/login",
			permanent: false
		}
	}
	if(req.session.user.promeniLozinku) return {
		redirect: {
			destination: "/admin/promeni-lozinku",
			permanent: false
		}
	}
	return {
		props: {
			user
		}
	}
})