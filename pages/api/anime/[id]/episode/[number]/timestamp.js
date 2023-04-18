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


handler.patch(async (req, res) => {
	const animeId = req.query.id;
	const episodeNumber = req.query.number;
	const user = await auth(req, res);
	if(!user) throw new Errors.UnauthenticatedError("You are not logged in");
	console.log(req.body.timestamp)
	if(!req.body.timestamp) throw new Errors.BadRequestError("Timestamp is required.");
	const {error: timestampError} = await Anime.Timestamp(animeId, episodeNumber, user.id, req.body.timestamp);
	if(timestampError) throw timestampError;

	res.status(StatusCodes.OK).json({ok: true})
});



export default APISession(errorWrapper(handler));
