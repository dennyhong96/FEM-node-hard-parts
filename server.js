const http = require("http");
const fs = require("fs");

function doOnRequest(request, response) {
	if (request.method === "GET" && request.url === "/") {
		// read the index.html file and send it back to the client
		// fs.createReadStream()
		const file = fs.readFileSync("index.html");
		response.end(file);
	} else if (request.method === "GET" && request.url === "/style.css") {
		const cssFile = fs.readFileSync("style.css");
		response.end(cssFile);
	} else if (request.method === "POST" && request.url === "/sayHi") {
		fs.appendFileSync("hi_log.txt", "Somebody said hi.\n", { encoding: "utf-8" });
		response.end("hi back to you!");
	} else if (request.method === "POST" && request.url === "/greeting") {
		// accumulate the request body in a series of chunks
		let reqBody = [];

		request
			.on("data", (chunk) => {
				reqBody.push(chunk);
			})
			.on("end", () => {
				reqBody = Buffer.concat(reqBody).toString();
				fs.appendFileSync("hi_log.txt", `${reqBody}\n`, { encoding: "utf-8" });

				if (reqBody === "hello") {
					response.end("hello there!");
				}

				if (reqBody === "what's up") {
					response.end("the sky");
				}
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
