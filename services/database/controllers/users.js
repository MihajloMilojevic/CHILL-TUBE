import query from "../query";
import bcrypt from "bcryptjs";
import Errors from "../../errors";

export default class User {

	static async getUserById(userId) {
		const ret = await query({
			sql: "SELECT * FROM users WHERE id = ?",
			params: [userId]
		});
		return ret;
	}
	static async getAllUsers() {
		const ret = await query({
			sql: "SELECT id, ime, prezime, korisnickoIme FROM korisnici"
		})
		return ret;
	}
	static async getUserByEmail(email) {
		const ret = await query({
			sql: "SELECT * FROM users WHERE email = ?",
			params: [email]
		});
		return ret;
	}
	static async editUser({id, ime, prezime, korisnickoIme, dozvole}) {
		const sqlUpdate = `UPDATE korisnici SET korisnickoIme = ?, ime = ?, prezime = ? WHERE id = ? ;`;
		const paramsUpdate = [korisnickoIme, ime, prezime, id];
		const sqlDelete = `DELETE FROM korisnici_dozvole WHERE korisnikId = ? ;`;
		const paramsDelete = [id];
		let sqlInsert = "";
		let paramsInsert = [];
		for (const dozvola of dozvole) {
			sqlInsert += "INSERT INTO korisnici_dozvole(korisnikId, dozvolaId) VALUES (?, ?); ";
			paramsInsert.push(id);
			paramsInsert.push(dozvola);
		};
		const ret = await query({
			sql: sqlUpdate + sqlDelete + sqlInsert,
			params: [...paramsUpdate, ...paramsDelete, ...paramsInsert]
		})
		return ret;
	}
	static async createUser({ime, prezime, korisnickoIme, dozvole}) {
		let queryResult = await query({
			sql: `SELECT dodaj_korisnika(?, ?, ?) as json; `,
			params: [korisnickoIme, ime, prezime]
		})
		if(queryResult.error) return queryResult;
		let data = JSON.parse(queryResult.data[0].json);
		if(data.id === null) return {error: new Error(data.message), data: null};
		const id = data.id; 
		let sqlInsertDoz = "";
		let paramsInsertDoz = [];
		for (const dozvola of dozvole) {
			sqlInsertDoz += "INSERT INTO korisnici_dozvole(korisnikId, dozvolaId) VALUES (?, ?); ";
			paramsInsertDoz.push(id);
			paramsInsertDoz.push(dozvola);
		};
		const ret = await query({
			sql: sqlInsertDoz,
			params: paramsInsertDoz
		})
		return ret;
	}
	static async promeniLozinku(id, stara, nova) {
		const {data} = await User.getUserById(id);
		const user = data[0];
		const iste = await bcrypt.compare(stara, user.lozinka);
		if(!iste) throw new Errors.BadRequestError("Стара лозинка је неисправна");
		const salt = await bcrypt.genSalt(10)
    	const hash = await bcrypt.hash(nova, salt)
		const ret = await query({
			sql: "UPDATE korisnici SET lozinka = ?, promeniLozinku = FALSE WHERE id = ?",
			params: [hash, id]
		})
		return ret;
	}
	static async resetLozinku({id}) {
		const ret = await query({
			sql: "CALL resetuj_lozinku(?);",
			params: [id]
		})
		return ret;
	}
	static async delete({id}) {
		const ret = await query({
			sql: "DELETE FROM korisnici WHERE id = ?",
			params: [id]
		})
		return ret;
	}
}