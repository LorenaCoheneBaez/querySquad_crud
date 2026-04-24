const express = require("express");
const router = express.Router();

const { 
    crearEmpresa, 
    mostrarFormularioNuevaEmpresa, 
    listarTodasEmpresas, 
    listarEmpresasActivas, 
    listarEmpresasInactivas,
    cambiarEstadoEmpresa,
    actualizarEmpresa,
    mostrarFormularioEditarEmpresa,
    eliminarEmpresa
} 
= require("../controllers/empresasController");

router.get("/nueva", (req, res) => {
    res.render("nueva-empresa");
});
// //ver fomrnulario nueva empresa 
// router.get("/nueva", mostrarFormularioNuevaEmpresa);
//POST: Alta
router.post("/", crearEmpresa);
//GET: Listado de empresas activas
router.get("/listado-empresas-activas", listarEmpresasActivas);  
//GET: Listado de empresas inactivas
router.get("/listado-empresas-inactivas", listarEmpresasInactivas);
//GET: Listado de todas las empresas
router.get("/", listarTodasEmpresas);
// PUT: Cambiar estado de empresa (activar/desactivar)
router.put("/:id/estado", cambiarEstadoEmpresa);
// PUT: Actualizar empresa
router.put("/:id", actualizarEmpresa);
// GET: Mostrar formulario de actualización de empresa          
router.get("/:id/editar", mostrarFormularioEditarEmpresa);
// DELETE: Eliminar empresa (borrado lógico)
router.delete("/:id", eliminarEmpresa);
module.exports = router;
