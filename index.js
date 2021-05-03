require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

const lessonsRouter = require('./routes/lessons')
const homeRouter = require('./routes/home')

const PORT = process.env.PORT
const dbLogin = process.env.DBLOGIN
const dbPassword = process.env.DBPASSWORD

const app = express()

mongoose.connect(`mongodb+srv://${dbLogin}:${dbPassword}@cluster0.lgxvc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

app.use(express.static('public'))

app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))

app.use('/home', homeRouter)
app.use('/lessons', lessonsRouter)

app.get('/', (req, res) => {
    res.redirect('/home')
})

app.listen(PORT)