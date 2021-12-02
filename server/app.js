require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const routes = require("./routes");
const errorHandler = require("./middlewares/errHandler");
const cors = require("cors");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res, next) =>
    res.json({
        server: "up",
    })
);

app.use(routes);
app.use(errorHandler);

app.listen(port, () => console.log(`App listen at http://localhost:${port}`));
