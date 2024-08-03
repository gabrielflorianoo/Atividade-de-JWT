const Joi = require("joi");

const MovieSchema = Joi.object({
	id: Joi.number().integer().greater(0),
	name: Joi.string().min(3).max(30).required(),
	genres: Joi.array().items(Joi.string().min(3)).required(),
	rating: Joi.number().less(10).not().negative().required(),
});

module.exports = {
	validateId: function (req, res, next) {
		const { error, value } = Joi.number()
			.integer()
			.greater(0)
			.validate(req.params.id);

		if (error) {
			return res
				.status(500)
				.json({ status: false, msg: "O código não é válido" });
		}

		req.params.id = value;
		return next();
	},
	validateMovie: function (req, res, next) {
		const { error, value } = MovieSchema.validate(req.body);
		if (error) {
			return res.json({ status: false, msg: "Dados incompletos" });
		}
		req.body = value;
		return next();
	},
};
