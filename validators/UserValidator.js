const Joi = require("joi");

const UserSchema = Joi.object({
	id: Joi.number().integer().greater(0),
	username: Joi.string().min(3).max(30).required(),
	password: Joi.string().min(3).max(30).required(),
});

module.exports = {
	validateUser: function (req, res, next) {
		const { error, value } = UserSchema.validate(req.body);
		if (error) {
			return res.json({ status: false, msg: "Dados incompletos" });
		}
		req.body = value;
		return next();
	},
};
