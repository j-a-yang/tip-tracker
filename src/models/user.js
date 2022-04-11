const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    fName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    lName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("don't use 'password' in your password");
            }      
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }] 
});

// this method will return object without sensitive data.
// we are taking advantage of'toJSON' which will automatically get called by express
// when sending off data to client. Express calls JSON.stringigy() which calls toJSON().
// very elegant way to do this every time user object gets sent back to client.
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

// generate auth token
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "thisismysecret");

    user.tokens.push({ token });
    await user.save();

    return token;
};

// define User Model function to handle login credential lookup.
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("unable to login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("unable to login");
    }

    return user;
}

// define middleware: hash the plaintext password before saving.
userSchema.pre("save", async function(next) {
    const user = this // this is the document on hand.

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;