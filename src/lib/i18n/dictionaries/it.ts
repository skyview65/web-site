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
    play: "GIOCA",
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
  story: {
    kicker: "LA STORIA",
    lines: [
      "Anno 2099. Una sola città si estende dalle strade alle stelle: Lumenfall.",
      "Un'IA chiamata PANOPT governa la città. Vede tutto e non dimentica nulla.",
      "Vivrai tre vite: una hacker, un ex esecutore e una pilota contrabbandiera. Tre storie annodate in un unico destino.",
    ],
    outro: "In questa città la libertà si ruba.",
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
        quote:
          "Tutto ciò che viene cancellato lascia una traccia da qualche parte. Io colleziono le tracce.",
        bio: "Al Mercato delle Ombre i dati costano più del sangue — e Mara è la sua ladra più costosa. Ha violato il suo primo caveau mnemonico a sedici anni; a ventotto il suo nome era leggenda negli strati protetti di PANOPT e il suo volto una voce di corridoio. Poi una notte suo fratello Deniz è stato cancellato dal sistema e da ogni mente della città. Quando sua madre ha guardato la foto chiedendo \"chi è questo ragazzo?\", Mara ha giurato: chi fa dimenticare riceverà qualcosa che non potrà mai dimenticare.",
        playstyle:
          "Furtività · hacking · ingegneria sociale — per chi smonta la città senza farsi vedere. Ogni telecamera un occhio, ogni impianto una porta, ogni segreto un'arma.",
      },
      {
        id: "kaan",
        name: "Kaan “Ghost” Demir",
        role: "Ex sicario",
        tagline: "L'uomo che è sfuggito al sistema.",
        quote:
          "Secondo i registri ufficiali sono morto. I registri mentono sempre.",
        bio: "Per vent'anni ha \"risolto problemi\" all'ombra del Compact, mettendo a tacere chi faceva le domande sbagliate. Poi una notte la persona da zittire era un bambino. Si è rifiutato; al mattino i registri lo davano per \"perdita operativa\". Nelle fabbriche arrugginite della Cintura di Ruggine si è costruito una vita silenziosa come una bara. Ma nemmeno i fantasmi trovano pace a Lumenfall: i vecchi fascicoli si riaprono, i vecchi nomi ritornano — e Ghost esce dalla tomba per presentare il conto.",
        playstyle:
          "Combattimento tattico · armi pesanti · irruzione — per chi sfonda le porte invece di bussare. Ogni copertura è una decisione, ogni grilletto una confessione.",
      },
      {
        id: "solene",
        name: "Solene Adeyemi",
        role: "Contrabbandiera orbitale",
        tagline: "La regina fuorilegge del cielo.",
        quote:
          "La gravità è un suggerimento. La dogana una barzelletta. Ma la mia parola è un contratto.",
        bio: "A otto anni contava le stelle dalla navetta cargo del padre; a diciotto era la pilota patentata più giovane di Ascesa; a ventuno le hanno bruciato la licenza — per aver trasportato una famiglia di rifugiati al posto di una cassa proibita. Ora vive nella cabina della Cicogna Nera, nel vuoto grigio tra strada e orbita. Finché un container non rivela il segreto più pericoloso della città — e il destino di tutta Lumenfall finisce nelle mani della donna che non cade mai.",
        playstyle:
          "Velocità · padronanza dei veicoli · fughe impossibili — per chi insegue l'inseguimento. Picchiate nei canyon al neon, manovre a gravità zero in orbita.",
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
    modes: [
      {
        name: "Guerre di distretto",
        body: "Guerra di conquista settimanale: crew contro crew per il controllo dei nove distretti. I vincitori incassano il tributo del distretto e il suo vantaggio di mercato.",
      },
      {
        name: "Il Caveau Zenit",
        body: "Colpo cooperativo per 4 giocatori: viola il caveau dati della stazione orbitale e fuggi a gravità zero. Ogni ruolo conta — hacker, muscoli, pilota, faccia tosta.",
      },
      {
        name: "Lega del contrabbando",
        body: "Trasporti illegali da Sottobruma fino ad Ascesa. Le crew rivali possono rubarti il carico: vince il più astuto, non il più veloce.",
      },
      {
        name: "Roaming libero",
        body: "Una città viva con 40 giocatori e nessuna regola: stringi alleanze, tradiscile e sfuggite insieme allo sguardo di PANOPT.",
      },
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
  game: {
    eyebrow: "DEMO GIOCABILE 3D",
    title: "FUGA NEON",
    tagline: "Pilota il tuo hover-craft tra le torri al neon di LUMENFALL. Schiva i droni di PANOPT, raccogli Lümen e corri verso l'ascensore orbitale.",
    choose: "Scegli il tuo pilota",
    start: "INIZIA",
    restart: "RIPROVA",
    controls: "← → ↑ ↓ / WASD o trascina il dito",
    distance: "DISTANZA",
    lumen: "LÜMEN",
    best: "RECORD",
    threat: "PANOPT",
    score: "PUNTI",
    gameOver: "PRESO",
    gameOverHint: "PANOPT ti ha registrato. La città non dimentica — riprova.",
    newBest: "NUOVO RECORD",
    backHome: "LUMENFALL",
  },
} satisfies Dictionary;
