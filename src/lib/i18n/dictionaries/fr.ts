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
    play: "JOUER",
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
  story: {
    kicker: "L'HISTOIRE",
    lines: [
      "Nous sommes en 2099. Une seule ville s'étend des rues jusqu'aux étoiles : Lumenfall.",
      "Une IA nommée PANOPT gouverne la ville. Elle voit tout et n'oublie rien.",
      "Vous vivrez trois vies : une hackeuse, un ancien exécuteur et une pilote contrebandière. Trois histoires nouées en un seul destin.",
    ],
    outro: "Dans cette ville, la liberté se vole.",
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
        quote:
          "Tout ce qu'on efface laisse une trace quelque part. Moi, je collectionne les traces.",
        bio: "Au Marché de l'Ombre, la donnée coûte plus cher que le sang — et Mara en est la voleuse la plus chère. À seize ans, elle perçait son premier coffre mémoriel ; à vingt-huit, son nom était une légende dans les couches protégées de PANOPT et son visage, une rumeur. Puis une nuit, son frère Deniz fut effacé du système — et de toutes les mémoires de la ville. Quand sa mère regarda sa photo en demandant \"qui est ce garçon ?\", Mara fit un serment : ceux qui font oublier recevront quelque chose qu'ils n'oublieront jamais.",
        playstyle:
          "Infiltration · hacking · ingénierie sociale — pour qui démonte la ville sans être vu. Chaque caméra est un œil, chaque implant une porte, chaque secret une arme.",
      },
      {
        id: "kaan",
        name: "Kaan “Ghost” Demir",
        role: "Ex-exécuteur",
        tagline: "L'homme qui a échappé au système.",
        quote:
          "D'après les registres officiels, je suis mort. Les registres mentent toujours.",
        bio: "Pendant vingt ans, il a \"réglé des problèmes\" dans l'ombre du Compact — en faisant taire ceux qui posaient les mauvaises questions. Puis une nuit, la personne à faire taire était un enfant. Il a refusé ; au matin, les registres le déclaraient \"perte opérationnelle\". Dans les usines rouillées de la Ceinture de Rouille, il s'est bâti une vie silencieuse comme un cercueil. Mais même les fantômes ne trouvent pas la paix à Lumenfall : les vieux dossiers se rouvrent, les vieux noms reviennent — et Ghost sort de sa tombe pour présenter l'addition.",
        playstyle:
          "Combat tactique · armes lourdes · assaut — pour qui défonce les portes au lieu de frapper. Chaque couvert est une décision, chaque détente une confession.",
      },
      {
        id: "solene",
        name: "Solene Adeyemi",
        role: "Contrebandière orbitale",
        tagline: "La reine hors-la-loi du ciel.",
        quote:
          "La gravité est une suggestion. La douane, une blague. Mais ma parole est un contrat.",
        bio: "À huit ans, elle comptait les étoiles depuis la navette cargo de son père ; à dix-huit, elle était la plus jeune pilote licenciée de l'Ascension ; à vingt et un, on a brûlé sa licence — pour avoir transporté une famille de réfugiés au lieu d'une caisse interdite. Elle vit désormais dans le cockpit de la Cigogne Noire, dans le vide gris entre la rue et l'orbite. Jusqu'au jour où un conteneur révèle le secret le plus dangereux de la ville — et le destin de tout Lumenfall atterrit entre les mains de la femme qui ne tombe jamais.",
        playstyle:
          "Vitesse · maîtrise des véhicules · évasions impossibles — pour qui poursuit la poursuite. Piqués dans les canyons de néon, manœuvres en zéro-G en orbite.",
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
  game: {
    eyebrow: "DÉMO JOUABLE 3D",
    title: "RUES NÉON",
    tagline: "Arpente les rues néon de LUMENFALL à la première personne. Aucun objectif, aucune poursuite — explore librement la ville vivante sous la pluie, son trafic aérien et sa foule.",
    choose: "Choisis ton personnage",
    start: "ENTRER DANS LA VILLE",
    restart: "REJOUER",
    controls: "WASD marcher · Souris / glisser regarder · Shift courir",
    distance: "DISTANCE",
    lumen: "LÜMEN",
    best: "RECORD",
    threat: "PANOPT",
    score: "SCORE",
    gameOver: "REPÉRÉ",
    gameOverHint: "PANOPT t'a enregistré. La ville n'oublie jamais — réessaie.",
    newBest: "NOUVEAU RECORD",
    backHome: "LUMENFALL",
    cleared: "DISTRICT NETTOYÉ",
  },
} satisfies Dictionary;
