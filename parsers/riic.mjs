
/*
	WARNING: It's very simple with hardcoded file location and no validation
	Node.js v10+
	node-xlsx required https://www.npmjs.com/package/node-xlsx
*/

import { parse } from 'csv';
import { readFile, writeFile } from "fs/promises";

const charaRIIC = {};

console.time("Succesfully saved the file in");

const riicFile = await readFile(`../input/jet_riic.csv`).then(file => file);

parse(riicFile, (err, file) => {
	if (err) throw err;

	const categories = file.shift().map(name => {
		let idk = name === "Skill Description" ? "skillDescFormatted"
				: name === "Skill Description (Formatted)" ? "skillDescRaw"
				: name.at(0).toLowerCase() + name.substring(1).replaceAll(" ", "")
		return idk;
	});
	file.forEach(skill => {
		const [
			charas,
			buffId,
			skillName,
			roomType,
			BuffCategory,
			skillDescRaw,
			skillDescFormatted,
		  ] = skill;
		if (charas !== "None") {
			let temp = {};
			for (let i = 1; i < categories.length; i++) {
				const cat = categories[i];
				temp[cat] = skill[i];
			}
			charaRIIC[buffId] = temp;
		}
	});
	writeFile(`../output/parsed_riic.json`, JSON.stringify(charaRIIC, null, 2))
		.then(() => console.timeEnd("Succesfully saved the file in"))
		.catch(err => console.error("An error occured while writing the file:", err));
});
