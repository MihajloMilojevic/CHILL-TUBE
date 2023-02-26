import React from 'react'
import AdminLayout from "../../../components/AdminLayout/AdminLayout";
import { SSRSession } from '../../../services/sessions/get-session';
import auth from '../../../services/middleware/authentication';
import { PageTitle } from '../../../components';

export default function Stranica({user}) {
  return (
	<AdminLayout user={user}>
		<PageTitle>Смерови</PageTitle>
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