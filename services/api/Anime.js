
export default class AnimeAPI {
	static async Delete({id}) {
		try {
			const ENDPOINT = `/api/admin/dokumenta/${id}`;
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
	static async Update(newFiles, oldFiles, kategorija, naziv, opis, id) {
		try {
			const body = new FormData();
			newFiles.forEach((file, index) => body.append("fajl-"+index, file));
			body.append("oldFiles", JSON.stringify(oldFiles))
			body.append("kategorija", kategorija);
			body.append("naziv", naziv);
			body.append("opis", opis);
			const ENDPOINT = `/api/admin/dokumenta/${id}`;
			const res = await fetch(ENDPOINT, {
				method: "PUT",
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