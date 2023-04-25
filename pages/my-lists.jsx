import {SSRSession} from "../services/sessions/get-session"
import auth from "../services/middleware/authentication"
import { AnimeList, Layout } from "../components";
import User from "../services/database/controllers/users";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { useState } from "react";
import {AiOutlineDelete } from '@react-icons/all-files/ai/AiOutlineDelete';
import { useStateContext } from "../services/context/ContextProvider";
import API from "../services/api";


export default function MyListsPage({user, lists: listsDB}) {
	const [lists, setLists] = useState(listsDB)
	return (
		<Layout user={user}>
			<h1>My Lists Page</h1>
			{lists.length === 0 ? (
				<p>You don&apos;t have any lists.</p>
			) : (
				lists.map(list => (
					<SingleList 
						key={list.id}
						list={list}
						setLists={setLists}
					/>
				))
			)}
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
	const listsQ = await User.GetLists(user.id);
	if(listsQ.error) return {
		redirect: {
			destination: `/error?message=${listsQ.error.message}`,
			permanent: false
		}
	}
	const lists = (listsQ.data ?? []).map(({id, name, animes}) => ({id, name, animes: JSON.parse(animes) ?? []}));
	return {
		props: {
			user,
			lists
		}
	}
})

function SingleList({list, setLists}) {
	const [hovered, setHovered] = useState(false);
	const {setModalOpen, setModalChildren, createNotification, notificationTypes} = useStateContext();
	async function deleteList(listId) {
		const {error, data} = await API.UserAPI.DeleteList(listId);
		if(error || !data.ok) { 
			// if an error occured create error notification
            createNotification({
                type: notificationTypes.ERROR,
                title: "Error",
                message: error.message || data.message
            })
        }
        else {
            createNotification({
                type: notificationTypes.SUCCESS,
                title: "Success",
                message: "You have successfully deleted list"
            })
			setLists(data.lists)
        }
	}
	function handleDelete() {
		setModalChildren(
			<DeleteListModal 
				onConfirm={ () => {
					deleteList(list.id)
				}}
			/>
		)
		setModalOpen(true)
	}
	return (
		<Accordion 
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<AccordionSummary >
				<div style={{width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
					<div style={{display: "flex", alignItems: "center", gap: 10}}>
						<h3>{list.name}</h3> 
						<p style={{fontSize: "0.8rem"}}>{list.animes.length} Anime{list.animes.length !== 1 ? "s" : ""}</p>
					</div>
					<div>
					{
						hovered && (
							<button onClick={handleDelete}>
								<AiOutlineDelete />
							</button>
						)	
					}
					</div>
				</div>
			</AccordionSummary>
			<AccordionDetails>
			{
				list.animes.length === 0 ? (
					<p>There are no anime on this list</p>
				) : (
				<AnimeList anime={list.animes} pagination={false}/>
				)
			}
			</AccordionDetails>
		</Accordion>
	)
}

function DeleteListModal({onConfirm}) {

	const {setModalOpen} = useStateContext();
	async function handleYes() {
		onConfirm();
		setModalOpen(false);
	}
	async function handleNo() {
		setModalOpen(false);
	}

	return (
		<div>
			<h3 className={`modal_title`}>Delete list confirmation</h3>
			<p className={`modal_paragraph`}>Are you sure you want to delete this list? Once performed this action can&apos;t be reversed.</p>
			<div className={`modal_buttons`}>
				<button onClick={handleYes} className={`modal_yes_button`}>Yes</button>
				<button onClick={handleNo} className={`modal_no_button`}>No</button>
			</div>
		</div>
	);
}