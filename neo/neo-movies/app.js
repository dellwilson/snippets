const csv = require('./csv');
var neo4j = require('neo4j-driver').v1;

// Read the CSV file into an array
var movies = csv.readMovies('./Movies.csv');
movies.forEach((movie) => {
	movie.id = movie.imdbId;
});
console.log(`${movies.length} movies read.`);

// Open connection to Neo4j
var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'UR1ScaryClown'));
var session = driver.session();

//TODO: Need to look at transaction support. See: https://neo4j.com/docs/api/javascript-driver/current/

// for (i=0; i<10; i++) {
    var i=0;
movies.forEach((csvMovie) => {
	var csvMovie = movies[i++];

    var dbMovie = {
		imdbId: csvMovie.imdbId,
		title: csvMovie.title,
		sortTitle: csvMovie.sortTitle,
		imdbRating: parseFloat(csvMovie.imdbRating),
		imdbRuntime: parseInt(csvMovie.imdbRuntime),
		imdbGenres: csvMovie.imdbGenres,
		imdbYear: csvMovie.imdbYear,
		imdbActors: csvMovie.imdbActors,
		imdbDirector: csvMovie.imdbDirector,
		imdbLastUpdate: csvMovie.imdbLastUpdate,
		isShortlistByDell: (csvMovie.isShortlistByDell == "1") ? true : false,
		isShortlistByLynn: (csvMovie.isShortlistByLynn == "1") ? true : false,
		needsReview: (csvMovie.needsReview == "1") ? true : false,
		thumbnail: csvMovie.thumbnail
    };
    
    console.log('.');

    session
        .run('CREATE (m:Movie {id:{imdbId}, title:{title}, sortTitle:{sortTitle}, imdbRating:{imdbRating}, imdbRuntime:{imdbRuntime}, imdbGenres:{imdbGenres}}) RETURN m', dbMovie)
        .then((movie) => {
            console.log(JSON.stringify(movie, null, 2));
        })
        .catch((err) => {
            console.error('Error saving movie to neo4j.', err);
        });
}); // for

console.log(i + ' movies written.');
// session.close();
// driver.close();