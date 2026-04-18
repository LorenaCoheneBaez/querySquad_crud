const express = require("express");
const router = express.Router();

const { 
    obtenerEmpleados, 
    obtenerEmpleadoPorId 
} = require("../controllers/empleadosController");

router.get("/", obtenerEmpleados);
router.get("/:id", obtenerEmpleadoPorId);

module.exports = router;