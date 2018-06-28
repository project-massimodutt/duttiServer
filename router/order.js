const mongoose = require('mongoose');
const express = require('express');
const orderRouter = express.Router();

/*订单骨架*/
const order = new mongoose.Schema({
    userid: {type: String, required: true},
    orderNum: String,
    status: String,
    goods: [
        {
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
        }
    ]
}, {collection: 'order'})
const orderModel = mongoose.model('order', order);

/*登录过滤*/
orderRouter.use(function (req, res, next) {
    var url = req.originalUrl;
    if (!req.session.loginInfo && url != "/user/login" && url != "/user/register" && url != "/postLogin") {
        return res.json({
            status: 0,
            msg: '未登录哦'
        });
    }
    next();
});

/*订单*/
orderRouter.get('/user/order', function (req, res) {
    console.log("获取订单");
    orderModel.find(req.query, function (err, docs) {
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
})

/*生成订单*/
orderRouter.post('/order/add', function (req, res) {
    console.log("订单生成");
    
    //生成订单号函数
    function randomString() {
        let $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let maxPos = $chars.length;
        let pwd = '';
        for (i = 0; i < 8; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * (maxPos + 1)));
        }
        return pwd;
    }
    
    let orderNum = randomString();
    console.log(orderNum);
    req.body.orderNum = orderNum;
    orderModel.create(req.body, function (err, docs) {
        if (err) {
            res.json({
                status: 0,
                msg: '添加失败',
                err: err
            });
        } else {
            // console.log(docs);
            res.json({
                status: 1,
                msg: '添加成功'
            });
        }
    })
});

/*修改订单状态*/
orderRouter.post('/order/update', function (req, res) {
    console.log("修改订单");
    console.log(req.body);
    orderModel.update({_id: req.body.orderid}, {status: req.body.status}, function (err, msg) {
        if (err) {
            console.log(docs);
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
module.exports = orderRouter;