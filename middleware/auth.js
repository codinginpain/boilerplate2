const { User } = require('../model/User');

let auth = (req, res, next) => {  //인증 처리
    //클라이언트 쿠키로 부터 토큰 가져오기
    let token = req.cookies.x_auth;


    //toekn을 복호화 한 후 유저 찾기
    User.findyToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error:ture });

        req.token = token; //req에 넣어야 auth를 호출 한 곳에서 req에 담긴 바로 사용 할 수 있게 하기 위함
        req.user = user;
        next();
    })
}

module.exports = { auth };