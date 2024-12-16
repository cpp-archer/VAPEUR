const express = require("express");
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const methodOverride = require('method-override');  // Déplace cette ligne ici
const app = express();
const PORT = 3005;

// Configuration du moteur de template
app.set("view engine", "hbs"); 
app.set("views", path.join(__dirname, "views"));

// Ajout des middlewares pour gérer les formulaires et les requêtes POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ajout de methodOverride pour delete
app.use(methodOverride('_method'));  

const prisma = new PrismaClient();

// Page d'accueil
app.get("/", async (req, res) => {
    res.render("accueil");
});

// Route pour lister tous les jeux
app.get("/Jeux", async (req, res) => { 
    try {
        const jeux = await prisma.Game.findMany({
            orderBy: { titre: 'asc' } // Tri par ordre alphabétique
        });
        res.render("Jeux/index", { jeux }); // On renvoie les jeux à la vue
    } catch (error) {
        res.status(500).send("Erreur lors de la récupération des jeux.");
    }
});

// Route pour afficher les detail d'un jeu
app.get("/Jeux/:id/details", async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            console.log("ID de jeu invalide :", req.params.id);
            return res.status(400).send("ID de jeu invalide.");
        }

        // Vérification de si le jeu existe bien
        const jeu = await prisma.Game.findUnique({
            where: { id },
            include: {
                genre: true, 
                editeur: true 
            }
        });

        if (!jeu) {
            console.log(`Aucun jeu trouvé avec l'ID ${id}`);
            return res.status(404).send("Jeu non trouvé.");
        }

        console.log("Détails du jeu trouvé :", jeu);
        res.render("Jeux/DetailsJeux", { jeu });

    } catch (error) { // Si pas de jeu trouvé alors return les erreur
        console.error("Erreur lors de la récupération du détail du jeu :", error);
        res.status(500).send("Erreur lors de la récupération du détail du jeu.");
    }
});

// Route pour suprimer un Jeu
app.delete("/Jeux/:id/delete", async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        // Verification que le jeu est bien trouvé
        if (isNaN(id)) {
            console.log("ID de jeu invalide :", req.params.id);
            return res.status(400).send("ID de jeu invalide.");
        }

        // Suprime
        await prisma.Game.delete({
            where: { id }
        });

        console.log(`Jeu avec l'ID ${id} supprimé.`);
        res.redirect("/"); // Redirection vers la page d'accueil après la suppression
    } catch (error) {
        console.error("Erreur lors de la suppression du jeu :", error);
        res.status(500).send("Erreur lors de la suppression du jeu.");
    }
});

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
