const express = require("express");
const { PrismaClient } = require("@prisma/client");
const path = require("path"); // S'adapte à tous les systèmes d'exploitation
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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//JEUX


// Route pour lister tous les jeux
app.get("/Jeux", async (req, res) => {
    const jeux = await prisma.Game.findMany({
        orderBy: { titre: 'asc' } // Tri par ordre alphabétique
    });
    res.render("Jeux/index", { jeux });
});

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//GENRE

//on va dans la route /genre qu'on a creer en tant que href et on recup l'index du doss Genres
app.get("/Genres", async (req,res)=> { 
    const genres = await prisma.Genre.findMany({ // on va prendre tout les genres de la table Genre
        orderBy: { nom: 'asc' } // Tri par ordre alphabétique}); 
    });
    res.render("Genres/index", {genres}); //on les renvois à index
})

app.get("/Genres/:id/jdg", async (req,res)=> { //jdg = jeux du genre
    const jeu = await prisma.Game.findMany({where: {genreId: parseInt(req.params.id)}});
    res.render("Genres/index", {jeu});
})



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//EDITEUR

// Route pour lister tous les éditeurs
app.get("/Editeurs", async (req, res) => {
    const editeurs = await prisma.Editeur.findMany({
        orderBy: { nom: 'asc' } // Trie les éditeurs par nom alphabétique
    });
    res.render("Editeurs/index", { editeurs });
});

app.get("/Editeurs/:id/jde", async (req,res)=> { //jdg = jeux de l'editeur
    const jeu = await prisma.Game.findMany({
        where: {editeurId: parseInt(req.params.id)}}); 
    res.render("Editeurs/index", {jeu});
})


// Route pour afficher les détails d'un éditeur
app.get("/Editeurs/:id/details", async (req, res) => {
    const id = parseInt(req.params.id); // On transforme l'ID de l'éditeur en entier

    const editeur = await prisma.Editeur.findUnique({ 
        where: { id }, 
        include: {
            jeux: true // Récupère tous les jeux publiés par cet éditeur
        }
    });

    if (!editeur) {
        return res.status(404).send("Éditeur non trouvé."); // Affiche une erreur 404 si l'éditeur n'existe pas
    }

    console.log(editeur); //vérifier l'objet récupéré
    res.render("Editeurs/DetailsEditeur", { editeur });
});






app.listen(PORT, () => {
    console.log(`Ca marche sur le port ${PORT}`);
});



//creation de 3 jeux pour voir
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


     const trois= {
        titre: "YES",
        description: "YESSS",
        releaseDate: new Date(2017,13,9),
        genreId: 3,
        editeurId: 3
    };

    const genre3 = {
        nom: "ACTION"

    };

    const editeur3 = {
        nom: "blooob"

    };

    const ed3 = await prisma.Editeur.create({
        data: editeur3,
    });
    const gre3 = await prisma.Genre.create({
        data: genre3,
    });

    const je3 = await prisma.Game.create({
        data: trois,
    });

}
