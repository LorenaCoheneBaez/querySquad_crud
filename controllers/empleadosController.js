const fs = require("fs");
const path = require("path");

const rutaEmpleados = path.join(__dirname, "../data/empleados.json");
const rutaEmpresas = path.join(__dirname, "../data/empresas.json");

const leerDatos = (ruta) => JSON.parse(fs.readFileSync(ruta, "utf-8"));

const guardarDatos = (ruta, datos) => {
    fs.writeFileSync(ruta, JSON.stringify(datos, null, 2));
};

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

// GET: Mostrar formulario de actualización
const mostrarFormularioActualizar = (req, res) => {
    const idParam = parseInt(req.params.id);
    const empleados = leerDatos(rutaEmpleados);
    const empresas = leerDatos(rutaEmpresas);

    const empleado = empleados.find(e => e.id === idParam);

    if (empleado) {
        console.log("Empleado encontrado:", empleado);
        return res.render("actualizar-empleado", { empleado, empresas });
    }

    console.log("Empleado no encontrado con ID:", idParam);
    res.render("actualizar-empleado", { error: "Empleado no encontrado", empresas });
};

// PUT: Actualizar empleado por ID
const actualizarEmpleado = (req, res) => {
    const empleados = leerDatos(rutaEmpleados);
    const empresas = leerDatos(rutaEmpresas);
    const idParam = parseInt(req.params.id);
    const { nombre, apellido, dni, empresaId } = req.body;

    // Verificar si existe el empleado
    const empleadoIndex = empleados.findIndex(e => e.id === idParam);
    if (empleadoIndex === -1) {
        return res.render("actualizar-empleado", { error: "Empleado no encontrado", empresas });
    }

    // Validar algun campo
    if (!nombre && !apellido && !dni && empresaId === undefined) {
        return res.status(400).json({
            mensaje: "Debe enviar al menos un campo para actualizar"
        });
    }

    // Validar DNI único
    const dniExistente = empleados.find(e => e.dni === dni && e.id !== idParam);
    if (dniExistente) {
        const empleado = empleados[empleadoIndex];
        return res.render("actualizar-empleado", {
            empleado,
            empresas,
            error: "El DNI ya está asignado a otro empleado"
        });
    }

    // Verificar si la empresa existe
    if (empresaId) {
        const empresaExiste = empresas.find(emp => emp.id === parseInt(empresaId));
        if (!empresaExiste) {
            const empleado = empleados[empleadoIndex];
            return res.render("actualizar-empleado", {
                empleado,
                empresas,
                error: "Empresa no encontrada"
            });
        }
    }

    // Actualizar datos del empleado
    if (nombre) empleados[empleadoIndex].nombre = nombre;
    if (apellido) empleados[empleadoIndex].apellido = apellido;
    if (dni) empleados[empleadoIndex].dni = dni;
    if (empresaId) empleados[empleadoIndex].empresaId = parseInt(empresaId);

    // Guardar cambios
    guardarDatos(rutaEmpleados, empleados);

    // Redirigir al listado
    res.redirect("/empleados");
};

const eliminarEmpleado = (req, res) => {
    const empleados = leerDatos(rutaEmpleados);
    const idParam = parseInt(req.params.id);

    const existe = empleados.find(e => e.id === idParam);

    if (!existe) {
        return res.status(404).json({
            mensaje: "Empleado no encontrado"
        });
    }

    const nuevosEmpleados = empleados.filter(e => e.id !== idParam);

    guardarDatos(rutaEmpleados, nuevosEmpleados);

    res.redirect("/empleados");
};

const listarEmpleados = (req, res) => {
    const empleados = leerDatos(rutaEmpleados);
    const empresas = leerDatos(rutaEmpresas);

    const empleadosConEmpresa = empleados.map(emp => {
        const empresa = empresas.find(e => e.id === emp.empresaId);
        return {
            ...emp,
            nombreEmpresa: empresa ? empresa.nombre : "Sin empresa"
        };
    });

    res.render("listado-empleados", { empleados: empleadosConEmpresa });
};


module.exports = {
    obtenerEmpleados,
    obtenerEmpleadoPorId,
    actualizarEmpleado,
    mostrarFormularioActualizar,
    eliminarEmpleado,
    listarEmpleados
};