let ids = 0;
let movies = [];

module.exports = {
    // Create a new movie
    new(name, genres, rating) {
        let movie = {id: ids++, name: name, genres: genres, rating: rating};
        movies.push(movie);
        return movie;
    },
    // Update a movie
    update (id, name, genres, rating) {
        let pos = this.getPositionById(id)
        if (pos >= 0) {
            movies[pos].name = name;
            movies[pos].genres = genres;
            movies[pos].rating = rating;
            return movies[pos];
        }
        return null;
    },
    // List all the movies
    list() {
        return movies;
    },
    // Get a movie given an id
    getElementById(id) {
        let pos = this.getPositionById(id)
        if (pos >= 0) {
            return movies[pos];
        }
        return null;
    },
    // Get the position of a movie given an id
    getPositionById(id) {
        for (let i = 0; i<movies.length; i++) {
            if (movies[i].id == id) {
                return i;
            }
        }
        return -1;
    },
    // Delete a movie from the movies list
    delete(id) {
        let i = this.getPositionById(id);
        if (i >= 0) {
            movies.splice(i, 1);
            return true;
        }
        return false; 
    }
}
