var express = require("express");
var jwt = require("jsonwebtoken");
var Movie = require("../model/Movies");
var MovieValidator = require("../validators/MovieValidator");
var router = express.Router();

router.get("/", function (req, res, next) {
	if (Movie.list().length == 0) {
		Movie.new("Tarefa 1");
		Movie.new("Tarefa 2");
	}

	res.json({ status: true, list: Movie.list() });
});

router.get("/:id", MovieValidator.validateId, function (req, res) {
	let obj = Movie.getElementById(req.params.id);
	if (!obj) {
		return res.json({ status: false, msg: "Tarefa não encontrada" });
	}

	return res.json({ status: true, movie: obj });
});

function validateToken(req, res, next) {
	let token_full = req.headers["authorization"];
	if (!token_full) token_full = "";
	let token = token_full.split(": ")[1];

	jwt.verify(token, "#Abcasdfqwr", (err, payload) => {
		if (err) {
			res.status(403).json({
				status: false,
				msg: "Acesso negado - Token invalido",
			});
			return;
		}
		req.user = payload.user;
		next();
	});
}

router.post(
	"/",
	validateToken,
	MovieValidator.validateNome,
	function (req, res) {
		res.json({ status: true, movie: Movie.new(req.body.nome) });
	}
);

router.put(
	"/:id",
	validateToken,
	MovieValidator.validateId,
	MovieValidator.validateNome,
	function (req, res) {
		let obj = Movie.update(req.params.id, req.body.nome);
		if (!obj) {
			return res.json({
				status: false,
				msg: "Falha ao alterar a tarefa",
			});
		}

		res.json({ status: true, movie: obj });
	}
);

router.delete(
	"/:id",
	validateToken,
	MovieValidator.validateId,
	function (req, res) {
		if (!Movie.delete(req.params.id)) {
			return res.json({
				status: false,
				msg: "Falha ao excluir a tarefa",
			});
		}

		res.json({ status: true });
	}
);

module.exports = router;
