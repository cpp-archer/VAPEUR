
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
    createTestDb();
    //res.send();
});

app.get("/Jeux", async (req,res)=> { //on va dans la route /jeux qu'on a creer en tant que href et on recup l'index du doss JEUX
    const jeu = await prisma.Game.findMany(); // on va prendre tout les jeux de la table Game
    res.render("Jeux/index", {jeu}); //on les renvois à index
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

async function createTestDb()
{
    const jeu = {
        titre: "test",
        description: "test",
        releaseDate: new Date(2018,22,1),
        genreId: 1,
        editeurId: 1
    };

    const genre = {
        nom: "FPS"

    };

    const editeur = {
        nom: "RIOT"

    };

    // const ed = await prisma.Editeur.create({
    //     data: editeur, 
    // });
    // const gre = await prisma.Genre.create({
    //     data: genre, 
    // });

    const je = await prisma.Game.create({
        data: jeu, 
    });
}
