class Novedad {
    constructor(id, empleadoId, tipo, descripcion, fecha) {
        this.id = id;
        this.empleadoId = parseInt(empleadoId);
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.fecha = fecha;
        this.activo = true;
    }
}

module.exports = Novedad;