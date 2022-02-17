const mongoose = require('mongoose')
const Category = require('../models/category')

const deletedListingSchema = new mongoose.Schema({  
    title: {            // All the requirements to the fields in the database
        type: String,   // All validation can be done inside the database model
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        maxlength: 5000
    },
    /*replies: [{ 
       
            type: String,
            maxlength: 255
        
    }],*/

    pictures:{type: Buffer},

    creationDate:{
        type: Date
    },

    category:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        async validate(value) { //kek idk if i can do that
            const isCategory = await Category.findById(value)

            if(!isCategory){
                throw new Error('incorrect category')
            }
        },
        ref: 'Category'   
    },

    visibility:{ // public or private
        type: Number,
        required: true,
        validate(value){ // 0 for private, 1 for public
            if(value < 0 || value > 1){
                throw new Error('Out of bounds')
            }
        }
        
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    hidden: {
        type:Boolean,
        default: false
    }

},{ 
    timestamps:true
})

deletedListingSchema.virtual('replies', { 
    ref: 'Replies',
    localField: '_id', 
    foreignField: 'owner'
})



const deletedListing = mongoose.model('deletedListing', deletedListingSchema) // Pass the model to schema, to use Schema.pre for authentication

module.exports = deletedListing