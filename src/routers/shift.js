const express = require("express");
const router = new express.Router();
const Shift = require("../models/shift");


/* create new shift */
router.post("/shifts", async (req, res) => {
    const newShift = new Shift(req.body);

    try {
        await newShift.save();
        res.status(201).send(newShift);
    } catch (e) {
        res.status(400).send(e);
    }
});

/* read shifts */
router.get("/shifts", async (req, res) => {

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
router.get("/shifts/:id", async (req, res) => {
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

/* update shift */
router.patch("/shifts/:id", async (req, res) => {
    /* code to validate properties to update, leaving it out now until later for more in-depth error handling */
    /* for now just note that any invalid properties are ignored by mongoose */

    // const updates = Object.keys(req.body);
    // const validUpdates = ["fName", "lName", "email", "password"];
    // const isValidOperation = updates.every((update) => validUpdates.includes(update));

    // if (!isValidOperation) {
    //     return res.status(400).send("error: attempting to update invalid property");
    // }


    try {
        const shift = await Shift.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if(!shift) {
            return res.status(404).send("shift not found");
        }

        res.status(200).send(shift);
    } catch (e) {
        res.status(500).send(e);
    }
});

/* delete shift */
router.delete("/shifts/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        const shift = await Shift.findByIdAndDelete(_id);

        if (!shift) {
            return res.status(404).send("shift not found");
        }

        res.status(200).send(shift);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;