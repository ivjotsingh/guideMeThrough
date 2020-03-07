const mongoose = require('mongoose')

const CheckpointSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    number: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Checkpoint', CheckpointSchema)