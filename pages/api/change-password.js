import nc from "next-connect";
import { StatusCodes } from "http-status-codes";
import { APISession } from "../../services/sessions/get-session";
import errorWrapper from "../../services/middleware/errorWrapper";
import errorHandler from "../../services/middleware/errorHandler";
import auth from "../../services/middleware/authentication";
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

handler.patch(async (req, res) => {
	const user = await auth(req, res);
	if(!user) throw new Errors.UnauthenticatedError("You are not logged in");

	const {oldPassword, newPassword, confirm} = req.body; // get old, new and confirmed passwords from request body
	if(!oldPassword) throw new Errors.BadRequestError("Old password is required"); // throw error 400 when old password is not present
	if(!newPassword) throw new Errors.BadRequestError("New password is required"); // throw error 400 when new password is not present
	if(!confirm) throw new Errors.BadRequestError("Confirmed password is required"); // throw error 400 when confirmed password is not present
	if(newPassword !== confirm) throw new Errors.BadRequestError("Passwords do not match"); // throw error 400 when confirmed password is not eqault to password
	
	let queryResult = await User.getUserByEmail(user.email); // get user from db that has provided email
	if(queryResult.error) throw queryResult.error; // if there was an error throw it

	const userDB = queryResult.data[0];
	const samePassword = await bcrypt.compare(oldPassword, userDB.password); // compare user password with password that is being used for loggin in
	if(!samePassword) throw new Errors.BadRequestError("Password incorrect"); // if passwords don't match throw 400 error

    const salt = await bcrypt.genSalt(10) // generates salt for crypting a password
    const hashed = await bcrypt.hash(newPassword, salt) // crypting password with given salt

	const updateResult = await User.ChangePassword(hashed, userDB.id); // updates user's password in database
	if(updateResult.error) throw updateResult.error; // if there is an error while updating throw an error

	
	res.status(StatusCodes.OK).json({ok: true}) // send response json
});

// wrap handler in APISession to be able to use req.session
// wrap handler in errorWrapper to be able to catch all errors thrown and send correct response
export default APISession(errorWrapper(handler));
