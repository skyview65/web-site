// Extra index languages added to reach the unified 11-language set.
// Each block mirrors the exact key structure of the existing en/fr blocks.
// Inserted into the `translations` object by build_index_ext.cjs.
// de = German (Latin), ru = Russian (Cyrillic), el = Greek.

const de = `    de: {
      navWork:"Projekte", navServices:"Leistungen", navProcess:"Methode", contactLabel:"Kontakt", btnStart:"Projekt starten",
      heroEyebrow:"Die Haute Couture des Digitalen", heroLine1:"Ihre Marke ist ein Raum.", heroLine2:"Wir bauen sie wie Architektur.",
      heroSub:"Atelance gestaltet und entwickelt Websites von Hand, mit der Geduld einer Werkstatt.", scroll:"Scrollen",
      atelierLabel:"Das Atelier",
      atelierBody1:"Atelance ist ein digitales Atelier. Wir wachsen nicht, wir vertiefen. Jedes Projekt wird nach Maß gezeichnet, geschrieben und gebaut, niemals aus einer Vorlage.",
      atelierBody2:"Den Marken unserer Kunden gilt unsere ganze Aufmerksamkeit, bis jedes Detail genau dort sitzt, wo es hingehört.", atelierMeta:"Handgefertigt · Weltweit tätig",
      workLabel:"Ausgewählte Projekte", viewLive:"Live-Website ansehen",
      calaType:"Boutique-Hotel", calaPlace:"Kaş, Türkei", calaLine:"Eine verborgene Bucht an der lykischen Küste, neun Suiten, vierzig Meter über klarem Wasser.",
      aureliaType:"Luxusresidenzen", aureliaPlace:"Wasserlage · 2025", aureliaLine:"Eine Immobilienmarke für Luxusresidenzen und Penthäuser, gerahmt von Licht und Marmor.",
      servicesLabel:"Was wir tun", servicesBody:"Ein Studio, von der ersten Idee bis zu Ihrer fertigen Website, durchgehend.",
      services:[
        {n:"01",name:"Webdesign",desc:"Redaktionelle, filmische Interfaces, um Ihre Marke herum gestaltet."},
        {n:"02",name:"Entwicklung",desc:"Schneller, handgeschriebener Code. Keine Baukästen, keine Kompromisse."},
        {n:"03",name:"Markenidentität",desc:"Namen, Zeichen und Schriftsysteme mit langer Haltbarkeit."},
        {n:"04",name:"Text & Copy",desc:"Worte, die das Gewicht des Designs tragen."},
        {n:"05",name:"SEO & Performance",desc:"Gebaut, um gefunden zu werden und im Nu zu laden."},
        {n:"06",name:"Pflege & Support",desc:"Wir bleiben dabei, lange nach dem Launch."}
      ],
      processLabel:"Die Methode", processBody:"Ein langsamer, bewusster Prozess. Vier Bewegungen.",
      steps:[
        {n:"01",name:"Entdeckung",desc:"Wir hören zu, recherchieren und definieren, was die Marke werden muss."},
        {n:"02",name:"Richtung",desc:"Art Direction, Referenzen und eine klare visuelle Sprache."},
        {n:"03",name:"Umsetzung",desc:"Design und Code, von Hand gemacht, offen verfeinert."},
        {n:"04",name:"Launch & Pflege",desc:"Wir veröffentlichen, messen und halten alles makellos."}
      ],
      contactTitle:"Ein Projekt im Sinn?", contactBody:"Erzählen Sie uns von Ihrer Marke. Wir beantworten jedes Briefing persönlich.",
      fName:"Ihr Name", fEmail:"E-Mail", fBrand:"Marke / Unternehmen", fType:"Projektart", fBudget:"Budget", fMsg:"Erzählen Sie von Ihrem Projekt", fSend:"Briefing senden", fSending:"Wird gesendet…",
      fSuccess:"Danke. Wir melden uns in Kürze.", fError:"Bitte füllen Sie alle Felder aus.",
      typeOpts:["Website","Markenidentität","Beides","Etwas anderes"], budgetOpts:["€5K+","€10K+","€25K+","Sprechen wir"],
      footTagline:"Die Haute Couture des Digitalen.", footRights:"© 2026 Atelance. Alle Rechte vorbehalten."
    }`;

const ru = `    ru: {
      navWork:"Работы", navServices:"Услуги", navProcess:"Процесс", contactLabel:"Контакты", btnStart:"Начать проект",
      heroEyebrow:"Haute couture цифрового", heroLine1:"Ваш бренд — это пространство.", heroLine2:"Мы строим его как архитектуру.",
      heroSub:"Atelance проектирует и создаёт сайты вручную, с терпением мастерской.", scroll:"Листайте",
      atelierLabel:"Мастерская",
      atelierBody1:"Atelance — это цифровая мастерская. Мы не масштабируемся, мы углубляемся. Каждый проект рисуется, пишется и создаётся по мерке, никогда по шаблону.",
      atelierBody2:"Бренды наших клиентов получают всё наше внимание, пока каждая деталь не встанет точно на своё место.", atelierMeta:"Ручная работа · По всему миру",
      workLabel:"Избранные работы", viewLive:"Открыть сайт",
      calaType:"Бутик-отель", calaPlace:"Каш, Турция", calaLine:"Укромная бухта на Ликийском побережье, девять сьютов, в сорока метрах над прозрачной водой.",
      aureliaType:"Люксовые резиденции", aureliaPlace:"Побережье · 2025", aureliaLine:"Риелторский бренд люксовых резиденций и пентхаусов, обрамлённых светом и мрамором.",
      servicesLabel:"Что мы делаем", servicesBody:"Одна студия — от первой идеи до готового сайта, на всём пути.",
      services:[
        {n:"01",name:"Веб-дизайн",desc:"Редакционные, кинематографичные интерфейсы, выстроенные вокруг вашего бренда."},
        {n:"02",name:"Разработка",desc:"Быстрый код, написанный вручную. Без конструкторов, без компромиссов."},
        {n:"03",name:"Фирменный стиль",desc:"Имена, знаки и типографические системы с долгим сроком жизни."},
        {n:"04",name:"Копирайтинг",desc:"Слова, несущие вес дизайна."},
        {n:"05",name:"SEO и производительность",desc:"Создано, чтобы вас находили и чтобы сайт открывался мгновенно."},
        {n:"06",name:"Забота и поддержка",desc:"Мы остаёмся рядом ещё долго после запуска."}
      ],
      processLabel:"Метод", processBody:"Медленный, вдумчивый процесс. Четыре движения.",
      steps:[
        {n:"01",name:"Открытие",desc:"Мы слушаем, исследуем и определяем, чем должен стать бренд."},
        {n:"02",name:"Направление",desc:"Арт-дирекшн, референсы и единый ясный визуальный язык."},
        {n:"03",name:"Создание",desc:"Дизайн и код, сделанные вручную, отточенные открыто."},
        {n:"04",name:"Запуск и забота",desc:"Мы публикуем, измеряем и держим всё безупречным."}
      ],
      contactTitle:"Есть проект на примете?", contactBody:"Расскажите о своём бренде. Мы лично отвечаем на каждый бриф.",
      fName:"Ваше имя", fEmail:"Эл. почта", fBrand:"Бренд / компания", fType:"Тип проекта", fBudget:"Бюджет", fMsg:"Расскажите о проекте", fSend:"Отправить бриф", fSending:"Отправка…",
      fSuccess:"Спасибо. Мы скоро свяжемся с вами.", fError:"Пожалуйста, заполните все поля.",
      typeOpts:["Сайт","Фирменный стиль","И то, и другое","Что-то ещё"], budgetOpts:["€5K+","€10K+","€25K+","Обсудим"],
      footTagline:"Haute couture цифрового.", footRights:"© 2026 Atelance. Все права защищены."
    }`;

const el = `    el: {
      navWork:"Έργα", navServices:"Υπηρεσίες", navProcess:"Διαδικασία", contactLabel:"Επικοινωνία", btnStart:"Ξεκινήστε ένα έργο",
      heroEyebrow:"Η Haute Couture του Ψηφιακού", heroLine1:"Η μάρκα σας είναι ένας χώρος.", heroLine2:"Τη χτίζουμε σαν αρχιτεκτονική.",
      heroSub:"Η Atelance σχεδιάζει και αναπτύσσει ιστότοπους στο χέρι, με την υπομονή ενός εργαστηρίου.", scroll:"Κύλιση",
      atelierLabel:"Το Εργαστήριο",
      atelierBody1:"Η Atelance είναι ένα ψηφιακό εργαστήριο. Δεν μεγαλώνουμε· εμβαθύνουμε. Κάθε έργο σχεδιάζεται, γράφεται και χτίζεται στα μέτρα, ποτέ από πρότυπο.",
      atelierBody2:"Οι μάρκες των πελατών μας λαμβάνουν όλη μας την προσοχή, μέχρι κάθε λεπτομέρεια να βρεθεί ακριβώς στη θέση της.", atelierMeta:"Χειροποίητο · Σε όλο τον κόσμο",
      workLabel:"Επιλεγμένα έργα", viewLive:"Δείτε τον ζωντανό ιστότοπο",
      calaType:"Ξενοδοχείο boutique", calaPlace:"Κας, Τουρκία", calaLine:"Ένας κρυμμένος όρμος στη λυκιακή ακτή, εννέα σουίτες, σαράντα μέτρα πάνω από καθαρά νερά.",
      aureliaType:"Πολυτελείς κατοικίες", aureliaPlace:"Παραθαλάσσιο · 2025", aureliaLine:"Μια μάρκα ακινήτων με πολυτελείς κατοικίες και ρετιρέ, πλαισιωμένα από φως και μάρμαρο.",
      servicesLabel:"Τι κάνουμε", servicesBody:"Ένα στούντιο, από την πρώτη ιδέα έως τον ζωντανό ιστότοπό σας, σε όλη τη διαδρομή.",
      services:[
        {n:"01",name:"Σχεδιασμός web",desc:"Εκδοτικές, κινηματογραφικές διεπαφές σχεδιασμένες γύρω από τη μάρκα σας."},
        {n:"02",name:"Ανάπτυξη",desc:"Γρήγορος, χειρόγραφος κώδικας. Χωρίς page builders, χωρίς συμβιβασμούς."},
        {n:"03",name:"Ταυτότητα μάρκας",desc:"Ονόματα, σήματα και τυπογραφικά συστήματα με μακρά διάρκεια ζωής."},
        {n:"04",name:"Κειμενογραφία",desc:"Λέξεις που σηκώνουν το βάρος του σχεδιασμού."},
        {n:"05",name:"SEO & Απόδοση",desc:"Φτιαγμένο για να σας βρίσκουν και να φορτώνει ακαριαία."},
        {n:"06",name:"Φροντίδα & Υποστήριξη",desc:"Μένουμε δίπλα σας, πολύ μετά την κυκλοφορία."}
      ],
      processLabel:"Η Μέθοδος", processBody:"Μια αργή, μελετημένη διαδικασία. Τέσσερις κινήσεις.",
      steps:[
        {n:"01",name:"Ανακάλυψη",desc:"Ακούμε, ερευνούμε και ορίζουμε τι πρέπει να γίνει η μάρκα."},
        {n:"02",name:"Κατεύθυνση",desc:"Καλλιτεχνική διεύθυνση, αναφορές και μία καθαρή οπτική γλώσσα."},
        {n:"03",name:"Κατασκευή",desc:"Σχεδιασμός και κώδικας, φτιαγμένα στο χέρι, εκλεπτυσμένα ανοιχτά."},
        {n:"04",name:"Κυκλοφορία & Φροντίδα",desc:"Δημοσιεύουμε, μετράμε και το κρατάμε άψογο."}
      ],
      contactTitle:"Έχετε ένα έργο στο μυαλό σας;", contactBody:"Πείτε μας για τη μάρκα σας. Απαντάμε προσωπικά σε κάθε brief.",
      fName:"Το όνομά σας", fEmail:"Email", fBrand:"Μάρκα / εταιρεία", fType:"Τύπος έργου", fBudget:"Προϋπολογισμός", fMsg:"Πείτε μας για το έργο", fSend:"Αποστολή brief", fSending:"Αποστολή…",
      fSuccess:"Ευχαριστούμε. Θα επικοινωνήσουμε σύντομα.", fError:"Παρακαλούμε συμπληρώστε όλα τα πεδία.",
      typeOpts:["Ιστότοπος","Ταυτότητα μάρκας","Και τα δύο","Κάτι άλλο"], budgetOpts:["€5K+","€10K+","€25K+","Ας μιλήσουμε"],
      footTagline:"Η haute couture του ψηφιακού.", footRights:"© 2026 Atelance. Με επιφύλαξη κάθε δικαιώματος."
    }`;

module.exports = { de, ru, el };
