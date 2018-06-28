const mongoose = require('mongoose');
const express = require('express');
const tagsRouter = express.Router();

/*tag1骨架*/
const tagList1 = new mongoose.Schema({
    tag1: String,
    tag2: Array
}, {collection: 'tagList1'});
const tagListModel1 = mongoose.model('tagList1', tagList1);

/*tag2骨架*/
const tagList2 = new mongoose.Schema({
    tag1: String,
    tags: [{
        tag2: String,
        tag3: Array
    }]
}, {collection: 'tagList2'});
const tagListModel2 = mongoose.model('tagList2', tagList2);

/*标签1*/
tagsRouter.get("/index/tagList1", function (req, res) {
    console.log("标签1");
    tagListModel1.find(function (err, docs) {
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
            })
        }
    })
});
/*标签2*/
tagsRouter.get("/index/tagList2", function (req, res) {
    console.log("标签2");
    tagListModel2.find(function (err, docs) {
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

/*导出路由器*/
module.exports = tagsRouter;