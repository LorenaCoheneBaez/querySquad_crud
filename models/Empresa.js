class Empresa {
    constructor(id, nombre, cuit, rubro, emailContacto, telefono, direccion, personaContacto) {
        this.id = id;
        this.nombre = nombre;
        this.cuit = cuit;
        this.rubro = rubro;
        this.emailContacto = emailContacto;
        this.telefono = telefono;
        this.direccion = direccion;
        this.personaContacto = personaContacto;
        this.fechaAlta = new Date().toISOString(); 
        this.activo = true; // por defecto activo
}
}
module.exports = Empresa;