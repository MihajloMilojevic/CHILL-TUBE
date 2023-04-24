import nc from "next-connect";
import { StatusCodes } from "http-status-codes";
import { APISession } from "../../services/sessions/get-session";
import errorWrapper from "../../services/middleware/errorWrapper";
import errorHandler from "../../services/middleware/errorHandler";
import auth from "../../services/middleware/authentication";
import Errors from "../../services/errors";
import bcrypt from "bcryptjs";
import User from "../../services/database/controllers/users";


const handler = nc({
	onError: (err, req, res) => errorHandler(err, req, res),
	onNoMatch: errorWrapper((req, res) => {
		throw new Errors.NotFoundError(`${req.method} ${req.url} doesn't exist`);
	})
});

handler.delete(async (req, res) => {
	const user = await auth(req, res);
	if(!user) throw new Errors.UnauthenticatedError("You are not logged in");

	const {listId} = req.body; 
	if(!listId) throw new Errors.BadRequestError("List id is required"); 
	
	const findListQ = await User.GetListById(listId);
	if(findListQ.error) throw findListQ.error;
	if(findListQ.data.length === 0) throw new Errors.NotFoundError("List does not exist");

	if(findListQ.data[0].userId !== user.id) throw new Errors.ForbiddenError("You don't have permission to delete this list");
	
	const deleteQ = await User.DeleteList(listId);
	

	const listsQ = await User.GetLists(user.id);
	if(listsQ.error) throw listsQ.error;
	const lists = (listsQ.data ?? []).map(({id, name, animes}) => ({id, name, animes: JSON.parse(animes) ?? []}));

	res.status(StatusCodes.OK).json({ok: true, lists}) 
});



export default APISession(errorWrapper(handler));
