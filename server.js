const http = require("http");
const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");
const getReq = require("./methods/get-request");
const postReq = require("./methods/post-request");
const deleteReq = require("./methods/delete-request");
const putReq = require("./methods/put-request");
const movies = require("./data/movies.json");

require("dotenv").config();

const PORT = process.env.PORT || 5001;

function serveStaticFile(res, route, contentType, data, responseCode) {
	if(!responseCode) responseCode = 200;

	fsPromise.writeFile(path.join(__dirname, route), data, {
		flag: "a+"
	});

	fs.readFile(path.join(__dirname, route), (err, data) => {
		if(err) {
			res.writeHead(500, { 'Content-Type': 'text/plain' });
			res.end('500 - Internal Error');
		} 

		res.writeHead(responseCode, {'Content-Type': contentType});
		res.end(data);
	})
}

const server = http.createServer((req, res) => {
	req.movies = movies;

	switch(req.method) {
		case "GET": 
			getReq(req,res);
			break;
		case "POST": 
			postReq(req,res);
			break;
		case "PUT": 
			putReq(req,res);
			break;
		case "DELETE": 
			deleteReq(req,res);
			break;
		default:
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");
			res.write(JSON.stringify({ title: "Not Found", message: "Route not found" }));
	}
});

server.listen(PORT, () => {
	console.log("Server started on PORT: ", PORT);
});