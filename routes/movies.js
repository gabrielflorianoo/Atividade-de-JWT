var express = require("express");
var jwt = require("jsonwebtoken");
var Movie = require("../models/Movies");
var MovieValidator = require("../validators/MovieValidator");
var router = express.Router();

router.get("/", function (req, res, next) {
    try {
        const movies = Movie.list();
        if (movies.length === 0) {
            return res.json({
                status: true,
                message: "Ainda não foram adicionados filmes a lista",
            });
        }

        res.json({ status: true, list: movies });
    } catch (error) {
        next(error);
    }
});

router.get("/:id", MovieValidator.validateId, function (req, res, next) {
    try {
        let obj = Movie.getElementById(req.params.id);
        if (!obj) {
            return res.json({ status: false, msg: "Filmes não encontrado" });
        }

        res.json({ status: true, movie: obj });
    } catch (error) {
        next(error);
    }
});

function validateToken(req, res, next) {
    let token_full = req.headers["authorization"];
    if (!token_full) token_full = "";
    let token = token_full.split(": ")[1];

    jwt.verify(token, "#Abcasdfqwr", (err, payload) => {
        if (err) {
            return res.status(403).json({
                status: false,
                msg: "Acesso negado - Token invalido",
            });
        }
        req.user = payload.user;
        next();
    });
}

router.post(
    "/",
    validateToken,
    MovieValidator.validateMovie,
    function (req, res, next) {
        try {
            const movie = Movie.new(req.body);
            if (!movie) {
                return res.status(400).json({ status: false, msg: "Erro ao criar o filme" });
            }

            res.json({ status: true, movie });
        } catch (error) {
            next(error);
        }
    }
);

router.put(
    "/:id",
    validateToken,
    MovieValidator.validateId,
    MovieValidator.validateMovie,
    function (req, res, next) {
        try {
            let obj = Movie.update(
                req.params.id,
                req.body.name,
                req.body.genres,
                req.body.rating
            );
            if (!obj) {
                return res.status(400).json({ status: false, msg: "Falha ao alterar o filme" });
            }

            res.json({ status: true, movie: obj });
        } catch (error) {
            next(error);
        }
    }
);

router.delete(
    "/:id",
    validateToken,
    MovieValidator.validateId,
    function (req, res, next) {
        try {
            if (!Movie.delete(req.params.id)) {
                return res.status(400).json({ status: false, msg: "Falha ao excluir o filme da lista" });
            }

            res.json({ status: true });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
