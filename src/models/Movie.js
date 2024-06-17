const DEFAULT_MOVIE_IMAGE = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUO-y3iljky2cVKDC919VE7sfNENLNaRksQg&s";

class Movie {
    constructor({
        id,
        title,
        year,
        plot,
        actors,
        genre,
        writer,
        released,
        // Default poster value
        poster = DEFAULT_MOVIE_IMAGE
    }) {
        this.id = id;
        this.title = title;
        this.year = year;
        this.plot = plot,
        this.actors = actors,
        this.genre = genre,
        this.writer = writer,
        this.released = released,
        this.poster = poster;
    }
}

export default Movie;
