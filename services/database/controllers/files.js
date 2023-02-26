import query from "../query";
import fs from "fs";
import path from "path";
import {uid} from "uid";
import shell from 'shelljs';

export default class File {
	static async Upload(file, subfolder, naziv) {
		const splitfileName = file.name.split(".");
		const fileExtension = splitfileName[splitfileName.length - 1];
		splitfileName.pop();
		const fileName = naziv + "--" + uid(10) + "." + fileExtension; 
		const folderPath = path.join(process.cwd(), `/public/files/${subfolder}/`);
		const filePath = path.join(folderPath, fileName);
		console.log({filePath, });
		// console.log({folderPath});
		shell.mkdir("-p", folderPath);
		await file.mv(filePath);
		const {error, data} = await query({
			sql: "INSERT INTO fajlovi (src, naziv) VALUES (?, ?);",
			params: [`/files/${subfolder}/${fileName}`, naziv]
		});
		if(error) return {error, data: null};
		return {error: null, data: data.insertId};
	}
	static async Delete(src) {
		console.log("######################### CWD: " + process.cwd());
		const filePath = path.join(process.cwd(), "/public", src);
		console.log({filePath});
		const {error, data} = await query({
			sql: "DELETE FROM fajlovi WHERE src = ?;",
			params: [src]
		});
		if(error) return {error, data: null};
		fs.unlinkSync(filePath);
		return {error: null, data};
	}
}