const router = require("express").Router();
const MoviesController = require("../controllers/MoviesController");
const { authorization } = require("../middlewares/auth");

router.get("/", MoviesController.list);
router.get("/popular", MoviesController.popular);
router.post("/", MoviesController.post);
router.get("/:id", authorization, MoviesController.get);
router.put("/:id", authorization, MoviesController.put); // route level middleware
router.delete("/:id", authorization, MoviesController.delete); // route level middleware

module.exports = router;
