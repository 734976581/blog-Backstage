/**
 * Created by zhao on 2017/8/11.
 */

var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/Content');
var Linkinfo = require('../models/Linkinfo');
// 统一返回格式
var responseData;
router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: '',
    }
    next();
});
/*
 * 用户注册
 *   注册逻辑
 *   1. 用户名是否已经被注册了: 数据库查询
 * */
router.post('/user/register', function (req, res, next) {
    // console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    // 用户名是否已被注册: 数据库查询 Model类的静态方法
    User.findOne({
        username: username,
    }).then(function (userInfo) {
        // console.log(userInfo);
        if (userInfo) {
            // 如果存在 表示数据库中有该记录
            responseData.code = 1;
            responseData.message = '用户名已被注册';
            res.json(responseData);
            return;
        }
        // 保存用户的信息到数据库中
        var user = new User({
            username: username,
            password: password,
        })

        return user.save(); // 该save方法返回的是一个promise对象
    }).then(function (newUserInfo) {
        // console.log(newUserInfo);
        responseData.message = '注册成功';
        res.json(responseData);
    })
})

router.post('/user/login', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    // 查询数据库中用户名和密码是否存在且对应, 如是, 则登陆成功
    User.findOne({
        username: username,
        password: password,
    }).then(function (userInfo) {
        if (!userInfo) {
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        }
        // 用户名和密码是正确的
        responseData.message = '登录成功';
        responseData.userInfo = {
            _id: userInfo.id,
            username: userInfo.username,
            isAdmin: userInfo.isAdmin,
        }
        console.log(responseData.userInfo)
        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo.id,
            username: userInfo.username,
        }), {httpOnly: false})
        res.json(responseData);
        return;
    })
})

router.get('/user/logout', function (req, res, next) {
    req.cookies.set('userInfo', null);// 清除cookies
    responseData.message = '退出成功!';
    res.json(responseData);
})


/**
 * 相关信息填写
 */
router.post('/setting', function(req, res, next){
    var name = req.body.name;
    var link = req.body.link;
    new Linkinfo({
        name: name,
        link: link
    }).save().then(function (rs) {
            responseData.code = 0;
            responseData.message = '保存信息成功';
            res.json(responseData);
        })
})


router.get('/setting', function(req, res, next){
    Linkinfo.find()
        .then(function(linkinfo) {
            res.json({
                linkinfo: linkinfo
            })
        })
})

router.post('/setting/delete', function(req, res, next){
    var id = req.body.id;
    Linkinfo.remove({
        _id: id,
    }).then(function () {
        responseData.code = 0;
        responseData.message = '删除链接成功';
        res.json(responseData);
    })
})

module.exports = router;