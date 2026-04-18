const express = require("express");
const app = express();
const PORT = 3000;

const empresasRoutes = require("./routes/empresasRoutes");

app.use(express.json());
app.use("/empresas", empresasRoutes);

app.listen(PORT, () => {
    console.log("Servidor corriendo en el puerto " + PORT);
});