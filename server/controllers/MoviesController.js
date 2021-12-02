const { Movie } = require("../models");
const axios = require("axios");

class MoviesController {
    static list(req, res) {
        Movie.findAll()
            .then((movies) => {
                res.status(200).json({ success: true, data: movies });
            })
            .catch((err) => {
                res.status(err.status || 500).json({
                    success: false,
                    error: err.message || err,
                });
            });
    }

    static post(req, res) {
        const { name, image } = req.body;

        Movie.create({ name, image, UserId: req.UserId })
            .then((movie) => {
                res.status(201).json({ success: true, data: movie });
            })
            .catch((err) => {
                res.status(err.status || 500).json({
                    success: false,
                    error: err.message || err,
                });
            });
    }

    static get(req, res) {
        res.status(200).json({ success: true, data: req.movie });
    }

    static put(req, res) {
        const { name, image } = req.body;
        const { movie } = req;

        movie.name = name;
        movie.image = image;

        movie
            .save()
            .then((_) => {
                res.status(200).json({ success: true, data: movie });
            })
            .catch((err) => {
                res.status(err.status || 500).json({
                    success: false,
                    error: err.message || err,
                });
            });
    }

    static delete(req, res) {
        const { movie } = req;

        movie
            .destroy()
            .then((result) => {
                if (!result) throw { code: 404, message: "Movie not found!" };
                res.status(200).json({
                    success: true,
                    message: "Movie deleted successfully!",
                });
            })
            .catch((err) => {
                res.status(err.status || 500).json({
                    success: false,
                    message: err.message || err,
                });
            });
    }

    static popular(req, res, next) {
        // ngapain
        // kita pengen dapetin data dari tmdb tadi
        // udah dapet datanya kita balikin ke client yang request ke api kita
        axios({
            method: "GET",
            url: "https://api.themoviedb.org/3/movie/popular",
            headers: {
                Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2N2NhOWE1YjdkZGUyYWE0MWYyNmViMTc5Y2U0ZDNkNCIsInN1YiI6IjYwYjQ0ZDcxMTBkYWQ2MDA0MzA4NmU4YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._WSacug3gokyp5rrEBtpRZCUr7SVm9y2ugNbO0RzQCw",
            },
        })
            .then((response) => {
                // console.log("Success", response);
                // ngablikin datanya ke client kita
                res.status(200).json({
                    popular: response.data,
                });
            })
            .catch((err) => {
                console.log("ERROR :: ", err);
            });
    }
}

module.exports = MoviesController;
