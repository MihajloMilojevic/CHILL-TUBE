
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
			const ENDPOINT = "/api/admin/logout";
			const res = await fetch(ENDPOINT, {
				method: "POST",
			});
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			return {error: null, data: json};
		} catch (error) {
			console.error(error);
			return {error, data: null};
		}
	}
	
	static async promeniLozinku(stara, nova) {
		try {
			const ENDPOINT = `/api/admin/promeni-lozinku`;
			const res = await fetch(ENDPOINT, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({stara, nova})
			});
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			return {error: null, data: json};
		} catch (error) {
			console.error(error);
			return {error, data: null};
		}
	}
	static async delete({id}) {
		try {
			const ENDPOINT = `/api/admin/korisnici/${id}`;
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
	static async resetPassword({id}) {
		try {
			const ENDPOINT = `/api/admin/korisnici/${id}/reset`;
			const res = await fetch(ENDPOINT, {
				method: "PATCH",
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