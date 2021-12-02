const jwt = require("jsonwebtoken");
const { Movie, User } = require("../models");

const authentication = (req, res, next) => {
    if (!req.headers.access_token) {
        throw { name: "ERROR_AUTHENTICATION" };
    }

    try {
        const decoded = jwt.verify(
            req.headers.access_token,
            process.env.JWT_SECRET
        );
        req.UserId = decoded.id;
        User.findByPk(req.UserId).then((data) => {
            if (data) next();
            else throw { name: "BROKEN_ACCESS_TOKEN" };
        });
    } catch (err) {
        next(err);
    }
};

const authorization = (req, res, next) => {
    const { id } = req.params;

    Movie.findOne({
        where: {
            id: id,
            UserId: req.UserId,
        },
    })
        .then((movie) => {
            if (!movie) {
                return res
                    .status(401)
                    .json({ success: false, message: "not authtorized" });
            }

            req.movie = movie;
            next();
        })
        .catch((err) => {
            res.status(500).json(err);
        });
};

module.exports = { authentication, authorization };
