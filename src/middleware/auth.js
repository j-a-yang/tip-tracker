const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, "thisismysecret");
        const user = await User.findOne({ _id: decoded._id, "tokens.token": token });

        if (!user) {
            throw new Error(); // handled by catch block below
        }

        // add two properties onto 'request' 
        req.token = token;
        req.user = user;

        next();
    } catch (e) {
        res.status(401).send("error: unable to authenticate");
    }
};

module.exports = auth;