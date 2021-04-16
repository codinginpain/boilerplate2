const { json } = require('express');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/key');
const { User } = require('./model/User');


mongoose.connect(config.mongoURI, {useNewUrlParser:true})
    .then(() => {console.log('mongoDB Connected')})
    .catch((err) => {console.error(err)});

app.use(express.json()); //bodyparser를 받을 필요없이 express에 포함된 bodyparser를 쓸 수 있게됨

app.get('/', (req, res) => {
    res.json({'root' : 'root hi!'});
})

app.get('/api/test', (req, res) => {
    res.send("test url 반갑습니다.");
})

app.post('/api/users/register', (req, res) => {
    const user = new User(req.body); //bodyparser 가 없으면 req.body가 default로 undefined로 설정됨

    user.save((err, doc) => { 
        if(err) {
            console.log('err', err);
            return res.json ({success: false, err});
        }
        console.log('success', 'register accepted');
        return res.status(200)
                  .json({sucess: true});
    })
})

console.log('server start');
app.listen(5000);