
/*
	WARNING: It's very simple with hardcoded file location and no validation
	Node.js v10+
	node-xlsx required https://www.npmjs.com/package/node-xlsx
*/

import xlsx from 'node-xlsx';
import { writeFile } from "fs/promises";
import { russianEntries } from "../misc/russianNames.mjs";

const charaTalents = {};

console.time("Succesfully saved the file in");
const talentsFile = xlsx.parse(`./input/jet_talents.xlsx`);
talentsFile.shift();
talentsFile.forEach(sheet => {
	const {name, data} = sheet;

	const cleanData = data.filter(item => item.length > 0);
	
	let cat = cleanData.shift();
	cleanData.reverse();

	let temprr = [[]];
	let prevChara = "";

	cleanData.forEach((item) => {
		if (item.length < 8) throw new RangeError("A value is missing from the spreadsheet, please check the spreadsheet around: " + prevChara);
		let tempIdk = {};
		let [
			charaName = null,
			rarity = null,
			talentNumber,
		// 	talentName,
		// 	talentDescription,
		// 	requiredElite,
		// 	requiredLevel,
		// 	requiredPotential,
		// 	equipCode = null,
		// 	equipLevel = null
		] = item;

		for (let i = 3; i < cat.length; i++) {
			tempIdk[cat[i]] = item[i] || null;
		}

		if (!temprr[talentNumber - 1]) temprr.push([]);
		temprr[talentNumber - 1].unshift(tempIdk);

		if (charaName) {
			prevChara = charaName;
			let fixedName = charaName.toLowerCase();
			russianEntries.forEach(([rus, en]) => {
				if (fixedName.includes(rus) || fixedName.includes(en)) {
					fixedName = rus;
				}
			})
			charaTalents[fixedName] = temprr;
			temprr = [[]];
		}
	});
});

writeFile(`./output/parsed_talents.json`, JSON.stringify(charaTalents, null, 2))
	.then(() => console.timeEnd("Succesfully saved the file in"))
	.catch(err => console.error("An error occured while writing the file:", err));
