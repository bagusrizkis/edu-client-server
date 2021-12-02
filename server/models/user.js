"use strict";
const bcrypt = require("bcrypt");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Movie);
        }
    }
    User.init(
        {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    msg: "Email has been used",
                },
                validate: {
                    isEmail: {
                        args: true,
                        msg: "Email format is not correct",
                    },
                    notNull: {
                        args: true,
                        msg: "Email can not be null",
                    },
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: {
                        args: [6],
                        msg: "Password at least have 6 characters",
                    },
                    notNull: {
                        args: true,
                        msg: "Password can not be null",
                    },
                },
            },
        },
        {
            hooks: {
                beforeCreate: (user) => {
                    const salt = bcrypt.genSaltSync(11);
                    const hash = bcrypt.hashSync(user.password, salt);
                    user.password = hash;
                },
            },
            sequelize,
            modelName: "User",
        }
    );
    return User;
};
