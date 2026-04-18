const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

const empresasRoutes = require("./routes/empresasRoutes");

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/empresas", empresasRoutes);
app.listen(PORT, () => {
    console.log("Servidor corriendo en el puerto " + PORT);
});