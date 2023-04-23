
export default class UserAPI {

	// function that sends POST request to login api route
	static async login({email, password}) {
		try {
			const ENDPOINT = "/api/login";
			const res = await fetch(ENDPOINT, {
				headers: {
					"Content-Type": "application/json"
				},
				method: "POST",
				body: JSON.stringify({email, password})
			});
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			return {error: null, data: json};
		} catch (error) {
			console.error(error);
			return {error, data: null};
		}
	}
	// function that sends POST request to logout api route
	static async logout() {
		try {
			const ENDPOINT = "/api/logout";
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
	// function that sends POST request to register api route
	static async register(data) {
		try {
			const ENDPOINT = "/api/register";
			const res = await fetch(ENDPOINT, {
				headers: {
					"Content-Type": "application/json"
				},
				method: "POST",
				body: JSON.stringify(data)
			});
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			return {error: null, data: json};
		} catch (error) {
			console.error(error);
			return {error, data: null};
		}
	}
}