const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/key');
const { User } = require('./model/User');


mongoose.connect(config.mongoURI, {useNewUrlParser:true})
// mongoose.connect(config.mongoURI, {useUnifiedTopology: true})
    .then(() => {console.log('mongoDB Connected')})
    .catch((err) => {console.error(err)});

app.use(express.json()); //bodyparser를 받을 필요없이 express에 포함된 bodyparser를 쓸 수 있게됨

app.get('/', (req, res) => {
    res.json({'root' : 'root hi!'});
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


app.post('/api/users/login', (req, res) => {
    console.log('login');

    User.findOne({ email: req.body.email }, (err, user) => { //일치 email확인
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: '해당 유저는 등록되어 있지 않습니다.'
            })
        }
        

        //비밀번호 확인
        console.log('user', user);
        console.log('got one');
        user.comparePassword(req.body.password, (err, isMathc) => {
            if(!isMathc) return res.json({ loginSuccess: false, message: 'wrong password'});
        })
        
        console.log('암호 일치');
        //비밀번호 일치한다면 토큰 생성
        // user.generateToken((err, user) => {
        //     if(err) return res.status(400).send(err);

            
        // })
    })
})

console.log('server start');
app.listen(5000);