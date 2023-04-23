
export default class AnimeAPI {
	
	static async Create(name, description, picture, released, genres) {
		try {
			const body = new FormData();
			body.append("name", name);
			body.append("description", description);
			body.append("picture", picture);
			body.append("released", released);
			const genresStr = JSON.stringify(genres);
			console.log({genresStr});
			body.append("genres", genresStr);
			const ENDPOINT = `/api/admin/anime`;
			const res = await fetch(ENDPOINT, {
				method: "POST",
				body,
			})
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			return {error: null, data: json};
		} catch (error) {
			console.error(error);
			return {error, data: null};
		}
	}
	
	static async Update(animeId, name, description, picture, released, pictureSrc, genres) {
		try {
			const body = new FormData();
			body.append("name", name);
			body.append("description", description);
			if(picture) body.append("picture", picture);
			body.append("released", released);
			body.append("pictureSrc", pictureSrc);
			const genresStr = JSON.stringify(genres);
			console.log({genresStr});
			body.append("genres", genresStr);
			const ENDPOINT = `/api/admin/anime/${animeId}`;
			const res = await fetch(ENDPOINT, {
				method: "PATCH",
				body,
			})
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			return {error: null, data: json};
		} catch (error) {
			console.error(error);
			return {error, data: null};
		}
	}

	static async Delete(animeId) {
		try {
			const ENDPOINT = `/api/admin/anime/${animeId}`;
			const res = await fetch(ENDPOINT, {
				method: "DELETE",
			});
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			return {error: null, data: json};
		} catch (error) {
			console.error(error);
			return {error, data: null};
		}
	}
	
	static async SaveEpisodes(animeId, episodes) {
		try {
			const data = episodes.map((ep, index) => ({id: ep.id, orderNumber: index + 1, new: ep.new, videoUrl: ep.videoUrl}))
			const files = episodes.map(ep => ({id: ep.id, file: ep.videoFile})).filter(ep => ep.file != null);
			const body = new FormData();
			console.log({data, files})
			body.append("data", JSON.stringify(data));
			for (const file of files) {
				body.append(file.id, file.file)
			}
			const ENDPOINT = `/api/admin/anime/${animeId}/episodes`;
			const res = await fetch(ENDPOINT, {
				method: "PATCH",
				body,
			})
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			return {error: null, data: json};
		} catch (error) {
			console.error(error);
			return {error, data: null};
		}
	}
	static async Rate(animeId, rating) {
		try {
			const ENDPOINT = `/api/anime/${animeId}/rate`;
			const res = await fetch(ENDPOINT, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({rating})
			});
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			return {error: null, data: json};
		} catch (error) {
			console.error(error);
			return {error, data: null};
		}
	}
	
	static async AddToLists(lists, animeId) {
		try {
			const ENDPOINT = `/api/anime/${animeId}/lists`;
			const res = await fetch(ENDPOINT, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({lists})
			});
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			return {error: null, data: json};
		} catch (error) {
			console.error(error);
			return {error, data: null};
		}
	}
	static async Comment(animeId, episodeNumber, commentText) {
		try {
			const ENDPOINT = `/api/anime/${animeId}/episode/${episodeNumber}/comment`;
			const res = await fetch(ENDPOINT, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({commentText})
			});
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			return {error: null, data: json};
		} catch (error) {
			console.error(error);
			return {error, data: null};
		}
	}
	static async Watch(animeId, episodeNumber, timestamp) {
		try {
			const ENDPOINT = `/api/anime/${animeId}/episode/${episodeNumber}/timestamp`;
			const res = await fetch(ENDPOINT, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({timestamp})
			});
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			return {error: null, data: json};
		} catch (error) {
			console.error(error);
			return {error, data: null};
		}
	}
	static async MarkEpisode(animeId, episodeNumber, mark) {
		try {
			const ENDPOINT = `/api/anime/${animeId}/episode/${episodeNumber}/mark`;
			const res = await fetch(ENDPOINT, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({mark})
			});
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			return {error: null, data: json};
		} catch (error) {
			console.error(error);
			return {error, data: null};
		}
	}
}