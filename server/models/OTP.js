const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    otp: {
        type: String,
        required: true
    },

    state: {
        type: String,
        enum: ['account_verification', 'event_booking'],
        default: 'account_verification' // Default value
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // OTP expires after 5 minutes
    }
});

module.exports = mongoose.model('OTP', otpSchema);