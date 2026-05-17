const validarEmpresa = (req, res, next) => {

    const { nombre, cuit } = req.body;

    if (!nombre || !cuit) {

        return res.status(400).json({
            mensaje: "Nombre y CUIT son obligatorios"
        });

    }

    next();

};

module.exports = validarEmpresa;