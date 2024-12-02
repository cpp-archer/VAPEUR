
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const path = require("path"); //on utilise path car ca s'adapte a tuot les systeme d'expl:oitation
const app = express();
const PORT = 3005;


app.set("view engine", "hbs"); // config notre moteur de template
app.set("views", path.join(__dirname, "views"));
const prisma = new PrismaClient();


app.get("/", async (req, res) => {
    res.render("accueil");
    //res.send();
});

app.get("/Jeux", async (req,res)=> { //on va dans la route /jeux qu'on a creer en tant que href et on recup l'index du doss JEUX
    res.render("Jeux/index");
})

app.get("/Genres", async (req,res)=> { //on va dans la route /genre et on recup l'index du doss GENRE
    res.render("Genres/index");
})

app.get("/Editeurs", async (req,res)=> { //on va dans la route /editeurs et on recup l'index du doss ED
    res.render("Editeurs/index");
})

app.listen(PORT, () => {
    console.log(`Ca marche sur le port ${PORT}`);
});
