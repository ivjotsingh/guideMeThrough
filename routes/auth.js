const express = require('express')
router.use(express.json());


const router = express.Router()

router.post('/register', (req, res) => {
    res.send('register')
})

router.post('/login', () => {
    res.send('login')
})

module.exports = router

