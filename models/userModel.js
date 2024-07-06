import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebwebtoken";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "FirstName is required"],
    },
    lastName: {
        type: String,
        required: [true, "LastName is required "]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: validator.isEmail
    },
    password: {
        type: String,
        required: [true, "Password is required "],
        minLeangth: [6, "Password must be at least"],
        select: true,
    },
    accountType: { type: String, default: "seeker" },
    contact: { type: String },
    location: { type: String },
    profileUrl: { type: String },
    jobTitle: { type: String },
    about: { type: String },
},
    { timestamps: true }
);


userSchema.pre("save", async function () {

    if (!this.isModified) return;

    const salt = await bcrypt.getSalt(10)

    this.password = await bcrypt.hash(tis.password, salt)
});

//compare password
userSchema.methods.comparepassword = async function (userPassword) {
    const isMatch = await bcrypt.compare(userPassword, this.password);

    return isMatch;
};

//JWT Token 
userSchema.methods.createToken = async function () {
    return JWT.sign(
        { userId: this._id },
        process.env.JWT_SECRET_key, {
        expiresIn: "Id",
    });
};

const Users = mongoose.model("Users", userSchema);

export default Users;