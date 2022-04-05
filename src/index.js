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

/* === CREATE ROUTES === */

/* create new user */
app.post("/users", async (req, res) => {
    const newUser = new User(req.body);

    try {
        await newUser.save();
        res.status(201).send(newUser);
    } catch (e) {
        res.status(400).send(e);
    }
});

/* create new shift */
app.post("/shifts", async (req, res) => {
    const newShift = new Shift(req.body);

    try {
        await newShift.save();
        res.status(201).send(newShift);
    } catch (e) {
        res.status(400).send(e);
    }
});

/* === READ ROUTES === */

/* read users */
app.get("/users", async (req, res) => {
    
    try {
        const users = await User.find({});
        if (users.length === 0) {
            return res.status(404).send("no users found");
        }
        res.status(200).send(users);
    } catch (e) {
        res.status(500).send(e);
    }
});

/* read specific user */
app.get("/users/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send("user not found");
        }
        res.status(200).send(user);
    } catch (e) {
        res.status(500).send(e);
    }
});

/* read shifts */
app.get("/shifts", async (req, res) => {

    try {
        const shifts = await Shift.find({});
        if (shifts.length === 0) {
            return res.status(404).send("no shifts found");
        }
        res.status(200).send(shifts);
    } catch (e) {
        res.status(500).send(e);
    }
});

/* read specific shift */
app.get("/shifts/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        const shift = await Shift.findById(_id);
        if (!shift) {
            return res.status(404).send("shift not found");
        }
        res.status(200).send(shift);
    } catch (e) {
        res.status(500).send(e);
    }
});


/* UPDATE ROUTES */
/* DELETE ROUTES */

app.listen(port, () => {
    console.log("server started on port " + port);
});