const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/key');


mongoose.connect(config.mongoURI, {useNewUrlParser:true})
    .then(() => {console.log('mongoDB Connected')})
    .catch((err) => {console.error(err)});

app.get('/', (req, res) => {
    res.json({'root' : 'root hi!'});
})

app.get('/api/test', (req, res) => {
    res.send("test url 반갑습니다.");
})

app.post('/api/user/register', (req, res) => {
    
})

console.log('server start');
app.listen(5000);