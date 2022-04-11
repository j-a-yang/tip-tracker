const { response } = require("express");
const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");


/* create new user */
router.post("/users", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e.toString()); // todo: customize  error to notify if email is already in use.
    }
});

// login user
router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (e) {
        res.status(400).send(e.toString());
    }
});

// logout user
router.post("/users/logout", auth, async (req, res) => {

    console.log("logging out");

    try {
         // remove current token from user.tokens array (arrar.filter() returns new array)
        req.user.tokens = req.user.tokens.filter((token) => token.token != req.token );
        
        // save update to db.
        await req.user.save()

        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

/* read profile */
router.get("/users/me", auth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});

/* update user */
router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const validUpdates = ["fName", "lName", "email", "password"];
    const isValidOperation = updates.every((update) => validUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send("error: attempting to update invalid property");
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update] );
        await req.user.save();
        res.send(req.user);

    } catch (e) {
        res.status(500).send(e.toString());
    }
});

/* delete user */
router.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;