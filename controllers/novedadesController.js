const fs = require("fs");
const path = require("path");
const Novedad = require("../models/Novedad");

const rutaNovedades = path.join(__dirname, "../data/novedades.json");
const rutaEmpleados = path.join(__dirname, "../data/empleados.json");
const rutaEmpresas = path.join(__dirname, "../data/empresas.json");

const leerDatos = (ruta) => JSON.parse(fs.readFileSync(ruta, "utf-8"));

const guardarNovedades = (novedades) => {
    fs.writeFileSync(rutaNovedades, JSON.stringify(novedades, null, 2));
};

// GET: Listar novedades (vista)
const listarNovedades = (req, res) => {
    const novedades = leerDatos(rutaNovedades);
    const empleados = leerDatos(rutaEmpleados);
    const empresas = leerDatos(rutaEmpresas);

    const empleadosConEmpresa = empleados.map((emp) => {
        const empresa = empresas.find((e) => e.id === emp.empresaId);
        return {
            ...emp,
            nombreEmpresa: empresa ? empresa.nombre : "Sin empresa",
        };
    });

    const novedadesConEmpleado = novedades.map((nov) => {
        const empleado = empleados.find((e) => e.id === nov.empleadoId);
        const empresa = empleado
            ? empresas.find((e) => e.id === empleado.empresaId)
            : null;
        return {
            ...nov,
            nombreEmpleado: empleado
                ? `${empleado.nombre} ${empleado.apellido}`
                : "Empleado no encontrado",
            nombreEmpresa: empresa ? empresa.nombre : "Sin empresa",
        };
    });

    const accept = req.get("accept") || "";
    if (accept.includes("application/json")) {
        return res.status(200).json(novedadesConEmpleado);
    }

    res.render("listado-novedades", {
        novedades: novedadesConEmpleado,
        empleados: empleadosConEmpresa,
        query: req.query,
    });
};

// POST: Crear novedad 
const crearNovedad = (req, res) => {
    const novedades = leerDatos(rutaNovedades);
    const empleados = leerDatos(rutaEmpleados);

    const { empleadoId, tipo, descripcion, fecha } = req.body;
    const accept = req.get("accept") || "";
    const quiereJson = accept.includes("application/json");

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

    if (quiereJson) {
        return res.status(201).json({
            mensaje: "Novedad creada correctamente",
            novedad: nuevaNovedad
        });
    }

    return res.redirect("/novedades?msg=created");
};

module.exports = {
    listarNovedades,
    crearNovedad
};