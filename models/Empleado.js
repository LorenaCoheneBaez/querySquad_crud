class Empleado {
    constructor(id, nombre, apellido, dni, empresaId) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.empresaId = parseInt(empresaId);
        this.activo = true; //borrado lógico
    }
}

module.exports = Empleado;