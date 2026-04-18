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

    if (!nombre || !cuit || !rubro || !emailContacto || !telefono || !direccion || !personaContacto) {
        return res.status(400).json({ 
            mensaje: "Error al crear: Por favor complete todos los campos requeridos." 
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

module.exports = {
    crearEmpresa
};