import nc from "next-connect";
import { StatusCodes } from "http-status-codes";
import { APISession } from "../../../../services/sessions/get-session";
import errorWrapper from "../../../../services/middleware/errorWrapper";
import errorHandler from "../../../../services/middleware/errorHandler";
import Errors from "../../../../services/errors";
import auth from "../../../../services/middleware/authentication";
import Anime from "../../../../services/database/controllers/anime";


const handler = nc({
	onError: (err, req, res) => errorHandler(err, req, res),
	onNoMatch: errorWrapper((req, res) => {
		throw new Errors.NotFoundError(`${req.method} ${req.url} doesn't exist.`);
	})
});


handler.post(async (req, res) => {
	const animeId = req.query.id;
	const user = await auth(req, res);
	if(!user) throw new Errors.UnauthenticatedError("You are not logged in");
	if(!req.body.rating) throw new Errors.BadRequestError("Rating is required.");
	const {error: rateError} = await Anime.Rate(animeId, user.id, req.body.rating);
	if(rateError) throw rateError;
	const {error: animeError, data} = await Anime.GetPersonalizedAnimeData(req.query.id, user.id);
	if(animeError) throw animeError; 
	const anime = {
		...data[0],
		episodes: JSON.parse(data[0].episodes ?? "[]") ?? [],
		genres: JSON.parse(data[0].genres ?? "[]") ?? [],
		lists: JSON.parse(data[0].lists ?? "[]") ?? [],
	}

	res.status(StatusCodes.OK).json({ok: true, anime})
});



export default APISession(errorWrapper(handler));
