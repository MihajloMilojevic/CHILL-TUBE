import nc from "next-connect";
import { StatusCodes } from "http-status-codes";
import { APISession } from "../../../../services/sessions/get-session";
import errorWrapper from "../../../../services/middleware/errorWrapper";
import errorHandler from "../../../../services/middleware/errorHandler";
import Errors from "../../../../services/errors";
import File from "../../../../services/database/controllers/files";
import auth from "../../../../services/middleware/authentication";
import fileUpload from "express-fileupload";
import Anime from "../../../../services/database/controllers/anime";


const handler = nc({
	onError: (err, req, res) => errorHandler(err, req, res),
	onNoMatch: errorWrapper((req, res) => {
		throw new Errors.NotFoundError(`${req.method} ${req.url} doesn't exist.`);
	})
});

handler.use(fileUpload())

handler.post(async (req, res) => {
	const user = await auth(req, res);
	if(!user) throw new Errors.UnauthenticatedError("You are not logged in");
	if(!user.admin) 
		throw new Errors.ForbiddenError("You don't have permission to perform this action.");
	const {name, description} = req.body;
	if(!name) throw new Errors.BadRequestError("Name is required.");
	const picture = req.files.picture;
	if(!picture) throw new Errors.BadRequestError("Picture is required");
	const fileName = await File.Upload(picture, `anime`, `${name}`);
	const {error} = await Anime.Create({fileName, name, description});
	if(error) throw error;

	res.status(StatusCodes.OK).json({ok: true})
});



export default APISession(errorWrapper(handler));


export const config = {
	api: {
		bodyParser: false
	}
};