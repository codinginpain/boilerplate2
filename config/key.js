//develplement 와 production 구분
if(process.env.NODE_ENV === "production") {
    module.exports = require('./prod');
}else {
    module.exports = require("./dev");
}