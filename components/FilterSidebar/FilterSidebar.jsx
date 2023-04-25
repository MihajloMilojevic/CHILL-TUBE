import React from 'react'
import styles from "./FilterSidebar.module.css"
import { useStateContext } from '../../services/context/ContextProvider';
import { CloseButton } from "..";
import Slider from '@mui/material/Slider';
import CustomCheckbox from './CustomCheckbox';
import CustomRadioButton from './CustomRadioButton';

export default function FilterSidebar() {
	const {
		filterOpen, setFilterOpen,
		filterOrder, setFilterOrder,
		selectedGenres, setSelectedGenres,
		filterOrderTypes, genres,
		releasedBoundries, 
		releasedValue, setReleasedValue,
	} = useStateContext();

	function handleCheckboxChange({value, checked}) {
		const id = genres.find(g => g.name === value)?.id;
		const exists = !!selectedGenres.find(g => g === id)
		if(exists && !checked) 
			setSelectedGenres(selectedGenres.filter(g => g !== id));
		else 
			setSelectedGenres([...selectedGenres, id]);
	}
	function handleRadioChange({value}) {
		setFilterOrder(value);
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
				{Object.keys(filterOrderTypes).map(k => (<CustomRadioButton key={k} checked={filterOrderTypes[k] === filterOrder} onChange={handleRadioChange} value={filterOrderTypes[k]} label={filterOrderTypes[k]} />))}
				<h3>Genres:</h3>
				{genres.map(g => (<CustomCheckbox key={g.id} checked={selectedGenres.includes(g.id)} onChange={handleCheckboxChange} value={g.name} label={g.name} />))}
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
