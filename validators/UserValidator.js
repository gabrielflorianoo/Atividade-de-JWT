const Joi = require("joi");

const MovieSchema = Joi.object({
	id: Joi.number().integer().greater(0),
	name: Joi.string().min(3).max(30).required(),
	genres: Joi.array().items(Joi.string().min(3)).required(),
	rating: Joi.number().less(10).not().negative().required(),
}).with("id", "name", "genres", "rating");
