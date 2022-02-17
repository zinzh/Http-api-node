const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'

    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},
    {
        timestamps: true
    })

const Message = mongoose.model('Message', messageSchema) // Pass the model to schema, to use Schema.pre for authentication

module.exports = Message