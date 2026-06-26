// AUTO-PORTED from the CALA reference site (window.CALA_I18N).
// Turkish (tr) is the source text rendered in JSX; these are the translations a
// visitor switches to via the language selector. Values may contain inline
// <em> markup, so they are injected with dangerouslySetInnerHTML by <T>.

export const LANGS = [
  { code: "tr", label: "TR" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "fr", label: "FR" },
  { code: "ru", label: "RU" },
  { code: "el", label: "EL" },
  { code: "de", label: "DE" },
] as const;

export type Lang = (typeof LANGS)[number]["code"];

export type Dict = Record<string, Partial<Record<Lang, string>>>;

export const I18N: Dict = {
  "nav_menu": {
    "en": "MENU",
    "es": "MENÚ",
    "fr": "MENU",
    "ru": "МЕНЮ",
    "el": "ΜΕΝΟΥ",
    "de": "MENÜ"
  },
  "nav_rez": {
    "en": "RESERVE",
    "es": "RESERVAR",
    "fr": "RÉSERVER",
    "ru": "БРОНИРОВАНИЕ",
    "el": "ΚΡΑΤΗΣΗ",
    "de": "RESERVIEREN"
  },
  "menu_close": {
    "en": "CLOSE",
    "es": "CERRAR",
    "fr": "FERMER",
    "ru": "ЗАКРЫТЬ",
    "el": "ΚΛΕΙΣΙΜΟ",
    "de": "SCHLIESSEN"
  },
  "menu_1": {
    "en": "The Stone House",
    "es": "La Casa de Piedra",
    "fr": "La Maison de Pierre",
    "ru": "Каменный дом",
    "el": "Το Πέτρινο Σπίτι",
    "de": "Das Steinhaus"
  },
  "menu_2": {
    "en": "Suites",
    "es": "Suites",
    "fr": "Suites",
    "ru": "Номера",
    "el": "Σουίτες",
    "de": "Suiten"
  },
  "menu_3": {
    "en": "The Table",
    "es": "La Mesa",
    "fr": "La Table",
    "ru": "Стол",
    "el": "Το Τραπέζι",
    "de": "Die Tafel"
  },
  "menu_4": {
    "en": "Guestbook",
    "es": "Libro de Visitas",
    "fr": "Livre d'Or",
    "ru": "Книга гостей",
    "el": "Βιβλίο Επισκεπτών",
    "de": "Gästebuch"
  },
  "menu_5": {
    "en": "Reservation",
    "es": "Reserva",
    "fr": "Réservation",
    "ru": "Бронирование",
    "el": "Κράτηση",
    "de": "Reservierung"
  },
  "hero_tag": {
    "en": "KAŞ · TURKEY · LYCIAN COAST",
    "es": "KAŞ · TURQUÍA · COSTA LICIA",
    "fr": "KAŞ · TURQUIE · CÔTE LYCIENNE",
    "ru": "КАШ · ТУРЦИЯ · ЛИКИЙСКОЕ ПОБЕРЕЖЬЕ",
    "el": "ΚΑΣ · ΤΟΥΡΚΙΑ · ΛΥΚΙΑΚΗ ΑΚΤΗ",
    "de": "KAŞ · TÜRKEI · LYKISCHE KÜSTE"
  },
  "hero_l1": {
    "en": "Above a hidden cove,",
    "es": "Sobre una cala escondida,",
    "fr": "Au-dessus d'une crique cachée,",
    "ru": "Над укромной бухтой,",
    "el": "Πάνω από έναν κρυφό όρμο,",
    "de": "Über einer verborgenen Bucht,"
  },
  "hero_l2": {
    "en": "catching the light —",
    "es": "atrapando la luz —",
    "fr": "captant la lumière —",
    "ru": "ловя свет —",
    "el": "που αιχμαλωτίζουν το φως —",
    "de": "das Licht einfangend —"
  },
  "hero_l3": {
    "en": "<em>nine suites.</em>",
    "es": "<em>nueve suites.</em>",
    "fr": "<em>neuf suites.</em>",
    "ru": "<em>девять номеров.</em>",
    "el": "<em>εννέα σουίτες.</em>",
    "de": "<em>neun Suiten.</em>"
  },
  "hero_p": {
    "en": "An adults-only boutique hotel. Forty metres above a crystal-clear cove. Open from April to November.",
    "es": "Un hotel boutique solo para adultos. A cuarenta metros sobre una cala cristalina. Abierto de abril a noviembre.",
    "fr": "Un hôtel de charme réservé aux adultes. À quarante mètres au-dessus d'une crique limpide. Ouvert d'avril à novembre.",
    "ru": "Бутик-отель только для взрослых. В сорока метрах над прозрачной бухтой. Открыт с апреля по ноябрь.",
    "el": "Ένα boutique ξενοδοχείο μόνο για ενήλικες. Σαράντα μέτρα πάνω από έναν κρυστάλλινο όρμο. Ανοιχτό από Απρίλιο έως Νοέμβριο.",
    "de": "Ein Boutique-Hotel nur für Erwachsene. Vierzig Meter über einer kristallklaren Bucht. Von April bis November geöffnet."
  },
  "serit_1": {
    "en": "NINE SUITES",
    "es": "NUEVE SUITES",
    "fr": "NEUF SUITES",
    "ru": "ДЕВЯТЬ НОМЕРОВ",
    "el": "ΕΝΝΕΑ ΣΟΥΙΤΕΣ",
    "de": "NEUN SUITEN"
  },
  "serit_2": {
    "en": "ADULTS ONLY",
    "es": "SOLO ADULTOS",
    "fr": "ADULTES UNIQUEMENT",
    "ru": "ТОЛЬКО ДЛЯ ВЗРОСЛЫХ",
    "el": "ΜΟΝΟ ΕΝΗΛΙΚΕΣ",
    "de": "NUR FÜR ERWACHSENE"
  },
  "serit_3": {
    "en": "92 STEPS TO THE SEA",
    "es": "92 ESCALONES AL MAR",
    "fr": "92 MARCHES VERS LA MER",
    "ru": "92 СТУПЕНИ К МОРЮ",
    "el": "92 ΣΚΑΛΟΠΑΤΙΑ ΩΣ ΤΗ ΘΑΛΑΣΣΑ",
    "de": "92 STUFEN ZUM MEER"
  },
  "tasev_tag": {
    "en": "THE STONE HOUSE",
    "es": "LA CASA DE PIEDRA",
    "fr": "LA MAISON DE PIERRE",
    "ru": "КАМЕННЫЙ ДОМ",
    "el": "ΤΟ ΠΕΤΡΙΝΟ ΣΠΙΤΙ",
    "de": "DAS STEINHAUS"
  },
  "tasev_h2": {
    "en": "The road ends here. The path winds <em>down</em> through the olive trees.",
    "es": "El camino termina aquí. El sendero baja <em>serpenteando</em> entre los olivos.",
    "fr": "La route s'arrête ici. Le sentier descend <em>en lacets</em> à travers les oliviers.",
    "ru": "Дорога здесь заканчивается. Тропа <em>спускается</em> вниз через оливковые рощи.",
    "el": "Ο δρόμος τελειώνει εδώ. Το μονοπάτι κατηφορίζει <em>κάτω</em> μέσα από τις ελιές.",
    "de": "Die Straße endet hier. Der Pfad windet sich <em>hinab</em> durch die Olivenbäume."
  },
  "tasev_p": {
    "en": "CALA is the Mediterranean name for a hidden cove: invisible from the main road, barely visible from the sea. Built in the 1960s as a fisherman's house, the stone structure was turned into nine suites without touching its original walls. The aim is the same as on the first day: to step away from the world for a while.",
    "es": "CALA es el nombre mediterráneo de una cala escondida: invisible desde la carretera, apenas perceptible desde el mar. Construida en los años sesenta como casa de pescadores, la estructura de piedra se convirtió en nueve suites sin tocar sus muros originales. El propósito sigue siendo el del primer día: alejarse del mundo por un tiempo.",
    "fr": "CALA est le nom méditerranéen d'une crique cachée : invisible depuis la route, à peine perceptible depuis la mer. Construite dans les années 1960 comme maison de pêcheur, la bâtisse en pierre a été transformée en neuf suites sans toucher à ses murs d'origine. Le but reste celui du premier jour : s'éloigner du monde pour un temps.",
    "ru": "CALA — средиземноморское название укромной бухты: невидима с главной дороги, едва различима с моря. Построенный в 1960-х как дом рыбака, каменный дом был превращён в девять номеров, не тронув исходные стены. Цель та же, что и в первый день: на время уйти от мира.",
    "el": "Η CALA είναι η μεσογειακή ονομασία ενός κρυμμένου όρμου: αόρατη από τον κεντρικό δρόμο, μόλις διακρίνεται από τη θάλασσα. Χτισμένο τη δεκαετία του 1960 ως σπίτι ψαρά, το πέτρινο κτίσμα μετατράπηκε σε εννέα σουίτες χωρίς να αγγίξει τους αυθεντικούς του τοίχους. Ο σκοπός παραμένει ίδιος με την πρώτη μέρα: να απομακρυνθείς από τον κόσμο για λίγο.",
    "de": "CALA ist der mediterrane Name für eine versteckte Bucht: von der Hauptstraße aus unsichtbar, vom Meer aus kaum zu erkennen. In den 1960er-Jahren als Fischerhaus erbaut, wurde der Steinbau in neun Suiten verwandelt, ohne seine ursprünglichen Mauern anzutasten. Das Ziel ist dasselbe wie am ersten Tag: sich eine Weile von der Welt zu entfernen."
  },
  "tasev_pnot": {
    "en": "COVE · AFTERNOON",
    "es": "CALA · TARDE",
    "fr": "CRIQUE · APRÈS-MIDI",
    "ru": "БУХТА · ПОСЛЕ ПОЛУДНЯ",
    "el": "ΟΡΜΟΣ · ΑΠΟΓΕΥΜΑ",
    "de": "BUCHT · NACHMITTAG"
  },
  "dalis_tag": {
    "en": "COVE · UNDERWATER",
    "es": "CALA · BAJO EL AGUA",
    "fr": "CRIQUE · SOUS L'EAU",
    "ru": "БУХТА · ПОД ВОДОЙ",
    "el": "ΟΡΜΟΣ · ΥΠΟΒΡΥΧΙΑ",
    "de": "BUCHT · UNTER WASSER"
  },
  "dalis_h2": {
    "en": "The sea belongs to those who know how to wait.",
    "es": "El mar es de quienes saben esperar.",
    "fr": "La mer appartient à ceux qui savent attendre.",
    "ru": "Море принадлежит тем, кто умеет ждать.",
    "el": "Η θάλασσα ανήκει σε όσους ξέρουν να περιμένουν.",
    "de": "Das Meer gehört denen, die zu warten wissen."
  },
  "dalis_alt": {
    "en": "Forty metres below, a clarity no one else sees.",
    "es": "Cuarenta metros más abajo, una claridad que nadie más ve.",
    "fr": "Quarante mètres plus bas, une clarté que personne d'autre ne voit.",
    "ru": "В сорока метрах внизу — прозрачность, которую не видит никто другой.",
    "el": "Σαράντα μέτρα πιο κάτω, μια διαύγεια που κανείς άλλος δεν βλέπει.",
    "de": "Vierzig Meter tiefer, eine Klarheit, die sonst niemand sieht."
  },
  "kapak_suit_h2": {
    "en": "SUITES",
    "es": "SUITES",
    "fr": "SUITES",
    "ru": "НОМЕРА",
    "el": "ΣΟΥΙΤΕΣ",
    "de": "SUITEN"
  },
  "kapak_suit_alt": {
    "en": "NINE ROOMS · NINE LIGHTS",
    "es": "NUEVE HABITACIONES · NUEVE LUCES",
    "fr": "NEUF CHAMBRES · NEUF LUMIÈRES",
    "ru": "ДЕВЯТЬ КОМНАТ · ДЕВЯТЬ СВЕТОВ",
    "el": "ΕΝΝΕΑ ΔΩΜΑΤΙΑ · ΕΝΝΕΑ ΦΩΤΑ",
    "de": "NEUN ZIMMER · NEUN LICHTER"
  },
  "suit_tag": {
    "en": "NINE SUITES",
    "es": "NUEVE SUITES",
    "fr": "NEUF SUITES",
    "ru": "ДЕВЯТЬ НОМЕРОВ",
    "el": "ΕΝΝΕΑ ΣΟΥΙΤΕΣ",
    "de": "NEUN SUITEN"
  },
  "suit_h2": {
    "en": "Each suite catches a different <em>light</em> of the day.",
    "es": "Cada suite capta una <em>luz</em> distinta del día.",
    "fr": "Chaque suite capte une <em>lumière</em> différente du jour.",
    "ru": "Каждый номер ловит свой <em>свет</em> дня.",
    "el": "Κάθε σουίτα αιχμαλωτίζει ένα διαφορετικό <em>φως</em> της ημέρας.",
    "de": "Jede Suite fängt ein anderes <em>Licht</em> des Tages ein."
  },
  "suit_baslik": {
    "en": "OUR SUITES",
    "es": "NUESTRAS SUITES",
    "fr": "NOS SUITES",
    "ru": "НАШИ НОМЕРА",
    "el": "ΟΙ ΣΟΥΙΤΕΣ ΜΑΣ",
    "de": "UNSERE SUITEN"
  },
  "s1": {
    "en": "Seher<i>first light</i>",
    "es": "Seher<i>primera luz</i>",
    "fr": "Seher<i>première lueur</i>",
    "ru": "Seher<i>первый свет</i>",
    "el": "Seher<i>πρώτο φως</i>",
    "de": "Seher<i>erstes Licht</i>"
  },
  "s2": {
    "en": "Şafak<i>red sunrise</i>",
    "es": "Şafak<i>amanecer rojo</i>",
    "fr": "Şafak<i>aube rouge</i>",
    "ru": "Şafak<i>багряный рассвет</i>",
    "el": "Şafak<i>κόκκινη ανατολή</i>",
    "de": "Şafak<i>rote Morgenröte</i>"
  },
  "s3": {
    "en": "Kuşluk<i>morning warmth</i>",
    "es": "Kuşluk<i>calor de la mañana</i>",
    "fr": "Kuşluk<i>chaleur du matin</i>",
    "ru": "Kuşluk<i>утреннее тепло</i>",
    "el": "Kuşluk<i>πρωινή ζέστη</i>",
    "de": "Kuşluk<i>Morgenwärme</i>"
  },
  "s4": {
    "en": "Öğle<i>high light</i>",
    "es": "Öğle<i>luz cenital</i>",
    "fr": "Öğle<i>lumière zénithale</i>",
    "ru": "Öğle<i>отвесный свет</i>",
    "el": "Öğle<i>κατακόρυφο φως</i>",
    "de": "Öğle<i>senkrechtes Licht</i>"
  },
  "s5": {
    "en": "İkindi<i>lengthening shadow</i>",
    "es": "İkindi<i>sombra que se alarga</i>",
    "fr": "İkindi<i>ombre qui s'allonge</i>",
    "ru": "İkindi<i>удлиняющаяся тень</i>",
    "el": "İkindi<i>σκιά που μακραίνει</i>",
    "de": "İkindi<i>länger werdender Schatten</i>"
  },
  "s6": {
    "en": "Gurup<i>the setting hour</i>",
    "es": "Gurup<i>la hora del ocaso</i>",
    "fr": "Gurup<i>l'heure du couchant</i>",
    "ru": "Gurup<i>час заката</i>",
    "el": "Gurup<i>η ώρα της δύσης</i>",
    "de": "Gurup<i>die Stunde des Sonnenuntergangs</i>"
  },
  "s7": {
    "en": "Alacakaranlık<i>between two lights</i>",
    "es": "Alacakaranlık<i>entre dos luces</i>",
    "fr": "Alacakaranlık<i>entre deux lumières</i>",
    "ru": "Alacakaranlık<i>между двух светов</i>",
    "el": "Alacakaranlık<i>ανάμεσα σε δύο φώτα</i>",
    "de": "Alacakaranlık<i>zwischen zwei Lichtern</i>"
  },
  "s8": {
    "en": "Mehtap<i>the moonpath</i>",
    "es": "Mehtap<i>el sendero de la luna</i>",
    "fr": "Mehtap<i>le chemin de lune</i>",
    "ru": "Mehtap<i>лунная дорожка</i>",
    "el": "Mehtap<i>το μονοπάτι του φεγγαριού</i>",
    "de": "Mehtap<i>der Mondpfad</i>"
  },
  "s9": {
    "en": "Yıldız<i>roof window</i>",
    "es": "Yıldız<i>ventana al cielo</i>",
    "fr": "Yıldız<i>fenêtre sur le ciel</i>",
    "ru": "Yıldız<i>окно в крыше</i>",
    "el": "Yıldız<i>παράθυρο οροφής</i>",
    "de": "Yıldız<i>Dachfenster</i>"
  },
  "o1": {
    "en": "SEA FRONT",
    "es": "FRENTE AL MAR",
    "fr": "FACE À LA MER",
    "ru": "ВИД НА МОРЕ",
    "el": "ΘΕΑ ΣΤΗ ΘΑΛΑΣΣΑ",
    "de": "ZUM MEER"
  },
  "o2": {
    "en": "SEA FRONT",
    "es": "FRENTE AL MAR",
    "fr": "FACE À LA MER",
    "ru": "ВИД НА МОРЕ",
    "el": "ΘΕΑ ΣΤΗ ΘΑΛΑΣΣΑ",
    "de": "ZUM MEER"
  },
  "o3": {
    "en": "GARDEN",
    "es": "JARDÍN",
    "fr": "JARDIN",
    "ru": "САД",
    "el": "ΚΗΠΟΣ",
    "de": "GARTEN"
  },
  "o4": {
    "en": "TERRACE + TUB",
    "es": "TERRAZA + BAÑERA",
    "fr": "TERRASSE + BAIGNOIRE",
    "ru": "ТЕРРАСА + ВАННА",
    "el": "ΒΕΡΑΝΤΑ + ΜΠΑΝΙΕΡΑ",
    "de": "TERRASSE + WANNE"
  },
  "o5": {
    "en": "SEA FRONT",
    "es": "FRENTE AL MAR",
    "fr": "FACE À LA MER",
    "ru": "ВИД НА МОРЕ",
    "el": "ΘΕΑ ΣΤΗ ΘΑΛΑΣΣΑ",
    "de": "ZUM MEER"
  },
  "o6": {
    "en": "WEST TERRACE",
    "es": "TERRAZA OESTE",
    "fr": "TERRASSE OUEST",
    "ru": "ЗАПАДНАЯ ТЕРРАСА",
    "el": "ΔΥΤΙΚΗ ΒΕΡΑΝΤΑ",
    "de": "WESTTERRASSE"
  },
  "o7": {
    "en": "GARDEN",
    "es": "JARDÍN",
    "fr": "JARDIN",
    "ru": "САД",
    "el": "ΚΗΠΟΣ",
    "de": "GARTEN"
  },
  "o8": {
    "en": "SEA FRONT",
    "es": "FRENTE AL MAR",
    "fr": "FACE À LA MER",
    "ru": "ВИД НА МОРЕ",
    "el": "ΘΕΑ ΣΤΗ ΘΑΛΑΣΣΑ",
    "de": "ZUM MEER"
  },
  "o9": {
    "en": "ROOF SUITE",
    "es": "SUITE ÁTICO",
    "fr": "SUITE TOIT",
    "ru": "ПЕНТХАУС",
    "el": "ΣΟΥΙΤΑ ΟΡΟΦΗΣ",
    "de": "DACHSUITE"
  },
  "suit_not": {
    "en": "No suite has a television. Every one has a corner for watching the light change through the day.",
    "es": "Ninguna suite tiene televisor. Todas tienen un rincón para contemplar cómo cambia la luz a lo largo del día.",
    "fr": "Aucune suite n'a de télévision. Chacune possède un coin pour regarder la lumière changer au fil du jour.",
    "ru": "Ни в одном номере нет телевизора. В каждом есть уголок, чтобы наблюдать, как меняется свет в течение дня.",
    "el": "Καμία σουίτα δεν έχει τηλεόραση. Όλες έχουν μια γωνιά για να παρακολουθείς το φως να αλλάζει μέσα στην ημέρα.",
    "de": "Keine Suite hat einen Fernseher. Jede hat eine Ecke, um das wechselnde Licht des Tages zu betrachten."
  },
  "kapak_sofra_h2": {
    "en": "THE TABLE",
    "es": "LA MESA",
    "fr": "LA TABLE",
    "ru": "СТОЛ",
    "el": "ΤΟ ΤΡΑΠΕΖΙ",
    "de": "DIE TAFEL"
  },
  "kapak_sofra_alt": {
    "en": "FROM THE SEA AND THE GARDEN",
    "es": "DEL MAR Y DEL HUERTO",
    "fr": "DE LA MER ET DU JARDIN",
    "ru": "ИЗ МОРЯ И САДА",
    "el": "ΑΠΟ ΤΗ ΘΑΛΑΣΣΑ ΚΑΙ ΤΟΝ ΚΗΠΟ",
    "de": "AUS DEM MEER UND DEM GARTEN"
  },
  "bf_pnot": {
    "en": "STONE TERRACE · MORNING",
    "es": "TERRAZA DE PIEDRA · MAÑANA",
    "fr": "TERRASSE DE PIERRE · MATIN",
    "ru": "КАМЕННАЯ ТЕРРАСА · УТРО",
    "el": "ΠΕΤΡΙΝΗ ΒΕΡΑΝΤΑ · ΠΡΩΙ",
    "de": "STEINTERRASSE · MORGEN"
  },
  "bf_h3": {
    "en": "BREAKFAST",
    "es": "DESAYUNO",
    "fr": "PETIT-DÉJEUNER",
    "ru": "ЗАВТРАК",
    "el": "ΠΡΩΙΝΟ",
    "de": "FRÜHSTÜCK"
  },
  "bf_p": {
    "en": "Breakfast is served on the stone terrace, late into the morning. Tomatoes and fresh herbs from the garden, village eggs, bread from the wood oven, Kaş honey and goat cheese; tea from the pot, coffee cooked over embers.",
    "es": "El desayuno se sirve en la terraza de piedra, hasta entrada la mañana. Tomates y hierbas frescas del huerto, huevos de pueblo, pan del horno de leña, miel de Kaş y queso de cabra; té de la tetera, café hecho sobre las brasas.",
    "fr": "Le petit-déjeuner est servi sur la terrasse de pierre, jusque tard dans la matinée. Tomates et herbes fraîches du jardin, œufs de village, pain du four à bois, miel de Kaş et fromage de chèvre ; thé de la théière, café cuit sur la braise.",
    "ru": "Завтрак подаётся на каменной террасе до позднего утра. Помидоры и свежие травы из сада, деревенские яйца, хлеб из дровяной печи, мёд из Каша и козий сыр; чай из чайника, кофе на углях.",
    "el": "Το πρωινό σερβίρεται στην πέτρινη βεράντα, ως αργά το πρωί. Ντομάτες και φρέσκα μυρωδικά από τον κήπο, χωριάτικα αυγά, ψωμί από τον ξυλόφουρνο, μέλι του Κας και κατσικίσιο τυρί· τσάι από την τσαγιέρα, καφές στη χόβολη.",
    "de": "Das Frühstück wird auf der Steinterrasse bis in den späten Vormittag serviert. Tomaten und frische Kräuter aus dem Garten, Dorfeier, Brot aus dem Holzofen, Honig aus Kaş und Ziegenkäse; Tee aus der Kanne, Kaffee über der Glut gekocht."
  },
  "bf_saat": {
    "en": "Weekdays&nbsp;&nbsp;08:00 – 11:30<br>Weekends&nbsp;&nbsp;08:00 – 12:00",
    "es": "Entre semana&nbsp;&nbsp;08:00 – 11:30<br>Fines de semana&nbsp;&nbsp;08:00 – 12:00",
    "fr": "En semaine&nbsp;&nbsp;08:00 – 11:30<br>Week-end&nbsp;&nbsp;08:00 – 12:00",
    "ru": "Будни&nbsp;&nbsp;08:00 – 11:30<br>Выходные&nbsp;&nbsp;08:00 – 12:00",
    "el": "Καθημερινές&nbsp;&nbsp;08:00 – 11:30<br>Σαββατοκύριακο&nbsp;&nbsp;08:00 – 12:00",
    "de": "Wochentags&nbsp;&nbsp;08:00 – 11:30<br>Wochenende&nbsp;&nbsp;08:00 – 12:00"
  },
  "ln_pnot": {
    "en": "NOON · FACING THE VIEW",
    "es": "MEDIODÍA · FRENTE A LA VISTA",
    "fr": "MIDI · FACE À LA VUE",
    "ru": "ПОЛДЕНЬ · ЛИЦОМ К ВИДУ",
    "el": "ΜΕΣΗΜΕΡΙ · ΜΕ ΘΕΑ",
    "de": "MITTAG · MIT BLICK"
  },
  "ln_h3": {
    "en": "LUNCH",
    "es": "ALMUERZO",
    "fr": "DÉJEUNER",
    "ru": "ОБЕД",
    "el": "ΜΕΣΗΜΕΡΙΑΝΟ",
    "de": "MITTAGESSEN"
  },
  "ln_p": {
    "en": "Lunch is kept light: the day's fresh fish grilled, greens from the garden, bread from the stone oven. Tables are set in the shade, facing the sea; the time is entirely yours.",
    "es": "El almuerzo es ligero: el pescado fresco del día a la parrilla, verduras del huerto, pan del horno de piedra. Las mesas se ponen a la sombra, frente al mar; el tiempo es enteramente suyo.",
    "fr": "Le déjeuner reste léger : le poisson frais du jour grillé, légumes du jardin, pain du four en pierre. Les tables sont dressées à l'ombre, face à la mer ; le temps n'appartient qu'à vous.",
    "ru": "Обед лёгкий: свежая рыба дня на гриле, зелень из сада, хлеб из каменной печи. Столы накрывают в тени, лицом к морю; время целиком ваше.",
    "el": "Το μεσημεριανό κρατιέται ελαφρύ: το φρέσκο ψάρι της ημέρας στη σχάρα, χόρτα από τον κήπο, ψωμί από τον πέτρινο φούρνο. Τα τραπέζια στρώνονται στη σκιά, με θέα στη θάλασσα· ο χρόνος είναι όλος δικός σας.",
    "de": "Das Mittagessen bleibt leicht: der frische Fisch des Tages vom Grill, Grünes aus dem Garten, Brot aus dem Steinofen. Die Tische stehen im Schatten, zum Meer gewandt; die Zeit gehört ganz Ihnen."
  },
  "ln_saat": {
    "en": "Daily&nbsp;&nbsp;12:30 – 15:00",
    "es": "A diario&nbsp;&nbsp;12:30 – 15:00",
    "fr": "Tous les jours&nbsp;&nbsp;12:30 – 15:00",
    "ru": "Ежедневно&nbsp;&nbsp;12:30 – 15:00",
    "el": "Καθημερινά&nbsp;&nbsp;12:30 – 15:00",
    "de": "Täglich&nbsp;&nbsp;12:30 – 15:00"
  },
  "dn_pnot": {
    "en": "EVENING PLATE · LOBSTER AND CAVIAR",
    "es": "PLATO DE NOCHE · LANGOSTA Y CAVIAR",
    "fr": "ASSIETTE DU SOIR · HOMARD ET CAVIAR",
    "ru": "ВЕЧЕРНЕЕ БЛЮДО · ОМАР И ИКРА",
    "el": "ΒΡΑΔΙΝΟ ΠΙΑΤΟ · ΑΣΤΑΚΟΣ ΚΑΙ ΧΑΒΙΑΡΙ",
    "de": "ABENDTELLER · HUMMER UND KAVIAR"
  },
  "dn_h3": {
    "en": "DINNER",
    "es": "CENA",
    "fr": "DÎNER",
    "ru": "УЖИН",
    "el": "ΔΕΙΠΝΟ",
    "de": "ABENDESSEN"
  },
  "dn_p": {
    "en": "At dinner a single menu is served, prepared from the best the sea and garden gave that morning. It is served at sunset, in one sitting. The menu is written in chalk on the kitchen door each evening. To reserve your table, simply let us know by 16:00 the same day.",
    "es": "En la cena se ofrece un único menú, elaborado con lo mejor que el mar y el huerto dieron esa mañana. Se sirve al atardecer, en un solo turno. El menú se escribe con tiza en la puerta de la cocina cada noche. Para reservar su mesa, basta con avisarnos antes de las 16:00 del mismo día.",
    "fr": "Au dîner, un menu unique est servi, préparé avec le meilleur de ce que la mer et le jardin ont offert le matin même. Il est servi au coucher du soleil, en un seul service. Le menu est écrit à la craie sur la porte de la cuisine chaque soir. Pour réserver votre table, il suffit de nous prévenir avant 16 h le jour même.",
    "ru": "На ужин подаётся единственное меню, приготовленное из лучшего, что море и сад дали в то утро. Его подают на закате, в один приём. Меню каждый вечер пишут мелом на двери кухни. Чтобы забронировать столик, достаточно сообщить нам до 16:00 того же дня.",
    "el": "Στο δείπνο σερβίρεται ένα μόνο μενού, φτιαγμένο από τα καλύτερα που έδωσαν η θάλασσα και ο κήπος εκείνο το πρωί. Σερβίρεται το ηλιοβασίλεμα, σε μία καθισιά. Το μενού γράφεται με κιμωλία στην πόρτα της κουζίνας κάθε βράδυ. Για να κρατήσετε το τραπέζι σας, αρκεί να μας ειδοποιήσετε ως τις 16:00 την ίδια μέρα.",
    "de": "Zum Abendessen wird ein einziges Menü serviert, zubereitet aus dem Besten, das Meer und Garten an diesem Morgen gegeben haben. Es wird bei Sonnenuntergang in einem einzigen Durchgang serviert. Das Menü wird jeden Abend mit Kreide an die Küchentür geschrieben. Um Ihren Tisch zu reservieren, genügt eine Mitteilung bis 16:00 Uhr am selben Tag."
  },
  "dn_saat": {
    "en": "Every evening&nbsp;&nbsp;19:30 · One sitting<br>April – November",
    "es": "Cada noche&nbsp;&nbsp;19:30 · Un solo turno<br>Abril – Noviembre",
    "fr": "Chaque soir&nbsp;&nbsp;19:30 · Un seul service<br>Avril – Novembre",
    "ru": "Каждый вечер&nbsp;&nbsp;19:30 · Один приём<br>Апрель – Ноябрь",
    "el": "Κάθε βράδυ&nbsp;&nbsp;19:30 · Μία καθισιά<br>Απρίλιος – Νοέμβριος",
    "de": "Jeden Abend&nbsp;&nbsp;19:30 · Ein Durchgang<br>April – November"
  },
  "rev_tag": {
    "en": "GUESTBOOK",
    "es": "LIBRO DE VISITAS",
    "fr": "LIVRE D'OR",
    "ru": "КНИГА ГОСТЕЙ",
    "el": "ΒΙΒΛΙΟ ΕΠΙΣΚΕΠΤΩΝ",
    "de": "GÄSTEBUCH"
  },
  "rev_h2": {
    "en": "Those who <em>return</em> tell it best.",
    "es": "Quienes <em>vuelven</em> lo cuentan mejor.",
    "fr": "Ceux qui <em>reviennent</em> en parlent le mieux.",
    "ru": "Лучше всех расскажут те, кто <em>возвращается</em>.",
    "el": "Όσοι <em>επιστρέφουν</em> το λένε καλύτερα.",
    "de": "Wer <em>wiederkommt</em>, erzählt es am besten."
  },
  "rev_puan": {
    "en": "<b>4.9 / 5</b> · 100+ REVIEWS · LAST TWO SEASONS",
    "es": "<b>4,9 / 5</b> · 100+ RESEÑAS · ÚLTIMAS DOS TEMPORADAS",
    "fr": "<b>4,9 / 5</b> · 100+ AVIS · DEUX DERNIÈRES SAISONS",
    "ru": "<b>4,9 / 5</b> · 100+ ОТЗЫВОВ · ПОСЛЕДНИЕ ДВА СЕЗОНА",
    "el": "<b>4,9 / 5</b> · 100+ ΚΡΙΤΙΚΕΣ · ΔΥΟ ΤΕΛΕΥΤΑΙΕΣ ΣΕΖΟΝ",
    "de": "<b>4,9 / 5</b> · 100+ BEWERTUNGEN · LETZTE ZWEI SAISONS"
  },
  "rev_q1": {
    "en": "Reading '92 steps' had scared me. By the third day I realised: that descent had become my favourite part of the day. With each step the sea comes a little closer.",
    "es": "Leer '92 escalones' me había asustado. Al tercer día me di cuenta: ese descenso se había convertido en mi momento favorito del día. Con cada escalón el mar se acerca un poco más.",
    "fr": "Lire « 92 marches » m'avait effrayé. Au troisième jour, j'ai compris : cette descente était devenue mon moment préféré de la journée. À chaque marche, la mer se rapproche un peu.",
    "ru": "Прочитав «92 ступени», я испугался. На третий день я понял: этот спуск стал моей любимой частью дня. С каждой ступенью море становится чуть ближе.",
    "el": "Όταν διάβασα «92 σκαλοπάτια» φοβήθηκα. Την τρίτη μέρα συνειδητοποίησα: εκείνη η κατάβαση είχε γίνει το αγαπημένο μου κομμάτι της ημέρας. Με κάθε σκαλοπάτι η θάλασσα πλησιάζει λίγο ακόμη.",
    "de": "‚92 Stufen' zu lesen, hatte mir Angst gemacht. Am dritten Tag wurde mir klar: dieser Abstieg war mein liebster Teil des Tages geworden. Mit jeder Stufe kommt das Meer ein Stück näher."
  },
  "rev_k1": {
    "en": "<b>SELİN K.</b> · MEHTAP SUITE · SEPTEMBER 2025",
    "es": "<b>SELİN K.</b> · SUITE MEHTAP · SEPTIEMBRE 2025",
    "fr": "<b>SELİN K.</b> · SUITE MEHTAP · SEPTEMBRE 2025",
    "ru": "<b>SELİN K.</b> · НОМЕР MEHTAP · СЕНТЯБРЬ 2025",
    "el": "<b>SELİN K.</b> · ΣΟΥΙΤΑ MEHTAP · ΣΕΠΤΕΜΒΡΙΟΣ 2025",
    "de": "<b>SELİN K.</b> · MEHTAP-SUITE · SEPTEMBER 2025"
  },
  "rev_q2": {
    "en": "No television in the room, no rush at reception, no choice on the menu. Sounds like something's missing, doesn't it? Go. You realise that everything 'missing' was simply excess.",
    "es": "Sin televisor en la habitación, sin prisas en recepción, sin opciones en el menú. Suena a que falta algo, ¿verdad? Vaya. Descubre que todo lo que 'faltaba' sobraba.",
    "fr": "Pas de télévision dans la chambre, pas de hâte à la réception, pas de choix au menu. On dirait qu'il manque quelque chose, non ? Allez-y. Vous comprenez que tout ce qui « manquait » n'était que superflu.",
    "ru": "В номере нет телевизора, на ресепшене никто не спешит, в меню нет выбора. Кажется, чего-то не хватает, правда? Поезжайте. Вы поймёте, что всё «недостающее» было лишним.",
    "el": "Χωρίς τηλεόραση στο δωμάτιο, χωρίς βιασύνη στη ρεσεψιόν, χωρίς επιλογές στο μενού. Ακούγεται σαν να λείπει κάτι, έτσι; Πηγαίνετε. Καταλαβαίνετε ότι ό,τι «έλειπε» ήταν περιττό.",
    "de": "Kein Fernseher im Zimmer, keine Hektik an der Rezeption, keine Wahl auf der Karte. Klingt, als fehle etwas, nicht wahr? Fahren Sie hin. Sie merken, dass alles „Fehlende\" nur Überfluss war."
  },
  "rev_k2": {
    "en": "<b>EMRE D.</b> · GURUP SUITE · JULY 2025",
    "es": "<b>EMRE D.</b> · SUITE GURUP · JULIO 2025",
    "fr": "<b>EMRE D.</b> · SUITE GURUP · JUILLET 2025",
    "ru": "<b>EMRE D.</b> · НОМЕР GURUP · ИЮЛЬ 2025",
    "el": "<b>EMRE D.</b> · ΣΟΥΙΤΑ GURUP · ΙΟΥΛΙΟΣ 2025",
    "de": "<b>EMRE D.</b> · GURUP-SUITE · JULI 2025"
  },
  "rev_q3": {
    "en": "We went for our twentieth anniversary. At dinner we smiled at the chalk-written menu; as we rose, I asked the host, \"what will it say tomorrow?\" \"The sea knows,\" he said.",
    "es": "Fuimos por nuestro vigésimo aniversario. En la cena sonreímos al ver el menú escrito con tiza; al levantarnos, pregunté al anfitrión: «¿qué dirá mañana?». «El mar lo sabe», respondió.",
    "fr": "Nous y sommes allés pour nos vingt ans de mariage. Au dîner, nous avons souri devant le menu écrit à la craie ; en nous levant, j'ai demandé à l'hôte : « que dira-t-il demain ? » « La mer le sait », a-t-il répondu.",
    "ru": "Мы поехали на двадцатую годовщину. За ужином мы улыбнулись меню, написанному мелом; вставая, я спросил хозяина: «что будет завтра?» «Море знает», — ответил он.",
    "el": "Πήγαμε για την εικοστή μας επέτειο. Στο δείπνο χαμογελάσαμε με το μενού γραμμένο με κιμωλία· καθώς σηκωνόμασταν, ρώτησα τον οικοδεσπότη, «τι θα γράφει αύριο;» «Η θάλασσα ξέρει», είπε.",
    "de": "Wir fuhren zu unserem zwanzigsten Jahrestag hin. Beim Abendessen lächelten wir über die mit Kreide geschriebene Karte; beim Aufstehen fragte ich den Gastgeber: „Was wird morgen draufstehen?\" „Das Meer weiß es\", sagte er."
  },
  "rev_k3": {
    "en": "<b>AYŞE &amp; MURAT T.</b> · YILDIZ SUITE · JUNE 2025",
    "es": "<b>AYŞE &amp; MURAT T.</b> · SUITE YILDIZ · JUNIO 2025",
    "fr": "<b>AYŞE &amp; MURAT T.</b> · SUITE YILDIZ · JUIN 2025",
    "ru": "<b>AYŞE &amp; MURAT T.</b> · НОМЕР YILDIZ · ИЮНЬ 2025",
    "el": "<b>AYŞE &amp; MURAT T.</b> · ΣΟΥΙΤΑ YILDIZ · ΙΟΥΝΙΟΣ 2025",
    "de": "<b>AYŞE &amp; MURAT T.</b> · YILDIZ-SUITE · JUNI 2025"
  },
  "rev_q4": {
    "en": "A note to perfectionists: you come here not to make plans but to let them go. My only criticism is the morning of departure: this time, climbing the 92 steps back up was hard.",
    "es": "Una nota para los perfeccionistas: aquí no se viene a hacer planes, sino a soltarlos. Mi única crítica es la mañana de la partida: esta vez, subir los 92 escalones se hizo cuesta arriba.",
    "fr": "Une note pour les perfectionnistes : on ne vient pas ici pour faire des plans, mais pour les abandonner. Ma seule critique : le matin du départ, remonter les 92 marches a été difficile cette fois.",
    "ru": "Заметка перфекционистам: сюда приезжают не строить планы, а отпускать их. Моя единственная претензия — утро отъезда: на этот раз подниматься по 92 ступеням было тяжело.",
    "el": "Μια σημείωση για τους τελειομανείς: εδώ δεν έρχεσαι για να κάνεις σχέδια, αλλά για να τα αφήσεις. Η μόνη μου κριτική είναι το πρωινό της αναχώρησης: αυτή τη φορά, ν' ανέβω τα 92 σκαλοπάτια ήταν δύσκολο.",
    "de": "Eine Anmerkung für Perfektionisten: Man kommt hierher nicht, um Pläne zu machen, sondern um sie loszulassen. Mein einziger Kritikpunkt ist der Morgen der Abreise: diesmal fiel der Aufstieg über die 92 Stufen schwer."
  },
  "rev_k4": {
    "en": "<b>DENİZ A.</b> · İKİNDİ SUITE · OCTOBER 2025",
    "es": "<b>DENİZ A.</b> · SUITE İKİNDİ · OCTUBRE 2025",
    "fr": "<b>DENİZ A.</b> · SUITE İKİNDİ · OCTOBRE 2025",
    "ru": "<b>DENİZ A.</b> · НОМЕР İKİNDİ · ОКТЯБРЬ 2025",
    "el": "<b>DENİZ A.</b> · ΣΟΥΙΤΑ İKİNDİ · ΟΚΤΩΒΡΙΟΣ 2025",
    "de": "<b>DENİZ A.</b> · İKİNDİ-SUITE · OKTOBER 2025"
  },
  "bilgi_tag": {
    "en": "INFORMATION",
    "es": "INFORMACIÓN",
    "fr": "INFORMATIONS",
    "ru": "ИНФОРМАЦИЯ",
    "el": "ΠΛΗΡΟΦΟΡΙΕΣ",
    "de": "INFORMATIONEN"
  },
  "b_sezon_k": {
    "en": "SEASON",
    "es": "TEMPORADA",
    "fr": "SAISON",
    "ru": "СЕЗОН",
    "el": "ΣΕΖΟΝ",
    "de": "SAISON"
  },
  "b_sezon_v": {
    "en": "April to November",
    "es": "De abril a noviembre",
    "fr": "D'avril à novembre",
    "ru": "С апреля по ноябрь",
    "el": "Από Απρίλιο έως Νοέμβριο",
    "de": "April bis November"
  },
  "b_giris_k": {
    "en": "CHECK-IN / OUT",
    "es": "ENTRADA / SALIDA",
    "fr": "ARRIVÉE / DÉPART",
    "ru": "ЗАЕЗД / ВЫЕЗД",
    "el": "ΑΦΙΞΗ / ΑΝΑΧΩΡΗΣΗ",
    "de": "CHECK-IN / OUT"
  },
  "b_misafir_k": {
    "en": "GUESTS",
    "es": "HUÉSPEDES",
    "fr": "CLIENTÈLE",
    "ru": "ГОСТИ",
    "el": "ΕΠΙΣΚΕΠΤΕΣ",
    "de": "GÄSTE"
  },
  "b_misafir_v": {
    "en": "Adults only",
    "es": "Solo adultos",
    "fr": "Adultes uniquement",
    "ru": "Только взрослые",
    "el": "Μόνο ενήλικες",
    "de": "Nur Erwachsene"
  },
  "b_ulasim_k": {
    "en": "GETTING HERE",
    "es": "CÓMO LLEGAR",
    "fr": "ACCÈS",
    "ru": "КАК ДОБРАТЬСЯ",
    "el": "ΠΡΟΣΒΑΣΗ",
    "de": "ANREISE"
  },
  "b_ulasim_v": {
    "en": "14 min to Kaş centre",
    "es": "14 min al centro de Kaş",
    "fr": "14 min du centre de Kaş",
    "ru": "14 мин до центра Каша",
    "el": "14 λεπτά από το κέντρο του Κας",
    "de": "14 Min. ins Zentrum von Kaş"
  },
  "rez_tag": {
    "en": "RESERVATION",
    "es": "RESERVA",
    "fr": "RÉSERVATION",
    "ru": "БРОНИРОВАНИЕ",
    "el": "ΚΡΑΤΗΣΗ",
    "de": "RESERVIERUNG"
  },
  "rez_h2": {
    "en": "The sea belongs to those<br>who know how to <em>wait</em>.",
    "es": "El mar es de quienes<br>saben <em>esperar</em>.",
    "fr": "La mer appartient à ceux<br>qui savent <em>attendre</em>.",
    "ru": "Море принадлежит тем,<br>кто умеет <em>ждать</em>.",
    "el": "Η θάλασσα ανήκει σε όσους<br>ξέρουν να <em>περιμένουν</em>.",
    "de": "Das Meer gehört denen,<br>die zu <em>warten</em> wissen."
  },
  "rez_cta": {
    "en": "Send a reservation request",
    "es": "Enviar una solicitud de reserva",
    "fr": "Envoyer une demande de réservation",
    "ru": "Отправить запрос на бронирование",
    "el": "Στείλτε αίτημα κράτησης",
    "de": "Reservierungsanfrage senden"
  },
  "rez_detay": {
    "en": "LOCATION · Lycian Way turn-off, Kaş / Antalya",
    "es": "UBICACIÓN · Desvío de la Vía Licia, Kaş / Antalya",
    "fr": "SITUATION · Embranchement de la Voie lycienne, Kaş / Antalya",
    "ru": "РАСПОЛОЖЕНИЕ · Поворот с Ликийской тропы, Каш / Анталья",
    "el": "ΤΟΠΟΘΕΣΙΑ · Διακλάδωση Λυκιακού Μονοπατιού, Κας / Αττάλεια",
    "de": "LAGE · Abzweigung des Lykischen Wegs, Kaş / Antalya"
  },
  "footer_loc": {
    "en": "KAŞ · ANTALYA · TURKEY",
    "es": "KAŞ · ANTALYA · TURQUÍA",
    "fr": "KAŞ · ANTALYA · TURQUIE",
    "ru": "КАШ · АНТАЛЬЯ · ТУРЦИЯ",
    "el": "ΚΑΣ · ΑΤΤΑΛΕΙΑ · ΤΟΥΡΚΙΑ",
    "de": "KAŞ · ANTALYA · TÜRKEI"
  },
  "footer_soc": {
    "en": "<a href=\"https://www.instagram.com\" target=\"_blank\" rel=\"noreferrer\">INSTAGRAM</a> &nbsp;·&nbsp; <a href=\"#\">JOURNAL</a> &nbsp;·&nbsp; © CALA 2026",
    "es": "<a href=\"https://www.instagram.com\" target=\"_blank\" rel=\"noreferrer\">INSTAGRAM</a> &nbsp;·&nbsp; <a href=\"#\">DIARIO</a> &nbsp;·&nbsp; © CALA 2026",
    "fr": "<a href=\"https://www.instagram.com\" target=\"_blank\" rel=\"noreferrer\">INSTAGRAM</a> &nbsp;·&nbsp; <a href=\"#\">JOURNAL</a> &nbsp;·&nbsp; © CALA 2026",
    "ru": "<a href=\"https://www.instagram.com\" target=\"_blank\" rel=\"noreferrer\">INSTAGRAM</a> &nbsp;·&nbsp; <a href=\"#\">ЖУРНАЛ</a> &nbsp;·&nbsp; © CALA 2026",
    "el": "<a href=\"https://www.instagram.com\" target=\"_blank\" rel=\"noreferrer\">INSTAGRAM</a> &nbsp;·&nbsp; <a href=\"#\">ΗΜΕΡΟΛΟΓΙΟ</a> &nbsp;·&nbsp; © CALA 2026",
    "de": "<a href=\"https://www.instagram.com\" target=\"_blank\" rel=\"noreferrer\">INSTAGRAM</a> &nbsp;·&nbsp; <a href=\"#\">JOURNAL</a> &nbsp;·&nbsp; © CALA 2026"
  },
  "footer_kurgu": {
    "en": "FICTIONAL CONCEPT PROPERTY · DESIGN: KİVANC · REVIEWS ARE ILLUSTRATIVE",
    "es": "ESTABLECIMIENTO DE CONCEPTO FICTICIO · DISEÑO: KİVANC · LAS RESEÑAS SON ILUSTRATIVAS",
    "fr": "ÉTABLISSEMENT CONCEPTUEL FICTIF · DESIGN : KİVANC · AVIS À TITRE ILLUSTRATIF",
    "ru": "ВЫМЫШЛЕННЫЙ КОНЦЕПТ-ОБЪЕКТ · ДИЗАЙН: KİVANC · ОТЗЫВЫ ИЛЛЮСТРАТИВНЫ",
    "el": "ΦΑΝΤΑΣΤΙΚΟ ΚΑΤΑΛΥΜΑ ΙΔΕΑΣ · ΣΧΕΔΙΑΣΜΟΣ: KİVANC · ΟΙ ΚΡΙΤΙΚΕΣ ΕΙΝΑΙ ΕΝΔΕΙΚΤΙΚΕΣ",
    "de": "FIKTIVES KONZEPTOBJEKT · DESIGN: KİVANC · BEWERTUNGEN SIND BEISPIELHAFT"
  }
};
