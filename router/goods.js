const mongoose = require('mongoose');
const express = require('express');
const goodsRouter = express.Router();


/*商品骨架*/
const goods = new mongoose.Schema({
    goodName: String,
    showPic: String,
    tags: Array,
    oldPrice: Number,
    price: Number,
    attr: [
        {
            color: String,
            colPic: String,
            size: Array,
            pics: Array
        }
    ],
    count: Number,
    details: String,
    more: Array,
    type: String
}, {collection: 'goods'});
const goodsModel = mongoose.model('goods', goods);


/*全部商品列表*/
goodsRouter.get("/goods/list", function (req, res) {
    console.log("获取全部商品");
    goodsModel.find(function (err, docs) {
        if (err) {
            console.error(err);
            res.json({
                status: 0,
                msg: '获取失败',
                err: err,
            });
        } else {
            // console.log(docs);
            res.json({
                status: 1,
                msg: '获取成功',
                data: docs,
            });
        }
    })
});

/*标签查询*/
goodsRouter.get("/goods/tag", function (req, res) {
    console.log("标签查询");
    console.log(req.query);
    goodsModel.find(function (err, docs) {
        if (err) {
            console.error(err);
            res.json({
                status: 0,
                msg: '获取失败',
                err: err,
            })
        } else {
            // console.log(docs);
            let data = [];
            for (let v of docs) {
                let tempArr = v.tags.join('');
                let flag = false;
                for (let k of req.query.tag) {
                    let reg = new RegExp(k);
                    flag = reg.test(tempArr);
                    if (!flag) {
                        break;
                    }
                }
                if (flag) {
                    data.push(v);
                }
            }
            res.json({
                status: 1,
                msg: '获取成功',
                data: data,
            });
        }
    })
});

/*模糊查询*/
goodsRouter.get("/goods/key", function (req, res) {
    console.log("模糊查询");
    goodsModel.find(function (err, docs) {
        if (err) {
            console.error(err);
            res.json({
                status: 0,
                msg: '获取失败',
                err: err,
            })
        } else {
            // console.log(docs);
            let data = [];
            for (let v of docs) {
                let reg = new RegExp(req.query.key);
                if (reg.test(v.goodName)) {
                    data.push(v);
                }
            }
            res.json({
                status: 1,
                msg: '获取成功',
                data: data,
            });
        }
    })
});

/*商品详情*/
goodsRouter.get("/goods/detail", function (req, res) {
    console.log("商品详情");
    goodsModel.findOne({_id: req.query.goodid}, function (err, docs) {
        if (err) {
            console.error(err);
            res.json({
                status: 0,
                msg: '获取失败',
                err: err,
            });
        } else {
            // console.log(docs);
            res.json({
                status: 1,
                msg: '获取成功',
                data: docs,
            });
        }
    })
});

/*商品录入*/
goodsRouter.post("/goods/add", function (req, res) {
    console.log("商品录入");
    goodsModel.create(req.body, function (err, docs) {
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
                msg: '添加成功',
            });
        }
    })
});


/*导出路由器*/
module.exports = goodsRouter;