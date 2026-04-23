const fs = require("fs");
const path = require("path");
const Empresa = require("../models/Empresa");

const rutaArchivo = path.join(__dirname, "../data/empresas.json");
const rutaEmpleados = path.join(__dirname, "../data/empleados.json");

const leerEmpresas = () => {
    const data = fs.readFileSync(rutaArchivo, "utf-8");
    return JSON.parse(data);
};

const guardarEmpresas = (empresas) => {
    fs.writeFileSync(rutaArchivo, JSON.stringify(empresas, null, 2));
};

const leerEmpleados = () => {
    const data = fs.readFileSync(rutaEmpleados, "utf-8");
    return JSON.parse(data);
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
    
    // ✅ CORRECTO
    res.redirect("/empresas?msg=created");

    // ❌ NO USAR (lo dejo comentado como pediste)
    // res.status(201).json({
    //     mensaje: "Empresa creada exitosamente",
    //     empresa: nuevaEmpresa
    // });
};

// GET: Mostrar el formulario
const mostrarFormularioNuevaEmpresa = (req, res) => {
    res.render("nueva-empresa"); 
};

// GET: Listado de empresas
const listarTodasEmpresas = (req, res) => {
    const empresas = leerEmpresas();

    // ✅ IMPORTANTE: pasar query
    res.render("listado-empresas", { empresas, query: req.query });

    // ❌ antes estaba así
    // res.render("listado-empresas", { empresas });
};

// GET: Listado de empresas activas
const listarEmpresasActivas = (req, res) => {
    const empresas = leerEmpresas();
    const empresasActivas = empresas.filter(empresa => empresa.activo);

    // ✅ agregado query
    res.render("listado-empresas-activas", { 
        empresas: empresasActivas, 
        query: req.query 
    });
};

// GET: Listado de empresas inactivas
const listarEmpresasInactivas = (req, res) => {
    const empresas = leerEmpresas();
    const empresasInactivas = empresas.filter(empresa => !empresa.activo);

    // ✅ agregado query
    res.render("listado-empresas-inactivas", { 
        empresas: empresasInactivas, 
        query: req.query 
    });
};

// Cambiar estado de empresa
const cambiarEstadoEmpresa = (req, res) => {
    const empresas = leerEmpresas();
    const idParam = parseInt(req.params.id);

    const empresaIndex = empresas.findIndex(e => e.id === idParam);

    if (empresaIndex === -1) {
        return res.status(404).json({
            mensaje: "Empresa no encontrada"
        });
    }

    empresas[empresaIndex].activo = !empresas[empresaIndex].activo;
    guardarEmpresas(empresas);

    // ✅ CORRECTO
    res.redirect("/empresas?msg=status");

    // ❌ NO USAR
    // res.json({
    //     mensaje: "Estado actualizado correctamente",
    //     empresa: empresas[empresaIndex]
    // });
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

    if (cuit) {
        const cuitExistente = empresas.find(e => e.cuit === cuit && e.id !== idParam);

        if (cuitExistente) {
            return res.status(400).json({
                mensaje: "Ya existe otra empresa con ese CUIT"
            });
        }

        empresas[empresaIndex].cuit = cuit;
    }

    if (nombre) empresas[empresaIndex].nombre = nombre;
    if (rubro) empresas[empresaIndex].rubro = rubro;
    if (emailContacto) empresas[empresaIndex].emailContacto = emailContacto;
    if (telefono) empresas[empresaIndex].telefono = telefono;
    if (direccion) empresas[empresaIndex].direccion = direccion;
    if (personaContacto) empresas[empresaIndex].personaContacto = personaContacto;

    guardarEmpresas(empresas);

    // ✅ CORRECTO
    res.redirect("/empresas?msg=updated");

    // ❌ NO USAR
    // res.json({
    //     mensaje: "Empresa actualizada correctamente",
    //     empresa: empresas[empresaIndex]
    // });
};

// GET: Form editar
const mostrarFormularioEditarEmpresa = (req, res) => {
    const empresas = leerEmpresas();
    const idParam = parseInt(req.params.id);

    const empresa = empresas.find(e => e.id === idParam);

    if (!empresa) {
        return res.status(404).send("Empresa no encontrada");
    }

    res.render("editar-empresa", { empresa });
};

// DELETE: eliminar empresa
const eliminarEmpresa = (req, res) => {
    const empresas = leerEmpresas();
    const empleados = leerEmpleados();
    const idParam = parseInt(req.params.id);

    const empresaIndex = empresas.findIndex(e => e.id === idParam);

    if (empresaIndex === -1) {
        return res.status(404).json({
            mensaje: "Empresa no encontrada"
        });
    }

    const tieneEmpleados = empleados.some(e => e.empresaId === idParam);

    if (tieneEmpleados) {
        return res.status(400).json({
            mensaje: "No se puede eliminar: tiene empleados asociados"
        });
    }

    const nuevasEmpresas = empresas.filter(e => e.id !== idParam);
    guardarEmpresas(nuevasEmpresas);

    // ✅ CORRECTO
    res.redirect("/empresas?msg=deleted");

    // ❌ NO USAR
    // res.json({
    //     mensaje: "Empresa eliminada correctamente"
    // });
};

module.exports = {
    crearEmpresa,
    mostrarFormularioNuevaEmpresa,
    listarTodasEmpresas,
    listarEmpresasActivas,
    listarEmpresasInactivas,
    cambiarEstadoEmpresa,
    actualizarEmpresa,
    mostrarFormularioEditarEmpresa,
    eliminarEmpresa
};