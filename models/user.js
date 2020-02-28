const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    email: {
        type: String,
        required: true,
        max: 555,
        min: 6
    },
    password: {
        type: String,
        required: true,
        max: 555,
        min: 6
    },
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', UserSchema)
