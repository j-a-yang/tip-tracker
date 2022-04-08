const { response } = require("express");
const express = require("express");
const router = new express.Router();
const User = require("../models/user");


/* create new user */
router.post("/users", async (req, res) => {
    const newUser = new User(req.body);

    try {
        await newUser.save();
        res.status(201).send(newUser);
    } catch (e) {
        res.status(400).send(e);
    }
});

// login user
router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        res.send(user);
    } catch (e) {
        res.status(400).send(e.toString());
    }
});

/* read users */
router.get("/users", async (req, res) => {
    
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
router.get("/users/:id", async (req, res) => {
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

/* update user */
router.patch("/users/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const validUpdates = ["fName", "lName", "email", "password"];
    const isValidOperation = updates.every((update) => validUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send("error: attempting to update invalid property");
    }

    try {
        // using the following workflow in order to trigger middleware for password hashing.
        // retrieve user document, update it, then save it. save() triggers middleware.
        const user = await User.findById(req.params.id);

        if(!user) {
            return res.status(404).send("user not found");
        }
        
        updates.forEach((update) => user[update] = req.body[update] );
        await user.save();
        res.status(200).send(user);

    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

/* delete user */
router.delete("/users/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findByIdAndDelete(_id);

        if (!user) {
            return res.status(404).send("user not found");
        }

        res.status(200).send(user);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;