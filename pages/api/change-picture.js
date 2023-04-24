import nc from "next-connect";
import { StatusCodes } from "http-status-codes";
import { APISession } from "../../services/sessions/get-session";
import errorWrapper from "../../services/middleware/errorWrapper";
import errorHandler from "../../services/middleware/errorHandler";
import auth from "../../services/middleware/authentication";
import Errors from "../../services/errors";
import bcrypt from "bcryptjs";
import User from "../../services/database/controllers/users";
import fileUpload from "express-fileupload";
import File from "../../services/database/controllers/files";

// creates a handler for api route 
const handler = nc({
	onError: (err, req, res) => errorHandler(err, req, res),
	onNoMatch: errorWrapper((req, res) => {
		throw new Errors.NotFoundError(`${req.method} ${req.url} doesn't exist`);
	})
});

handler.use(fileUpload())

handler.patch(async (req, res) => {
	const user = await auth(req, res);
	if(!user) throw new Errors.UnauthenticatedError("You are not logged in");
	if(!req.files.picture) throw new Errors.BadRequestError("Picture is required");
	if(user.picture !== "/files/users/default.jpg") {
		const deleteQ = await File.Delete(user.picture);
		if(!deleteQ) throw new Error();
	}
	const fileName = await File.Upload(req.files.picture, 'users', user.username);
	const newPic = `/files/users/${fileName}`;
	
	req.session.user.picture = newPic;
	await req.session.save();

	await User.ChangePicture(newPic, user.id);

	res.status(StatusCodes.OK).json({ok: true, user: req.session.user}) // send response json
});

// wrap handler in APISession to be able to use req.session
// wrap handler in errorWrapper to be able to catch all errors thrown and send correct response
export default APISession(errorWrapper(handler));

export const config = {
	api: {
		bodyParser: false
	}
};