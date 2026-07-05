import type { Dictionary } from "../dictionary";

export const en = {
  meta: {
    title: "LUMENFALL — Darkness Shines · 2099",
    description:
      "2099. Three lives, one fate in Lumenfall — a megacity ruled by AI. An open-world crime epic stretching from the streets to orbit. Coming 2027.",
    ogAlt: "LUMENFALL — an orbital elevator over the neon megacity of 2099",
  },
  nav: {
    city: "The City",
    protagonists: "Characters",
    features: "Features",
    online: "LUMENFALL Online",
    editions: "Editions",
    preorder: "Pre-order",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    selectLanguage: "Select language",
    skipToContent: "Skip to content",
  },
  hero: {
    kicker: "AN OPEN-WORLD CRIME EPIC",
    tagline: "Darkness shines.",
    releaseWindow: "2027",
    platforms: "PC · CONSOLE · CLOUD",
    cta: "Pre-order now",
    scrollHint: "Scroll to explore",
    imageAlt:
      "Lumenfall in 2099: an orbital elevator piercing the clouds toward the stars, cyan and magenta neon on black towers",
  },
  city: {
    kicker: "THE CITY",
    title: "Lumenfall is alive. Even while you sleep.",
    paragraphs: [
      "Rebuilt from the ashes after the Great Blackout of 2061, Lumenfall is now governed by PANOPT — a city-scale artificial intelligence that runs everything from traffic to trials, from power grids to memory itself. Beneath its flawless order lies a vast criminal ecosystem carved into nine districts.",
      "From the casinos of Neon Harbor to the gang streets of the Rust Belt, from the drowned alleys of Undermist to Ascent, where the orbital elevator climbs into the sky: every district has its own economy, its own rules, its own memory. The smell of a street, the anger of a neighborhood, the price a loan shark quotes you — the city forgets none of it.",
      "And the city is watching you. Every choice you make is written into PANOPT's ledger — waiting for the day it comes back to find you.",
    ],
    stats: [
      { value: "9", label: "DISTRICTS" },
      { value: "310 KM²", label: "CITY + ORBITAL LAYER" },
      { value: "1.2M", label: "SIMULATED CITIZENS" },
      { value: "100%", label: "SEAMLESS — NO LOADING SCREENS" },
    ],
    imageAlt:
      "Street level in Lumenfall: crowds in a neon canyon, holographic ads and wet asphalt reflections",
  },
  protagonists: {
    kicker: "THREE LIVES, ONE FATE",
    title: "Whose eyes will you see it through?",
    intro:
      "Three playable characters, three separate worlds — and stories that collide in a single knot. Switch between them at any moment; each keeps living their own life while you're gone.",
    characters: [
      {
        id: "mara",
        name: "Mara Vex",
        role: "Netrunner",
        tagline: "Searching for her erased brother.",
        quote:
          "Everything erased leaves a trace somewhere. I collect the traces.",
        bio: "In Shadowmarket, data costs more than blood — and Mara is its most expensive thief. She cracked her first memory vault at sixteen; by twenty-eight her name was a legend inside PANOPT's protected layers and her face was a rumor. Then one night her brother Deniz was erased from the system and from every mind in the city. When her mother looked at his photo and asked \"who is this boy?\", Mara swore an oath: the ones who make people forget will get something they can never forget.",
        playstyle:
          "Stealth · hacking · social engineering — for players who take the city apart without being seen. Every camera an eye, every implant a door, every secret a weapon.",
      },
      {
        id: "kaan",
        name: "Kaan “Ghost” Demir",
        role: "Ex-Enforcer",
        tagline: "The man who escaped the system.",
        quote:
          "According to the official records, I am dead. Records always lie.",
        bio: "For twenty years he \"solved problems\" in the Compact's shadow — silencing those who asked the wrong questions. Then one night, the person he was sent to silence was a child. He refused; by morning the records listed him as an \"operational loss.\" He built a life as quiet as a coffin in the rusted factories of the Rust Belt. But even ghosts find no peace in Lumenfall: old files are reopening, old names are coming back — and Ghost is rising from his grave to collect.",
        playstyle:
          "Tactical combat · heavy weapons · breaching — for players who kick doors instead of knocking. Every cover a decision, every trigger a confession.",
      },
      {
        id: "solene",
        name: "Solene Adeyemi",
        role: "Orbital Smuggler",
        tagline: "The outlaw queen of the sky.",
        quote:
          "Gravity is a suggestion. Customs is a joke. But my word is a contract.",
        bio: "At eight she counted stars from her father's cargo shuttle; at eighteen she was Ascent's youngest licensed pilot; at twenty-one they burned her license — for carrying a refugee family instead of a forbidden crate. Now she lives in the cockpit of the Black Stork, in the gray void between street and orbit. Until one container spills the most dangerous secret in the city, and the fate of all Lumenfall lands in the hands of the woman who never falls.",
        playstyle:
          "Speed · vehicle mastery · impossible escapes — for players who chase the chase. Nosedives through neon canyons, zero-g maneuvers in orbit.",
      },
    ],
  },
  features: {
    kicker: "GAMEPLAY",
    title: "More than a city. A system.",
    items: [
      {
        title: "Street to Orbit",
        body: "A chase that starts in the metro can climb the orbital elevator and end in zero gravity on the Zenith Ring. One map, one breath — no loading screens.",
      },
      {
        title: "A Living City",
        body: "Each of 1.2 million citizens carries a persistent identity: routines, relationships, memories. The street vendor you clipped yesterday will recognize you tomorrow.",
      },
      {
        title: "Three Lives, One Story",
        body: "Switch instantly between Mara, Kaan and Solene. The characters you're not controlling live their own agendas; their stories intersect through your choices.",
      },
      {
        title: "The PANOPT Response System",
        body: "Not a wanted level — a city that learns you. PANOPT analyzes your crime patterns and builds its traps around them. The same trick never works twice.",
      },
      {
        title: "A Player-Driven Economy",
        body: "Prices across nine districts move with real supply and demand. Run smuggling routes or manipulate the market — the economy is your playground.",
      },
      {
        title: "The Bottomless Garage",
        body: "Over 200 vehicles: from hover-sweepers to orbital shuttles. Every one can be modified part by part, and every one can be stolen. Yes, the shuttle too.",
      },
    ],
  },
  online: {
    kicker: "LIVE SERVICE",
    title: "LUMENFALL Online: The city belongs to all of us.",
    body: "Build your own criminal empire with a four-person crew. With seasonal heist rotations, district wars and an economy written by players, Lumenfall is a world that keeps turning even while you're offline.",
    bullets: [
      "12-week seasons — each with a new district storyline, heist and events",
      "Crew system: 4-player teams, shared hideouts, a common vault",
      "District wars: control of nine districts changes hands every week",
      "Cross-platform + cross-progression: one account, every device",
      "All gameplay content is earned by playing — power is never for sale",
    ],
    modes: [
      {
        name: "District Wars",
        body: "Weekly conquest warfare: crew versus crew for control of nine districts. Winners collect the district's tribute and its market advantage.",
      },
      {
        name: "The Zenith Vault",
        body: "4-player co-op heist: breach the data vault on the orbital station and escape in zero gravity. Every role matters — hacker, muscle, pilot, face.",
      },
      {
        name: "Smuggling League",
        body: "Illegal cargo runs from Undermist up to Ascent. Rival crews can steal your load — the cleverest wins, not the fastest.",
      },
      {
        name: "Free Roam",
        body: "A living city with 40 players and no rules: forge alliances, betray them, and outrun PANOPT's gaze together.",
      },
    ],
    ticker:
      "SEASON 01: BLACKOUT PROTOCOL · NEW HEIST: THE ZENITH VAULT · DISTRICT WAR: NEON HARBOR · DOUBLE LUMEN WEEK",
    imageAlt:
      "A four-person crew around a holographic heist-planning table in a dark hideout",
  },
  editions: {
    kicker: "PRE-ORDER",
    title: "Choose your edition.",
    tiers: [
      {
        id: "standard",
        name: "Standard",
        tag: "",
        price: "$69.99",
        contents: [
          "LUMENFALL base game",
          "Access to LUMENFALL Online",
          "Pre-order bonus: “Blackout” vehicle wrap",
        ],
        cta: "Choose Standard",
      },
      {
        id: "deluxe",
        name: "Deluxe",
        tag: "Most Popular",
        price: "$99.99",
        contents: [
          "Base game + LUMENFALL Online",
          "72-hour early access",
          "Digital artbook + original soundtrack",
          "“Shadowmarket” outfit collection",
          "Season 01 Prisma cosmetic pack",
        ],
        cta: "Choose Deluxe",
      },
      {
        id: "eternal",
        name: "Eternal",
        tag: "Collector's",
        price: "$129.99",
        contents: [
          "Everything in Deluxe",
          "Year One expansion pass (2 story packs)",
          "Zenith Ring apartment (in-game hideout)",
          "Exclusive “Eternal” monogram vehicle series",
          "Your name on a street in Lumenfall*",
        ],
        cta: "Choose Eternal",
      },
    ],
    note: "*Limited to the first 10,000 Eternal pre-orders. All content is fictional; prices are illustrative. Nothing that affects gameplay is ever sold for real money.",
    imageAlt:
      "A collector's LUMENFALL box with a cyan V emblem and neon reflections on black glass",
  },
  newsletter: {
    title: "Join the blackout list.",
    body: "Trailers, closed-beta invites and season news — no spam, just signal.",
    placeholder: "your email address",
    button: "Sign up",
    success: "You're on the list. The dark will be in touch.",
    privacy: "Leave anytime with a single click.",
  },
  footer: {
    fictional:
      "LUMENFALL is a fictional game created as a concept work. It has no connection to any real product, studio or brand.",
    rights: "© 2099 Lumenworks Studios. All rights — for now — reserved.",
    studio: "Lumenworks Studios",
  },
} satisfies Dictionary;
