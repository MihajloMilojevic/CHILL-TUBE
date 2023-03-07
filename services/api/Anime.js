
export default class AnimeAPI {
	
	static async Create(name, description, picture) {
		try {
			const body = new FormData();
			body.append("name", name);
			body.append("description", description);
			body.append("picture", picture);
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
}