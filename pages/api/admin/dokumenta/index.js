import nc from "next-connect";
import { StatusCodes } from "http-status-codes";
import { APISession } from "../../../../services/sessions/get-session";
import errorWrapper from "../../../../services/middleware/errorWrapper";
import errorHandler from "../../../../services/middleware/errorHandler";
import Errors from "../../../../services/errors";
import File from "../../../../services/database/controllers/files";
import auth from "../../../../services/middleware/authentication";
import dozvoleId from "../../../../services/constants/dozvoleId.json"
import authorize from "../../../../services/middleware/autohorize";
import fileUpload from "express-fileupload";
import Dokument from "../../../../services/database/controllers/dokument";
import {convert, crte, osisaj} from "../../../../services/utils/translate";


const handler = nc({
	onError: (err, req, res) => errorHandler(err, req, res),
	onNoMatch: errorWrapper((req, res) => {
		throw new Errors.NotFoundError(`${req.method} ${req.url} не постоји.`);
	})
});

handler.use(fileUpload())

handler.post(async (req, res) => {
	const user = await auth(req, res);
	if(!user) throw new Errors.UnauthenticatedError("Нисте пријављени");
	if(!authorize(user, [dozvoleId.DODAJ_DOKUMENT])) 
		throw new Errors.ForbiddenError("Немате дозволу да додајете документа.");
	const {kategorija, naziv, opis} = req.body;
	if(!kategorija) throw new Errors.BadRequestError("Категорија је обавезна.");
	if(!naziv) throw new Errors.BadRequestError("Назив је обавезан.");
	if(req.files.length === 0) throw new Errors.BadRequestError("Морате додати макар један фајл");
	
	let numberOfFilesUploaded = 0;
	let ids = [];
	for (const key in req.files) {
		const file = req.files[key];
		const {error, data} = await File.Upload(file, `dokumenta`, `${naziv}`);
		if(!error) {
			numberOfFilesUploaded++;
			ids.push(data);
		}
	}
	const {error} = await Dokument.Create({files: ids, naziv, opis, kategorija, korisnik: user.id});
	if(error) throw error;
	res.status(StatusCodes.OK).json({ok: true, numberOfFilesUploaded})
});



export default APISession(errorWrapper(handler));


export const config = {
	api: {
		bodyParser: false
	}
};