const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { OAuth2Client } = require("google-auth-library");

class UsersController {
    static googleLogin(req, res, next) {
        const client = new OAuth2Client(process.env.CLIENT_ID);
        const { token_google } = req.body;
        let email = "";
        client
            .verifyIdToken({
                idToken: token_google,
                audience: process.env.CLIENT_ID,
            })
            .then((ticket) => {
                const payload = ticket.getPayload();
                email = payload.email;
                console.log("Payload google: ", payload);
                /**
                 * - dari google: email, name, dll
                 * 1. [v] Check user dg email di DB ada atau tidak?
                 *      - [v] ada -> login user -> access_token
                 *      - [v] gak ada -> register user baru
                 *                -> kirim access_token
                 */
                return User.findOne({
                    where: { email: payload.email },
                });
            })
            .then((user) => {
                console.log(user);
                if (!user) {
                    // usernya belum ada
                    return User.create({
                        email,
                        password: Math.random() * 100 + "afasdfa",
                    });
                } else {
                    return user;
                    // const access_token = jwt.sign(
                    //     { id: user.id, email: user.email },
                    //     process.env.JWT_SECRET
                    // );
                    // res.status(200).json({
                    //     success: true,
                    //     message: "berhasil signup",
                    //     access_token,
                    // });
                }
            })
            .then((user) => {
                if (user) {
                    // tambahin buat handle jika ada user yang dilempar
                    const access_token = jwt.sign(
                        {
                            id: user.id,
                            email: user.email,
                        },
                        process.env.JWT_SECRET
                    );
                    res.status(200).json({
                        success: true,
                        message: "berhasil signup or signin",
                        access_token,
                    });
                } else {
                    //
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ error: err });
            });
    }

    static register(req, res, next) {
        const { email, password } = req.body;

        User.create({ email, password })
            .then((user) => {
                res.status(201).json({
                    success: true,
                    message: "User registered successfully!",
                });
            })
            .catch((err) => {
                next(err);
            });
    }

    static login(req, res, next) {
        const { email, password } = req.body;
        User.findOne({ where: { email } })
            .then((user) => {
                if (user && bcrypt.compareSync(password, user.password)) {
                    // generate access Token, balikin
                    const access_token = jwt.sign(
                        { id: user.id, email: user.email },
                        process.env.JWT_SECRET
                    );
                    res.status(200).json({
                        success: true,
                        message: "berhasil login",
                        access_token,
                    });
                } else {
                    throw { name: "WRONG_EMAIL_AND_PW" };
                }
            })
            .catch((err) => {
                next(err);
            });
    }
}

module.exports = UsersController;
