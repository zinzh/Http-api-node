const mongoose = require('mongoose')
const { insertMany } = require('./message')
const Listing = require('../models/listing')
const deletedListing = require('./deletedListings')
const roleAuth = require('../middleware/roleAuth')


const categorySchema = new mongoose.Schema({ 

    name:{
        type: String,
        required: true
    },

    visibility:{ // public or private
        type: Number,
        default:0,
        required: true,
        validate(value){ // 0 for private, 1 for public
            if(value < 0 || value > 1){
                throw new Error('Out of bounds')
            }
        }
        
    }
    

},{ 
    timestamps:true
})

categorySchema.virtual('listings', { //listings is virtual field instead of making listing array
    ref: 'Listing',
    localField: '_id', 
    foreignField: 'category'
})



categorySchema.set('toObject', { virtuals: true });
categorySchema.set('toJSON', { virtuals: true });

const Category = mongoose.model('Category', categorySchema) // Pass the model to schema, to use Schema.pre for authentication

categorySchema.post('findOneAndDelete', roleAuth, async function (next) {
    
    

    next()
})



module.exports = Category