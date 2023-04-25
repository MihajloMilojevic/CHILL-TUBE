import React, { useState } from 'react'
import { useStateContext } from '../../services/context/ContextProvider';
import API from '../../services/api';

export default function AddToListButton({anime, setAnime}) {

	const {user, setModalChildren, setModalOpen, createNotification, notificationTypes} = useStateContext();
	async function handleSave(lists) {
		const {error, data} = await API.AnimeAPI.AddToLists(lists, anime.id)
		if(error || !data.ok) { 
			// if an error occured create error notification
            createNotification({
                type: notificationTypes.ERROR,
                title: "Error",
                message: error.message || data.message
            })
        }
        else {
			setAnime({...anime, ...data.anime})
            createNotification({
                type: notificationTypes.SUCCESS,
                title: "Success",
                message: "Lists succesfully saved"
            })
        }
	}
	function buttonClick() {
		setModalChildren(
			<ListsModal 
				lists={anime.lists}
				onCofirm={handleSave}
			/>
		)
		setModalOpen(true);
	}
	if(!user) return null;
	return (
		<button onClick={buttonClick}>Add To List</button>
	)
}

function ListsModal({lists: listsDB, onCofirm}) {	
	const [lists, setLists] = useState(listsDB);
	const [newListName, setNewListName] = useState("");
	const {setModalOpen} = useStateContext();
	function handleChange(value, id) {
		setLists(lists.map(list => {
			if(list.id !== id) return list;
			return {...list, added: value}
		}))
	}
	function handleConfirm() {
		onCofirm(lists)
		setModalOpen(false);
	}
	function handleClose() {
		setModalOpen(false);
	}
	function addNewList() {
		if(!newListName) return;
		const maxId = lists.reduce((currMax, currList) => {
			if(currMax == null && currList.new === true) return null;
			if(currMax == null && currList.new === false) return currList.id;
			return Math.max(currMax, currList.id);
		}, 0);
		const newList = {
			id: Math.round(Math.random() * 1000000) + maxId,
			name: newListName,
			added: false,
			new: true
		}
		setLists([...lists, newList]);
		setNewListName("");
	}
	return <div>
		<h3 className={`modal_title`}>Add Anime To List</h3>
		<input value={newListName} onChange={e => setNewListName(e.target.value)}/>
		<button onClick={addNewList}>New List</button>
		{lists.map(list => <div key={list.id}>
			<input type='checkbox' checked={list.added} onChange={e => handleChange(e.target.checked, list.id)} id={list.name} />
			<label htmlFor={list.name}>{list.name}</label>
		</div>)}
		<div className={`modal_buttons`}>
			<button onClick={handleConfirm} className={`modal_yes_button`}>Ok</button>
			<button onClick={handleClose} className={`modal_no_button`}>Close</button>
		</div>
	</div>
}