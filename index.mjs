
import { exec } from 'child_process';
import { readdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const parserPath = join(__dirname, "parsers");

readdir(parserPath)
    .then(files => {
        files.forEach(file => {
            exec(`node ${join(parserPath, file)}`, (error, stdout, stderr) => {
                if (error) return console.log(`${file} returned error:`, error);

                if (stderr) return console.log(`${file} returned stderr:`, stderr);

                console.log(`${file}: ${stdout}`);
            });
        });
    })
    .catch(err => console.error(err));
