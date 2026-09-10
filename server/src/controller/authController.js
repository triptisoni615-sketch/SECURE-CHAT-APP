import bcrypt from "bcryptjs";

import User from "../model/user_model.js";

import {
    generateToken
} from "../untils/jwt.js";

import {
    registerValidator,
    loginValidator
} from "../validation/authValidator.js";


// =====================================
// REGISTER
// =====================================

export const register = async (req, res, next) => {

    try {

        const {
            error
        } = registerValidator.validate(req.body);

        if (error) {

            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });

        }

        const {
            first_name,
            last_name,
            email,
            password
        } = req.body;


        const existingUser =
            await User.findOne({
                email: email.toLowerCase()
            });


        if (existingUser) {

            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });

        }


        const hashedPassword =
            await bcrypt.hash(password, 12);


        const user = await User.create({

            first_name,

            last_name,

            email: email.toLowerCase(),

            password: hashedPassword

        });


        const token =
            generateToken(user._id);


        res.status(201).json({

            success: true,

            message: "Registration successful",

            token,

            user: {

                id: user._id,

                first_name: user.first_name,

                last_name: user.last_name,

                email: user.email

            }

        });

    } catch (error) {

        next(error);

    }

};


// =====================================
// LOGIN
// =====================================

export const login = async (req, res, next) => {

    try {

        const {
            error
        } = loginValidator.validate(req.body);

        if (error) {

            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });

        }


        const {
            email,
            password
        } = req.body;


        const user =
            await User.findOne({
                email: email.toLowerCase()
            });


        if (!user) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }


        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }


        if (!user.is_active || user.is_deleted) {

            return res.status(403).json({
                success: false,
                message: "Account is inactive"
            });

        }


        user.is_online = true;

        await user.save();


        const token =
            generateToken(user._id);


        res.status(200).json({

            success: true,

            message: "Login successful",

            token,

            user: {

                id: user._id,

                first_name: user.first_name,

                last_name: user.last_name,

                email: user.email,

                profile_img: user.profile_img,

                is_online: user.is_online

            }

        });

    } catch (error) {

        next(error);

    }

};


// =====================================
// LOGOUT
// =====================================

export const logout = async (req, res, next) => {

    try {

        const user =
            await User.findById(req.user.userId);


        if (user) {

            user.is_online = false;

            user.last_seen = new Date();

            await user.save();

        }


        res.status(200).json({

            success: true,

            message: "Logout successful"

        });

    } catch (error) {

        next(error);

    }

};