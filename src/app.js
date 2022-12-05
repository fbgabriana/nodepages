const http = require("http");
const fs = require("fs");

const port = process.env.PORT || 8080;
const hostname = "localhost";

const server = http.createServer((req, res) => {
	const template = fs.readFileSync("./template/index.html");
	let filename = `${req.url.substring(1) || "home"}`;
	let path = "";
	if (filename.indexOf(".") == -1) {
		filename = `${filename}.dat`;
		path = "./pages";
	} else {
		path = "./template";
	}
	fs.readFile(`${path}/${filename}`, function(err, data) {
		if (err) {
			switch (err.code) {
				case "ENOENT":
					res.writeHead(404);
					res.message = `The file '${req.url}' was not found on this server.`;
					break;
				case "EACCES":
					res.writeHead(403);
					res.message = `The file '${req.url}' exists but cannot be accessed.`;
					break;
				default:
					res.writeHead(500);
					res.message = err.message;
			}
			data = `<h1>${res.statusCode.toString()} ${res.statusMessage.toString()}</h1><p>${res.message}</p>`;
			res.write(template.toString().replace("<!-- data -->", data));
		}
		else {
			if (path == "./pages") {
				res.writeHead(200, {"Content-Type": "text/html"});
				res.write(template.toString().replace("<!-- data -->", data));
			} else {
				res.write(data);
			}
		}
		res.end();
	});
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});

