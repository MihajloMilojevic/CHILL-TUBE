import User from "../database/controllers/users";

export default async function authentication(req) {
	const session = req.session; // get session from request
	if(!session.user) return null; // if user is not logged in return null as user object
	const id = session.user.id; // get user id from session
	const {error, data} = await User.getUserById(id); // fetch new user data
	if(error || data.length === 0) return null; // if there was an error or no user with that id return null
	// create user object for session - don't use value from db as it contains password
	const user = {
		id: data[0].id, 
		username: data[0].username,
		email: data[0].email,
		picture: data[0].picture,
		admin: Boolean(data[0].admin)
	};
	session.user = user; // set user in session to newly created object
	await session.save(); // and save the session
	return user;
}