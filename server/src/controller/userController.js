import User from "../model/user_model.js";

import {
    profileValidator
} from "../validation/userValidator.js";


// =====================================
// MY PROFILE
// =====================================

export const getMyProfile = async (
    req,
    res,
    next
) => {

    try {

        const user =
            await User.findById(
                req.user.userId
            ).select("-password");


        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }


        res.status(200).json({

            success: true,

            user

        });

    } catch (error) {

        next(error);

    }

};


// =====================================
// UPDATE PROFILE
// =====================================

export const updateProfile = async (
    req,
    res,
    next
) => {

    try {

        const {
            error
        } = profileValidator.validate(req.body);


        if (error) {

            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });

        }


        const user =
            await User.findById(
                req.user.userId
            );


        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }


        const {
            first_name,
            last_name,
            profile_img
        } = req.body;


        if (first_name !== undefined) {

            user.first_name = first_name;

        }


        if (last_name !== undefined) {

            user.last_name = last_name;

        }


        if (profile_img !== undefined) {

            user.profile_img = profile_img;

        }


        await user.save();


        res.status(200).json({

            success: true,

            message: "Profile updated",

            user: {

                id: user._id,

                first_name: user.first_name,

                last_name: user.last_name,

                email: user.email,

                profile_img: user.profile_img

            }

        });

    } catch (error) {

        next(error);

    }

};


// =====================================
// SEARCH USERS
// =====================================

export const searchUsers = async (
    req,
    res,
    next
) => {

    try {

        const search =
            req.query.search || "";


        const users =
            await User.find({

                $or: [

                    {
                        first_name: {
                            $regex: search,
                            $options: "i"
                        }
                    },

                    {
                        last_name: {
                            $regex: search,
                            $options: "i"
                        }
                    },

                    {
                        email: {
                            $regex: search,
                            $options: "i"
                        }
                    }

                ],

                _id: {
                    $ne: req.user.userId
                },

                is_deleted: false

            })
            .select(
                "first_name last_name email profile_img is_online last_seen"
            )
            .limit(20);


        res.status(200).json({

            success: true,

            users

        });

    } catch (error) {

        next(error);

    }

};


// =====================================
// GET USER BY ID
// =====================================

export const getUserById = async (
    req,
    res,
    next
) => {

    try {

        const user =
            await User.findById(
                req.params.id
            )
            .select(
                "first_name last_name email profile_img is_online last_seen"
            );


        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }


        res.status(200).json({

            success: true,

            user

        });

    } catch (error) {

        next(error);

    }

};