const router = require("express").Router();
const usersRoutes = require("./users");
const moviesRoutes = require("./movies");
const MoviesController = require("../controllers/MoviesController");
const { authentication } = require("../middlewares/auth");

router.use("/users", usersRoutes);
router.use(authentication); // application level middleware
router.use("/movies", moviesRoutes);

module.exports = router;
