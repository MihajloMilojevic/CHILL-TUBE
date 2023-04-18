import nc from "next-connect";
import { StatusCodes } from "http-status-codes";
import { APISession } from "../../../../../../services/sessions/get-session";
import errorWrapper from "../../../../../../services/middleware/errorWrapper";
import errorHandler from "../../../../../../services/middleware/errorHandler";
import Errors from "../../../../../../services/errors";
import auth from "../../../../../../services/middleware/authentication";
import Anime from "../../../../../../services/database/controllers/anime";


const handler = nc({
	onError: (err, req, res) => errorHandler(err, req, res),
	onNoMatch: errorWrapper((req, res) => {
		throw new Errors.NotFoundError(`${req.method} ${req.url} doesn't exist.`);
	})
});


handler.post(async (req, res) => {
	const animeId = req.query.id;
	const episodeNumber = req.query.number;
	const user = await auth(req, res);
	if(!user) throw new Errors.UnauthenticatedError("You are not logged in");
	if(!req.body.commentText) throw new Errors.BadRequestError("Comment text is required.");
	const {error: commentError} = await Anime.Comment(animeId, episodeNumber, user.id, req.body.commentText);
	if(commentError) throw commentError;
	const {error: animeError, data} = await Anime.GetPersonalizedAnimeData(req.query.id, user.id);
	if(animeError) throw animeError; 
	const anime = {
		...data[0],
		episodes: JSON.parse(data[0].episodes ?? "[]") ?? [],
		genres: JSON.parse(data[0].genres ?? "[]") ?? [],
		lists: JSON.parse(data[0].lists ?? "[]") ?? [],
	}
	
	const commentsQ = await Anime.GetComments(episodeNumber);
	if(commentsQ.error) anime.comments = [];
	else anime.comments = commentsQ.data.map(({json}) => JSON.parse(json))

	res.status(StatusCodes.OK).json({ok: true, anime})
});



export default APISession(errorWrapper(handler));
