const mongoose = require('mongoose');

        const replySchema = new mongoose.Schema({
         text: {
              type: String,
              required: true
           },
        date: {
              type: Date,
              default: Date.now
           },      

       owner: {
             type: mongoose.Schema.Types.ObjectId,
             required: true,
             ref: 'User'
       },
        listing: {
              type: mongoose.Schema.Types.ObjectId,
              required: true,
              ref: 'Listing'
           }
         })

         const Replies = mongoose.model('Replies', replySchema)

        module.exports = Replies