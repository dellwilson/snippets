const fs = require('fs');
const parse = require('csv-parse/lib/sync');
function readMovies(path) {
	var input = fs.readFileSync(path, 'utf8');
	var movies = parse(input, {columns: true});
	return movies;
}
module.exports = {readMovies};