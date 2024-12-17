//config
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const path = require("path"); // S'adapte à tous les systèmes d'exploitation
const { create } = require("hbs");
const app = express();
const PORT = 3005;

// Configuration du moteur de template
app.set("view engine", "hbs"); 
app.set("views", path.join(__dirname, "views"));

const prisma = new PrismaClient();

// Page d'accueil
app.get("/", async (req, res) => {
    res.render("accueil");
    // createTestDb();
});


//*********************************************************************************************************************************//

app.use(express.urlencoded({ extended: true })); // Gestion des formulaires POST
app.use(express.json()); // Gestion des requêtes JSON



app.get("/", async (req, res) => {
    const message = req.query.message; // Récupère le message de la requête (s'il existe)
    res.render("accueil");
});



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//JEUX


// Route pour lister tous les jeux
app.get("/Jeux", async (req, res) => {
    const jeux = await prisma.Game.findMany({
        orderBy: { titre: 'asc' } // Tri par ordre alphabétique
    });
    res.render("Jeux/index", { jeux });
});

// Route pour afficher les details d'un jeu
app.get("/Jeux/:id/details", async (req, res) => {
    const id = parseInt(req.params.id); // transforme l'ID un entier

    const jeu = await prisma.Game.findUnique({ 
        where: { id },
        include: { 
            genre: true,  // Récupere les colone relatives au nom des genre et editeur 
            editeur: true 
        }
    });

    if (!jeu) {
        return res.status(404).send("Jeu non trouvé."); // erreur 404 si pas de jeu trouvé
    }
    console.log(jeu);  //vérifier l'objet récupéré
    res.render("Jeux/DetailsJeux", { jeu });
});

// Suprimé un jeu
app.post("/Jeux/:id/delete", async (req, res) => {
    try {
        const id = parseInt(req.params.id); // transforme l'ID un entier

        // Suprime le Jeu actuelle en récupérent l'id dans l'url
        await prisma.Game.delete({
            where: { id }
        });

        console.log(`Jeu avec l'ID ${id} supprimé.`);
        res.redirect("/");

    } catch (error) { // Renvoie les erreurs
        console.error("Erreur lors de la suppression du jeu :", error);
        res.status(500).send("Erreur lors de la suppression du jeu.");
    }
});

// Route pour ajouter jeu
app.get("/Jeux/Ajouter", async (req, res) => {
    try {
        const genres = await prisma.Genre.findMany();
        const editeurs = await prisma.Editeur.findMany();
        res.render("Jeux/AjouterJeu", { genres, editeurs });
    } catch (err) {
        console.error("Erreur lors de la récupération des données :", err);
        res.status(500).send("Erreur interne du serveur");
    }
});

// Ajouter jeu
app.post("/Jeux/Ajouter", async (req, res) => {
    const { titre, description, releaseDate, genreId, editeurId } = req.body;

    if (!titre || !description || !releaseDate || !genreId || !editeurId) {
        return res.status(400).send("Tous les champs sont requis.");
    }

    try {
        await prisma.Game.create({
            data: {
                titre,
                description,
                releaseDate: new Date(releaseDate),
                genreId: parseInt(genreId),
                editeurId: parseInt(editeurId),
            },
        });

        // Redirection vers l'accueil avec un message de confirmation
        res.redirect("/?message=Le jeu a été ajouté avec succès");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de l'ajout du jeu");
    }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//GENRE

//on va dans la route /genre qu'on a creer en tant que href et on recup l'index du doss Genres
app.get("/Genres", async (req,res)=> { 
    const genres = await prisma.Genre.findMany(); // on va prendre tout les genres de la table Genre
    res.render("Genres/index", {genres}); //on les renvois à index
})

app.get("/Genres/:id/jdg", async (req,res)=> { //jdg = jeux du genre
    const jeu = await prisma.Game.findMany({where: {genreId: parseInt(req.params.id)}});
    res.render("Genres/index", {jeu});
})




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//EDITEUR


//on va dans la route /genre qu'on a creer en tant que href et on recup l'index du doss Genres
app.get("/Editeurs", async (req,res)=> { 
    const editeurs = await prisma.Editeur.findMany(); // on va prendre tout les genres de la table Genre
    res.render("Editeurs/index", {editeurs}); //on les renvois à index
})

app.get("/Editeurs/:id/jde", async (req,res)=> { //jdg = jeux de l'editeur
    const jeu = await prisma.Game.findMany({where: {editeurId: parseInt(req.params.id)}}); 
    res.render("Editeurs/index", {jeu});
})

// Route pour afficher le formulaire d'ajout d'un éditeur
app.get("/Editeurs/Ajouter", (req, res) => {
    res.render("Editeurs/AjouterEditeur"); // Affiche la vue AjouterEditeur
});

// Route pour ajouter un éditeur dans la base de données
app.post("/Editeurs/Ajouter", async (req, res) => {
    const { nom } = req.body;

    if (!nom) {
        return res.status(400).send("Le champ nom est requis.");
    }

    try {
        // Ajoute l'éditeur dans la base de données
        await prisma.Editeur.create({
            data: { nom },
        });

        // Redirige vers la liste des éditeurs avec un message
        res.redirect("/Editeurs?message=L'éditeur a été ajouté avec succès");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de l'ajout de l'éditeur.");
    }
});

// Suprimer un éditeur
app.post("/Editeurs/:id/delete", async (req, res) => {
    try {
        const id = parseInt(req.params.id); // Récupère l'id de l'éditeur à supprimer

        // Mise à jour de tous les jeux lié a l'editeur
        const jeuxMisAJour = await prisma.Game.updateMany({
            where: { editeurId: id },  // On prend tous les jeux de l'éditeur
            data: { editeurId: null }  // et on leur met la valeur NULL a la place
        });

        // Suppression de l'éditeur via son id
        await prisma.Editeur.delete({
            where: { id }
        });

        console.log(`L'editeur avec l'ID ${id} a été supprimé.`);
        res.redirect("/Editeurs"); // Redirection vers la liste des éditeurs
    } catch (error) {
        console.error("Erreur lors de la suppression de l'éditeur ou de la mise à jour des jeux :", error);
        res.status(500).send("Erreur lors de la suppression de l'éditeur et de la mise à jour des jeux.");
    }
});


//*************************FIN************************************************************************************************//



app.listen(PORT, () => {
    console.log(`Ca marche sur le port ${PORT}`);
});



// Middleware pour parser les données POST (assure-toi qu'il est bien configuré)
// app.use(express.urlencoded({ extended: true }));




// Route pour afficher la liste des éditeurs

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
