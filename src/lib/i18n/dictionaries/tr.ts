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
        bio: "Gölgepazar'ın en iyi veri hırsızı. Kardeşi bir gece PANOPT'un hafıza bankalarından — ve herkesin anılarından — silindi. Mara, sistemin unuttuğu şeyi geri çalmak için sistemin kalbine sızacak.",
      },
      {
        id: "kaan",
        name: "Kaan “Ghost” Demir",
        role: "Eski İnfazcı",
        tagline: "Sistemden kaçan adam.",
        bio: "Yirmi yıl Compact'in kirli işlerini yaptı; sonra bir emri reddetti ve resmî kayıtlara göre öldü. Şimdi Pas Kuşağı'nda hayalet gibi yaşıyor. Geçmişi onu bulmadan, o geçmişiyle hesaplaşacak.",
      },
      {
        id: "solene",
        name: "Solene Adeyemi",
        role: "Yörünge Kaçakçısı",
        tagline: "Gökyüzünün kanunsuz kraliçesi.",
        bio: "Yükseliş ile Zenit Halkası arasında uçmayan hiçbir şeyi taşımayan pilot. Gümrük onun için bir öneri, yerçekimi bir ayrıntı. Ta ki bir kargo, tüm şehrin kaderini kokpitine bırakana dek.",
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
} satisfies Dictionary;
