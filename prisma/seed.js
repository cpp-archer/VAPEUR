const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    // Ajout des genres
    const genres = await prisma.genre.createMany({
        data: [
            { nom: "RPG" },
            { nom: "Course" },
            { nom: "Action" },
            { nom: "FPS" },
            { nom: "MOBA" },
            { nom: "Gacha" }
        ]
    });

    // Ajout des éditeurs
    const editeurs = await prisma.editeur.createMany({
        data: [
            { nom: "FromSoftware" },
            { nom: "Codemasters" },
            { nom: "Electronic Arts" },
            { nom: "HoYoverse" },
            { nom: "Blizzard Entertainment" },
            { nom: "Nintendo" }
        ]
    });

    // Récupération des genres et éditeurs pour l'association
    const genreRPG = await prisma.genre.findFirst({ where: { nom: "RPG" } });
    const genreCourse = await prisma.genre.findFirst({ where: { nom: "Course" } });
    const genreAction = await prisma.genre.findFirst({ where: { nom: "Action" } });
    const genreFPS = await prisma.genre.findFirst({ where: { nom: "FPS" } });
    const genreMOBA = await prisma.genre.findFirst({ where: { nom: "MOBA" } });
    const genreGacha = await prisma.genre.findFirst({ where: { nom: "Gacha" } });

    const editeurFromSoftware = await prisma.editeur.findFirst({ where: { nom: "FromSoftware" } });
    const editeurCodemasters = await prisma.editeur.findFirst({ where: { nom: "Codemasters" } });
    const editeurEA = await prisma.editeur.findFirst({ where: { nom: "Electronic Arts" } });
    const editeurHoyoverse = await prisma.editeur.findFirst({ where: { nom: "HoYoverse" } });
    const editeurBlizzard = await prisma.editeur.findFirst({ where: { nom: "Blizzard Entertainment" } });
    const editeurNintendo = await prisma.editeur.findFirst({ where: { nom: "Nintendo" } });

    // Ajout des jeux
    await prisma.game.createMany({
        data: [
            { titre: "Elden Ring", description: "Un RPG d'action en monde ouvert.", releaseDate: new Date("2022-02-25"), genreId: genreRPG.id, editeurId: editeurFromSoftware.id, enAvant: true },
            { titre: "Dirt 5", description: "Un jeu de course arcade intense.", releaseDate: new Date("2020-11-06"), genreId: genreCourse.id, editeurId: editeurCodemasters.id, enAvant: false },
            { titre: "F1 24", description: "Le dernier opus de la série F1.", releaseDate: new Date("2024-06-15"), genreId: genreCourse.id, editeurId: editeurEA.id, enAvant: true },
            { titre: "Genshin Impact", description: "Un jeu d'aventure et de gacha en monde ouvert.", releaseDate: new Date("2020-09-28"), genreId: genreGacha.id, editeurId: editeurHoyoverse.id, enAvant: true },
            { titre: "Overwatch 2", description: "Un FPS en équipe avec des héros.", releaseDate: new Date("2022-10-04"), genreId: genreFPS.id, editeurId: editeurBlizzard.id, enAvant: false },
            { titre: "Zelda: Breath of the Wild", description: "Un jeu d'aventure légendaire.", releaseDate: new Date("2017-03-03"), genreId: genreAction.id, editeurId: editeurNintendo.id, enAvant: true },
            { titre: "League of Legends", description: "Un MOBA ultra populaire.", releaseDate: new Date("2009-10-27"), genreId: genreMOBA.id, editeurId: editeurBlizzard.id, enAvant: false },
            { titre: "Cyberpunk 2077", description: "Un RPG futuriste ambitieux.", releaseDate: new Date("2020-12-10"), genreId: genreRPG.id, editeurId: editeurFromSoftware.id, enAvant: true },
            { titre: "Mario Kart 8 Deluxe", description: "Le classique du karting.", releaseDate: new Date("2017-04-28"), genreId: genreCourse.id, editeurId: editeurNintendo.id, enAvant: false },
            { titre: "Call of Duty: Modern Warfare II", description: "Un FPS militaire intense.", releaseDate: new Date("2022-10-28"), genreId: genreFPS.id, editeurId: editeurEA.id, enAvant: true }
        ]
    });

    console.log("Genres, éditeurs et jeux ajoutés avec succès !");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
