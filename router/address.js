const mongoose = require('mongoose');
const express = require('express');
const addressRouter = express.Router();

/*收件地址骨架*/
const address = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    firName: String,
    secName: String,
    market: String,
    phone: Number,
    address: String,
    other: String,
    postCode: Number,
    province: String,
    city: String,
    area: String,
}, {collection: 'address'});
const addressModel = mongoose.model('address', address);

/*登录过滤*/
addressRouter.use(function (req, res, next) {
    var url = req.originalUrl;
    if (!req.session.loginInfo && url != "/user/login" && url != "/user/register" && url != "/postLogin") {
        return res.json({
            status: 0,
            msg: '未登录哦'
        });
    }
    next();
});

/*获取收货地址*/
addressRouter.get('/user/address', function (req, res) {
    console.log("获取收货地址");
    addressModel.find(req.query, function (err, docs) {
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

/*删除收货地址*/
addressRouter.get('/address/del', function (req, res) {
    console.log("删除收货地址");
    addressModel.remove({_id: req.query.addressid}, function (err, msg) {
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

/*添加收货地址*/
addressRouter.post('/address/add', function (req, res) {
    console.log("添加收货地址");
    addressModel.create(req.body, function (err, docs) {
        if (err) {
            console.error(err);
            res.json({
                status: 0,
                msg: '添加失败',
                err: err,
            });
        } else {
            // console.log(docs);
            res.json({
                status: 1,
                msg: '添加成功',
            });
        }
    })
});

/*修改收货地址*/
addressRouter.post('/address/update', function (req, res) {
    console.log("修改收货地址");
    let addressid = req.body.addressid;
    delete req.body.addressid;
    addressModel.update({_id: addressid}, req.body, function (err, msg) {
        if (err) {
            console.error(err);
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
module.exports = addressRouter;