import Users from "../models/userModel.js";

export const register = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    //validate fileds

    if (!firstName) {
        next("First Name is required");
    }
    if (!email) {
        next("Email is required");
    }
    if (!lastName) {
        next("Last Name is required");
    }
    if (!password) {
        next("Password is required");
    }
    try {
        const userExist = await Users.findOne({ email });
        if (userExist) {
            next("Email Address already exists")
            return;
        }
        const user = await Users.create({
            firstName,
            lastName,
            email,
            password,
        });

        //user token 
        const token = user.creatJWT();
        res.status(201).send({
            success: true,
            message: "Account created successfully",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                accountType: user.accountType,
            },
            token,
        })
    } catch (error) {
        console.log(error);
    }
};