const mongoose = require('mongoose')
const Schema = mongoose.Schema

const assignedCheckpoint = Schema({
    checkpoint: {
        type: Schema.Types.ObjectId,
        ref: 'Checkpoint',
        required: true
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    }
})

const MilestoneSchema = Schema({
    title: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    assignedCheckpoints: [
        {
            type: assignedCheckpoint,
            default: []
        }
    ]
    
})

module.exports = mongoose.model('Milestone', MilestoneSchema)
