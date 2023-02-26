
export default class DokumentAPI {
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
	static async Create(files, kategorija, naziv, opis) {
		try {
			const body = new FormData();
			files.forEach((file, index) => body.append("fajl"+index, file));
			body.append("kategorija", kategorija);
			body.append("naziv", naziv);
			body.append("opis", opis);
			const ENDPOINT = `/api/admin/dokumenta`;
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