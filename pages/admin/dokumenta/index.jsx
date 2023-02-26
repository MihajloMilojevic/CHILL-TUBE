import React from 'react'
import AdminLayout from "../../../components/AdminLayout/AdminLayout";
import { SSRSession } from '../../../services/sessions/get-session';
import auth from '../../../services/middleware/authentication';
import Dokument from '../../../services/database/controllers/dokument';
import { PageTitle } from '../../../components';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Stranica({user, dokumenta}) {
	const router = useRouter();
  return (
	<AdminLayout user={user}>
		<PageTitle>Документа</PageTitle>
		<button onClick={() => router.push("/admin/dokumenta/kreiraj")}>+</button><br/>
		{/* {JSON.stringify(dokumenta)} */}
		{
			dokumenta.length === 0 ? (<p>Нема докумената</p>) : (
				dokumenta.map(dok => (
					<Link href={`/admin/dokumenta/${dok.id}`} key={dok.id}><p>{dok.naziv}</p></Link>
				))
			)
		}
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
	const {error, data} = await Dokument.SviDokumenti();
	return {
		props: {
			user,
			dokumenta: error ? [] : JSON.parse(JSON.stringify(data))
		}
	}
})