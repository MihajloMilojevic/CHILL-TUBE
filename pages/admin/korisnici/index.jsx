import React from 'react'
import AdminLayout from "../../../components/AdminLayout/AdminLayout";
import { SSRSession } from '../../../services/sessions/get-session';
import auth from '../../../services/middleware/authentication';
import { PageTitle } from '../../../components';
import User from '../../../services/database/controllers/users';
import { useRouter } from 'next/router';

export default function Stranica({user, korisnici}) {
	// console.log(korisnici);
	const router = useRouter();

	return (
		<AdminLayout user={user}>
			<PageTitle>Корисници</PageTitle>
			<button onClick={e => router.push("/admin/korisnici/kreiraj")}>+</button>
			<div style={{
				display: "flex",
				flexDirection: "column",
				gap: "1rem"
			}}>
				{
					korisnici.map((kor, index) => 
						<div 
							key={kor.id} 
							style={{
								display: "flex",
								gap: "1rem"
							}}
							onClick={() => router.push("/admin/korisnici/"+kor.id)}
						>
							<p>{index + 1}{"."}</p>
							<p>{kor.ime}</p>
							<p>{kor.prezime}</p>
							<p>{kor.korisnickoIme}</p>
						</div>)
				}
			</div>
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
	const {error, data: korisnici} = await User.getAllUsers(); 
	if(error) {
		return {
			redirect: {
				destination: "/error?msg="+error.message,
				permanent: false
			}
		}
	}
	return {
		props: {
			user,
			korisnici: JSON.parse(JSON.stringify(korisnici))
		}
	}
})
