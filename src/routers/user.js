const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const Message = require('../models/message')
const Role = require('../models/role')

router.post('/user', async (req, res) => { // create user
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/user/me', auth, async (req, res) => {
    res.send(req.user)
})

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        
        res.send({ user, token})
    } catch (e) {
        res.status(404).send(e)
    }
})

router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/user/pm', auth, async (req, res) => { // Send pm

    try {

        const recipient = await User.findById(req.body.recipient)
        if (!recipient) {
            return res.send({ "error": "no such user" })
        }

    } catch (e) {
        res.status(500).send(e)
    }
    const message = new Message({
        message: req.body.message,
        sender: req.user._id,
        recipient: req.body.recipient
    })

    try {
        await message.save()
        res.send(message)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/user/messages', auth, async (req, res) => { //Load inbox
    try {
        const messages = await req.user.getPrivateMessages()
        res.send(messages)
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/role', auth, async(req, res) => {
    // try{
    //     const role = new Role({
    //         role:"admin"
    //     })
    //     role.save()
    // } catch(e) {
    //     res.status(500).send()
    // }

    res.send(req.user.role_id)
})



module.exports = router

