const jwt = require('jsonwebtoken')
const User = require('../models/user')

const checkAuth = async (req, res) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token, 'supersecretjsonwebtokensecret')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if(!user) {
            return false            
        } 

        req.token = token

        req.user = user

        
        return true
    } catch (e) {
        res.status(401).send({error: 'please authenticate'})
      
    }
}

module.exports = {checkAuth}