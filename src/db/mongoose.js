// Connects to database

const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/http-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Database connected!"))
    .catch(err => console.log(err));





