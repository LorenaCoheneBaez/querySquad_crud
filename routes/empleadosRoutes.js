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

router.get("/", listarEmpleados);


router.get("/api", obtenerEmpleados);

router.get("/actualizar/:id", mostrarFormularioActualizar);

router.put("/:id", actualizarEmpleado);


router.delete("/:id", eliminarEmpleado);

router.get("/:id", obtenerEmpleadoPorId);

module.exports = router;