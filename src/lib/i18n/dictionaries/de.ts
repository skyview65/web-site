import type { Dictionary } from "../dictionary";

export const de = {
  meta: {
    title: "LUMENFALL — Die Dunkelheit leuchtet · 2099",
    description:
      "2099. Drei Leben, ein Schicksal in Lumenfall — einer Megacity unter KI-Herrschaft. Ein Open-World-Krimi-Epos von den Straßen bis in den Orbit. Erscheint 2027.",
    ogAlt: "LUMENFALL — ein Orbitalaufzug über der Neon-Megacity von 2099",
  },
  nav: {
    city: "Die Stadt",
    protagonists: "Charaktere",
    features: "Features",
    online: "LUMENFALL Online",
    editions: "Editionen",
    preorder: "Vorbestellen",
    play: "SPIELEN",
    menuOpen: "Menü öffnen",
    menuClose: "Menü schließen",
    selectLanguage: "Sprache wählen",
    skipToContent: "Zum Inhalt springen",
  },
  hero: {
    kicker: "EIN OPEN-WORLD-KRIMI-EPOS",
    tagline: "Die Dunkelheit leuchtet.",
    releaseWindow: "2027",
    platforms: "PC · KONSOLE · CLOUD",
    cta: "Jetzt vorbestellen",
    scrollHint: "Scrollen zum Entdecken",
    imageAlt:
      "Lumenfall im Jahr 2099: ein Orbitalaufzug durchstößt die Wolken Richtung Sterne, Cyan- und Magenta-Neon auf schwarzen Türmen",
  },
  story: {
    kicker: "DIE GESCHICHTE",
    lines: [
      "Wir schreiben das Jahr 2099. Eine einzige Stadt reicht von den Straßen bis zu den Sternen: Lumenfall.",
      "Eine KI namens PANOPT regiert die Stadt. Sie sieht alles und vergisst nichts.",
      "Du lebst drei Leben: eine Hackerin, ein ehemaliger Vollstrecker und eine Schmugglerpilotin. Drei Geschichten, verknotet zu einem Schicksal.",
    ],
    outro: "In dieser Stadt wird Freiheit gestohlen.",
  },
  city: {
    kicker: "DIE STADT",
    title: "Lumenfall lebt. Selbst wenn du schläfst.",
    paragraphs: [
      "Nach dem Großen Blackout von 2061 aus der Asche neu errichtet, wird Lumenfall heute von PANOPT regiert — einer künstlichen Intelligenz im Stadtmaßstab, die alles kontrolliert: Verkehr und Gerichte, Stromnetze und sogar die Erinnerung selbst. Unter der makellosen Ordnung liegt ein gewaltiges kriminelles Ökosystem, aufgeteilt in neun Bezirke.",
      "Von den Casinos des Neonhafens zu den Gangstraßen des Rostgürtels, von den versunkenen Gassen von Untergrau bis nach Aufstieg, wo der Orbitalaufzug in den Himmel klettert: Jeder Bezirk hat seine eigene Wirtschaft, seine eigenen Regeln, sein eigenes Gedächtnis. Den Geruch einer Straße, die Wut eines Viertels, den Preis, den dir ein Kredithai nennt — die Stadt vergisst nichts davon.",
      "Und die Stadt beobachtet dich. Jede deiner Entscheidungen wird in PANOPTs Register geschrieben — und wartet auf den Tag, an dem sie dich wiederfindet.",
    ],
    stats: [
      { value: "9", label: "BEZIRKE" },
      { value: "310 KM²", label: "STADT + ORBITALEBENE" },
      { value: "1,2 MIO.", label: "SIMULIERTE BÜRGER" },
      { value: "100 %", label: "NAHTLOS — KEINE LADEBILDSCHIRME" },
    ],
    imageAlt:
      "Straßenebene in Lumenfall: Menschenmengen in einer Neonschlucht, Hologramm-Werbung und nasse Asphaltspiegelungen",
  },
  protagonists: {
    kicker: "DREI LEBEN, EIN SCHICKSAL",
    title: "Durch wessen Augen wirst du es erleben?",
    intro:
      "Drei spielbare Charaktere, drei getrennte Welten — und Geschichten, die sich in einem einzigen Knoten verfangen. Wechsle jederzeit zwischen ihnen; jeder lebt sein eigenes Leben weiter, während du fort bist.",
    characters: [
      {
        id: "mara",
        name: "Mara Vex",
        role: "Netrunnerin",
        tagline: "Sucht ihren gelöschten Bruder.",
        quote:
          "Alles Gelöschte hinterlässt irgendwo eine Spur. Ich sammle die Spuren.",
        bio: "Auf dem Schattenmarkt kostet Daten mehr als Blut — und Mara ist seine teuerste Diebin. Mit sechzehn knackte sie ihren ersten Erinnerungstresor; mit achtundzwanzig war ihr Name in PANOPTs geschützten Schichten eine Legende und ihr Gesicht ein Gerücht. Dann wurde eines Nachts ihr Bruder Deniz aus dem System gelöscht — und aus jedem Gedächtnis der Stadt. Als ihre Mutter sein Foto ansah und fragte, \"wer ist dieser Junge?\", schwor Mara einen Eid: Wer Menschen vergessen lässt, bekommt etwas, das er nie vergessen wird.",
        playstyle:
          "Stealth · Hacking · Social Engineering — für Spieler, die die Stadt ungesehen zerlegen. Jede Kamera ein Auge, jedes Implantat eine Tür, jedes Geheimnis eine Waffe.",
      },
      {
        id: "kaan",
        name: "Kaan “Ghost” Demir",
        role: "Ex-Vollstrecker",
        tagline: "Der Mann, der dem System entkam.",
        quote:
          "Laut den offiziellen Akten bin ich tot. Akten lügen immer.",
        bio: "Zwanzig Jahre lang \"löste er Probleme\" im Schatten des Compact — er brachte jene zum Schweigen, die die falschen Fragen stellten. Dann war die Person, die er zum Schweigen bringen sollte, eines Nachts ein Kind. Er weigerte sich; am Morgen führten die Akten ihn als \"operativen Verlust\". In den verrosteten Fabriken des Rostgürtels baute er sich ein Leben, still wie ein Sarg. Doch selbst Geister finden in Lumenfall keinen Frieden: Alte Akten öffnen sich, alte Namen kehren zurück — und Ghost steigt aus seinem Grab, um abzurechnen.",
        playstyle:
          "Taktischer Kampf · schwere Waffen · Erstürmung — für Spieler, die Türen eintreten statt anzuklopfen. Jede Deckung eine Entscheidung, jeder Abzug ein Geständnis.",
      },
      {
        id: "solene",
        name: "Solene Adeyemi",
        role: "Orbital-Schmugglerin",
        tagline: "Die Gesetzlose Königin des Himmels.",
        quote:
          "Schwerkraft ist ein Vorschlag. Der Zoll ein Witz. Aber mein Wort ist ein Vertrag.",
        bio: "Mit acht zählte sie Sterne aus dem Frachtshuttle ihres Vaters; mit achtzehn war sie Aufstiegs jüngste lizenzierte Pilotin; mit einundzwanzig verbrannten sie ihre Lizenz — weil sie statt einer verbotenen Kiste eine geflüchtete Familie transportierte. Jetzt lebt sie im Cockpit des Schwarzen Storchs, in der grauen Leere zwischen Straße und Orbit. Bis ein Container das gefährlichste Geheimnis der Stadt preisgibt — und das Schicksal von ganz Lumenfall in den Händen der Frau landet, die niemals fällt.",
        playstyle:
          "Tempo · Fahrzeugbeherrschung · unmögliche Fluchten — für Spieler, die die Verfolgungsjagd jagen. Sturzflüge durch Neonschluchten, Zero-G-Manöver im Orbit.",
      },
    ],
  },
  features: {
    kicker: "GAMEPLAY",
    title: "Mehr als eine Stadt. Ein System.",
    items: [
      {
        title: "Von der Straße in den Orbit",
        body: "Eine Verfolgungsjagd, die in der U-Bahn beginnt, kann den Orbitalaufzug hinaufführen und in der Schwerelosigkeit auf dem Zenit-Ring enden. Eine Karte, ein Atemzug — keine Ladebildschirme.",
      },
      {
        title: "Eine lebende Stadt",
        body: "Jeder der 1,2 Millionen Bürger trägt eine persistente Identität: Routinen, Beziehungen, Erinnerungen. Der Straßenhändler, den du gestern gerammt hast, erkennt dich morgen wieder.",
      },
      {
        title: "Drei Leben, eine Geschichte",
        body: "Wechsle sofort zwischen Mara, Kaan und Solene. Die Charaktere, die du nicht steuerst, verfolgen ihre eigenen Pläne; ihre Geschichten kreuzen sich durch deine Entscheidungen.",
      },
      {
        title: "Das PANOPT-Reaktionssystem",
        body: "Kein Fahndungslevel — eine Stadt, die dich lernt. PANOPT analysiert deine Verbrechensmuster und baut seine Fallen um sie herum. Derselbe Trick funktioniert nie zweimal.",
      },
      {
        title: "Eine spielergetriebene Wirtschaft",
        body: "Die Preise in neun Bezirken folgen echtem Angebot und echter Nachfrage. Betreibe Schmuggelrouten oder manipuliere den Markt — die Wirtschaft ist dein Spielplatz.",
      },
      {
        title: "Die bodenlose Garage",
        body: "Über 200 Fahrzeuge: vom Hover-Gleiter bis zum Orbital-Shuttle. Jedes lässt sich Teil für Teil modifizieren, und jedes lässt sich stehlen. Ja, auch das Shuttle.",
      },
    ],
  },
  online: {
    kicker: "LIVE-SERVICE",
    title: "LUMENFALL Online: Die Stadt gehört uns allen.",
    body: "Baue mit deiner Vierer-Crew dein eigenes Verbrecherimperium auf. Mit saisonalen Heist-Rotationen, Bezirkskriegen und einer von Spielern geschriebenen Wirtschaft ist Lumenfall eine Welt, die sich weiterdreht — selbst wenn du offline bist.",
    bullets: [
      "12-Wochen-Seasons — jede mit neuer Bezirksstory, neuem Heist und Events",
      "Crew-System: 4-Spieler-Teams, gemeinsame Verstecke, geteilter Tresor",
      "Bezirkskriege: Die Kontrolle über neun Bezirke wechselt jede Woche",
      "Crossplay + Cross-Progression: ein Konto, jedes Gerät",
      "Alle Gameplay-Inhalte werden erspielt — Macht steht niemals zum Verkauf",
    ],
    modes: [
      {
        name: "Bezirkskriege",
        body: "Wöchentlicher Eroberungskrieg: Crew gegen Crew um die Kontrolle über neun Bezirke. Die Sieger kassieren den Tribut des Bezirks und seinen Marktvorteil.",
      },
      {
        name: "Der Zenit-Tresor",
        body: "Koop-Heist für 4 Spieler: Knackt den Datentresor auf der Orbitalstation und flieht in der Schwerelosigkeit. Jede Rolle zählt — Hacker, Muskeln, Pilot, Gesicht.",
      },
      {
        name: "Schmuggler-Liga",
        body: "Illegale Frachtläufe von Untergrau hinauf nach Aufstieg. Rivalisierende Crews können deine Ladung stehlen — es gewinnt nicht der Schnellste, sondern der Schlaueste.",
      },
      {
        name: "Freies Spiel",
        body: "Eine lebende Stadt mit 40 Spielern und ohne Regeln: Schmiede Allianzen, verrate sie und entkomme gemeinsam PANOPTs Blick.",
      },
    ],
    ticker:
      "SEASON 01: BLACKOUT-PROTOKOLL · NEUER HEIST: DER ZENIT-TRESOR · BEZIRKSKRIEG: NEONHAFEN · DOPPELTE-LUMEN-WOCHE",
    imageAlt:
      "Eine Vierer-Crew um einen holografischen Heist-Planungstisch in einem dunklen Versteck",
  },
  editions: {
    kicker: "VORBESTELLUNG",
    title: "Wähle deine Edition.",
    tiers: [
      {
        id: "standard",
        name: "Standard",
        tag: "",
        price: "79,99 €",
        contents: [
          "LUMENFALL Hauptspiel",
          "Zugang zu LUMENFALL Online",
          "Vorbesteller-Bonus: „Blackout“-Fahrzeugfolierung",
        ],
        cta: "Standard wählen",
      },
      {
        id: "deluxe",
        name: "Deluxe",
        tag: "Am beliebtesten",
        price: "109,99 €",
        contents: [
          "Hauptspiel + LUMENFALL Online",
          "72 Stunden Vorabzugang",
          "Digitales Artbook + Original-Soundtrack",
          "„Schattenmarkt“-Outfit-Kollektion",
          "Season-01-Prisma-Kosmetikpaket",
        ],
        cta: "Deluxe wählen",
      },
      {
        id: "eternal",
        name: "Eternal",
        tag: "Collector's",
        price: "139,99 €",
        contents: [
          "Alles aus der Deluxe-Edition",
          "Year-One-Erweiterungspass (2 Story-Pakete)",
          "Apartment am Zenit-Ring (Versteck im Spiel)",
          "Exklusive „Eternal“-Monogramm-Fahrzeugserie",
          "Dein Name auf einer Straße in Lumenfall*",
        ],
        cta: "Eternal wählen",
      },
    ],
    note: "*Limitiert auf die ersten 10.000 Eternal-Vorbestellungen. Alle Inhalte sind fiktiv; Preise sind illustrativ. Nichts, was das Gameplay beeinflusst, wird jemals für echtes Geld verkauft.",
    imageAlt:
      "Eine Collector's-Box von LUMENFALL mit cyanfarbenem V-Emblem und Neonspiegelungen auf schwarzem Glas",
  },
  newsletter: {
    title: "Trag dich auf die Blackout-Liste ein.",
    body: "Trailer, Closed-Beta-Einladungen und Season-News — kein Spam, nur Signal.",
    placeholder: "deine E-Mail-Adresse",
    button: "Anmelden",
    success: "Du stehst auf der Liste. Die Dunkelheit meldet sich.",
    privacy: "Jederzeit mit einem Klick abmeldbar.",
  },
  footer: {
    fictional:
      "LUMENFALL ist ein fiktives Spiel, entstanden als Konzeptarbeit. Es besteht keine Verbindung zu realen Produkten, Studios oder Marken.",
    rights: "© 2099 Lumenworks Studios. Alle Rechte — vorerst — vorbehalten.",
    studio: "Lumenworks Studios",
  },
  game: {
    eyebrow: "SPIELBARE DEMO",
    title: "NEON-FLUCHT",
    tagline: "Steuere dein Hover-Bike durch den Neon-Canyon. Finde die Lücken in PANOPTs Drohnenwänden, sammle Lümen, lass dich nicht schnappen.",
    start: "START",
    restart: "NEU",
    controls: "↑ ↓ / W S oder mit dem Finger ziehen",
    distance: "DISTANZ",
    lumen: "LÜMEN",
    best: "REKORD",
    threat: "PANOPT",
    score: "PUNKTE",
    gameOver: "ERWISCHT",
    gameOverHint: "PANOPT hat dich registriert. Die Stadt vergisst nie — versuch es erneut.",
    newBest: "NEUER REKORD",
    backHome: "LUMENFALL",
  },
} satisfies Dictionary;
