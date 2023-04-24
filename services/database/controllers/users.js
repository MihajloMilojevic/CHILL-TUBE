import query from "../query";

export default class User {

	static async Create({username, email, password}) {
		const ret = await query({
			sql: "INSERT INTO users(username, email, password) VALUES(?, ?, ?)",
			params: [username, email, password]
		});
		return ret;
	}
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
	static async ChangePassword(password, userId) {
		const ret = await query({
			sql: "UPDATE users SET password = ? WHERE id = ?",
			params: [password, userId]
		})
		return ret;
	}
	static async ChangePicture(newPic, userId) {
		const ret = await query({
			sql: "UPDATE users SET picture = ? WHERE id = ?",
			params: [newPic, userId]
		})
		return ret;
	}
}