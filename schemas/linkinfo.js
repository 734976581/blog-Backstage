/**
 * Created by zhao on 2017/8/12.
 */
var mongoose = require('mongoose');

// 文章的表结构
module.exports = new mongoose.Schema({
    link: {
        type: String,
        default: '',
    },
    name: {
        type: String,
        default: '',
    }
});