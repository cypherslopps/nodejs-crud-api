const writeToFile = require("../utils/write-to-file");

module.exports = (req, res) => {
	const baseURL = req.url.substring(0, req.url.lastIndexOf("/") + 1);
	const id = req.url.split("/")[3];
	const regexV4 = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/ig);

	if(baseURL.includes("/api/movies") && regexV4.test(id)) {
		const index = req.movies.findIndex(movie => movie.id === id);

		if(index === -1) {
			res.statusCode = 200;
			res.write(
				JSON.stringify({ 
					title: "Not Found", 
					message: "Movie not found" 
				})
			);
			res.end();
		} else {
			req.movies.splice(index, 1);
			writeToFile(req.movies);
			res.writeHead(204, { "Content-Type": "application/json" });
			res.end(JSON.stringify(req.movies));
		}
	} else if(!regexV4.test(id)) {
		res.writeHead(400, { "Content-Type": "application/json" });
		res.end(
			JSON.stringify({ 
				title: "Validation Failed", 
				message: "UUID is not valid" 
			})
		);
	} else {
		res.writeHead(404, { "Content-Type": "application/json" });
		res.end(
			JSON.stringify({
				title: "Not Found",
				message: "Route not found"
			})
		)
	}
}