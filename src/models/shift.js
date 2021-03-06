const mongoose = require("mongoose");
const validator = require("validator");

const shiftSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    year: {
        type: Number
    },
    month: {
        type: Number
    },
    day: {
        type: Number
    },
    shiftType: {
        type: Number
    },
    inTime: {
        type: Number
    },
    nonCashTips: {
        type: Number
    },
    cashTips: {
        type: Number
    },
    bottledBeer: {
        type: Number
    },
    draftBeer: {
        type: Number
    },
    liquor: {
        type: Number
    },
    sake: {
        type: Number
    },
    wine: {
        type: Number
    },
    totalNetSales: {
        type: Number
    },
    voidAmount: {
        type: Number
    },
    removalAmountt: {
        type: Number
    },
    customerDiscount: {
        type: Number
    },
    storeDiscount: {
        type: Number
    },
    totalGuests: {
        type: Number
    },
    ppa: {
        type: Number
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

const Shift = mongoose.model("Shift", shiftSchema);

module.exports = Shift;