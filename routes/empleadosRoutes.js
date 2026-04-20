const express = require("express");
const router = express.Router();

const { 
    obtenerEmpleados, 
    obtenerEmpleadoPorId,
    actualizarEmpleado,
    mostrarFormularioActualizar
} = require("../controllers/empleadosController");

router.get("/", obtenerEmpleados);
router.get("/actualizar/:id", mostrarFormularioActualizar);
router.put("/:id", actualizarEmpleado);
router.get("/:id", obtenerEmpleadoPorId);

module.exports = router; 