const http = require("http");
const fs = require("fs");

function doOnRequest(request, response) {
	if (request.method === "GET" && request.url === "/") {
		// read the index.html file and send it back to the client
		fs.readFile("index.html", (err, file) => {
			response.end(file);
		});
	} else if (request.method === "GET" && request.url === "/style.css") {
		fs.readFile("style.css", (err, cssFile) => {
			response.end(cssFile);
		});
	} else if (request.method === "POST" && request.url === "/sayHi") {
		fs.appendFile("hi_log.txt", "Somebody said hi.\n", (err) => {
			response.end("hi back to you!");
		});
	} else if (request.method === "POST" && request.url === "/greeting") {
		// accumulate the request body in a series of chunks
		let reqBody = [];

		request
			.on("data", (chunk) => {
				reqBody.push(chunk);
			})
			.on("end", () => {
				reqBody = Buffer.concat(reqBody).toString();

				fs.appendFile("hi_log.txt", `${reqBody}\n`, (err) => {
					if (reqBody === "hello") {
						response.end("hello there!");
					}

					if (reqBody === "what's up") {
						response.end("the sky");
					}
				});
			});
	} else if (request.method === "PUT" && request.url === "/update") {
		let reqBody = [];

		request
			.on("data", (chunk) => {
				reqBody.push(chunk);
			})
			.on("end", () => {
				reqBody = Buffer.concat(reqBody).toString();
				fs.writeFile("hi_log.txt", `${reqBody}\n`, (err) => {
					response.end("Updated!");
				});
			});
	} else if (request.method === "DELETE" && request.url === "/delete") {
		fs.unlink("hi_log.txt", (err) => {
			response.end("Deleted!");
		});
	} else {
		// Handle 404 error: page not found
		response.statusCode = 404;
		response.statusMessage = "Error: Page Not Found";
		response.end("Error: Page Not Found");
	}
}

const server = http.createServer(doOnRequest);

server.listen(3000);
