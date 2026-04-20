const express = require("express");
const router = express.Router();

const { 
    crearEmpresa, 
    mostrarFormularioNuevaEmpresa, listarTodasEmpresas, listarEmpresasActivas, listarEmpresasInactivas} 
= require("../controllers/empresasController");

//ver fomrnulario nueva empresa 
router.get("/nueva", mostrarFormularioNuevaEmpresa);
//POST: Alta
router.post("/", crearEmpresa);
//GET: Listado de empresas activas
router.get("/listado-empresas-activas", listarEmpresasActivas);  
//GET: Listado de empresas inactivas
router.get("/listado-empresas-inactivas", listarEmpresasInactivas);
//GET: Listado de todas las empresas
router.get("/", listarTodasEmpresas);
module.exports = router;