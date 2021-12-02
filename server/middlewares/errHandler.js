function errorHandler(err, req, res, next) {
    console.log(err);
    // value awal
    let status = null;
    let errMessage = null;

    // ganti-ganti valuenya
    // terhadapat error name
    switch (err.name) {
        case "SequelizeValidationError":
            status = 400;
            errMessage = err.errors.map((elErr) => elErr.message);
            break;
        case "WRONG_EMAIL_AND_PW":
            status = 401;
            errMessage = "Kombinasi email dan password tidak ditemukan!";
            break;
        case "ERROR_AUTHENTICATION":
            status = 401;
            errMessage = "missing access token";
            break;
        case "JsonWebTokenError":
            status = 401;
            errMessage = "not authenticated";
            break;
        default:
            status = 500;
            errMessage = "Internal Server Error";
            break;
    }

    res.status(status).json({
        success: false,
        err: errMessage,
    });
}

module.exports = errorHandler;
