
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const path = require("path"); //on utilise path car ca s'adapte a tuot les systeme d'expl:oitation
const app = express();
const PORT = 3005;


// app.set("view engine", "hbs"); // config notre moteur de template
// app.set("views", path.join(__dirname, "views"));
const prisma = new PrismaClient();


app.get("/", async (req, res) => {
    //res.render("index");
    res.send();
});

app.listen(PORT, () => {
    console.log(`Ca marche sur le port ${PORT}`);
});
