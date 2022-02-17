const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Category = require('../models/category')
const Listing = require('../models/listing')
const checkAuth = require('../utils/checkAuth')
const roleAuth = require('../middleware/roleAuth')

router.get('/category', async (req, res) => { // Lists all categories
    const isAuthenticated = checkAuth.checkAuth(req, res)

    try {

        if (!await isAuthenticated) {
            const publicCategory = await Category.find({ visibility: 1 })
            if (!publicCategory) {
                return res.status(404).send({ error: 'no categories' })
            }
            res.send(publicCategory)
        }

        const category = await Category.find({})

        if (!category) {
            return res.status(404).send()
        }

        res.send(category)

    } catch (e) {
        res.status(500).send()
    }
})

router.get('/category/:id', async (req, res) => { // LIstings from category 
    const isAuthenticated = await checkAuth.checkAuth(req, res)
    //console.log(isAuthenticated)

    try {

        if (!isAuthenticated) { // Instead, I can query once and remove listings with visibility 0
            const publicCategory = await Category.findOne({ _id: req.params.id, visibility: 1 }).populate({ path: 'listings', match: { visibility: 1 } })
            console.log(publicCategory.listings)
            if (!publicCategory) {
                return res.status(403).send('you do not have permission to view this category')
            }

            return res.send(publicCategory.listings)
        }

        const category = await Category.findById(req.params.id).populate('listings')
        if (!category) {
            return res.status(404).send('wrong category')
        }

        return res.send(category.listings)

    } catch (e) {
        res.status(500).send()
    }


})

router.delete('/category/:id', roleAuth, async (req, res) => {

    try {
        const category = await Category.findOneAndDelete({ id: req.params.id })
        
        if (!category) {
            res.status(404).send()
        }

        const documentsToMove = await Listing.find({ _id: { $in: Category.listings } });
        documentsToMove.forEach(function (doc) {
            deletedListing.insert(doc);
            Listing.remove(doc);
        })

        await Listing.delete()

        res.send(category)

    } catch (e) {
        console.log('hi')
        res.status(500).send()
    }
})










module.exports = router