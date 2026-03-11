const mongoose = require("mongoose");

const parkingSlotSchema = new mongoose.Schema({
    carNum: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    slotNum: {
        type: Number,
        required: true,
        unique: true,
    },
    entryTime: {
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("ParkingSlot",parkingSlotSchema);