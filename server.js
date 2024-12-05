
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const path = require("path"); //on utilise path car ca s'adapte a tuot les systeme d'expl:oitation
const app = express();
const PORT = 3005;

// config notre moteur de template
app.set("view engine", "hbs"); 
app.set("views", path.join(__dirname, "views"));
const prisma = new PrismaClient();

//page d'accueil
app.get("/", async (req, res) => {
    res.render("accueil");
    createTestDb();
    //res.send();
});

//on va dans la route /jeux qu'on a creer en tant que href et on recup l'index du doss JEUX
app.get("/Jeux", async (req,res)=> { 
    const jeu = await prisma.Game.findMany(); // on va prendre tout les jeux de la table Game
    const genre = await prisma.Genre.findMany(); 
    res.render("Jeux/index", {jeu, genre,}); //on les renvois à index
})


//quand on clique sur un jeu, on va sur son detail 
app.get("/Jeux/:titre/details", async (req,res)=> {

    //je peux pas parce que titre est pas unique... jvais essayer ID 
    const {titre} = req.params;
    const jeu = await prisma.Game.findUnique({where: {titre},});
    res.render("Jeux/DetailsJeux", {jeu});
})

//on va dans la route /genre et on recup l'index du doss GENRE
app.get("/Genres", async (req,res)=> { 
    const genre = await prisma.Genre.findMany();
    res.render("Genres/index");
})

 //on va dans la route /editeurs et on recup l'index du doss ED
app.get("/Editeurs", async (req,res)=> {
    res.render("Editeurs/index");
})

app.listen(PORT, () => {
    console.log(`Ca marche sur le port ${PORT}`);
});


//test de base de donnée
//refaire car BORDEL
async function createTestDb()
{
    const jeu = {
        titre: "trr",
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

    const ed = await prisma.Editeur.create({
        data: editeur, 
    });
    const gre = await prisma.Genre.create({
        data: genre, 
    });

    const je = await prisma.Game.create({
        data: jeu, 
    });


//test d'une deuxieme donnee pour voir si quand on clique les details sont bien affiliés au bon jeu
    const deux= {
        titre: "NOP",
        description: "NOP",
        releaseDate: new Date(2019,12,5),
        genreId: 2,
        editeurId: 2
    };

    const genre2 = {
        nom: "MMO"

    };

    const editeur2 = {
        nom: "NOOOO"

    };

    const ed2 = await prisma.Editeur.create({
        data: editeur2, 
    });
    const gre2 = await prisma.Genre.create({
        data: genre2, 
    });

    const je2 = await prisma.Game.create({
        data: deux, 
    });

}
