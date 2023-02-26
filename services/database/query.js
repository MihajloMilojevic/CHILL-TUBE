const mysql = require("./connect");

module.exports =  async function query({sql, params}) {
		let result = null;
		try {
			const data = await mysql.query(sql, params ?? []);
			result = {error: null, data};
		} catch (error) {
			result = {error, data: null};
		}
		finally {
			await mysql.end();
			return result;
		}
	}
