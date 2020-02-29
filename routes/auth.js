const express = require('express')

const router = express.Router()

const User = require('../models/user')

router.use(express.json())

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {

    const emailExists = await User.findOne({email: req.body.email})
    if (emailExists) return res.status(400).send('email already exists')

    // hasing password
    const salt = bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
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

    // when you need to compare you can use 
    // const validPassword = await bcrypt.compare(req.body.password, user.password)

    // after password and email id validation

    const user = await User.findOne({email: req.body.email})

    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
    return res.header('auth-token', token).send("logged in successfully")

})

module.exports = router

