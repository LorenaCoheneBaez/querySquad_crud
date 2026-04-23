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

    nuevaEmpresa.activo = true;
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

// Cambiar estado de empresa (activar/desactivar)
const cambiarEstadoEmpresa = (req, res) => {
    const empresas = leerEmpresas();
    const idParam = parseInt(req.params.id);

    const empresaIndex = empresas.findIndex(e => e.id === idParam);

    if (empresaIndex === -1) {
        return res.status(404).json({
            mensaje: "Empresa no encontrada"
        });
    }

    // 🔁 Cambia el estado (true ↔ false)
    empresas[empresaIndex].activo = !empresas[empresaIndex].activo;

    guardarEmpresas(empresas);

    res.json({
        mensaje: "Estado actualizado correctamente",
        empresa: empresas[empresaIndex]
    });
};

// PUT: Actualizar empresa
const actualizarEmpresa = (req, res) => {
    const empresas = leerEmpresas();
    const idParam = parseInt(req.params.id);

    const { nombre, cuit, rubro, emailContacto, telefono, direccion, personaContacto } = req.body;

    const empresaIndex = empresas.findIndex(e => e.id === idParam);

    if (empresaIndex === -1) {
        return res.status(404).json({
            mensaje: "Empresa no encontrada"
        });
    }

    // PUT: Validación de CUIT único (no permitir dos empresas con el mismo identificador).
    if (cuit) {
        const cuitExistente = empresas.find(e => e.cuit === cuit && e.id !== idParam);

        if (cuitExistente) {
            return res.status(400).json({
                mensaje: "Ya existe otra empresa con ese CUIT"
            });
        }

        empresas[empresaIndex].cuit = cuit;
    }

    // Actualizar otros campos
    if (nombre) empresas[empresaIndex].nombre = nombre;
    if (rubro) empresas[empresaIndex].rubro = rubro;
    if (emailContacto) empresas[empresaIndex].emailContacto = emailContacto;
    if (telefono) empresas[empresaIndex].telefono = telefono;
    if (direccion) empresas[empresaIndex].direccion = direccion;
    if (personaContacto) empresas[empresaIndex].personaContacto = personaContacto;

    guardarEmpresas(empresas);

    res.json({
        mensaje: "Empresa actualizada correctamente",
        empresa: empresas[empresaIndex]
    });
};

// GET: Mostrar formulario de edición
const mostrarFormularioEditarEmpresa = (req, res) => {
    const empresas = leerEmpresas();
    const idParam = parseInt(req.params.id);

    const empresa = empresas.find(e => e.id === idParam);

    if (!empresa) {
        return res.status(404).send("Empresa no encontrada");
    }

    res.render("editar-empresa", { empresa });
};


module.exports = {
    crearEmpresa,
    mostrarFormularioNuevaEmpresa,
    listarTodasEmpresas,
    listarEmpresasActivas,
    listarEmpresasInactivas,
    cambiarEstadoEmpresa,
    actualizarEmpresa,
    mostrarFormularioEditarEmpresa
};