//config
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
    // createTestDb();
    //res.send();
});

//******************************AFFICHAGE DE TOUT LES JEUX GENRE ET EDITEURS ET LEUR ROUTE**************************************************//

//on va dans la route /jeux qu'on a creer en tant que href et on recup l'index du doss JEUX
app.get("/Jeux", async (req,res)=> { 
    const jeu = await prisma.Game.findMany(); // on va prendre tout les jeux de la table Game
    res.render("Jeux/index", {jeu}); //on les renvois à index
})

//on va dans la route /genre qu'on a creer en tant que href et on recup l'index du doss Genres
app.get("/Genres", async (req,res)=> { 
    const genres = await prisma.Genre.findMany(); // on va prendre tout les genres de la table Genre
    res.render("Genres/index", {genres}); //on les renvois à index
})

//on va dans la route /genre qu'on a creer en tant que href et on recup l'index du doss Genres
app.get("/Editeurs", async (req,res)=> { 
    const editeurs = await prisma.Editeur.findMany(); // on va prendre tout les genres de la table Genre
    res.render("Editeurs/index", {editeurs}); //on les renvois à index
})
//*********************************************************************************************************************************//



//*************************AFFICHAGE DES DETAILS JEUX + JEUX AFFILIES AUX GENRE ET EDITEURS**********************************//
//quand on clique sur un jeu, on va sur son detail 
app.get("/Jeux/:titre/details", async (req,res)=> {

    //je peux pas parce que titre est pas unique... jvais essayer ID 
    const jeu = await prisma.Game.findMany({where: {titre: req.params.titre},});
    const genre = await prisma.Genre.findMany({where: {id: jeu[0].genreId}}); //vu que tout les jeux sont dans un tableau
    const editeurs = await prisma.Editeur.findMany({where: {id: jeu[0].editeurId}});
    res.render("Jeux/DetailsJeux", {jeu,genre, editeurs});
})

app.get("/Genres/:id/jdg", async (req,res)=> { //jdg = jeux du genre
    const jeu = await prisma.Game.findMany({where: {genreId: parseInt(req.params.id)}});
    res.render("Genres/index", {jeu});
})

app.get("/Editeurs/:id/jde", async (req,res)=> { //jdg = jeux de l'editeur
    const jeu = await prisma.Game.findMany({where: {editeurId: parseInt(req.params.id)}}); 
    res.render("Editeurs/index", {jeu});
})
//*************************FIN************************************************************************************************//


app.listen(PORT, () => {
    console.log(`Ca marche sur le port ${PORT}`);
});



//creation de 3 jeux pour voir
//test de base de donnée
//refaire car BORDEL
// async function createTestDb()
// {
//     const jeu = {
//         titre: "trr",
//         description: "test",
//         releaseDate: new Date(2018,22,1),
//         genreId: 1,
//         editeurId: 1
//     };

    
//     const genre = {
//         nom: "FPS"

//     };

//     const editeur = {
//         nom: "RIOT"

//     };

//     const ed = await prisma.Editeur.create({
//         data: editeur, 
//     });
//     const gre = await prisma.Genre.create({
//         data: genre, 
//     });

//     const je = await prisma.Game.create({
//         data: jeu, 
//     });


// //test d'une deuxieme donnee pour voir si quand on clique les details sont bien affiliés au bon jeu
//     const deux= {
//         titre: "NOP",
//         description: "NOP",
//         releaseDate: new Date(2019,12,5),
//         genreId: 2,
//         editeurId: 2
//     };

//     const genre2 = {
//         nom: "MMO"

//     };

//     const editeur2 = {
//         nom: "NOOOO"

//     };

//     const ed2 = await prisma.Editeur.create({
//         data: editeur2, 
//     });
//     const gre2 = await prisma.Genre.create({
//         data: genre2, 
//     });

//     const je2 = await prisma.Game.create({
//         data: deux, 
//     });


//      const trois= {
//         titre: "YES",
//         description: "YESSS",
//         releaseDate: new Date(2017,13,9),
//         genreId: 3,
//         editeurId: 3
//     };

//     const genre3 = {
//         nom: "ACTION"

//     };

//     const editeur3 = {
//         nom: "blooob"

//     };

//     const ed3 = await prisma.Editeur.create({
//         data: editeur3, 
//     });
//     const gre3 = await prisma.Genre.create({
//         data: genre3, 
//     });

//     const je3 = await prisma.Game.create({
//         data: trois, 
//     });

// }
