import type { Dictionary } from "../dictionary";

export const it = {
  meta: {
    title: "LUMENFALL — Il buio risplende · 2099",
    description:
      "2099. Tre vite, un solo destino a Lumenfall, una megalopoli governata da un'IA. Un'epopea criminale open world che va dalla strada all'orbita. In arrivo nel 2027.",
    ogAlt: "LUMENFALL — un ascensore orbitale sopra la megalopoli al neon del 2099",
  },
  nav: {
    city: "La Città",
    protagonists: "Personaggi",
    features: "Caratteristiche",
    online: "LUMENFALL Online",
    editions: "Edizioni",
    preorder: "Preordina",
    menuOpen: "Apri menu",
    menuClose: "Chiudi menu",
    selectLanguage: "Scegli la lingua",
    skipToContent: "Vai al contenuto",
  },
  hero: {
    kicker: "UN'EPOPEA CRIMINALE OPEN WORLD",
    tagline: "Il buio risplende.",
    releaseWindow: "2027",
    platforms: "PC · CONSOLE · CLOUD",
    cta: "Preordina ora",
    scrollHint: "Scorri per esplorare",
    imageAlt:
      "Lumenfall nel 2099: un ascensore orbitale buca le nuvole verso le stelle, neon ciano e magenta su torri nere",
  },
  city: {
    kicker: "LA CITTÀ",
    title: "Lumenfall è viva. Anche mentre dormi.",
    paragraphs: [
      "Ricostruita dalle ceneri dopo il Grande Blackout del 2061, oggi Lumenfall è governata da PANOPT: un'intelligenza artificiale su scala urbana che controlla tutto, dal traffico ai tribunali, dalla rete elettrica alla memoria stessa. Sotto il suo ordine impeccabile si estende un immenso ecosistema criminale diviso in nove distretti.",
      "Dai casinò di Porto Neon alle strade delle gang della Cintura di Ruggine, dai vicoli sommersi di Sottobruma fino ad Ascesa, dove l'ascensore orbitale si arrampica verso il cielo: ogni distretto ha la sua economia, le sue regole, la sua memoria. L'odore di una strada, la rabbia di un quartiere, il prezzo che ti fa uno strozzino: la città non dimentica nulla.",
      "E la città ti osserva. Ogni tua scelta viene scritta nel registro di PANOPT, in attesa del giorno in cui tornerà a cercarti.",
    ],
    stats: [
      { value: "9", label: "DISTRETTI" },
      { value: "310 KM²", label: "CITTÀ + LIVELLO ORBITALE" },
      { value: "1,2 MLN", label: "CITTADINI SIMULATI" },
      { value: "100%", label: "SENZA INTERRUZIONI — ZERO CARICAMENTI" },
    ],
    imageAlt:
      "A livello strada a Lumenfall: folle in un canyon di neon, pubblicità olografiche e riflessi sull'asfalto bagnato",
  },
  protagonists: {
    kicker: "TRE VITE, UN DESTINO",
    title: "Con quali occhi lo vivrai?",
    intro:
      "Tre personaggi giocabili, tre mondi separati, e storie che si annodano in un unico punto. Passa dall'uno all'altro quando vuoi; ognuno continua a vivere la propria vita mentre non ci sei.",
    characters: [
      {
        id: "mara",
        name: "Mara Vex",
        role: "Netrunner",
        tagline: "Cerca il fratello cancellato.",
        bio: "La migliore ladra di dati del Mercato delle Ombre. Una notte suo fratello è stato cancellato dai banchi di memoria di PANOPT e dai ricordi di tutti. Mara violerà il cuore del sistema per rubare ciò che ha scelto di dimenticare.",
      },
      {
        id: "kaan",
        name: "Kaan “Ghost” Demir",
        role: "Ex sicario",
        tagline: "L'uomo che è sfuggito al sistema.",
        bio: "Per vent'anni ha fatto il lavoro sporco del Compact; poi ha rifiutato un ordine ed è morto, secondo i registri ufficiali. Ora infesta la Cintura di Ruggine come un fantasma. Regolerà i conti con il suo passato prima che sia il passato a trovarlo.",
      },
      {
        id: "solene",
        name: "Solene Adeyemi",
        role: "Contrabbandiera orbitale",
        tagline: "La regina fuorilegge del cielo.",
        bio: "La pilota che trasporta qualsiasi cosa voli tra Ascesa e l'Anello Zenit. La dogana per lei è un suggerimento, la gravità un cavillo. Finché un carico non le lascia in cabina il destino dell'intera città.",
      },
    ],
  },
  features: {
    kicker: "GAMEPLAY",
    title: "Più di una città. Un sistema.",
    items: [
      {
        title: "Dalla strada all'orbita",
        body: "Un inseguimento che comincia in metropolitana può risalire l'ascensore orbitale e finire a gravità zero sull'Anello Zenit. Una mappa, un respiro: zero schermate di caricamento.",
      },
      {
        title: "Una città viva",
        body: "Ognuno degli 1,2 milioni di cittadini ha un'identità persistente: routine, relazioni, ricordi. Il venditore ambulante che hai urtato ieri ti riconoscerà domani.",
      },
      {
        title: "Tre vite, una storia",
        body: "Passa all'istante tra Mara, Kaan e Solene. I personaggi che non controlli portano avanti i propri piani; le loro storie si intrecciano attraverso le tue scelte.",
      },
      {
        title: "Il sistema di risposta PANOPT",
        body: "Niente livello di sospetto: una città che ti impara. PANOPT analizza i tuoi schemi criminali e costruisce le sue trappole su misura. Lo stesso trucco non funziona mai due volte.",
      },
      {
        title: "Un'economia guidata dai giocatori",
        body: "I prezzi dei nove distretti si muovono con domanda e offerta reali. Apri rotte di contrabbando o manipola il mercato: l'economia è il tuo parco giochi.",
      },
      {
        title: "Il garage senza fondo",
        body: "Oltre 200 veicoli: dagli hover alle navette orbitali. Tutti modificabili pezzo per pezzo, tutti rubabili. Sì, anche la navetta.",
      },
    ],
  },
  online: {
    kicker: "LIVE SERVICE",
    title: "LUMENFALL Online: la città è di tutti noi.",
    body: "Costruisci il tuo impero criminale con una crew di quattro. Con rotazioni stagionali di colpi, guerre tra distretti e un'economia scritta dai giocatori, Lumenfall è un mondo che continua a girare anche quando sei offline.",
    bullets: [
      "Stagioni di 12 settimane, ognuna con nuova trama di distretto, colpo ed eventi",
      "Sistema crew: squadre da 4, covi condivisi, cassaforte comune",
      "Guerre di distretto: il controllo dei nove distretti cambia di mano ogni settimana",
      "Cross-platform + cross-progression: un account, ogni dispositivo",
      "Tutti i contenuti di gameplay si sbloccano giocando: il potere non è mai in vendita",
    ],
    ticker:
      "STAGIONE 01: PROTOCOLLO BLACKOUT · NUOVO COLPO: IL CAVEAU ZENIT · GUERRA DI DISTRETTO: PORTO NEON · SETTIMANA DOPPIO LUMEN",
    imageAlt:
      "Una crew di quattro attorno a un tavolo olografico di pianificazione in un covo buio",
  },
  editions: {
    kicker: "PREORDINE",
    title: "Scegli la tua edizione.",
    tiers: [
      {
        id: "standard",
        name: "Standard",
        tag: "",
        price: "79,99 €",
        contents: [
          "Gioco base LUMENFALL",
          "Accesso a LUMENFALL Online",
          "Bonus preordine: livrea veicolo “Blackout”",
        ],
        cta: "Scegli Standard",
      },
      {
        id: "deluxe",
        name: "Deluxe",
        tag: "La più popolare",
        price: "109,99 €",
        contents: [
          "Gioco base + LUMENFALL Online",
          "Accesso anticipato di 72 ore",
          "Artbook digitale + colonna sonora originale",
          "Collezione di abiti “Mercato delle Ombre”",
          "Pacchetto cosmetico Prisma della Stagione 01",
        ],
        cta: "Scegli Deluxe",
      },
      {
        id: "eternal",
        name: "Eternal",
        tag: "Da collezione",
        price: "139,99 €",
        contents: [
          "Tutti i contenuti della Deluxe",
          "Pass espansioni Anno Uno (2 pacchetti storia)",
          "Appartamento sull'Anello Zenit (covo in gioco)",
          "Serie esclusiva di veicoli monogramma “Eternal”",
          "Il tuo nome su una strada di Lumenfall*",
        ],
        cta: "Scegli Eternal",
      },
    ],
    note: "*Riservato ai primi 10.000 preordini Eternal. Tutti i contenuti sono di fantasia; i prezzi sono indicativi. Nulla che influenzi il gameplay viene mai venduto per denaro reale.",
    imageAlt:
      "Una confezione da collezione di LUMENFALL con emblema V ciano e riflessi al neon su vetro nero",
  },
  newsletter: {
    title: "Iscriviti alla lista blackout.",
    body: "Trailer, inviti alla beta chiusa e notizie di stagione. Niente spam, solo segnale.",
    placeholder: "il tuo indirizzo email",
    button: "Iscrivimi",
    success: "Sei in lista. Il buio si farà sentire.",
    privacy: "Puoi cancellarti in qualsiasi momento, con un clic.",
  },
  footer: {
    fictional:
      "LUMENFALL è un gioco di fantasia creato come lavoro concettuale. Non ha alcun legame con prodotti, studi o marchi reali.",
    rights: "© 2099 Lumenworks Studios. Tutti i diritti — per ora — riservati.",
    studio: "Lumenworks Studios",
  },
} satisfies Dictionary;
