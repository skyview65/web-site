import type { Dictionary } from "../dictionary";

export const tr = {
  meta: {
    title: "LUMENFALL — Karanlık Parlar · 2099",
    description:
      "2099. Yapay zekânın yönettiği megakent Lumenfall'da üç hayat, tek kader. Sokaktan yörüngeye uzanan açık dünya suç destanı. 2027'de geliyor.",
    ogAlt: "LUMENFALL — 2099'un neon megakenti üzerinde yörünge asansörü",
  },
  nav: {
    city: "Şehir",
    protagonists: "Karakterler",
    features: "Özellikler",
    online: "LUMENFALL Online",
    editions: "Sürümler",
    preorder: "Ön Sipariş",
    play: "OYNA",
    menuOpen: "Menüyü aç",
    menuClose: "Menüyü kapat",
    selectLanguage: "Dil seçin",
    skipToContent: "İçeriğe atla",
  },
  hero: {
    kicker: "BİR AÇIK DÜNYA SUÇ DESTANI",
    tagline: "Karanlık parlar.",
    releaseWindow: "2027",
    platforms: "PC · KONSOL · BULUT",
    cta: "Ön siparişe geç",
    scrollHint: "Keşfetmek için kaydır",
    imageAlt:
      "2099'da Lumenfall: bulutları delip yıldızlara uzanan yörünge asansörü, siyah kulelerde camgöbeği ve macenta neonlar",
  },
  story: {
    kicker: "HİKÂYE",
    lines: [
      "Yıl 2099. Sokaklardan yıldızlara uzanan tek bir şehir: Lumenfall.",
      "Şehri PANOPT adında bir yapay zekâ yönetiyor. Her şeyi görüyor, hiçbir şeyi unutmuyor.",
      "Üç hayat yaşayacaksın: bir hacker, eski bir infazcı ve kaçakçı bir pilot. Üç hikâye, tek kaderde düğümleniyor.",
    ],
    outro: "Bu şehirde özgürlük çalınır.",
  },
  city: {
    kicker: "ŞEHİR",
    title: "Lumenfall yaşıyor. Sen uyurken bile.",
    paragraphs: [
      "2061'deki Büyük Karartma'dan sonra küller üzerine yeniden kuruldu. Bugün Lumenfall, PANOPT adlı şehir ölçeğinde bir yapay zekâ tarafından yönetiliyor — trafikten yargıya, elektrikten hafızaya kadar her şey onun elinde. Kusursuz görünen düzenin altında ise şehir, dokuz bölgeye bölünmüş dev bir suç ekosistemi.",
      "Neon Liman'ın kumarhanelerinden Pas Kuşağı'nın çete sokaklarına, sular altındaki Sisaltı'ndan yörünge asansörünün yükseldiği Yükseliş'e: her bölgenin kendi ekonomisi, kendi kuralları, kendi hafızası var. Bir sokağın kokusunu, bir mahallenin öfkesini, bir tefecinin sana kestiği fiyatı — şehir hiçbirini unutmuyor.",
      "Ve şehir seni izliyor. Yaptığın her seçim PANOPT'un defterine işleniyor; bir gün karşına çıkmak üzere.",
    ],
    stats: [
      { value: "9", label: "BÖLGE" },
      { value: "310 KM²", label: "ŞEHİR + YÖRÜNGE KATMANI" },
      { value: "1.2M", label: "SİMÜLE VATANDAŞ" },
      { value: "%100", label: "KESİNTİSİZ — YÜKLEME EKRANI YOK" },
    ],
    imageAlt:
      "Lumenfall'da sokak seviyesi: neon kanyonda kalabalık, hologram reklamlar ve ıslak asfalt yansımaları",
  },
  protagonists: {
    kicker: "ÜÇ HAYAT, TEK KADER",
    title: "Kimin gözünden bakacaksın?",
    intro:
      "Üç oynanabilir karakter, üç ayrı dünya — ve tek bir düğümde birleşen hikâyeleri. İstediğin an aralarında geçiş yap; her biri sen yokken kendi hayatını yaşamaya devam eder.",
    characters: [
      {
        id: "mara",
        name: "Mara Vex",
        role: "Netrunner",
        tagline: "Silinen kardeşini arıyor.",
        quote:
          "Silinen her şey bir yerde iz bırakır. Ben o izleri toplarım.",
        bio: "Gölgepazar'da veri kandan pahalıdır — ve Mara oranın en pahalı hırsızıdır. On altısında ilk hafıza kasasını kırdı; yirmi sekizinde adı PANOPT'un korunan katmanlarında bir efsane, yüzü bir söylentiydi. Sonra bir gece kardeşi Deniz sistemden ve herkesin zihninden silindi. Annesi oğlunun fotoğrafına bakıp \"bu çocuk kim?\" diye sorduğunda, Mara unutturanlara unutamayacakları bir şey yapmaya yemin etti.",
        playstyle:
          "Sızma · hack · sosyal mühendislik — şehri fark edilmeden söküp takanlar için. Her kamera bir göz, her implant bir kapı, her sır bir silah.",
      },
      {
        id: "kaan",
        name: "Kaan “Ghost” Demir",
        role: "Eski İnfazcı",
        tagline: "Sistemden kaçan adam.",
        quote:
          "Resmî kayıtlara göre öldüm. Kayıtlar hep yalan söyler.",
        bio: "Yirmi yıl Compact'in gölgesinde \"sorun çözdü\" — yanlış soruları soranları susturdu. Sonra bir gece susturması istenen kişi bir çocuktu. Reddetti; ertesi sabah kayıtlara \"operasyonel kayıp\" olarak geçti. Pas Kuşağı'nın küflü fabrikalarında tabut kadar sessiz bir hayat kurdu. Ama Lumenfall'da hayaletler bile huzur bulamaz: eski dosyalar açılıyor, eski isimler geri dönüyor — ve Ghost, mezarından hesap sormaya kalkıyor.",
        playstyle:
          "Taktik çatışma · ağır silahlar · baskın — kapıyı çalmak yerine kıranlar için. Her sığınak bir karar, her tetik bir itiraf.",
      },
      {
        id: "solene",
        name: "Solene Adeyemi",
        role: "Yörünge Kaçakçısı",
        tagline: "Gökyüzünün kanunsuz kraliçesi.",
        quote:
          "Yerçekimi bir öneri. Gümrük bir şaka. Sözümse senettir.",
        bio: "Sekiz yaşında babasının kargo mekiğinde yıldızları saydı; on sekizinde Yükseliş'in en genç lisanslı pilotu oldu; yirmi birinde lisansını yaktılar — yasak bir kargo yerine kaçak bir aileyi taşıdığı için. Şimdi Kara Leylek'in kokpitinde, sokakla yörünge arasındaki gri boşlukta yaşıyor. Ta ki bir konteynerden şehrin en tehlikeli sırrı çıkana dek. Artık tüm Lumenfall'un kaderi, asla düşmeyen kadının ellerinde.",
        playstyle:
          "Hız · araç ustalığı · imkânsız kaçışlar — kovalamacayı kovalayanlar için. Neon kanyonlarda burun dalışı, yörüngede sıfır-g manevrası.",
      },
    ],
  },
  features: {
    kicker: "OYNANIŞ",
    title: "Bir şehirden fazlası. Bir sistem.",
    items: [
      {
        title: "Sokaktan Yörüngeye",
        body: "Metroda başlayan bir kovalamaca, yörünge asansöründe sürüp Zenit Halkası'nda sıfır yerçekiminde bitebilir. Tek harita, tek nefes — yükleme ekranı yok.",
      },
      {
        title: "Yaşayan Şehir",
        body: "1.2 milyon vatandaşın her biri kalıcı bir kimlik taşır: rutinleri, ilişkileri ve hafızaları var. Dün çarptığın seyyar satıcı, yarın seni tanır.",
      },
      {
        title: "Üç Hayat, Tek Hikâye",
        body: "Mara, Kaan ve Solene arasında anında geçiş yap. Kontrol etmediğin karakterler kendi gündemlerini yaşar; hikâyeleri senin seçimlerinle kesişir.",
      },
      {
        title: "PANOPT Tepki Sistemi",
        body: "Aranma seviyesi yerine seni öğrenen bir şehir. PANOPT suç desenini analiz eder, tuzaklarını sana göre kurar. Aynı numara iki kez işe yaramaz.",
      },
      {
        title: "Oyuncu Ekonomisi",
        body: "Dokuz bölgenin fiyatları gerçek arz-talebe göre dalgalanır. İstersen kaçakçılık rotası kur, istersen piyasayı manipüle et — ekonomi senin oyun alanın.",
      },
      {
        title: "Sınırsız Garaj",
        body: "200'den fazla araç: yerden kesik süpürücülerden yörünge mekiklerine. Hepsi parça parça modifiye edilebilir, hepsi çalınabilir. Evet, mekik de.",
      },
    ],
  },
  online: {
    kicker: "CANLI SERVİS",
    title: "LUMENFALL Online: Şehir hepimizin.",
    body: "Dört kişilik ekibinle kendi suç imparatorluğunu kur. Sezonluk soygun rotasyonları, bölge savaşları ve oyuncuların yazdığı ekonomiyle Lumenfall, sen çevrimdışıyken bile dönmeye devam eden bir dünya.",
    bullets: [
      "12 haftalık sezonlar — her sezon yeni bölge hikâyesi, soygun ve etkinlikler",
      "Crew sistemi: 4 kişilik ekipler, paylaşımlı üsler, ortak kasa",
      "Bölge savaşları: dokuz bölgenin kontrolü her hafta el değiştirir",
      "Çapraz platform + çapraz ilerleme: tek hesap, her cihaz",
      "Tüm oynanış içerikleri oynayarak açılır — güç satın alınamaz",
    ],
    modes: [
      {
        name: "Bölge Savaşları",
        body: "Haftalık fetih savaşı: dokuz bölgenin kontrolü için crew crew'a karşı. Kazanan, bölgenin haracını ve pazar avantajını alır.",
      },
      {
        name: "Zenit Kasası",
        body: "4 kişilik ortak soygun: yörünge istasyonundaki veri kasasına sız, sıfır yerçekiminde kaç. Her rol kritik — hacker, kas, pilot, yüz.",
      },
      {
        name: "Kaçakçılık Ligi",
        body: "Sisaltı'ndan Yükseliş'e yasadışı kargo koşusu. Rakip crew'lar yükünü çalabilir — en hızlı değil, en kurnaz kazanır.",
      },
      {
        name: "Serbest Dolaşım",
        body: "40 oyunculu yaşayan şehirde kural yok: ittifak kur, ihanet et, PANOPT'un gözünden birlikte kaç.",
      },
    ],
    ticker:
      "SEZON 01: KARARTMA PROTOKOLÜ · YENİ SOYGUN: ZENİT KASASI · BÖLGE SAVAŞI: NEON LİMAN · ÇİFTE LÜMEN HAFTASI",
    imageAlt:
      "Karanlık bir üste holografik soygun planı masasının etrafında dört kişilik ekip",
  },
  editions: {
    kicker: "ÖN SİPARİŞ",
    title: "Sürümünü seç.",
    tiers: [
      {
        id: "standard",
        name: "Standard",
        tag: "",
        price: "₺2.399",
        contents: [
          "LUMENFALL temel oyun",
          "LUMENFALL Online erişimi",
          "Ön sipariş bonusu: “Karartma” araç kaplaması",
        ],
        cta: "Standard'ı seç",
      },
      {
        id: "deluxe",
        name: "Deluxe",
        tag: "En Popüler",
        price: "₺3.399",
        contents: [
          "Temel oyun + LUMENFALL Online",
          "72 saat erken erişim",
          "Dijital sanat kitabı + orijinal film müziği",
          "“Gölgepazar” kıyafet koleksiyonu",
          "Sezon 01 Prizma kozmetik paketi",
        ],
        cta: "Deluxe'ü seç",
      },
      {
        id: "eternal",
        name: "Eternal",
        tag: "Koleksiyonluk",
        price: "₺4.599",
        contents: [
          "Deluxe'ün tüm içeriği",
          "İlk yıl genişleme geçişi (2 hikâye paketi)",
          "Zenit Halkası dairesi (oyun içi üs)",
          "Özel “Eternal” monogram serisi araç seti",
          "Adın Lumenfall'da bir sokakta*",
        ],
        cta: "Eternal'ı seç",
      },
    ],
    note: "*İlk 10.000 Eternal ön siparişine özeldir. Tüm içerikler kurgusaldır; fiyatlar temsilîdir. Oynanışı etkileyen hiçbir içerik gerçek parayla satılmaz.",
    imageAlt:
      "Camgöbeği V amblemli, siyah camda neon yansımalı koleksiyonluk LUMENFALL kutusu",
  },
  newsletter: {
    title: "Karartma listesine yazıl.",
    body: "Fragmanlar, kapalı beta davetleri ve sezon haberleri — spam yok, sadece sinyal.",
    placeholder: "e-posta adresin",
    button: "Kaydol",
    success: "Listedesin. Karanlık seninle iletişime geçecek.",
    privacy: "İstediğin an tek tıkla ayrılabilirsin.",
  },
  footer: {
    fictional:
      "LUMENFALL, bir konsept çalışması olarak tasarlanmış kurgusal bir oyundur. Gerçek bir ürün, stüdyo veya markayla bağlantısı yoktur.",
    rights: "© 2099 Lumenworks Studios. Tüm hakları — henüz — saklıdır.",
    studio: "Lumenworks Studios",
  },
  game: {
    eyebrow: "OYNANABİLİR DEMO",
    title: "NEON KAÇIŞ",
    tagline: "Hover motorunu neon kanyonda sür. PANOPT dron duvarlarındaki boşluklardan geç, Lümen topla, yakalanma.",
    start: "BAŞLA",
    restart: "TEKRAR DENE",
    controls: "↑ ↓ / W S veya parmağını sürükle",
    distance: "MESAFE",
    lumen: "LÜMEN",
    best: "REKOR",
    threat: "PANOPT",
    score: "SKOR",
    gameOver: "YAKALANDIN",
    gameOverHint: "PANOPT seni kaydına işledi. Şehir unutmaz — tekrar dene.",
    newBest: "YENİ REKOR",
    backHome: "LUMENFALL",
  },
} satisfies Dictionary;
