import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

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

    const salt = await bcrypt.genSalt(10)

    this.password = await bcrypt.hash(this.password, salt)
});

//compare password
userSchema.methods.comparePassword = async function (userPassword) {
    const isMatch = await bcrypt.compare(userPassword, this.password);

    return isMatch;
};

//JWT Token 
userSchema.methods.createJWT = function () {
   const token = JWT.sign({ userId: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
    });
    
    return token
};

const Users = mongoose.model("Users", userSchema);

export default Users;