const express = require("express");
const router = express.Router();

const { crearEmpresa } = require("../controllers/empresasController");

//POST: Alta
router.post("/", crearEmpresa);

module.exports = router;