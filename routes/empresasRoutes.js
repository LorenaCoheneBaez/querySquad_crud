const express = require("express");
const router = express.Router();

const { 
    crearEmpresa, 
    mostrarFormularioNuevaEmpresa } 
= require("../controllers/empresasController");

//ver fomrnulario nueva empresa 
router.get("/nueva", mostrarFormularioNuevaEmpresa);
//POST: Alta
router.post("/", crearEmpresa);

module.exports = router;