import Layout from "../components/Layout/Layout";
import auth from "../services/middleware/authentication";
import {SSRSession} from "../services/sessions/get-session";
import Anime from "../services/database/controllers/anime";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimeList } from "../components";
import { useStateContext } from "../services/context/ContextProvider";
import {AiOutlinePlus} from "@react-icons/all-files/ai/AiOutlinePlus";
import {BsSearch} from "@react-icons/all-files/bs/BsSearch";
import {IoMdOptions} from "@react-icons/all-files/io/IoMdOptions";
import styles from "../styles/HomeScreen.module.css";

export default function AdminHomePage({user, anime}) {
	const {
		filterOpen, setFilterOpen,
		filterOrder, setFilterOrder,
		selectedGenres, setSelectedGenres,
		filterOrderTypes, genres,
		releasedBoundries, setReleasedBoundries,
		releasedValue, setReleasedValue
	} = useStateContext();

	const [filteredAnime, setFilteredAnime] = useState(order(anime));
	const [search, setSearch] = useState("");
	const searchInputRef = useRef(null);

	useEffect(() => {
		const min = anime.reduce((currMin, currAnime) => Math.min(currMin, currAnime.released), new Date().getFullYear() + 100)
		const max = anime.reduce((currMax, currAnime) => Math.max(currMax, currAnime.released), 0)
		console.log({min, max})
		setReleasedBoundries({min, max});
		setReleasedValue({min, max});
	}, []);

	useEffect(() => {
		setFilteredAnime(order(filterByReleased(filterByGenres(anime))));
	}, [filterOrder, releasedValue, selectedGenres])


	function filterByReleased(list) {
		return list.filter(a => a.released >= releasedValue.min && a.released <= releasedValue.max);
	}

	function filterByGenres(list) {
		if(selectedGenres.length === 0) return list;
		return list.filter(a => a.genres.some(g => selectedGenres.includes(g)));
	}
	
	function order(list) {
		switch (filterOrder) {
			case filterOrderTypes.NAME_ASC:
				list.sort((a, b) => a.name < b.name ? 1 : -1)	
				break;
			case filterOrderTypes.NAME_DESC:
				list.sort((a, b) => a.name > b.name ? 1 : -1)	
				break;
			case filterOrderTypes.RATING_ASC:
				list.sort((a, b) => a.rating > b.rating ? 1 : -1)	
				break;
			case filterOrderTypes.RATING_DESC:
				list.sort((a, b) => a.rating < b.rating ? 1 : -1)	
				break;
		}
		return list;
	}

	return (
		<Layout user={user}>
			{/* <p>{JSON.stringify(user)}</p> */}
			{ (user && user.admin) && 
				<Link href="/add"><p className={`button ${styles.add_button}`}><AiOutlinePlus size={20} /><span>Add New Anime</span></p></Link>
			}
			<div className={styles.search_filter_group}>
				<div className={`${styles.search_box}`} onClick={() => searchInputRef.current?.focus()}>
					<BsSearch size={20} />
					<input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} ref={searchInputRef} />
				</div>
				<button className={`button ${styles.filter_button}`} onClick={() => setFilterOpen(true)}><IoMdOptions size={20} /></button>
			</div>
			<br/>
			{
				filteredAnime.length === 0 ? "No anime has with this search" : (
					<AnimeList 
						anime={filteredAnime.filter(a => (search === "" ? true : a.name.toLowerCase().includes(search.toLowerCase())))}
					/>
				)
			}
		</Layout>
	)
}

export const getServerSideProps = SSRSession(async ({req, res}) => {
	const user = await auth(req, res); // get currently logged user
	
	// get a list of all anime
	const {data, error} = await Anime.GetAll();
	// if there was an error while fetching anime redirect to error page with error message
	if(error) return {
		redirect: {
			destination: `/error?message=${error.message}`,
			permanent: false
		}
	}
	const anime = data.map((a) => ({...a, genres: (JSON.parse(a.genres ?? "[]") ?? []).map(({id}) => id)}))
	return {
		props: {
			user,
			anime,
		}
	}
})