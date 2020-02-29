const express = require('express')

const router = express.Router()

const Milestone = require('../models/milestones')

const Joi = require('joi')

const {validateMilestone} = require('../validators')

router.use(express.json());

const verifyToken = require('./helpers')

// now this is a private route
router.get('/', verifyToken, async (req, res) => {

    // we can use req.user
    // findOne({_id: req.user._id})
    try{
        const milestones = await Milestone.find()
        return res.json(milestones)
    }catch(err){
        res.json({
            'message': err
        })
    }
})

router.get('/:id', async (req, res) => {
    
    // const milestone  = milestones.find(m => m.id === parseInt(req.params.id))
    try{
        const milestone = await Milestone.findById(req.params.id)
        if (!milestone){
            return res.status(400).send("id incorrect")
        }
        return res.json(milestone)
    }catch(err){
        console.log("coming here")
        return res.status(400).json(err)
    }
})


router.delete('/:id', async (req, res) => {
    try{
        const removedMilestone = await Milestone.remove({
            _id: req.params.id
        })
        return res.status(200).json(removedMilestone)
    }catch(err){
        res.status(400).json(err)
    }
})

router.patch('/:id', async (req, res) => {
    try{
        const updatedMilestone = await Milestone.updateOne(
            {
            _id: req.params.id
        }, {
            $set: {title: req.body.title}
        })
        res.json(updatedMilestone)
    }catch(err){
        res.status(400).json(err)
    }
})

router.post('/', async (req, res) => {
    
    const {error} = validateMilestone(req.body) // return_of_function.error === {error}
    // if (!req.body.name || req.body.name.length <3){
    if (error){
        // also loop through the errors and concatenate as string
        return res.status(400).send(error.details[0].message)
    }
    const milestone = new Milestone({
        title: req.body.title
    })

    // this returns a promise
    try{
        milestone_data = await milestone.save()
        res.status(200).json(milestone_data)
    }catch(err) {
        res.json({
            'message': err
        })
    }
    // const milestone = {
    //     "id": milestones.length + 1,
    //     "name": req.body.name
    // }
    // milestones.push(milestone)
    // return res.send(milestone)
})

module.exports = router

