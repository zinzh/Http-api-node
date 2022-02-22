const express = require('express')
const multer = require('multer')
const router = new express.Router()
const auth = require('../middleware/auth')
const Listing = require('../models/listing')
const checkAuth = require('../utils/checkAuth')
const Category = require('../models/category')
const Reply = require('../models/replies')
const { ObjectId } = require('mongodb')

const upload = multer({

    limits: {
        fileSize: 1000000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
            return cb(new Error('upload images only'))
        }

        cb(undefined, true)
    }
})


router.post('/listing', auth, upload.single('images'), async (req, res) => { // Auth middleware only registered users can create listings


    // console.log(req.body)
    /*const imagesArray = []
    for(const {buffer} of req.files){
        imagesArray.push({buffer})
    }
*/

    const listing = new Listing({
        ...req.body,
        owner: req.user._id,
        pictures: req.file.buffer
    })


    try {
        await listing.save()
        res.status(201).send({ title: listing.title, category: listing.category, visibility: listing.visibility })
    } catch (e) {
        res.status(500).send(e)
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

/*router.get('/listing/:id', auth, async (req, res) => {
    const _id = req.params.id

    try{
        
        const listing = await Listing.findOne({ _id, owner: req.user._id })

        if(!listing){
           return res.status(404).send()
         }

    res.send(listing)

    } catch (e) {
        res.status(500).send()
    }
})*/

router.get('/listing/:id', async (req, res) => {
    const isAuthenticated = checkAuth.checkAuth(req, res)
    const _id = req.params.id

    try {

        if (!await isAuthenticated) {
            const publicListings = await Listing.findOne({ _id, visibility: 1 })
            if (!publicListings) {
                return res.status(404).send({ error: 'This listing is private. You can only view it if you are logged in' })
            }
            return res.send(publicListings)
        }

        const listing = await Listing.findOne({ _id, owner: req.user._id })

        if (!listing || listing.hidden) {
            return res.status(404).send()
        }

        res.send(listing)


    } catch (e) {
        res.status(500).send()
    }
})


router.get('/listings', async (req, res) => {
    const isAuthenticated = checkAuth.checkAuth(req, res)

    try {

        if (!await isAuthenticated) {
            const publicListings = await Listing.find({ visibility: 1 })
            if (!publicListings) {
                return res.status(404).send()
            }
            return res.send(publicListings)
        }

        const listing = await Listing.find({})

        if (!listing) {
            return res.status(404).send()
        }
        res.send(listing)
    } catch (e) {
        res.status(500).send(e)
    }
})



router.get('/mylistings', auth, async (req, res) => {
    try {
        const listing = await Listing.find({ owner: req.user._id })

        if (!listing) {
            return res.status(404).send()
        }
        res.send(listing)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/listing/:id', auth, async (req, res) => { // Edit listing
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'content', 'pictures', 'visibility']

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation) {
        return res.status(400).send({ error: 'invalid updates' })
    }
    try {
        //const listing = await Listing.findOne({ _id: req.params.id, owner: req.user._id })
        const listing = await Listing.findOne({ _id: req.params.id })


        if (!listing) {
            return res.status(404).send()
        }

        if (listing.owner.equals(req.user._id) || req.user.role_id.equals(ObjectId("620d4434c1c9d600d61d7ee6"))) {
            updates.forEach((update) => listing[update] = req.body[update])
            await listing.save()
            res.send(listing)
        } else {
            return res.status(403).send()
        }


    } catch (e) {
        res.status(400).send(e)
    }

})

router.delete('/listing/:id', auth, async (req, res) => { // Delete listing

    try {
        //const listing = await Listing.findOne({_id: req.params.id, owner: req.user._id})

        const listing = await Listing.findOne({ _id: req.params.id })

        if (!listing) {
            return res.status(404).send('no listing to delete')
        }
        if (listing.owner.equals(req.user._id)) {
            await Listing.findByIdAndDelete(req.params.id)
        }
        else if (req.user.role_id.equals(ObjectId("620d4434c1c9d600d61d7ee6"))) { // Admin
            await Listing.findByIdAndDelete(req.params.id)
        }
        else if (req.user.role_id.equals(ObjectId("620d503d74b6e02b1d7ecca5"))) { //moderator
            await Listing.findByIdAndUpdate(req.params.id, { hidden: true })
        }

        res.send(listing)

    } catch (e) {
        res.status(500).send()
    }
})

router.post('/listing/:id/:reply', auth, async (req, res) => { //reply to a listing

    /*try{

        const listing = await Listing.findById(req.params.id)

        if(!listing){
            return res.status(404).send({error:'hello'})
        }

        listing.replies.push(req.params.reply)
        await listing.save()
        res.send(listing)
        console.log(listing.replies)

    }catch(e){
        res.status(500).send()
    }*/


    const listing = await Listing.findById(req.params.id)
    const diff = Math.floor((Date.now() - Date.parse(listing.createdAt)) / 86400000)

    if (diff > 365) {
        return res.status(501).send({ error: "you cannot reply to a thread that is older than 1 year" })
    }

    const reply = new Reply({
        text: req.params.reply,
        owner: req.user._id,
        listing: req.params.id
    })

    try {
        await reply.save()
        res.status(201).send(reply)
    } catch (e) {
        res.status(500).send()
    }


})

router.get('/listing/:id/replies', async (req, res) => {

    
    try {
        const isAuthenticated = await checkAuth.checkAuth(req, res)

        const listing = await Listing.findById(req.params.id)
        if (!isAuthenticated) {
            if (listing.visibility === 0) {
                return res.status(501).send('you have to be authenticated')
            }
        }
        if (!listing) {
            return res.status(404).send('no listing found')
        }



        const replies = await Reply.find({ listing: req.params.id })
        res.status(200).send(replies)

    } catch (e) {
        res.status(500).send()
    }
})





module.exports = router
