const jwt = require('jsonwebtoken')

// next as a paramter can be used to create middleware
module.exports = function verifyToken(req, res, next){
    const token = req.header('auth-token');
    if (!token) {
        return res.send(400)
    }

    try{
        const verified = jwt.verify(token, process.env.JWT_SECRET)

        if (!verified) {return res.this.status(400)}

        req.user = verified
        next;
    }catch(err){
        if (err) {req.send.err}
    }
}