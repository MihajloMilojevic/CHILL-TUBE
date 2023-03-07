import nc from "next-connect";
import { StatusCodes } from "http-status-codes";
import { APISession } from "../../services/sessions/get-session";
import errorWrapper from "../../services/middleware/errorWrapper";
import errorHandler from "../../services/middleware/errorHandler";
import Errors from "../../services/errors";
import bcrypt from "bcryptjs";
import User from "../../services/database/controllers/users";

// creates a handler for api route 
const handler = nc({
	onError: (err, req, res) => errorHandler(err, req, res),
	onNoMatch: errorWrapper((req, res) => {
		throw new Errors.NotFoundError(`${req.method} ${req.url} doesn't exist`);
	})
});

handler.post(async (req, res) => {
	const {email, password} = req.body; // get email and password from request body
	if(!email) throw new Errors.BadRequestError("Email is required."); // throw error 400 when email is not present 
	if(!password) throw new Errors.BadRequestError("Password is required"); // throw error 400 when password is not present
	let queryResult = await User.getUserByEmail(email); // get user from db that has provided email
	if(queryResult.error) throw queryResult.error; // if there was an error throw it
	const user = queryResult.data[0]; // user object is first element in returen array
	if(!user) throw new Errors.NotFoundError("User with this email doesn't exist"); // if user is undefined or null throw 404 error
	const samePassword = await bcrypt.compare(password, user.password); // compare user password with password that is being used for loggin in
	if(!samePassword) throw new Errors.BadRequestError("Password incorrect"); // if passwords don't match throw 400 error
	req.session.user = { // get user object in session
		id: user.id, 
		username: user.username,
		email: user.email,
		picture: user.picture,
		admin: Boolean(user.admin)
	};
	await req.session.save(); // save the session
	res.status(StatusCodes.OK).json({ok: true, user: req.session.user}) // send response json
});

// wrap handler in APISession to be able to use req.session
// wrap handler in errorWrapper to be able to catch all errors thrown and send correct response
export default APISession(errorWrapper(handler));
