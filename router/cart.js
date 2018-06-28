const mongoose = require('mongoose');
const express = require('express');
const cartRouter = express.Router();

/*购物车骨架*/
const cart = new mongoose.Schema({
    userid: {type: String, required: true},
    goodsid: {type: String, required: true},
    goodName: String,
    showPic: String,
    count: Number,
    color: String,
    colPic: String,
    size: String,
    oldPrice: Number,
    price: Number
}, {collection: 'cart'})
const cartModel = mongoose.model('cart', cart);

/*登录过滤*/
cartRouter.use(function (req, res, next) {
    var url = req.originalUrl;
    if (!req.session.loginInfo && url != "/user/login" && url != "/user/register" && url != "/postLogin") {
        return res.json({
            status: 0,
            msg: '未登录哦'
        });
    }
    next();
});

/*购物车*/
cartRouter.get('/user/cart', function (req, res) {
    console.log("获取购物车");
    cartModel.find(req.body, function (err, docs) {
        if (err) {
            console.error(err);
            res.json({
                status: 0,
                msg: '查询失败',
                err: err
            });
        } else {
            // console.log(docs);
            res.json({
                status: 1,
                msg: '查询成功',
                data: docs
            });
        }
    });
});

/*删除购物车*/
cartRouter.get('/cart/del', function (req, res) {
    console.log("删除购物车");
    cartModel.remove({_id: req.query.cartid}, function (err, msg) {
        if (err) {
            console.error(err);
            res.json({
                status: 0,
                msg: '删除失败',
                err: err
            });
        } else {
            console.log(msg);
            res.json({
                status: 1,
                msg: '删除成功',
            });
        }
    })
});

/*添加购物车*/
cartRouter.post('/cart/add', function (req, res) {
    console.log("添加购物车");
    console.log(req.body);
    cartModel.create(req.body, function (err, docs) {
        if (err) {
            console.log(err);
            res.json({
                status: 0,
                msg: '添加失败',
                err: err
            });
        } else {
            console.log(docs);
            res.json({
                status: 1,
                msg: '添加成功'
            });
        }
    })
});

/*修改购物车*/
cartRouter.post('/cart/update', function (req, res) {
    console.log("修改购物车");
    cartModel.update({'_id': req.body.cartid}, {'count': req.body.count}, function (err, msg) {
        if (err) {
            res.json({
                status: 0,
                msg: '修改失败',
                err: err
            });
        } else {
            console.log(msg);
            res.json({
                status: 1,
                msg: '修改成功',
            });
        }
    })
});


/*导出路由器*/
module.exports = cartRouter;