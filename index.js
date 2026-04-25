const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const app = express();
const PORT = 3000;

const empresasRoutes = require("./routes/empresasRoutes");
const empleadosRoutes = require("./routes/empleadosRoutes");
const novedadesRoutes = require("./routes/novedadesRoutes");

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Para no tener error con PUT
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        return req.body._method;
    }
}));

app.use("/empresas", empresasRoutes);
app.use("/empleados", empleadosRoutes);
app.use("/novedades", novedadesRoutes);
app.get('/', (req, res) => {
    res.render('login');
});
app.listen(PORT, () => {
    console.log("Servidor corriendo en el puerto " + PORT);
});