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
	// static async UnlinkFile(dokId, fajlId) {
	// 	const ret = await query({
	// 		sql: "DELETE FROM dokumenti_fajlovi WHERE dokumentId = ? AND fajlId = ?",
	// 		params: [dokId, fajlId]
	// 	});
	// 	return ret;
	// }
	// static async SveKategorije() {
	// 	const ret = await query({
	// 		sql: "SELECT * FROM kategorije"
	// 	})
	// 	return ret;
	// }
	// static async SviDokumenti() {
	// 	const ret = await query({
	// 		sql: "SELECT * FROM dokumenti"
	// 	})
	// 	return ret;
	// }
	// static async ById(id) {
	// 	const ret = await query({
	// 		sql: "SELECT *, fajlovi_dokumenta(id) as fajlovi FROM dokumenti WHERE id = ?",
	// 		params: [id]
	// 	});
	// 	return ret;
	// }
	// static async Link({files, id}) {
	// 	let sql = "";
	// 	let params = [];
	// 	for (const fileId of files) {
	// 		sql += "INSERT INTO dokumenti_fajlovi(dokumentId, fajlId) VALUES(?, ?); ";
	// 		params.push(id);
	// 		params.push(fileId);
	// 	}
	// 	const ret = await query({sql, params});
	// 	return ret;
	// }
	// static async Update({naziv, opis, kategorija, id}) {
	// 	const ret = await query({
	// 		sql: "UPDATE dokumenti SET naziv = ?, opis = ?, kategorijaId = ? WHERE id = ?;",
	// 		params: [naziv, opis, kategorija, id]
	// 	})
	// 	return ret;
	// }
	// static async Create({files, naziv, opis, kategorija, korisnik}) {
	// 	const dokRes = await query({
	// 		sql: "INSERT INTO dokumenti(naziv, opis, korisnikId, kategorijaId) VALUES(?, ?, ?, ?);",
	// 		params: [naziv, opis, korisnik, kategorija]
	// 	})
	// 	if(dokRes.error) return dokRes;
	// 	const dokumentId = dokRes.data.insertId;
	// 	let sql = "";
	// 	let params = [];
	// 	for (const fileId of files) {
	// 		sql += "INSERT INTO dokumenti_fajlovi(dokumentId, fajlId) VALUES(?, ?); ";
	// 		params.push(dokumentId);
	// 		params.push(fileId);
	// 	}
	// 	const ret = await query({sql, params});
	// 	return ret;
	// }
	// static async getRemovedFiles(dokId, filesIds) {
	// 	const ret = await query(
	// 		filesIds && filesIds.length > 0 ? ({
	// 			sql: "SELECT f.id, f.src FROM fajlovi f JOIN dokumenti_fajlovi df ON f.id = df.fajlId WHERE df.dokumentId = ? AND df.fajlId NOT IN(?)",
	// 			params: [dokId, filesIds]
	// 		}) : ({
	// 				sql: "SELECT f.id, f.src FROM fajlovi f JOIN dokumenti_fajlovi df ON f.id = df.fajlId WHERE df.dokumentId = ?",
	// 				params: [dokId]
	// 		})
	// 	);
	// 	return ret;
	// }
	// static async Delete(id) {
	// 	const removedSrcRes= await Dokument.getRemovedFiles(id);
	// 	if(removedSrcRes.error) throw removedSrcRes.error;
	// 	console.log({id});
	// 	removedSrcRes.data.forEach(async ({src, id: fId}) => {
	// 		await Dokument.UnlinkFile(id, fId);
	// 		await File.Delete(src);
	// 	});
	// 	const ret = await query ({
	// 		sql: "DELETE FROM dokumenti WHERE id = ?",
	// 		params: [id]
	// 	})
	// 	return ret;
	// }
}