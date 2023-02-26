import nc from "next-connect";
import { StatusCodes } from "http-status-codes";
import { APISession } from "../../services/sessions/get-session";
import auth from "../../services/middleware/authentication";
import errorWrapper from "../../services/middleware/errorWrapper";
import errorHandler from "../../services/middleware/errorHandler";
import Errors from "../../services/errors";
import query from "../../services/database/query";
import bcrypt from "bcryptjs";
import User from "../../services/database/controllers/users";

const handler = nc({
	onError: (err, req, res) => errorHandler(err, req, res),
	onNoMatch: errorWrapper((req, res) => {
		throw new Errors.NotFoundError(`${req.method} ${req.url} не постоји.`);
	})
});

handler.patch(async (req, res) => {
	const user = await auth(req, res);
	if(!user) throw new Errors.UnauthenticatedError("Нисте пријављени.");
	const {stara, nova} = req.body;
	if(!stara) throw new Errors.BadRequestError("Стара лозинка је обавезна.");
	if(!nova) throw new Errors.BadRequestError("Нова лозинка је обавезна.");
	let queryResult = await User.promeniLozinku(user.id, stara, nova);
	if(queryResult.error) throw queryResult.error;
	// console.log({queryResult});
	req.session.user.promeniLozinku = false;
	await req.session.save();
	res.status(StatusCodes.OK).json({ok: true,})
});

export default APISession(errorWrapper(handler));
