import query from "../query";
// import File from "./files";

export default class Anime {
	static async GetAll() {
		const ret = await query({
			sql: "SELECT id, name, picture FROM anime ORDER BY id DESC",
		});
		return ret;
	}
	static async GetById(id) {
		const ret = await query({
			sql: "SELECT *, getEpisodes(id) as episodes FROM anime WHERE id = ?",
			params: [id]
		});
		return ret;
	}
	static async Create({fileName, name, description}) {
		const ret = await query({
			sql: "INSERT INTO anime(name, picture, description) VALUES (?, ?, ?)",
			params: [name, `/files/anime/${fileName}`, description]
		});
		return ret;
	}
	
}