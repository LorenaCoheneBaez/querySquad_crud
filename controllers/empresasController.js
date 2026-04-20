const fs = require("fs");
const path = require("path");
const Empresa = require("../models/Empresa");

const rutaArchivo = path.join(__dirname, "../data/empresas.json");

const leerEmpresas = () => {
    const data = fs.readFileSync(rutaArchivo, "utf-8");
    return JSON.parse(data);
};

const guardarEmpresas = (empresas) => {
    fs.writeFileSync(rutaArchivo, JSON.stringify(empresas, null, 2));
};

// POST: Crear empresa 
const crearEmpresa = (req, res) => {
    const empresas = leerEmpresas();
    const { nombre, cuit, rubro, emailContacto, telefono, direccion, personaContacto } = req.body;

    //validaciones y errores
    if (!nombre || !cuit || !rubro || !emailContacto || !telefono || !direccion || !personaContacto) {
        return res.status(400).json({ 
            mensaje: "Error al crear: Por favor complete todos los campos requeridos." 
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailContacto)) {
        return res.status(400).json({ 
            mensaje: "Error al crear: El formato del email no es válido." 
        });
    }
    const cuitRegex = /^\d{2}-\d{8}-\d{1}$/;
    if (!cuitRegex.test(cuit)) {
        return res.status(400).json({ 
            mensaje: "Error al crear: El formato del CUIT debe ser XX-XXXXXXXX-X." 
        });
    }
    const telefonoRegex = /^[0-9+\-\s]+$/;
    if (!telefonoRegex.test(telefono)) {
        return res.status(400).json({ 
            mensaje: "Error al crear: El teléfono solo puede contener números, espacios, guiones o el signo '+'." 
        });
    }

    const cuitExistente = empresas.find(empresa => empresa.cuit === cuit);
    
    if (cuitExistente) {
        return res.status(400).json({ 
            mensaje: "Error al crear: Ya existe una empresa con ese CUIT." 
        });
    }

    const id = Date.now(); 
    const nuevaEmpresa = new Empresa(id, nombre, cuit, rubro, emailContacto, telefono, direccion, personaContacto);

    empresas.push(nuevaEmpresa);
    guardarEmpresas(empresas);

   res.status(201).json({
        mensaje: "Empresa creada exitosamente",
        empresa: nuevaEmpresa
    });
};

// GET: Mostrar el formulario
const mostrarFormularioNuevaEmpresa = (req, res) => {
    res.render("nueva-empresa"); 
};

//GET: Listado de empresas

const listarTodasEmpresas = (req, res) => {
    const empresas = leerEmpresas();
    res.render("listado-empresas", { empresas });
};

//GET: Listado de empresas activas

const listarEmpresasActivas = (req, res) => {
    const empresas = leerEmpresas();
    const empresasActivas = empresas.filter(empresa => empresa.activo);
    res.render("listado-empresas-activas", { empresas: empresasActivas });
}

//GET: Listado de empresas inactivas

const listarEmpresasInactivas = (req, res) => {
    const empresas = leerEmpresas();
    const empresasInactivas = empresas.filter(empresa => !empresa.activo);
    res.render("listado-empresas-inactivas", { empresas: empresasInactivas });
}

module.exports = {
    crearEmpresa,
    mostrarFormularioNuevaEmpresa,
    listarTodasEmpresas,
    listarEmpresasActivas,
    listarEmpresasInactivas
};