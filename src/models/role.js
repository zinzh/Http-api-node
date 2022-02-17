const mongoose = require('mongoose')

const roleSchema = mongoose.Schema({
    role: {
        type: String,
        required: true
    }
})

const Role = mongoose.model('Role', roleSchema) 

module.exports = Role