const express = require('express')

const router = express.Router()

const User = require('../models/user')

router.use(express.json())

router.post('/register', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    try{
        user_data = await user.save()
        return res.status(200).json(user_data)
    }catch(err) {
        res.status(400).json({
            'message': err
        })
    }
})

router.post('/login', (req, res) => {
    res.send('login')
})

module.exports = router

