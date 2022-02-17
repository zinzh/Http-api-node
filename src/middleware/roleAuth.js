const User = require('../models/user')
const jwt = require('jsonwebtoken')

const roleAuth = async (req, res, next) => {
    try {
        
        const token = req.header('Authorization').replace('Bearer ', '')
        
        const decoded = jwt.verify(token, 'supersecretjsonwebtokensecret')
        
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }).populate({path: 'role_id'}).exec()
        
        if (!user) {
            
            throw new Error()
            //return false         
        }
        
        // if(!user.role_id.equals(ObjectId("620d4434c1c9d600d61d7ee6")) /*admin*/ && !user.role_id.equals(ObjectId("620d503d74b6e02b1d7ecca5") /*mod*/)){
            
        //     throw new Error()
        // }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'please authenticate' })

    }

    
}

module.exports = roleAuth