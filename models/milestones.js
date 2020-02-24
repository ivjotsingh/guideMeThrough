const mongoose = require('mongoose')

const MilestoneSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Milestone', MilestoneSchema)