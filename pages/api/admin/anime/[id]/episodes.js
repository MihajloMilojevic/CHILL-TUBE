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
	const data = JSON.parse(req.body.data);
	console.log({data, isArray: Array.isArray(data)});
	if(!data) throw new Errors.BadRequestError("Data is required.");
	const deleted = await Anime.GetDeletedEpisodes({animeId, remainingIds: data.filter(({new: isNew}) => !isNew).map(({id}) => id)})
	if(deleted.error) throw deleted.error;
	const deletePromises = [];
	for (const deletedEpisode of deleted.data) {
		deletePromises.push(Anime.DeleteEpisode({animeId, episodeId: deletedEpisode.id, src: deletedEpisode.video}));
	}
	await Promise.all(deletePromises);
	const newEpisodes = data.filter((ep) => ep.new);
	const insertsPromises = [];
	for (const newEpisode of newEpisodes) {
		insertsPromises.push(Anime.AddEpisode({orderNumber: newEpisode.orderNumber, animeId, file: req.files[newEpisode.id]}));
	}
	await Promise.all(insertsPromises);
	const notNewEpisodes = data.filter((ep) => !ep.new);
	const updatesPromises = [];
	for (const notNewEpisode of notNewEpisodes) {
		let video = notNewEpisode.videoUrl;
		if(Object.hasOwn(req.files, notNewEpisode.id)) {
			
			console.log({notNewEpisode})
			await File.Delete(notNewEpisode.videoUrl);
			const fileName = await File.Upload(req.files[notNewEpisode.id], `episodes/${animeId}`, `episode-${notNewEpisode.id}-anime-${animeId}`)
			video = `/files/episodes/${animeId}/${fileName}`;
		}
		updatesPromises.push(Anime.UpdateEpisode({animeId, episodeId: notNewEpisode.id, orderNumber: notNewEpisode.orderNumber, video}))
	}
	await Promise.all(updatesPromises);
	const animeQ = await Anime.GetById(animeId);
	if(animeQ.error) throw animeQ.error;
	const anime = {
		...animeQ.data[0],
		episodes: JSON.parse(animeQ.data[0].episodes ?? "[]") ?? []
	}
	res.status(StatusCodes.OK).json({ok: true, anime})
});



export default APISession(errorWrapper(handler));


export const config = {
	api: {
		bodyParser: false
	}
};