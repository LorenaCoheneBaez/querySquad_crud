const fs = require("fs");
const path = require("path");
const Novedad = require("../models/Novedad");

const rutaNovedades = path.join(__dirname, "../data/novedades.json");
const rutaEmpleados = path.join(__dirname, "../data/empleados.json");

const leerDatos = (ruta) => JSON.parse(fs.readFileSync(ruta, "utf-8"));

const guardarNovedades = (novedades) => {
    fs.writeFileSync(rutaNovedades, JSON.stringify(novedades, null, 2));
};

// GET: Listar novedades (vista)
const listarNovedades = (req, res) => {
    const novedades = leerDatos(rutaNovedades);
    const empleados = leerDatos(rutaEmpleados);

    const novedadesConEmpleado = novedades.map(nov => {
        const empleado = empleados.find(e => e.id === nov.empleadoId);
        return {
            ...nov,
            nombreEmpleado: empleado ? `${empleado.nombre} ${empleado.apellido}` : "Empleado no encontrado"
        };
    });

    res.render("listado-novedades", {
        novedades: novedadesConEmpleado,
        empleados,
        query: req.query
    });
};

// POST: Crear novedad (te queda base para crecer el módulo)
const crearNovedad = (req, res) => {
    const novedades = leerDatos(rutaNovedades);
    const empleados = leerDatos(rutaEmpleados);

    const { empleadoId, tipo, descripcion, fecha } = req.body;

    if (!empleadoId || !tipo || !descripcion || !fecha) {
        return res.status(400).json({
            mensaje: "Debe completar empleadoId, tipo, descripcion y fecha"
        });
    }

    const empleadoExiste = empleados.find(e => e.id === parseInt(empleadoId));
    if (!empleadoExiste) {
        return res.status(404).json({
            mensaje: "Empleado no encontrado"
        });
    }

    const nuevaNovedad = new Novedad(
        novedades.length ? novedades[novedades.length - 1].id + 1 : 1,
        empleadoId,
        tipo,
        descripcion,
        fecha
    );

    novedades.push(nuevaNovedad);
    guardarNovedades(novedades);

    return res.redirect("/novedades?msg=created");
};

module.exports = {
    listarNovedades,
    crearNovedad
};