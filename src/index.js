const express = require('express')
const userRouter = require('./routers/user')
const listingRouter = require('./routers/listing')
const categoryRouter = require('./routers/category')

require('./db/mongoose') // Just to make sure mongoose connects to database

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.use(userRouter)
app.use(listingRouter)
app.use(categoryRouter)

app.listen(port, () => {
    console.log('server is running on port: ', port)
})



