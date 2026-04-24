const express = require("express");
const router = express.Router();

const { 
    obtenerEmpleados, 
    obtenerEmpleadoPorId,
    actualizarEmpleado,
    mostrarFormularioActualizar,
    listarEmpleados,
    eliminarEmpleado,
    crearEmpleado
} = require("../controllers/empleadosController");

// GET: Listar empleados
router.get("/", listarEmpleados);
// GET: Form nuevo empleado
router.get("/nuevo", (req, res) => {
    const empresas = require("../data/empresas.json");
    res.render("nuevo-empleado", { empresas });
});
// GET: Listar empleados (API)
router.get("/api", obtenerEmpleados);
// GET: Obtener empleado por ID (API)
router.get("/api/:id", obtenerEmpleadoPorId);
// GET: Form actualizar empleado
router.get("/actualizar/:id", mostrarFormularioActualizar);
// PUT: Actualizar empleado
router.put("/:id", actualizarEmpleado);
// DELETE: Eliminar empleado
router.delete("/:id", eliminarEmpleado);
// GET: Obtener empleado por ID (API)
router.get("/:id", obtenerEmpleadoPorId);
// POST: Crear nuevo empleado
router.post("/", crearEmpleado);

module.exports = router;
