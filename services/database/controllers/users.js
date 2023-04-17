import query from "../query";

export default class User {

	static async getUserById(userId) {
		const ret = await query({
			sql: "SELECT * FROM users WHERE id = ?",
			params: [userId]
		});
		return ret;
	}
	static async getUserByEmail(email) {
		const ret = await query({
			sql: "SELECT * FROM users WHERE email = ?",
			params: [email]
		});
		return ret;
	}
	static async AddList(name, userId) {
		const {error, data} = await query({
			sql: "INSERT INTO lists(userId, name) VALUES(?, ?)",
			params: [userId, name]
		})
		if(error) throw error;
		return data.insertId;
	}
}