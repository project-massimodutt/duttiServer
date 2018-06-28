const express = require('express');
const app = express();
const queryString = require('querystring');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

/*自用启动命令:mongod --dbpath=C:\duttServer\mongo*/
const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://localhost:27017/dutt');
/*验证链接成功与否*/
db.then(function () {
    //成功的回调
    console.log("数据库链接成功");
}).catch(function (err) {
    //失败的回调
    console.error(new Error(err));
});


/*express跨域*/
app.all('/test', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


// 创建 application/json 解析
app.use(bodyParser.json());
// 创建 application/x-www-form-urlencoded 解析
app.use(bodyParser.urlencoded({extended: false}));


/*cookie-parser中间件*/
app.use(cookieParser());


/*session中间件*/
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        url: 'mongodb://localhost:27017/dutt',
        ttl: 3 * 60 * 60,
        autoRemove: 'native' // Default
    })
}));


/*导入子路由*/
const tagsRouter = require('./router/tags');
const goodsRouter = require('./router/goods');
const accountRouter = require('./router/account');
const addressRouter = require('./router/address');
const cartRouter = require('./router/cart');
const orderRouter = require('./router/order');
app.use('/', tagsRouter);
app.use('/', goodsRouter);
app.use('/', accountRouter);
app.use('/', addressRouter);
app.use('/', cartRouter);
app.use('/', orderRouter);


/*路由错误了哦*/
app.all("*", function (req, res) {
    res.json({msg: "小笨蛋,你做了什么才显示这条信息了???", err: "请求url错误了哦"});
});


/*设置端口号*/
app.listen(8888);