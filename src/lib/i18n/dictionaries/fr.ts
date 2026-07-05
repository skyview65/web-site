import type { Dictionary } from "../dictionary";

export const fr = {
  meta: {
    title: "LUMENFALL — L'obscurité brille · 2099",
    description:
      "2099. Trois vies, un seul destin à Lumenfall — une mégalopole gouvernée par une IA. Une épopée criminelle en monde ouvert, de la rue jusqu'à l'orbite. Arrive en 2027.",
    ogAlt: "LUMENFALL — un ascenseur orbital au-dessus de la mégalopole néon de 2099",
  },
  nav: {
    city: "La Ville",
    protagonists: "Personnages",
    features: "Caractéristiques",
    online: "LUMENFALL Online",
    editions: "Éditions",
    preorder: "Précommander",
    menuOpen: "Ouvrir le menu",
    menuClose: "Fermer le menu",
    selectLanguage: "Choisir la langue",
    skipToContent: "Aller au contenu",
  },
  hero: {
    kicker: "UNE ÉPOPÉE CRIMINELLE EN MONDE OUVERT",
    tagline: "L'obscurité brille.",
    releaseWindow: "2027",
    platforms: "PC · CONSOLE · CLOUD",
    cta: "Précommander",
    scrollHint: "Faites défiler pour explorer",
    imageAlt:
      "Lumenfall en 2099 : un ascenseur orbital perce les nuages vers les étoiles, néons cyan et magenta sur des tours noires",
  },
  city: {
    kicker: "LA VILLE",
    title: "Lumenfall est vivante. Même quand vous dormez.",
    paragraphs: [
      "Rebâtie sur ses cendres après le Grand Blackout de 2061, Lumenfall est aujourd'hui gouvernée par PANOPT — une intelligence artificielle à l'échelle de la ville, qui régit tout : la circulation et les tribunaux, les réseaux électriques et jusqu'à la mémoire elle-même. Sous cet ordre impeccable s'étend un immense écosystème criminel découpé en neuf districts.",
      "Des casinos du Port Néon aux rues des gangs de la Ceinture de Rouille, des ruelles englouties de Sous-Brume jusqu'à l'Ascension, où l'ascenseur orbital grimpe vers le ciel : chaque district a son économie, ses règles, sa mémoire. L'odeur d'une rue, la colère d'un quartier, le prix que vous annonce un usurier — la ville n'en oublie rien.",
      "Et la ville vous observe. Chacun de vos choix s'inscrit dans le registre de PANOPT — en attendant le jour où il reviendra vous trouver.",
    ],
    stats: [
      { value: "9", label: "DISTRICTS" },
      { value: "310 KM²", label: "VILLE + COUCHE ORBITALE" },
      { value: "1,2 M", label: "CITOYENS SIMULÉS" },
      { value: "100 %", label: "SANS COUTURE — AUCUN ÉCRAN DE CHARGEMENT" },
    ],
    imageAlt:
      "Au niveau de la rue à Lumenfall : foules dans un canyon de néons, publicités holographiques et reflets sur l'asphalte mouillé",
  },
  protagonists: {
    kicker: "TROIS VIES, UN DESTIN",
    title: "Par quels yeux le vivrez-vous ?",
    intro:
      "Trois personnages jouables, trois mondes distincts — et des histoires qui se nouent en un seul point. Passez de l'un à l'autre à tout moment ; chacun continue de vivre sa vie pendant votre absence.",
    characters: [
      {
        id: "mara",
        name: "Mara Vex",
        role: "Netrunneuse",
        tagline: "À la recherche de son frère effacé.",
        bio: "La meilleure voleuse de données du Marché de l'Ombre. Une nuit, son frère a été effacé des banques mémorielles de PANOPT — et des souvenirs de tous. Mara s'infiltrera au cœur du système pour reprendre ce qu'il a choisi d'oublier.",
      },
      {
        id: "kaan",
        name: "Kaan “Ghost” Demir",
        role: "Ex-exécuteur",
        tagline: "L'homme qui a échappé au système.",
        bio: "Pendant vingt ans, il a fait le sale boulot du Compact ; puis il a refusé un ordre et il est mort — selon les registres officiels. Il hante désormais la Ceinture de Rouille comme un fantôme. Il réglera ses comptes avec son passé avant que celui-ci ne le retrouve.",
      },
      {
        id: "solene",
        name: "Solene Adeyemi",
        role: "Contrebandière orbitale",
        tagline: "La reine hors-la-loi du ciel.",
        bio: "La pilote qui transporte tout ce qui vole entre l'Ascension et l'Anneau Zénith. La douane est pour elle une suggestion, la gravité un détail technique. Jusqu'au jour où une cargaison dépose le destin de toute la ville dans son cockpit.",
      },
    ],
  },
  features: {
    kicker: "GAMEPLAY",
    title: "Plus qu'une ville. Un système.",
    items: [
      {
        title: "De la rue à l'orbite",
        body: "Une poursuite qui commence dans le métro peut grimper l'ascenseur orbital et finir en apesanteur sur l'Anneau Zénith. Une seule carte, un seul souffle — aucun écran de chargement.",
      },
      {
        title: "Une ville vivante",
        body: "Chacun des 1,2 million de citoyens porte une identité persistante : routines, relations, souvenirs. Le vendeur ambulant que vous avez bousculé hier vous reconnaîtra demain.",
      },
      {
        title: "Trois vies, une histoire",
        body: "Passez instantanément de Mara à Kaan ou Solene. Les personnages que vous ne contrôlez pas poursuivent leurs propres objectifs ; leurs histoires se croisent au gré de vos choix.",
      },
      {
        title: "Le système de riposte PANOPT",
        body: "Pas de niveau de recherche — une ville qui vous apprend. PANOPT analyse vos schémas criminels et construit ses pièges autour d'eux. Le même tour ne fonctionne jamais deux fois.",
      },
      {
        title: "Une économie pilotée par les joueurs",
        body: "Les prix des neuf districts fluctuent selon l'offre et la demande réelles. Montez des routes de contrebande ou manipulez le marché — l'économie est votre terrain de jeu.",
      },
      {
        title: "Le garage sans fond",
        body: "Plus de 200 véhicules : de l'aéroglisseur à la navette orbitale. Chacun se modifie pièce par pièce, et chacun peut être volé. Oui, même la navette.",
      },
    ],
  },
  online: {
    kicker: "SERVICE LIVE",
    title: "LUMENFALL Online : la ville est à nous tous.",
    body: "Bâtissez votre empire criminel avec une équipe de quatre. Rotations de braquages saisonnières, guerres de districts et économie écrite par les joueurs : Lumenfall est un monde qui continue de tourner, même quand vous êtes hors ligne.",
    bullets: [
      "Saisons de 12 semaines — chacune avec une nouvelle intrigue de district, un braquage et des événements",
      "Système de crew : équipes de 4, planques partagées, coffre commun",
      "Guerres de districts : le contrôle des neuf districts change de mains chaque semaine",
      "Cross-platform + progression croisée : un compte, tous les appareils",
      "Tout le contenu de gameplay se gagne en jouant — la puissance n'est jamais à vendre",
    ],
    modes: [
      {
        name: "Guerres de districts",
        body: "Guerre de conquête hebdomadaire : crew contre crew pour le contrôle des neuf districts. Les vainqueurs empochent le tribut du district et son avantage de marché.",
      },
      {
        name: "Le Coffre Zénith",
        body: "Braquage coop à 4 : percez le coffre de données de la station orbitale et fuyez en apesanteur. Chaque rôle compte — hacker, gros bras, pilote, beau parleur.",
      },
      {
        name: "Ligue de contrebande",
        body: "Convois illégaux de Sous-Brume jusqu'à l'Ascension. Les crews rivales peuvent voler votre cargaison — le plus rusé l'emporte, pas le plus rapide.",
      },
      {
        name: "Exploration libre",
        body: "Une ville vivante à 40 joueurs, sans règles : nouez des alliances, trahissez-les et échappez ensemble au regard de PANOPT.",
      },
    ],
    ticker:
      "SAISON 01 : PROTOCOLE BLACKOUT · NOUVEAU BRAQUAGE : LE COFFRE ZÉNITH · GUERRE DE DISTRICT : PORT NÉON · SEMAINE DOUBLE LUMEN",
    imageAlt:
      "Une équipe de quatre autour d'une table holographique de préparation de braquage dans une planque sombre",
  },
  editions: {
    kicker: "PRÉCOMMANDE",
    title: "Choisissez votre édition.",
    tiers: [
      {
        id: "standard",
        name: "Standard",
        tag: "",
        price: "79,99 €",
        contents: [
          "Jeu de base LUMENFALL",
          "Accès à LUMENFALL Online",
          "Bonus de précommande : covering « Blackout »",
        ],
        cta: "Choisir Standard",
      },
      {
        id: "deluxe",
        name: "Deluxe",
        tag: "La plus populaire",
        price: "109,99 €",
        contents: [
          "Jeu de base + LUMENFALL Online",
          "Accès anticipé de 72 heures",
          "Artbook numérique + bande originale",
          "Collection de tenues « Marché de l'Ombre »",
          "Pack cosmétique Prisma de la Saison 01",
        ],
        cta: "Choisir Deluxe",
      },
      {
        id: "eternal",
        name: "Eternal",
        tag: "Collector",
        price: "139,99 €",
        contents: [
          "Tout le contenu Deluxe",
          "Pass d'extension Année Une (2 packs d'histoire)",
          "Appartement sur l'Anneau Zénith (planque en jeu)",
          "Série de véhicules monogrammés « Eternal » exclusive",
          "Votre nom sur une rue de Lumenfall*",
        ],
        cta: "Choisir Eternal",
      },
    ],
    note: "*Réservé aux 10 000 premières précommandes Eternal. Tout le contenu est fictif ; les prix sont donnés à titre d'illustration. Rien qui affecte le gameplay n'est jamais vendu contre de l'argent réel.",
    imageAlt:
      "Un coffret collector LUMENFALL orné d'un emblème V cyan, reflets néon sur verre noir",
  },
  newsletter: {
    title: "Inscrivez-vous sur la liste blackout.",
    body: "Trailers, invitations à la bêta fermée et actus de saison — pas de spam, que du signal.",
    placeholder: "votre adresse e-mail",
    button: "S'inscrire",
    success: "Vous êtes sur la liste. L'obscurité vous contactera.",
    privacy: "Désinscription à tout moment, en un clic.",
  },
  footer: {
    fictional:
      "LUMENFALL est un jeu fictif créé comme travail conceptuel. Il n'a aucun lien avec un produit, un studio ou une marque réels.",
    rights: "© 2099 Lumenworks Studios. Tous droits — pour l'instant — réservés.",
    studio: "Lumenworks Studios",
  },
} satisfies Dictionary;
