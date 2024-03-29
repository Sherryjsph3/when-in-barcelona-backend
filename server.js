// ============ DEPENDENCIES =========
//get .env variables
require('dotenv').config();

//pull PORT form .env, give default value of 4000
//pull MONGODB_URL from .env
const {PORT = 4000, MONGODB_URL} = process.env;

//import express
const express = require('express');

//create application object
const app = express();

//import mongoose
const mongoose = require('mongoose');

//import middlerware
const cors = require('cors');
const morgan = require('morgan');
// app.use(express.static('public'));

// ============ DATABASE CONNECTION =========
//establish connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

//connction events
mongoose.connection
    .on('open', () => console.log('You are connected to mongoose'))
    .on('close', () => console.log('You are disconnected from mongoose'))
    .on('error', (error) => console.log(error));

// ============ MODELS =========
const AttractionSchema = new mongoose.Schema({
    name: String,
    image: String,
    blurb: String,
    location: String,
    link: String,
});

const Attraction = mongoose.model('Attraction', AttractionSchema);

// =========== MIDDLEWARE =========
app.use(cors());// to pevent cors errors, open access to all origins
app.use(morgan('dev'));//logging
app.use(express.json());//parse json bodies

// =========== ROUTES =========
//test route
app.get('/', (req, res) => {
    res.send('test');
})

//attraction index route
app.get('/attraction', async (req, res) => {
    try{
        res.json(await Attraction.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
});

//attraction delete route
app.delete('/attraction/:id', async (req, res) => {
    try {
        res.json(await Attraction.findByIdAndRemove(req.params.id));
    } catch (error) {
        res.status(400).json(error);
    }
});

//attraction update route
app.put('/attraction/:id', async (req, res) => {
    try {
        res.json(await Attraction.findByIdAndUpdate(req.params.id, req.body, { new: true}));
    } catch (error) {
        res.status(400).json(error);
    }
});

//attraction create route
app.post('/attraction', async (req, res) => {
    try {
        res.json(await Attraction.create(req.body));
    } catch (error) {
        res.status(400).json(error);
    }
});

// ============ LISTENER =========
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));