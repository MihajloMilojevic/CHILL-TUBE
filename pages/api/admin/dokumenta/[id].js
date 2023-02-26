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

handler.put(async (req, res) => {

	const oldFiles = JSON.parse(req.body.oldFiles);
	// console.log({
	// 	files: req.files,
	// 	new: Object.keys(req.files).length,
	// 	old: oldFiles,
	// 	b: Object.keys(req.files).length + (oldFiles ?? []).length
	// });
	// return res.json({ok: false, message: "test"});
	const user = await auth(req, res);
	if(!user) throw new Errors.UnauthenticatedError("Нисте пријављени");
	if(!authorize(user, [dozvoleId.IZMENI_DOKUMENT])) 
		throw new Errors.ForbiddenError("Немате дозволу да мењате документа.");
	const {kategorija, naziv, opis} = req.body;
	if(!kategorija) throw new Errors.BadRequestError("Категорија је обавезна.");
	if(!naziv) throw new Errors.BadRequestError("Назив је обавезан.");
	if((Object.keys(req?.files ?? {}).length + (oldFiles ?? []).length) === 0) throw new Errors.BadRequestError("Морате додати макар један фајл");
	const removedSrcRes= await Dokument.getRemovedFiles(req.query.id, oldFiles.map(({id}) => id));
	if(removedSrcRes.error) throw new Error(removedSrcRes.error.message);
	removedSrcRes.data.forEach(async ({src, id}) => {
		const {error: e1} = await Dokument.UnlinkFile(req.query.id, id);
		const {error: e2} = await File.Delete(src);
		console.log({e1, e2});
	});
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
	if(ids.length != 0) {
		const {error} = await Dokument.Link({files: ids, id: req.query.id});
		if(error) throw error;
	}
	const {error} = await Dokument.Update({kategorija, naziv, opis, id: req.query.id})
	if(error) throw error
	const {error: err, data} = await Dokument.ById(req.query.id);
	if(err) throw err; 
	res.status(StatusCodes.OK).json({ok: true, dokument: data[0]})
});

handler.delete(async (req, res) => {
	const user = await auth(req, res);
	if(!user) throw new Errors.UnauthenticatedError("Нисте пријављени");
	if(!authorize(user, [dozvoleId.OBRISI_DOKUMENT])) 
		throw new Errors.ForbiddenError("Немате дозволу да бришете документа.");
	const {error} = await Dokument.Delete(req.query.id);
	console.log(error);
	if(error) throw error; 
	res.status(StatusCodes.OK).json({ok: true})
});



export default APISession(errorWrapper(handler));


export const config = {
	api: {
		bodyParser: false
	}
};