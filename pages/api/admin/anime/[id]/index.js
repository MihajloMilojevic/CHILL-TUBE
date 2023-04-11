import nc from "next-connect";
import { StatusCodes } from "http-status-codes";
import { APISession } from "../../../../../services/sessions/get-session";
import errorWrapper from "../../../../../services/middleware/errorWrapper";
import errorHandler from "../../../../../services/middleware/errorHandler";
import Errors from "../../../../../services/errors";
import File from "../../../../../services/database/controllers/files";
import auth from "../../../../../services/middleware/authentication";
import fileUpload from "express-fileupload";
import Anime from "../../../../../services/database/controllers/anime";


const handler = nc({
	onError: (err, req, res) => errorHandler(err, req, res),
	onNoMatch: errorWrapper((req, res) => {
		throw new Errors.NotFoundError(`${req.method} ${req.url} doesn't exist.`);
	})
});

handler.use(fileUpload())

handler.patch(async (req, res) => {
	const animeId = req.query.id;
	const user = await auth(req, res);
	if(!user) throw new Errors.UnauthenticatedError("You are not logged in");
	if(!user.admin) 
		throw new Errors.ForbiddenError("You don't have permission to perform this action.");
	const {name, pictureSrc, description, type, released} = req.body;
	const genres = JSON.parse(req.body.genres ?? "[]") ?? [];
	if(!name) throw new Errors.BadRequestError("Name is required.");
	let picture = pictureSrc;
	if(req.files && Object.hasOwn(req.files, "picture")) {
		await File.Delete(pictureSrc);
		const fileName = await File.Upload(req.files.picture, `anime`, name);
		picture = `/files/anime/${fileName}`;
	}
	const update = await Anime.Update({animeId, name, description, picture, type, released, genres})
	if(update.error) throw update.error;
	const animeQ = await Anime.GetById(animeId);
	if(animeQ.error) throw animeQ.error;
	const anime = {
		...animeQ.data[0],
		episodes: JSON.parse(animeQ.data[0].episodes ?? "[]") ?? [],
		genres: JSON.parse(animeQ.data[0].genres ?? "[]") ?? []
	}
	res.status(StatusCodes.OK).json({ok: true, anime})
});


handler.delete(async (req, res) => {
	const animeId = req.query.id;
	const user = await auth(req, res);
	if(!user) throw new Errors.UnauthenticatedError("You are not logged in");
	if(!user.admin) 
		throw new Errors.ForbiddenError("You don't have permission to perform this action.");
	await Anime.Delete(animeId);
	res.status(StatusCodes.OK).json({ok: true})
});

export default APISession(errorWrapper(handler));


export const config = {
	api: {
		bodyParser: false
	}
};