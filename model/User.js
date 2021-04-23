const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 5;
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1 //true=1 , false=0
    },
    password: {
        type: String,
        minlength: 5
    },
    lastName: {
        type: String,
        maxlenght: 50
    },
    role: {
        type: Number,
        default: 0
    },
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }

});

//register시 password정보 암호화(bcrypt)
userSchema.pre('save', function(next) { //코드 실행중 next만나면 밑에 로직을 건너뛰고 바로 다음 함수로 감 pre.save->save
    let user = this;

    if(user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hashedPassword) {
                if(err) return next(err);
                user.password = hashedPassword;
                next();
            })
        })
    }else {
        next();
    }
})

//login시 암호 비교
userSchema.methods.comparePassword = function(plainPassword, cb) {

    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);

        cb(null, isMatch); //err null
    })
}

//login시 토큰생성
userSchema.methods.generateToken = function(cb) {
    let user = this;
    
    //jsonwebtoken을 사용해 토큰 생헝
    let token = jwt.sign(user._id.toHexString(), 'loginToken') // _id -> mongoDB에서 자동 생성해주는 아이디값
    //token = user._id + 'loginToken'

    user.token = token;
    user.save((err, user) => {
        if(err) return cb(err);
        cb(null, user);
    })
}

userSchema.statics.findByToken = function(token, cb) {
    let user = this;
    console.log("auth");
    console.log(user);

    jwt.verify(token, 'loginToken', function(err, decoded) {
        if(err) return cb(err);

        //userId를 이용해서 user를 찾고 token과 값 비교
        user.findOne({"id": decoded, "token": token}, function(err, user) {
            if(err) return cb(err);
            cb(null, user);
        })
    })
}

//schema 작성후 모델 자체를 만들기위해 mongoose.model 사용
//param은 name of collection(User), scheam(User에 저장 될 userSchema)
const User = mongoose.model('User', userSchema);
module.exports = { User };