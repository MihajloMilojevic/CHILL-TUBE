import React from 'react'
import styles from "./FilterSidebar.module.css"
import { useStateContext } from '../../services/context/ContextProvider';
import { CloseButton } from "..";
import Slider from '@mui/material/Slider';

export default function FilterSidebar() {
	const {
		filterOpen, setFilterOpen,
		filterOrder, setFilterOrder,
		selectedGenres, setSelectedGenres,
		filterOrderTypes, genres,
		releasedBoundries, 
		releasedValue, setReleasedValue,
	} = useStateContext();

	function handleCheckboxChange(e) {
		const value = e.target.value;
		const id = genres.find(g => g.name === value)?.id;
		const exists = !!selectedGenres.find(g => g === id)
		if(exists && !e.target.checked) 
			setSelectedGenres(selectedGenres.filter(g => g !== id));
		else 
			setSelectedGenres([...selectedGenres, id]);
	}
	function handleRadioChange(e) {
		setFilterOrder(e.target.value);
	}
	function handleSliderChange(e, value) {
		setReleasedValue({min: value[0], max: value[1]})
	}

	if(!filterOpen) return <></>;
	return (
		<div className={styles.filter_wrapper}>
			<div className={`overlay ${styles.filter_overlay}`} onClick={() => setFilterOpen(false)}/>
			<div className={styles.panel}>
				<CloseButton onClick={() => setFilterOpen(false)} />
				<h2>Filter Search Options</h2>
				<h3>Order By:</h3>
				{Object.keys(filterOrderTypes).map(k => (
					<div key={k}>
						<input checked={filterOrderTypes[k] === filterOrder} type="radio" id={filterOrderTypes[k]} name="order" onChange={handleRadioChange} value={filterOrderTypes[k]} />
						<label htmlFor={filterOrderTypes[k]}>{filterOrderTypes[k]}</label>
					</div>))}
				<h3>Genres:</h3>
				{genres.map(g => (
					<div key={g.id}>
						<input checked={selectedGenres.includes(g.id)} type="checkbox" id={g.name} onChange={handleCheckboxChange} value={g.name} />
						<label htmlFor={g.name}>{g.name}</label>
					</div>))}
				<h3>Released:</h3>
				<div style={{display: "flex", gap: 20, justifyContent: "center", alignItems: "center"}}>
					<p>{releasedValue.min}</p>
					<Slider
						value={[releasedValue.min, releasedValue.max]}
						onChange={handleSliderChange}
						min={releasedBoundries.min}
						max={releasedBoundries.max}
						sx={{
							flex: 1,
							color: 'white',
							"& .MuiSlider-thumb": {
								boxShadow: ""
							},
							"& .MuiSlider-thumb:hover": {
								boxShadow: "0px 0px 0px 4px rgba(255, 255, 255, 0.16)"
							},
							"& .MuiSlider-thumb.Mui-active": {
								boxShadow: "0px 0px 0px 8px rgba(255, 255, 255, 0.16)"
							}
						}}
					/>
					<p>{releasedValue.max}</p>
				</div>
			</div>
		</div>
	)
}
