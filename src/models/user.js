const mongoose = require("mongoose");
const validator = require("validator");

const User = mongoose.model('User', {
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
    }   
});

module.exports = User;