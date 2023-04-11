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
			sql: "SELECT *, getEpisodes(id) as episodes, getGenres(id) as genres FROM anime WHERE id = ?",
			params: [id]
		});
		return ret;
	}
	static async Create({fileName, name, description, type, released, genres}) {
		let ret = await query({
			sql: "INSERT INTO anime(name, picture, description, type, released) VALUES (?, ?, ?, ?, ?)",
			params: [name, `/files/anime/${fileName}`, description, type, released]
		});
		if(ret.error) throw error;
		const id = ret.data.insertId;
		const values = genres.map(() => `(?, ?)`);
		const params = [];
		for (const genreId of genres) {
			params.push(id);
			params.push(genreId);
		}
		ret = await query({
			sql: `INSERT INTO anime_genres(animeId, genreId) VALUES ${values.join(', ')}`,
			params
		})
		return ret;
	}
	static async Update({animeId, name, description, type, released, picture, genres}) {
		let ret = await query({
			sql: "UPDATE anime SET name = ?, picture = ?, description = ?, type = ?, released = ? WHERE id = ?",
			params: [name, picture, description, type, released, animeId]
		});
		if(ret.error) throw ret.error;
		await query({
			sql: "DELETE FROM anime_genres WHERE animeID = ?",
			params: [animeId]
		});
		const values = genres.map(() => `(?, ?)`);
		const params = [];
		for (const genreId of genres) {
			params.push(animeId);
			params.push(genreId);
		}
		ret = await query({
			sql: `INSERT INTO anime_genres(animeId, genreId) VALUES ${values.join(', ')}`,
			params
		})
		return ret;
	}
	static async Delete(animeId) {
		const promises = []
		const episodes = await this.GetDeletedEpisodes({animeId, remainingIds: []});
		if(episodes.error) throw episodes.error;
		for (const episode of episodes.data) {
			promises.push(this.DeleteEpisode({animeId, episodeId: episode.id, src: episode.video}))
		}
		promises.push(query({
			sql: "DELETE FROM ratings WHERE animeId = ?",
			params: [animeId]
		}));
		promises.push(query({
			sql: "DELETE FROM anime_genres WHERE animeId = ?",
			params: [animeId]
		}));
		promises.push(query({
			sql: "DELETE FROM animes_lists WHERE animeId = ?",
			params: [animeId]
		}));
		await Promise.all(promises);
		const {error, data} = await this.GetById(animeId);
		if(data && data.length > 0) File.Delete(data[0].picture);
		await query({
			sql: "DELETE FROM anime WHERE id = ?",
			params: [animeId]
		})
	}
	static async GetDeletedEpisodes({animeId, remainingIds}) {
		const ret = await query({
			sql: "SELECT * FROM episodes WHERE animeId = ? AND id NOT IN(?)",
			params: [animeId, remainingIds.length > 0 ? remainingIds : -1]
		});
		return ret;
	}
	static async DeleteEpisode({animeId, episodeId, src}) {
		if(src) File.Delete(src);
		await Promise.all([
			query({
				sql: "DELETE FROM watches WHERE episodeId = ?",
				params: [episodeId]
			}),
			query({
				sql: "DELETE FROM comments WHERE episodeId = ?",
				params: [episodeId]
			})
		]);
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
	static async AllGenres() {
		const ret = await query({
			sql: "SELECT * FROM genres"
		})
		return ret;
	}
}