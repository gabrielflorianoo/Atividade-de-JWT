var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var UserValidator = require("../validators/UserValidator");

var users = [];

router.get("/login", function (req, res, next) {
	res.render("login");
});

router.get("/registrar", function (req, res, next) {
	res.render("register");
});

router.post(
	"/registrar",
	UserValidator.validateUser,
	function (req, res, next) {
		const { username, password } = req.body;

		let findUser = users.find((user) => user.username == username);
		if (findUser) {
			res.status(407).send("Usuário já existente");
		}

		users.push({
			username,
			password,
		});

		let token = jwt.sign({ user: username }, "#Abcasdfqwr", {
			expiresIn: "20 min",
		});
		res.json({ status: true, token: token });
	}
);

router.post("/logar", UserValidator.validateUser, function (req, res, next) {
	const { username, password } = req.body;

	let findUser = users.find(
		(user) => user.username == username && user.password == password
	);
	if (findUser) {
		//Realizar o login - Gerar o token
		let token = jwt.sign({ user: username }, "#Abcasdfqwr", {
			expiresIn: "20 min",
		});
		res.json({ status: true, token: token });
	} else {
		res.status(403).json({ status: false, msg: "Usuario/Senha invalidos" });
	}
});

module.exports = router;
