const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Place",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests:{type:Number,required:true},
    name: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    bookingDate: {
        type: Date,
        default:new Date(),
    }
}, { timestamps: true });
const BookingModel = mongoose.model('Booking', bookingSchema);
module.exports = BookingModel;