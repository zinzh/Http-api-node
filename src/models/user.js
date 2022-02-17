const mongoose = require('mongoose')
const validator = require('validator') // to validate credentials
const jwt = require('jsonwebtoken')
const bcrypt = require ('bcryptjs')
const Message = require('../models/message')

const userSchema = new mongoose.Schema({  
    email: {            // All the requirements to the fields in the database
        type: String,   // All validation can be done inside the database model
        required: true,
        trim: true,
        unique:true,
        lowercase: true,
        validate(value) { // Can include function because why not
            if(!validator.isEmail(value)){
                throw new Error('invalid email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim:true,
        validate(value) {
            if(value.includes('password')) {
                throw new Error('password too obvious')
            }
            if(value.length <= 6) {
                throw new Error('password too short')
            }
            if(value.length > 100) {
                throw new Error('password too long')
            }
        }
    },
    name: {
        type: String,
       
        trim: true
    },

    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Role' 
    },

    //messages:[{type: Message}],

    tokens: [{  // Need to keep track of it because it was only sent back to user, then how to log out?
        token:{
            type: String,
            require: true
        }
    }]
},{ 
    timestamps:true
})

userSchema.virtual('listings', { //listings is virtual field instead of making listing array
    ref: 'Listing',
    localField: '_id', 
    foreignField: 'owner'
})

userSchema.virtual('messages', { 
    ref: 'Message',
    localField: '_id', 
    foreignField: 'recipient'
})

userSchema.methods.generateAuthToken = async function () { // methods accessible on instances not Model
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'supersecretjsonwebtokensecret')

    user.tokens = user.tokens.concat({ token }) // Adding token for user to his array of tokens
    await user.save()
    return token
}

userSchema.methods.getPrivateMessages = async function () { // methods accessible on instances not Model
    const user = this

    try {
        
        const messages = await Message.find({ recipient: user._id })
       
        if (!messages) {
            //console.log('hi')
            return res.status(404).send()
        }
        //console.log(messages)
        return messages
    } catch (e) {
        res.status(500).send(e)
    }
    
}

userSchema.statics.findByCredentials = async function (email, password) {
    const user = await User.findOne({email})

    if(!user) {
        throw new Error('no user found');
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new error('Wrong password')
    }

    return user


}



userSchema.pre('save', async function (next) {
    if (this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }

    next()
})
const User = mongoose.model('User', userSchema) // Pass the model to schema, to use Schema.pre for authentication

module.exports = User