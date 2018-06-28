const mongoose = require('mongoose');
const express = require('express');
const accountRouter = express.Router();

/*用户账号骨架*/
const users = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    pwd: {
        type: String,
        required: true
    }
}, {collection: 'user'});
const userModel = mongoose.model('user', users);
/*个人信息骨架*/
const userInfo = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    firName: String,
    secName: String,
    birthday: String,
    sex: String,
    market: String,
    phone: Number,
    address: String,
    other: String,
    postCode: Number,
    province: String,
    city: String,
    area: String,
    idCard: Number,
    comName: String,
    follow: Array
}, {collection: 'userinfo'});
const userInfoModel = mongoose.model('userinfo', userInfo);

/*登录过滤*/
accountRouter.use(function (req, res, next) {
    var url = req.originalUrl;
    if (!req.session.loginInfo && url != "/user/login" && url != "/user/register" && url != "/postLogin") {
        return res.json({
            status: 0,
            msg: '未登录哦'
        });
    }
    next();
});


/*登录*/
accountRouter.post('/user/login', function (req, res) {
    console.log("登录");
    userModel.findOne({username: req.body.username}, function (err, docs) {
        if (err) {
            /*查询失败*/
            console.error(err);
            res.json({
                status: 0,
                msg: '登录失败',
                err: err,
            });
        } else {
            /*查询成功*/
            // console.log(docs);
            if (docs) {
                /*匹配到账号*/
                if (req.body.pwd == docs.pwd) {
                    /*密码正确*/
                    /*记录登录状态*/
                    req.session.loginInfo = true;
                    req.session.save();
                    res.json({
                        status: 1,
                        msg: '登录成功',
                        data: {
                            username: docs.username,
                            userid: docs._id
                        }
                    });
                } else {
                    /*密码错误*/
                    res.json({
                        status: 0,
                        msg: '密码错误',
                    });
                }
            } else {
                /*账号未注册*/
                res.json({
                    status: 0,
                    msg: '该账户未注册',
                });
            }
        }
    });
});

/*登出*/
accountRouter.get('/user/loginout', function (req, res) {
    console.log("登出");
    req.session.destroy(function (err) {
        if (err) {
            res.json({status: 0, msg: '退出登录失败', err: err});
        } else {
            res.json({status: 1, msg: '退出登录成功'});
        }
    })
});

/*注册*/
accountRouter.post('/user/register', function (req, res) {
    console.log("注册");
    userModel.findOne({username: req.body.username}, function (err, docs) {
        if (err) {
            /*查询出错*/
            console.error(err);
            res.json({
                status: 0,
                msg: "注册失败",
                err: err
            });
        } else {
            /*查询成功*/
            // console.log(docs);
            if (docs) {
                /*账号已注册*/
                res.json({
                    status: 0,
                    msg: "该账户已被占用"
                });
            } else {
                /*账号未注册*/
                userModel.create({username: req.body.username, pwd: req.body.pwd}, function (err, docs) {
                    if (err) {
                        /*注册失败*/
                        console.error(err);
                        res.json({
                            status: 0,
                            msg: "注册失败",
                            err: err
                        });
                    } else {
                        /*账号添加到数据库成功*/
                        // console.log(docs);
                        let info = {
                            userid: docs._id,
                            sex: req.body.sex,
                            firName: req.body.firName,
                            secName: req.body.secName,
                            idCard: req.body.idCard,
                            comName: req.body.comName,
                            follow: req.body.follow
                        };
                        userInfoModel.create(info, function (err, docs) {
                            if (err) {
                                /*创建个人信息失败*/
                                console.log(err);
                                let error = err;
                                userModel.remove({_id: info.userid}, function (err, msg) {
                                    if (err) {
                                        console.error(err);
                                        res.json({
                                            status: 0,
                                            msg: "注册出问题了,请联系管理员",
                                            err: err
                                        });
                                    } else {
                                        console.log(msg);
                                        res.json({
                                            status: 0,
                                            msg: "注册失败",
                                            err: error
                                        });
                                    }
                                })
                            } else {
                                /*注册成功*/
                                res.json({
                                    status: 1,
                                    msg: "注册成功"
                                });
                            }
                        })
                    }
                })
            }
        }
    })
});

/*修改密码*/
accountRouter.post('/pwd/update', function (req, res) {
    console.log("修改密码");
    userModel.findOne({_id: req.body.userid}, function (err, docs) {
        if (err) {
            console.error(err);
            res.json({
                status: 0,
                msg: '修改失败',
                err: err
            });
        } else {
            // console.log(docs);
            if (req.body.oldPwd == docs.pwd) {
                userModel.update({_id: req.body.userid}, {pwd: req.body.newPwd}, function (err, msg) {
                    if (err) {
                        console.error(err);
                        res.json({
                            status: 0,
                            msg: '修改失败',
                            err: err
                        });
                    } else {
                        res.json({
                            status: 1,
                            msg: '修改成功',
                        });
                    }
                })
            } else {
                res.json({
                    status: 0,
                    msg: '当前密码错误',
                });
            }
        }
    });
});

/*修改邮箱*/
accountRouter.post('/username/update', function (req, res) {
    console.log("修改邮箱");
    userModel.findOne({_id: req.body.userid}, function (err, docs) {
        if (err) {
            console.error(err);
            res.json({
                status: 0,
                msg: '修改失败',
                err: err
            });
        } else {
            // console.log(docs);
            if (req.body.oldUsername == docs.username) {
                userModel.findOne({username: req.body.newUsername}, function (err, docs) {
                    if (err) {
                        console.error(err);
                        res.json({
                            status: 0,
                            msg: '修改失败',
                            err: err
                        });
                    } else {
                        if (docs) {
                            res.json({
                                status: 0,
                                msg: '此邮箱已被占用',
                            });
                        } else {
                            userModel.update({_id: req.body.userid}, {username: req.body.newUsername}, function (err, msg) {
                                if (err) {
                                    console.error(err);
                                    res.json({
                                        status: 0,
                                        msg: '修改失败',
                                        err: err
                                    });
                                } else {
                                    res.json({
                                        status: 1,
                                        msg: '修改成功',
                                    });
                                }
                            })
                        }
                    }
                });
            } else {
                res.json({
                    status: 0,
                    msg: '当前邮箱错误',
                });
            }
        }
    });
});

/*获取个人信息*/
accountRouter.get('/user/info', function (req, res) {
    console.log("获取个人信息");
    userInfoModel.findOne(req.query, function (err, docs) {
        if (err) {
            console.error(err);
            res.json({
                status: 0,
                msg: '获取失败',
                err: err
            });
        } else {
            // console.log(docs);
            res.json({
                status: 1,
                msg: '获取成功',
                data: docs
            });
        }
    });
});

/*更新个人信息*/
accountRouter.post('/info/update', function (req, res) {
    console.log("更新个人信息");
    userInfoModel.update({userid: req.body.userid}, req.body, function (err, msg) {
        if (err) {
            console.error(err);
            res.json({
                status: 0,
                msg: '更新失败',
                err: err
            });
        } else {
            console.log(msg);
            res.json({
                status: 1,
                msg: '更新成功'
            });
        }
    })
});

/*新闻通讯*/
accountRouter.post('/user/follow', function (req, res) {
    console.log("新闻通讯");
    userInfoModel.update({userid: req.body.userid}, {follow: req.body.follow}, function (err, msg) {
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
module.exports = accountRouter;