import Link from "next/link";
import auth from "../services/middleware/authentication";
import {SSRSession} from "../services/sessions/get-session";

export default function Home({user}) {
  return (
    <div>
      <h1>Hello</h1>
      <p>{user ? (`Hello, ${user.username}`) : "You are not logged in"}</p>
      <Link href={user ? "/logout" : "/login"}>{user ? "Logout" : "Login"}</Link>
    </div>
  )
}

// wrap getServerSideProps in SSRSession to be able to use req.session object from iron-session
export const getServerSideProps = SSRSession(async ({req, res}) => {
	const user = await auth(req, res);
	return {
		props: {
			user
		}
	}
})