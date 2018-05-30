/**
 * Created by zhao on 2017/8/12.
 */
var mongoose = require('mongoose');
var linkinfoSchema = require('../schemas/linkinfo');

module.exports = mongoose.model('Linkinfo', linkinfoSchema);