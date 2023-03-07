import nc from "next-connect";
import { StatusCodes } from "http-status-codes";
import { APISession } from "../../services/sessions/get-session";
import errorWrapper from "../../services/middleware/errorWrapper";
import errorHandler from "../../services/middleware/errorHandler";
import Errors from "../../services/errors";

const handler = nc({
	onError: (err, req, res) => errorHandler(err, req, res),
	onNoMatch: errorWrapper((req, res) => {
		throw new Errors.NotFoundError(`${req.method} ${req.url} doesn't exist.`);
	})
});

handler.delete(async (req, res) => {
	await req.session.destroy();
	res.status(StatusCodes.OK).json({ok: true})
});

export default APISession(errorWrapper(handler));
