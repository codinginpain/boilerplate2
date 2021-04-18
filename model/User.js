const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 5;


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
userSchema.methods.comparePassword = (plainPassword, cb) => {

    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);

        cb(null, isMatch); //err null
    })
}

const User = mongoose.model('User', userSchema);
module.exports = { User };