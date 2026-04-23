const express = require("express");
const router = express.Router();

const { 
    obtenerEmpleados, 
    obtenerEmpleadoPorId,
    actualizarEmpleado,
    mostrarFormularioActualizar,
    listarEmpleados,
    eliminarEmpleado
} = require("../controllers/empleadosController");

router.get("/", obtenerEmpleados);
router.get("/listado", listarEmpleados);
router.get("/actualizar/:id", mostrarFormularioActualizar);
router.put("/:id", actualizarEmpleado);
router.delete("/:id", eliminarEmpleado);
router.get("/listado", listarEmpleados);
router.get("/:id", obtenerEmpleadoPorId);

module.exports = router; 