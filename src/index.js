const express = require("express");
require('./db/mongoose'); /* ensure mongoose.js runs, connecting to db */
const User = require("./models/user");
const Shift = require("./models/shift");

const app = express();

/* deployment environment specified port or 3000 */
const port = process.env.PORT || 3000;

/* configure express: this will automatically parse incoming json to object
so we can easily access data with request handlers  */
app.use(express.json());

/* create new user route */
app.post("/users", (req, res) => {
    const newUser = new User(req.body);

    newUser.save().then(() => {
        res.status(201).send(newUser);
    }). catch((e) => {
        res.status(400).send(e);
    });
});

/* create new shift route */
app.post("/shifts", (req, res) => {
    const newShift = new Shift(req.body);

    newShift.save().then(() => {
        res.status(201).send(newShift);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.listen(port, () => {
    console.log("server started on port " + port);
});

