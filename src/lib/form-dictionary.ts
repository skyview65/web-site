// Reservation-form copy in 10 languages, ported from the RT dictionary in
// cala_4_v13_1.html. The `errors` block is new: the original signalled invalid
// fields with colour only; these messages back the accessible error text.

import type { Lang } from "./dictionary";

export interface FormStrings {
  readonly baslik: string;
  readonly intro: string;
  readonly ad: string;
  readonly mail: string;
  readonly tel: string;
  readonly giris: string;
  readonly cikis: string;
  readonly kisi: string;
  readonly notlbl: string;
  readonly guests: readonly [string, string, string, string];
  readonly btn: string;
  readonly ph: string;
  readonly note: string;
  readonly okb: string;
  readonly body: string;
  readonly yeni: string;
  readonly L: {
    readonly ad: string;
    readonly mail: string;
    readonly tel: string;
    readonly giris: string;
    readonly cikis: string;
    readonly kisi: string;
    readonly not: string;
  };
  readonly errors: {
    readonly ad: string;
    readonly email: string;
    readonly giris: string;
    readonly cikis: string;
    readonly sira: string;
  };
}

export const FORM: Readonly<Record<Lang, FormStrings>> = {
  tr: {
    baslik: "Rezervasyon talebinizi bırakın.",
    intro:
      "Likya kıyısında, yalnızca yetişkinlere özel dokuz süit. Tarihlerinizi bırakın; uygunluğu ve usulünce hazırlanmış bir karşılamayı sizinle özel olarak planlayalım.",
    ad: "Ad Soyad",
    mail: "E-posta",
    tel: "Telefon",
    giris: "Giriş",
    cikis: "Çıkış",
    kisi: "Misafir",
    notlbl: "Not (isteğe bağlı)",
    guests: ["1 misafir", "2 misafir", "3 misafir", "4 misafir"],
    btn: "Talebi gönderin",
    ph: "Özel bir isteğiniz, süit tercihiniz…",
    note: "Bu bir önizleme formudur. Talebiniz kaydedilmez ve hiçbir yere iletilmez; gerçek bir rezervasyon oluşturmaz.",
    okb: "Talebiniz alındı.",
    body: "Sayın {ad}, rezervasyon talebiniz alındı. En kısa sürede e-posta ile dönüş yapılacaktır. (Önizleme: talep iletilmez.)",
    yeni: "Yeni talep",
    L: { ad: "AD", mail: "E-POSTA", tel: "TELEFON", giris: "GİRİŞ", cikis: "ÇIKIŞ", kisi: "MİSAFİR", not: "NOT" },
    errors: {
      ad: "Lütfen adınızı ve soyadınızı yazın.",
      email: "Geçerli bir e-posta adresi girin.",
      giris: "Giriş tarihi seçin.",
      cikis: "Çıkış tarihi seçin.",
      sira: "Çıkış tarihi giriş tarihinden sonra olmalı.",
    },
  },
  en: {
    baslik: "Leave your reservation request.",
    intro:
      "On the Lycian coast, nine adults-only suites. Leave your dates and we will plan availability and a carefully prepared welcome with you, privately.",
    ad: "Full name",
    mail: "E-mail",
    tel: "Phone",
    giris: "Check-in",
    cikis: "Check-out",
    kisi: "Guests",
    notlbl: "Note (optional)",
    guests: ["1 guest", "2 guests", "3 guests", "4 guests"],
    btn: "Send request",
    ph: "A special request, a suite preference…",
    note: "This is a preview form. Your request is not stored or sent anywhere and does not create a real reservation.",
    okb: "Your request has been received.",
    body: "Dear {ad}, your reservation request has been received. We will reply by e-mail shortly. (Preview: not actually sent.)",
    yeni: "New request",
    L: { ad: "NAME", mail: "E-MAIL", tel: "PHONE", giris: "CHECK-IN", cikis: "CHECK-OUT", kisi: "GUESTS", not: "NOTE" },
    errors: {
      ad: "Please enter your full name.",
      email: "Please enter a valid e-mail address.",
      giris: "Please choose a check-in date.",
      cikis: "Please choose a check-out date.",
      sira: "Check-out must be after check-in.",
    },
  },
  es: {
    baslik: "Deje su solicitud de reserva.",
    intro:
      "En la costa licia, nueve suites solo para adultos. Deje sus fechas y planificaremos con usted, en privado, la disponibilidad y una bienvenida cuidadosamente preparada.",
    ad: "Nombre y apellidos",
    mail: "Correo electrónico",
    tel: "Teléfono",
    giris: "Entrada",
    cikis: "Salida",
    kisi: "Huéspedes",
    notlbl: "Nota (opcional)",
    guests: ["1 huésped", "2 huéspedes", "3 huéspedes", "4 huéspedes"],
    btn: "Enviar solicitud",
    ph: "Una petición especial, preferencia de suite…",
    note: "Este es un formulario de demostración. Su solicitud no se guarda ni se envía a ningún sitio y no genera una reserva real.",
    okb: "Su solicitud ha sido recibida.",
    body: "Estimado/a {ad}, su solicitud de reserva ha sido recibida. Le responderemos por correo en breve. (Demostración: no se envía.)",
    yeni: "Nueva solicitud",
    L: { ad: "NOMBRE", mail: "CORREO", tel: "TELÉFONO", giris: "ENTRADA", cikis: "SALIDA", kisi: "HUÉSPEDES", not: "NOTA" },
    errors: {
      ad: "Escriba su nombre y apellidos.",
      email: "Introduzca un correo electrónico válido.",
      giris: "Elija una fecha de entrada.",
      cikis: "Elija una fecha de salida.",
      sira: "La salida debe ser posterior a la entrada.",
    },
  },
  fr: {
    baslik: "Laissez votre demande de réservation.",
    intro:
      "Sur la côte lycienne, neuf suites réservées aux adultes. Laissez vos dates et nous planifierons avec vous, en toute confidentialité, la disponibilité et un accueil soigneusement préparé.",
    ad: "Nom complet",
    mail: "E-mail",
    tel: "Téléphone",
    giris: "Arrivée",
    cikis: "Départ",
    kisi: "Personnes",
    notlbl: "Note (facultatif)",
    guests: ["1 personne", "2 personnes", "3 personnes", "4 personnes"],
    btn: "Envoyer la demande",
    ph: "Une demande particulière, une préférence de suite…",
    note: "Ceci est un formulaire de démonstration. Votre demande n'est ni enregistrée ni envoyée et ne crée aucune réservation réelle.",
    okb: "Votre demande a bien été reçue.",
    body: "Cher/Chère {ad}, votre demande de réservation a été reçue. Nous vous répondrons bientôt par e-mail. (Démonstration : non envoyé.)",
    yeni: "Nouvelle demande",
    L: { ad: "NOM", mail: "E-MAIL", tel: "TÉLÉPHONE", giris: "ARRIVÉE", cikis: "DÉPART", kisi: "PERSONNES", not: "NOTE" },
    errors: {
      ad: "Veuillez saisir votre nom complet.",
      email: "Veuillez saisir une adresse e-mail valide.",
      giris: "Choisissez une date d'arrivée.",
      cikis: "Choisissez une date de départ.",
      sira: "Le départ doit être après l'arrivée.",
    },
  },
  ru: {
    baslik: "Оставьте заявку на бронирование.",
    intro:
      "На ликийском побережье, девять сьютов только для взрослых. Оставьте даты, и мы лично спланируем с вами доступность и тщательно подготовленную встречу.",
    ad: "Имя и фамилия",
    mail: "Эл. почта",
    tel: "Телефон",
    giris: "Заезд",
    cikis: "Выезд",
    kisi: "Гости",
    notlbl: "Примечание (необязательно)",
    guests: ["1 гость", "2 гостя", "3 гостя", "4 гостя"],
    btn: "Отправить заявку",
    ph: "Особое пожелание, предпочтение по сьюту…",
    note: "Это демонстрационная форма. Ваша заявка не сохраняется и никуда не отправляется и не создаёт реальное бронирование.",
    okb: "Ваша заявка получена.",
    body: "Уважаемый(ая) {ad}, ваша заявка на бронирование получена. Мы скоро ответим по эл. почте. (Демо: не отправляется.)",
    yeni: "Новая заявка",
    L: { ad: "ИМЯ", mail: "E-MAIL", tel: "ТЕЛЕФОН", giris: "ЗАЕЗД", cikis: "ВЫЕЗД", kisi: "ГОСТИ", not: "ПРИМЕЧАНИЕ" },
    errors: {
      ad: "Пожалуйста, укажите имя и фамилию.",
      email: "Введите корректный адрес эл. почты.",
      giris: "Выберите дату заезда.",
      cikis: "Выберите дату выезда.",
      sira: "Дата выезда должна быть позже даты заезда.",
    },
  },
  el: {
    baslik: "Αφήστε το αίτημα κράτησής σας.",
    intro:
      "Στις ακτές της Λυκίας, εννέα σουίτες μόνο για ενήλικες. Αφήστε τις ημερομηνίες σας και θα σχεδιάσουμε μαζί σας, ιδιωτικά, τη διαθεσιμότητα και μια προσεκτικά προετοιμασμένη υποδοχή.",
    ad: "Ονοματεπώνυμο",
    mail: "E-mail",
    tel: "Τηλέφωνο",
    giris: "Άφιξη",
    cikis: "Αναχώρηση",
    kisi: "Επισκέπτες",
    notlbl: "Σημείωση (προαιρετικό)",
    guests: ["1 επισκέπτης", "2 επισκέπτες", "3 επισκέπτες", "4 επισκέπτες"],
    btn: "Αποστολή αιτήματος",
    ph: "Ένα ειδικό αίτημα, προτίμηση σουίτας…",
    note: "Αυτή είναι μια φόρμα προεπισκόπησης. Το αίτημά σας δεν αποθηκεύεται ούτε αποστέλλεται πουθενά και δεν δημιουργεί πραγματική κράτηση.",
    okb: "Το αίτημά σας ελήφθη.",
    body: "Αγαπητέ/ή {ad}, το αίτημα κράτησής σας ελήφθη. Θα σας απαντήσουμε σύντομα με e-mail. (Προεπισκόπηση: δεν αποστέλλεται.)",
    yeni: "Νέο αίτημα",
    L: { ad: "ΟΝΟΜΑ", mail: "E-MAIL", tel: "ΤΗΛΕΦΩΝΟ", giris: "ΑΦΙΞΗ", cikis: "ΑΝΑΧΩΡΗΣΗ", kisi: "ΕΠΙΣΚΕΠΤΕΣ", not: "ΣΗΜΕΙΩΣΗ" },
    errors: {
      ad: "Γράψτε το ονοματεπώνυμό σας.",
      email: "Εισαγάγετε έγκυρη διεύθυνση e-mail.",
      giris: "Επιλέξτε ημερομηνία άφιξης.",
      cikis: "Επιλέξτε ημερομηνία αναχώρησης.",
      sira: "Η αναχώρηση πρέπει να είναι μετά την άφιξη.",
    },
  },
  de: {
    baslik: "Hinterlassen Sie Ihre Reservierungsanfrage.",
    intro:
      "An der lykischen Küste, neun Suiten nur für Erwachsene. Hinterlassen Sie Ihre Daten und wir planen mit Ihnen ganz persönlich die Verfügbarkeit und einen sorgfältig vorbereiteten Empfang.",
    ad: "Vollständiger Name",
    mail: "E-Mail",
    tel: "Telefon",
    giris: "Anreise",
    cikis: "Abreise",
    kisi: "Gäste",
    notlbl: "Anmerkung (optional)",
    guests: ["1 Gast", "2 Gäste", "3 Gäste", "4 Gäste"],
    btn: "Anfrage senden",
    ph: "Ein besonderer Wunsch, eine Suite-Präferenz…",
    note: "Dies ist ein Vorschauformular. Ihre Anfrage wird nicht gespeichert oder versendet und erstellt keine echte Reservierung.",
    okb: "Ihre Anfrage ist eingegangen.",
    body: "Sehr geehrte(r) {ad}, Ihre Reservierungsanfrage ist eingegangen. Wir antworten Ihnen in Kürze per E-Mail. (Vorschau: nicht gesendet.)",
    yeni: "Neue Anfrage",
    L: { ad: "NAME", mail: "E-MAIL", tel: "TELEFON", giris: "ANREISE", cikis: "ABREISE", kisi: "GÄSTE", not: "ANMERKUNG" },
    errors: {
      ad: "Bitte geben Sie Ihren vollständigen Namen ein.",
      email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      giris: "Bitte wählen Sie ein Anreisedatum.",
      cikis: "Bitte wählen Sie ein Abreisedatum.",
      sira: "Die Abreise muss nach der Anreise liegen.",
    },
  },
  it: {
    baslik: "Lasciate la vostra richiesta di prenotazione.",
    intro:
      "Sulla costa licia, nove suite riservate agli adulti. Lasciate le vostre date e pianificheremo con voi, in privato, la disponibilità e un'accoglienza preparata con cura.",
    ad: "Nome e cognome",
    mail: "E-mail",
    tel: "Telefono",
    giris: "Check-in",
    cikis: "Check-out",
    kisi: "Ospiti",
    notlbl: "Nota (facoltativo)",
    guests: ["1 ospite", "2 ospiti", "3 ospiti", "4 ospiti"],
    btn: "Invia la richiesta",
    ph: "Una richiesta particolare, una preferenza di suite…",
    note: "Questo è un modulo dimostrativo. La vostra richiesta non viene salvata né inviata e non genera una prenotazione reale.",
    okb: "La vostra richiesta è stata ricevuta.",
    body: "Gentile {ad}, la vostra richiesta di prenotazione è stata ricevuta. Vi risponderemo a breve via e-mail. (Anteprima: non inviata.)",
    yeni: "Nuova richiesta",
    L: { ad: "NOME", mail: "E-MAIL", tel: "TELEFONO", giris: "CHECK-IN", cikis: "CHECK-OUT", kisi: "OSPITI", not: "NOTA" },
    errors: {
      ad: "Inserite il vostro nome e cognome.",
      email: "Inserite un indirizzo e-mail valido.",
      giris: "Scegliete una data di check-in.",
      cikis: "Scegliete una data di check-out.",
      sira: "Il check-out deve essere successivo al check-in.",
    },
  },
  ar: {
    baslik: "اترك طلب الحجز الخاص بك.",
    intro:
      "على ساحل ليقيا، تسع أجنحة للكبار فقط. اترك لنا تواريخك وسنخطط معك بشكل خاص للتوافر ولاستقبال مُعدّ بعناية.",
    ad: "الاسم الكامل",
    mail: "البريد الإلكتروني",
    tel: "الهاتف",
    giris: "تسجيل الوصول",
    cikis: "تسجيل المغادرة",
    kisi: "الضيوف",
    notlbl: "ملاحظة (اختياري)",
    guests: ["ضيف واحد", "ضيفان", "3 ضيوف", "4 ضيوف"],
    btn: "إرسال الطلب",
    ph: "طلب خاص، تفضيل جناح…",
    note: "هذا نموذج للعرض فقط. لا يتم حفظ طلبك أو إرساله إلى أي جهة ولا يُنشئ حجزاً فعلياً.",
    okb: "تم استلام طلبك.",
    body: "عزيزي {ad}، تم استلام طلب حجزك. سنرد عليك قريباً عبر البريد الإلكتروني. (عرض توضيحي: لا يُرسل فعلياً.)",
    yeni: "طلب جديد",
    L: { ad: "الاسم", mail: "البريد", tel: "الهاتف", giris: "الوصول", cikis: "المغادرة", kisi: "الضيوف", not: "ملاحظة" },
    errors: {
      ad: "يرجى كتابة اسمك الكامل.",
      email: "يرجى إدخال بريد إلكتروني صالح.",
      giris: "يرجى اختيار تاريخ الوصول.",
      cikis: "يرجى اختيار تاريخ المغادرة.",
      sira: "يجب أن يكون تاريخ المغادرة بعد تاريخ الوصول.",
    },
  },
  fa: {
    baslik: "درخواست رزرو خود را ثبت کنید.",
    intro:
      "در ساحل لیکیه، نُه سوئیت ویژهٔ بزرگسالان. تاریخ‌های خود را بگذارید تا به‌صورت خصوصی، در دسترس بودن و پذیرایی‌ای را که با دقت آماده شده است با شما برنامه‌ریزی کنیم.",
    ad: "نام و نام خانوادگی",
    mail: "ایمیل",
    tel: "تلفن",
    giris: "ورود",
    cikis: "خروج",
    kisi: "مهمان‌ها",
    notlbl: "یادداشت (اختیاری)",
    guests: ["1 مهمان", "2 مهمان", "3 مهمان", "4 مهمان"],
    btn: "ارسال درخواست",
    ph: "درخواستی خاص، ترجیح سوئیت…",
    note: "این یک فرم نمایشی است. درخواست شما ذخیره یا به جایی ارسال نمی‌شود و رزرو واقعی ایجاد نمی‌کند.",
    okb: "درخواست شما دریافت شد.",
    body: "{ad} گرامی، درخواست رزرو شما دریافت شد. به‌زودی از طریق ایمیل پاسخ خواهیم داد. (نمایشی: ارسال نمی‌شود.)",
    yeni: "درخواست جدید",
    L: { ad: "نام", mail: "ایمیل", tel: "تلفن", giris: "ورود", cikis: "خروج", kisi: "مهمان‌ها", not: "یادداشت" },
    errors: {
      ad: "لطفاً نام و نام خانوادگی خود را بنویسید.",
      email: "لطفاً یک ایمیل معتبر وارد کنید.",
      giris: "لطفاً تاریخ ورود را انتخاب کنید.",
      cikis: "لطفاً تاریخ خروج را انتخاب کنید.",
      sira: "تاریخ خروج باید پس از تاریخ ورود باشد.",
    },
  },
};

/** Per-language date display format (separator + placeholder), from the original DF map. */
export const DATE_FORMATS: Readonly<Record<Lang, { sep: string; ph: string }>> = {
  tr: { sep: ".", ph: "gg.aa.yyyy" },
  en: { sep: "/", ph: "dd/mm/yyyy" },
  es: { sep: "/", ph: "dd/mm/aaaa" },
  fr: { sep: "/", ph: "jj/mm/aaaa" },
  de: { sep: ".", ph: "tt.mm.jjjj" },
  ru: { sep: ".", ph: "дд.мм.гггг" },
  el: { sep: "/", ph: "ηη/μμ/εεεε" },
  it: { sep: "/", ph: "gg/mm/aaaa" },
  ar: { sep: "/", ph: "يوم/شهر/سنة" },
  fa: { sep: "/", ph: "روز/ماه/سال" },
};

/** ISO yyyy-mm-dd → localized display string. */
export function formatDate(iso: string, lang: Lang): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const { sep } = DATE_FORMATS[lang];
  return [d, m, y].join(sep);
}
