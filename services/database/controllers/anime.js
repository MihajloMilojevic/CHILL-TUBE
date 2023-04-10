import query from "../query";
import File from "./files";
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
	static async Create({fileName, name, description, type, released}) {
		const ret = await query({
			sql: "INSERT INTO anime(name, picture, description, type, released) VALUES (?, ?, ?, ?, ?)",
			params: [name, `/files/anime/${fileName}`, description, type, released]
		});
		return ret;
	}
	static async GetDeletedEpisodes({animeId, remainingIds}) {
		const ret = await query({
			sql: "SELECT * FROM episodes WHERE animeId = ? AND id NOT IN(?)",
			params: [animeId, remainingIds.length > 0 ? remainingIds : -1]
		});
		return ret;
	}
	static async DeleteEpisode({animeId, episodeId, src}) {
		if(src) File.Delete(src).then(() => {});
		await query({
			sql: "DELETE FROM episodes WHERE id = ? AND animeId = ?",
			params: [episodeId, animeId]
		})
	}
	static async UpdateEpisode({animeId, episodeId, orderNumber, video}) {
		await query({
			sql: "UPDATE episodes SET video = ?, orderNumber = ? WHERE id = ? AND animeId = ?",
			params: [video, orderNumber, episodeId, animeId]
		})
	}
	static async AddEpisode({orderNumber, file, animeId}) {
		const {error, data} = await query({
			sql: "INSERT INTO episodes (orderNumber, animeId, video) VALUES(?, ?, '')",
			params: [orderNumber, animeId]
		})

		if(error) throw error;
		const episodeId = data.insertId;
		const fileName = await File.Upload(file, `episodes/${animeId}`, `episode-${episodeId}-anime-${animeId}`);
		const update = await query({
			sql: "UPDATE episodes SET video = ? WHERE id = ? AND animeId = ?",
			params: [`/files/episodes/${animeId}/${fileName}`, episodeId, animeId]
		})
		console.log(update);
	}
}