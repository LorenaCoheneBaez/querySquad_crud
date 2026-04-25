const express = require("express");
const router = express.Router();

const {
    listarNovedades,
    crearNovedad
} = require("../controllers/novedadesController");

// GET: listado (vista)
router.get("/", listarNovedades);

// POST: crear
router.post("/", crearNovedad);

module.exports = router;