import { useRef, useState } from "react";
import AdminLayout from "../../../components/AdminLayout/AdminLayout";
import auth from "../../../services/middleware/authentication";
import {SSRSession} from "../../../services/sessions/get-session";
import { useStateContext } from '../../../services/context/ContextProvider';
import API from "../../../services/api";
import { useRouter } from "next/router";
import Anime from "../../../services/database/controllers/anime";

export default function SingleAnime({user, anime}) {
	const {createNotification, notificationTypes} = useStateContext();
	const [name, setName] = useState(anime.name);
	const [description, setDescription] = useState(anime.description);
	const [imageSrc, setImageSrc] = useState(anime.picture);
	const pictureRef = useRef(null);
	const router = useRouter();
		
	async function handleSubmit(e) {
		e.preventDefault();
		console.log({name, description, picture: pictureRef.current.files[0]});
		if(!name) {
			return createNotification({
				type: notificationTypes.ERROR,
				title: "Error",
				message: "Name is required"
			})
		}
		
		if(pictureRef.current.files.length === 0) {
			return createNotification({
				type: notificationTypes.ERROR,
				title: "Error",
				message: "Picture is required"
			})
		}
		const {error, data} = await API.AnimeAPI.Create(name, description, pictureRef.current.files[0])
		if(error) {
			return createNotification({
				type: notificationTypes.ERROR,
				title: "Error",
				message: error.message
			})
		}
		createNotification({
			type: notificationTypes.SUCCESS,
			title: "Success",
			message: "Anime succesfully created"
		})
		router.push("/admin");
	}

	return (
		<AdminLayout user={user}>
			<h1>{anime.name}</h1>
			{/* <p>{JSON.stringify(user)}</p> */}
			<form onSubmit={handleSubmit}>
				<button type="submit">Save</button> <br/>
				<label htmlFor="name">Name:</label>
				<input id="name" value={name} onChange={e => setName(e.target.value)}  /> <br />
				<label htmlFor="picture">Picture:</label>
				<input 
					type="file" 
					ref={pictureRef} 
					onChange={
						e => {
							const [file] = e.target.files;
							if (file) {
								setImageSrc(URL.createObjectURL(file))
							}
							else setImageSrc("")
						}
  					} 
				/> 
				<br />
				{imageSrc !== "" && (<img src={imageSrc} width={100} height={100} style={{objectFit: "contain", display:"block"}} />)}
				<label htmlFor="desc">Description:</label>
				<textarea id="desc" value={description} onChange={e => setDescription(e.target.value)} /> <br />
			</form>
		</AdminLayout>
	)
}

export const getServerSideProps = SSRSession(async ({req, res, query}) => {
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
	const {error, data} = await Anime.GetById(query.id);
	if(error) return {
		redirect: {
			destination: `/error?message=${error.message}`,
			permanent: false
		}
	}
	if(data.length === 0) return {
		notFound: true
	}
	console.log(data);
	const anime = {
		...data[0],
		episodes: JSON.parse(data[0].episodes ?? "[]") ?? []
	}
	console.log(anime);
	return {
		props: {
			user,
			anime: JSON.parse(JSON.stringify(anime))
		}
	}
})