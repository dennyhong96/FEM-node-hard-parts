const fs = require("fs");
const through2 = require("through2");

// Create a read stream here
const readPoemStream = fs.createReadStream("./on-joy-and-sorrow-emoji.txt");

// readPoemStream.on("data", (chunk) => {
// 	console.log(chunk.toString().replace(/:\)/gi, "joy").replace(/:\(/gi, "sorrow"));
// });

// Create a write stream here
const writePoemStream = fs.createWriteStream("./on-joy-and-sorrow-fixed.txt");

// writePoemStream.on("pipe", (src) => {
// 	console.log({ src });
// });

readPoemStream.pipe(writePoemStream);

/* EXTENSION: Create a transform stream (modify the read stream before piping to write stream)
const transformStream = ???
readPoemStream.pipe(transformStream).pipe(writePoemStream)
*/

const transformStream = through2(function (bufferChunk, encoding, next) {
	let text = bufferChunk.toString();
	text = text.replace(/:\)/gi, "joy").replace(/:\(/gi, "sorrow");
	this.push(text);
	next();
});

readPoemStream.pipe(transformStream).pipe(writePoemStream);
