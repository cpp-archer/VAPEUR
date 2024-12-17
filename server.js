//configurations
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const path = require("path"); // S'adapte à tous les systèmes d'exploitation
const { create } = require("hbs");
const app = express();
const PORT = 3005;
const prisma = new PrismaClient();

//Configuration du moteur de template
app.set("view engine", "hbs"); 
app.set("views", path.join(__dirname, "views"));

//Gestion des formulaires et requêtes
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ROUTES

// Page d'accueil et jeux à la une
app.get("/", async (req, res) => {

    const jeuxEnAvant = await prisma.Game.findMany({
        where: { enAvant: true}
    }); 
    res.render("accueil",{jeuxEnAvant});

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//MISE EN AVANT

//met en avant
app.post("/Jeux/:id/enAvant", async (req, res)=>{
 
    try{
        const jeu = await prisma.Game.update({
            where: {id: parseInt(req.params.id)},
            data : {enAvant: true}    
        });

        res.redirect("/");    
    }
    catch(error){
        console.error(error);
        res.status(500).send("Erreur lors de la mise en avant");
    }
});

//enlève la mise en avant
app.post("/Jeux/:id/notEnAvant", async (req, res)=>{
 
    try{
        const jeu = await prisma.Game.update({
            where: {id: parseInt(req.params.id)},
            data : {enAvant: false}      
        });
        res.redirect("/");    
    }
    catch(error){
        console.error(error);
        res.status(500).send("Nope");
    }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ROUTES 

// Route jeux
app.get("/Jeux", async (req, res) => {
    const jeux = await prisma.Game.findMany({
        orderBy: { titre: 'asc' } // Tri par ordre alphabétique
    });
    res.render("Jeux/index", { jeux });
});

//Route genres
app.get("/Genres", async (req,res)=> { 
    const genres = await prisma.Genre.findMany();
    res.render("Genres/index", {genres}); 
});

// Route editeurs
app.get("/Editeurs", async (req,res)=> { 
    const editeurs = await prisma.Editeur.findMany(); 
    res.render("Editeurs/index", {editeurs}); 
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//AJOUTER JEUX


app.get("/Jeux/Ajouter", async (req, res) => {
    const genres = await prisma.Genre.findMany();
    const editeurs = await prisma.Editeur.findMany();
    res.render("Jeux/AjouterJeu", { genres, editeurs });
    
});


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
        res.redirect("/?message=Le jeu a été ajouté avec succès");
    } 
    catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de l'ajout du jeu");
    }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//MODIFIER JEUX

// formulaire de modification et verifications de données
app.get("/Jeux/:id/edit", async (req, res) => {
    const gameId = parseInt(req.params.id); // Récupère l'ID depuis l'URL

    try {
        const jeu = await prisma.Game.findUnique({
            where: { id: gameId },
        });

        if (!jeu) {
            return res.status(404).send("Jeu introuvable.");
        }

        const genres = await prisma.Genre.findMany();
        const editeurs = await prisma.Editeur.findMany();
    
        res.render("Jeux/EditerJeu", { jeu, genres, editeurs });
    } 
    catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        res.status(500).send("Erreur interne du serveur.");
    }
});

//mise à jour du jeu
app.post("/Jeux/:id/edit", async (req, res) => {
    const gameId = parseInt(req.params.id); // récupère l'id depuis l'URL
    const { titre, description, releaseDate, genreId, editeurId } = req.body;

    try {
        if (!titre || !description || !releaseDate || !genreId || !editeurId) {
            return res.status(400).send("Tous les champs sont requis.");
        }

        //bdd
        await prisma.Game.update({
            where: { id: gameId },
            data: {
                titre: titre.trim(),
                description: description.trim(),
                releaseDate: new Date(releaseDate),
                genreId: parseInt(genreId),
                editeurId: parseInt(editeurId),
            },
        });

        res.redirect("/Jeux?message=Le jeu a été mis à jour avec succès.");
    } 
    catch (error) {
        console.error("Erreur lors de la mise à jour du jeu :", error);
        res.status(500).send("Une erreur est survenue lors de la mise à jour.");
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//AJOUTER EDITEUR, routes

app.get("/Editeurs/Ajouter", (req, res) => {
    res.render("Editeurs/AjouterEditeur"); 
});

app.post("/Editeurs/Ajouter", async (req, res) => {
    const { nom } = req.body;

    if (!nom) {
        return res.status(400).send("Le champ nom est requis.");
    }

    try {
        await prisma.Editeur.create({
            data: { nom },
        });

        res.redirect("/Editeurs?message=L'éditeur a été ajouté avec succès");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de l'ajout de l'éditeur.");
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//MODIFIER EDITEUR, routes

app.get("/Editeurs/:id/edit", async (req, res) => {
    const editeurId = parseInt(req.params.id);

    try {
        //editeur unique
        const editeur = await prisma.Editeur.findUnique({
            where: { id: editeurId },
        });

        if (!editeur) {
            return res.status(404).send("Éditeur introuvable.");
        }

        res.render("Editeurs/ModifierEditeur", { editeur });
    } catch (error) {
        console.error("Erreur lors de la récupération de l'éditeur :", error);
        res.status(500).send("Erreur interne du serveur.");
    }
});

app.post("/Editeurs/:id/edit", async (req, res) => {
    const editeurId = parseInt(req.params.id);
    const { nom } = req.body;

    try {  
        if (!nom) {
            return res.status(400).send("Tous les champs sont requis.");
        }

        await prisma.Editeur.update({
            where: { id: editeurId },
            data: {
                nom: nom,
            },
        });

        res.redirect("/Editeurs?message=L'éditeur a été mis à jour avec succès.");
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'éditeur :", error);
        res.status(500).send("Une erreur est survenue lors de la mise à jour.");
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//SUPPRESSION JEUX, routes

app.get("/Jeux/:id/details", async (req, res) => {
    const id = parseInt(req.params.id); 

    const jeu = await prisma.Game.findUnique({ 
        where: { id },
        include: { 
            genre: true,  
            editeur: true 
        }
    });   
    if (!jeu) {
        return res.status(404).send("Jeu non trouvé."); 
    }
    
    res.render("Jeux/DetailsJeux", { jeu });
});

app.post("/Jeux/:id/delete", async (req, res) => {
    try {
        const id = parseInt(req.params.id); 

        await prisma.Game.delete({
            where: { id }
        });

        console.log(`Jeu avec l'ID ${id} supprimé.`);
        res.redirect("/");

    } catch (error) { //renvois les erreurs
        console.error("Erreur lors de la suppression du jeu :", error);
        res.status(500).send("Erreur lors de la suppression du jeu.");
    }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ROUTES DE JEUX

app.get("/Genres/:id/jdg", async (req,res)=> { //jdg = jeux du genre
    const jeu = await prisma.Game.findMany({where: {genreId: parseInt(req.params.id)}});
    res.render("Genres/index", {jeu});
})

app.get("/Editeurs/:id/jde", async (req,res)=> { //jde = jeux de l'editeur
    const jeu = await prisma.Game.findMany({where: {editeurId: parseInt(req.params.id)}}); 
    res.render("Editeurs/index", {jeu});
})



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//SUPPRIMER EDITEUR

app.post("/Editeurs/:id/delete", async (req, res) => {
    try {
        const id = parseInt(req.params.id); 

        const jeuxMisAJour = await prisma.Game.updateMany({
            where: { editeurId: id },  
            data: { editeurId: null } 
        });

        await prisma.Editeur.delete({
            where: { id }
        });

        console.log(`L'editeur avec l'ID ${id} a été supprimé.`);
        res.redirect("/Editeurs"); 
    }
     catch (error) {
        console.error("Erreur lors de la suppression de l'éditeur ou de la mise à jour des jeux :", error);
        res.status(500).send("Erreur lors de la suppression de l'éditeur et de la mise à jour des jeux.");
    }
});

app.listen(PORT, () => {
    console.log(`Ca marche sur le port ${PORT}`);
});


