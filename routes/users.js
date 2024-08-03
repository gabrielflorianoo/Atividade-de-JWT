var express = require("express");
var router = express.Router();

var users = [];

router.get("/", function (req, res, next) {
	
});

router.post("/registrar", function (req, res, next) {
    
});

router.post("/logar", function (req, res, next) {
	const { user, password } = req.body;
	if (user === password) {
		//Realizar o login - Gerar o token
		let token = jwt.sign({ user: user }, "#Abcasdfqwr", {
			expiresIn: "20 min",
		});
		res.json({ status: true, token: token });
	} else {
		res.status(403).json({ status: false, msg: "Usuario/Senha invalidos" });
	}
});

module.exports = router;
