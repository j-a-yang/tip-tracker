const express = require("express");
const router = new express.Router();
const Shift = require("../models/shift");
const User = require("../models/user");
const auth = require("../middleware/auth");


/* create new shift */
router.post("/shifts", auth, async (req, res) => {
    const shift = new Shift({
        ...req.body,
        owner: req.user._id
    });

    try {
        await shift.save();
        res.status(201).send(shift);
    } catch (e) {
        res.status(400).send(e);
    }
});

/* read shifts */
router.get("/shifts", auth, async (req, res) => {

    try {

        await req.user.populate("shifts");
        if (req.user.shifts.length === 0) {
            return res.status(404).send("no shifts found");
        }
        res.status(200).send(req.user.shifts);
    } catch (e) {
        res.status(500).send(e.toString());
    }
});

/* read specific shift */
router.get("/shifts/:id", auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const shift = await Shift.findOne({ _id, owner: req.user._id });
        if (!shift) {
            return res.status(404).send("shift not found");
        }
        res.status(200).send(shift);
    } catch (e) {
        res.status(500).send(e);
    }
});

/* update shift */
router.patch("/shifts/:id", auth, async (req, res) => {
    const _id = req.params.id;

    /* code to validate properties to update, leaving it out now until later for more in-depth error handling */
    /* for now just note that any invalid properties are ignored by mongoose */

    const updates = Object.keys(req.body);
    // const validUpdates = ["fName", "lName", "email", "password"];
    // const isValidOperation = updates.every((update) => validUpdates.includes(update));

    // if (!isValidOperation) {
    //     return res.status(400).send("error: attempting to update invalid property");
    // }


    try {
        // fetch shift from db
        const shift = await Shift.findOne({ _id, owner: req.user._id });

        if(!shift) {
            return res.status(404).send("shift not found");
        }

        // apply each update to shift and re-save in db.
        updates.forEach((update) => shift[update] = req.body[update] );
        await shift.save();

        res.status(200).send(shift);
    } catch (e) {
        res.status(500).send(e.toString());
    }
});

/* delete shift */
router.delete("/shifts/:id", auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const shift = await Shift.findOneAndDelete({ _id, owner: req.user._id });

        if (!shift) {
            return res.status(404).send("shift not found");
        }

        res.status(200).send(shift);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;