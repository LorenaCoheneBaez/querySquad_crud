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

router.get("/", listarEmpleados);

router.get("/nuevo", (req, res) => {
    const empresas = require("../data/empresas.json");
    res.render("nuevo-empleado", { empresas });
});

router.get("/api", obtenerEmpleados);

router.get("/actualizar/:id", mostrarFormularioActualizar);

router.put("/:id", actualizarEmpleado);


router.delete("/:id", eliminarEmpleado);

router.get("/:id", obtenerEmpleadoPorId);





// router.post("/", crearEmpleado);

module.exports = router;