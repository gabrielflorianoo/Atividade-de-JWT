var express = require("express");
var jwt = require("jsonwebtoken");
var Movie = require("../models/Movies");
var MovieValidator = require("../validators/MovieValidator");
var router = express.Router();

router.get("/", function (req, res, next) {
	if (Movie.list().length == 0) {
		res.json({
			status: true,
			message: "Ainda não foram adicionados filmes a lista",
		});
	}

	res.json({ status: true, list: Movie.list() });
});

router.get("/:id", MovieValidator.validateId, function (req, res) {
	let obj = Movie.getElementById(req.params.id);
	if (!obj) {
		return res.json({ status: false, msg: "Filmes não encontrado" });
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
	MovieValidator.validateMovie,
	function (req, res) {
		console.log("YO");
		res.json({ status: true, movie: Movie.new(req.body) });
	}
);

router.put(
	"/:id",
	validateToken,
	MovieValidator.validateId,
	MovieValidator.validateMovie,
	function (req, res) {
		let obj = Movie.update(
			req.params.id,
			req.body.name,
			req.body.genres,
			req.body.rating
		);
		if (!obj) {
			return res.json({
				status: false,
				msg: "Falha ao alterar o filme",
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
				msg: "Falha ao excluir o filme da lista",
			});
		}

		res.json({ status: true });
	}
);

module.exports = router;
