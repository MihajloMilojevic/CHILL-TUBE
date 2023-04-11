import { useRef, useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout/AdminLayout";
import auth from "../../services/middleware/authentication";
import {SSRSession} from "../../services/sessions/get-session";
import { useStateContext } from '../../services/context/ContextProvider';
import API from "../../services/api";
import { useRouter } from "next/router";
import Anime from "../../services/database/controllers/anime";


import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  
  disablePortal: true 
};

export default function AddAnimePage({user, genres}) {
	const {createNotification, notificationTypes} = useStateContext();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [type, setType] = useState("");
	const [released, setReleased] = useState("");
	const [imageSrc, setImageSrc] = useState("");
	const [genresSelect, setGenresSelect] = useState([]);
	const pictureRef = useRef(null);
	const router = useRouter();

	async function handleSubmit(e) {
		e.preventDefault();
		//console.log({name, description, picture: pictureRef.current.files[0]});
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
		
		if(genresSelect.length === 0) {
			return createNotification({
				type: notificationTypes.ERROR,
				title: "Error",
				message: "Anime must have at least one genre selected"
			})
		}
		const {error} = await API.AnimeAPI.Create(name, description, pictureRef.current.files[0], type, released, genresSelect)
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

	const handleChange = (event) => {
		const {
		  target: { value },
		} = event;
		setGenresSelect(
		  // On autofill we get a stringified value.
		  typeof value === 'string' ? value.split(',') : value,
		);
	  };

	return (
		<AdminLayout user={user}>
			<h1>Add Anime</h1>
			{/* <p>{JSON.stringify(user)}</p> */}
			<form onSubmit={handleSubmit} style={{position: "relative"}}>
				<button type="submit">Save</button> <br/>
				<label htmlFor="name">Name:</label>
				<textarea id="name" value={name} onChange={e => setName(e.target.value)}  /> <br />
				<label htmlFor="type">Type:</label>
				<input id="type" value={type} onChange={e => setType(e.target.value)}  /> <br />
				<label htmlFor="released">Released:</label>
				<input id="released" value={released} onChange={e => setReleased(e.target.value)}  /> <br />
				<label htmlFor="genres">Genres:</label>
				<Select
					id="genres"
					style={{
						width: 300,
						padding: 0
					}}
					multiple
					value={genresSelect}
					onChange={handleChange}
					input={<OutlinedInput style={{outline: "none"}}/>}
					renderValue={(selected) => (
						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
							{selected.map((value) => (
								<Chip key={value} label={genres.find(({id}) => id === value).name} />
							))}
						</Box>
					)}
					MenuProps={MenuProps}
					>
					{genres.map((genre) => (
						<MenuItem
							key={genre.id}
							value={genre.id}
						>
							{genre.name}
						</MenuItem>
					))}
				</Select> <br/>
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
	const genresQ = await Anime.AllGenres();
	if(genresQ.error) {
		return {
			redirect: {
				destination: `/error?message=${genresQ.error.message}`,
				permanent: false
			}
		}
	}
	return {
		props: {
			user,
			genres: JSON.parse(JSON.stringify(genresQ.data))
		}
	}
})