import nc from "next-connect";
import { StatusCodes } from "http-status-codes";
import { APISession } from "../../../../../services/sessions/get-session";
import errorWrapper from "../../../../../services/middleware/errorWrapper";
import errorHandler from "../../../../../services/middleware/errorHandler";
import Errors from "../../../../../services/errors";
import query from "../../../../../services/database/query";
import bcrypt from "bcryptjs";
import User from "../../../../../services/database/controllers/users";
import auth from "../../../../../services/middleware/authentication";
import dozvoleId from "../../../../../services/constants/dozvoleId.json"
import authorize from "../../../../../services/middleware/autohorize";

const handler = nc({
	onError: (err, req, res) => errorHandler(err, req, res),
	onNoMatch: errorWrapper((req, res) => {
		throw new Errors.NotFoundError(`${req.method} ${req.url} не постоји.`);
	})
});

handler.put(async (req, res) => {
	const user = await auth(req, res);
	if(!user) throw new Errors.UnauthenticatedError("Нисте пријављени");
	if(!authorize(user, [dozvoleId.PROMENI_PODATKE_KORISNIKA])) 
		throw new Errors.ForbiddenError("Немате дозволу да мењате податке о другом кориснику.");
	const {id, ime, prezime, korisnickoIme, dozvole} = req.body;
	if(!ime) throw new Errors.BadRequestError("Име је обавезно.");
	if(!prezime) throw new Errors.BadRequestError("Презиме је обавезно.");
	if(!korisnickoIme) throw new Errors.BadRequestError("Корисничко име је обавезно.");
	if(!dozvole) throw new Errors.BadRequestError("Дозволе су обавезне.");
	
	let queryResult = await User.editUser({id, ime, prezime, korisnickoIme, dozvole});
	if(queryResult.error) throw queryResult.error;
	
	res.status(StatusCodes.OK).json({ok: true, data: queryResult.data})
});

handler.delete(async (req, res) => {
	const user = await auth(req, res);
	if(!user) throw new Errors.UnauthenticatedError("Нисте пријављени");
	if(!authorize(user, [dozvoleId.OBRISI_KORISNIKA])) 
		throw new Errors.ForbiddenError("Немате дозволу да бришете кориснике.");
	// console.log("params", req.query);
	const id = req.query.id;
	let queryResult = await User.delete({id});
	if(queryResult.error) throw queryResult.error;
	
	res.status(StatusCodes.OK).json({ok: true})
});

export default APISession(errorWrapper(handler));
