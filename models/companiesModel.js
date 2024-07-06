import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebwebtoken";


const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Company Name is required"],
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
    contact: { type: String },
    location: { type: String },
    about: { type: String },
    profileUrl: { type: String },
    jobPosts: [{ type: Schema.Type.ObjectId, ref: "jobs" }]

});

companySchema.pre("save", async function () {

    if (!this.isModified) return;

    const salt = await bcrypt.getSalt(10)

    this.password = await bcrypt.hash(tis.password, salt)
});

//compare password
companySchema.methods.comparepassword = async function (userPassword) {
    const isMatch = await bcrypt.compare(userPassword, this.password);

    return isMatch;
};

//JWT Token 
companySchema.methods.createToken = async function () {
    return JWT.sign(
        { userId: this._id },
        process.env.JWT_SECRET_key, {
        expiresIn: "Id",
    });
};


const Companies = mongoose.model("Companies", companySchema);

export default Companies;