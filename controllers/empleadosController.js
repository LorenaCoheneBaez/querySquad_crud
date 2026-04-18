const fs = require("fs");
const path = require("path");

const rutaEmpleados = path.join(__dirname, "../data/empleados.json");
const rutaEmpresas = path.join(__dirname, "../data/empresas.json");

const leerDatos = (ruta) => JSON.parse(fs.readFileSync(ruta, "utf-8"));

//Obtener TODOS los empleados
const obtenerEmpleados = (req, res) => {
    const empleados = leerDatos(rutaEmpleados).filter(e => e.activo);
    const empresas = leerDatos(rutaEmpresas);

    const empleadosConEmpresa = empleados.map(emp => {
        const empresaAsociada = empresas.find(empresa => empresa.id === emp.empresaId);
        emp.nombreEmpresa = empresaAsociada ? empresaAsociada.nombre : "Empresa no encontrada";
        return emp;
    });

    res.json(empleadosConEmpresa);
};

// Obtener UN SOLO empleado por ID 
const obtenerEmpleadoPorId = (req, res) => {
    const empleados = leerDatos(rutaEmpleados);
    const empresas = leerDatos(rutaEmpresas);
    const idParam = parseInt(req.params.id);

    const empleado = empleados.find(e => e.id === idParam && e.activo);
    if (!empleado) {
        return res.status(404).json({ mensaje: "Empleado no encontrado o inactivo" });
    }
    const empresaAsociada = empresas.find(empresa => empresa.id === empleado.empresaId);
    empleado.nombreEmpresa = empresaAsociada ? empresaAsociada.nombre : "Empresa no encontrada";
    res.json(empleado);
};

module.exports = {
    obtenerEmpleados,
    obtenerEmpleadoPorId
};