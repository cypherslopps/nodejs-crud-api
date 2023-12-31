module.exports = (req, res) => {
	const baseURL = req.url.substring(0, req.url.lastIndexOf("/") + 1);
	const id = req.url.split("/")[3];
	const regexV4 = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/ig);

	if(req.url === "/api/movies") {
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.write(JSON.stringify(req.movies));
		res.end();
	} else if(baseURL === "/api/movies/" && regexV4.test(id)) {
		res.setHeader("Content-Type", "application/json");
		const filteredMovie = req.movies.filter(movie =>movie.id === id);

		if(filteredMovie.length > 0) {
			res.statusCode = 200;
			res.write(JSON.stringify(filteredMovie[0]));
			res.end();
		} else {
			res.statusCode = 404;
			res.writeHead(404, { "Content-Type": "application/json" });
			res.end(
				JSON.stringify({ 
					title: "Not Found", 
					message: "Movie not found" 
				})
			);
		}
	}  else {
		res.writeHead(404, { "Content-Type": "application/json" });
		res.end(
			JSON.stringify({ 
				title: "Not Found", 
				message: "Route not found" 
			})
		);
	}
}