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
}