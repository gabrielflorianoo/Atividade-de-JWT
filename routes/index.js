var express = require("express");
var Movie = require("../models/Movies");
var MovieSchema = require("../validators/MovieValidator");
const Joi = require("joi");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
	res.render('index');
});

module.exports = router;
