import fs from "fs";
import path from "path";
import {uid} from "uid";
import shell from 'shelljs';

export default class File {
	static async Upload(file, subfolder, name) {
		const splitfileName = file.name.split(".");
		const fileExtension = splitfileName[splitfileName.length - 1];
		splitfileName.pop();
		const fileName = name + "--" + uid(10) + "." + fileExtension; 
		const folderPath = path.join(process.cwd(), `/public/files/${subfolder}/`);
		const filePath = path.join(folderPath, fileName);;
		shell.mkdir("-p", folderPath);
		await file.mv(filePath);
		return fileName;
	}
	static async Delete(src) {
		const filePath = path.join(process.cwd(), "/public", src);
		fs.unlinkSync(filePath);
	}
}