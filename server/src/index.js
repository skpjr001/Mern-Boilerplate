require('dotenv').config();
const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');
const helmet = require('helmet');
const { checkTokenSetUser, isLoggedIn, isAdmin } = require('../auth/middlewares')
const { notFound, errorHandler } = require('./middlewares')
const auth = require('../auth/index'); // auth router
const notes = require('../api/notes'); // notes router
const users = require('../api/users'); // users router

 

const app = express(); //express app

app.use(volleyball); // request/response logger
app.use(helmet()); // header protection
app.use(cors({
    origin: process.env.CORS_ORIGIN,
})); // for handling incoming requests origin
app.use(express.json()); // express json body parser
app.use(checkTokenSetUser);
app.use(express.urlencoded({extended: true})); // express url parser

app.get('/world', (req,res) => {
    res.json({message:'hello world 🌏......',
    user: req.user,
});
});

//ROUTES
app.use('/auth', auth);
app.use('/api/v1/notes', isLoggedIn, notes);
app.use('/api/v1/users', isLoggedIn, isAdmin, users);

//ERROR HANDLING MIDDLEWARES
app.use(notFound); // notFound error handler
app.use(errorHandler); // general error handler

const port = process.env.PORT || 1337; // node server port
app.listen(port,() => {
    console.log(`server is listening on port ${port}`)
})