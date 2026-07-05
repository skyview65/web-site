import type { Dictionary } from "../dictionary";

export const es = {
  meta: {
    title: "LUMENFALL — La oscuridad brilla · 2099",
    description:
      "2099. Tres vidas, un destino en Lumenfall, una megaciudad gobernada por una IA. Una epopeya criminal de mundo abierto que va de la calle a la órbita. Llega en 2027.",
    ogAlt: "LUMENFALL — un ascensor orbital sobre la megaciudad de neón de 2099",
  },
  nav: {
    city: "La Ciudad",
    protagonists: "Personajes",
    features: "Características",
    online: "LUMENFALL Online",
    editions: "Ediciones",
    preorder: "Reservar",
    menuOpen: "Abrir menú",
    menuClose: "Cerrar menú",
    selectLanguage: "Elegir idioma",
    skipToContent: "Saltar al contenido",
  },
  hero: {
    kicker: "UNA EPOPEYA CRIMINAL DE MUNDO ABIERTO",
    tagline: "La oscuridad brilla.",
    releaseWindow: "2027",
    platforms: "PC · CONSOLA · NUBE",
    cta: "Reservar ahora",
    scrollHint: "Desplázate para explorar",
    imageAlt:
      "Lumenfall en 2099: un ascensor orbital atraviesa las nubes hacia las estrellas, neones cian y magenta sobre torres negras",
  },
  city: {
    kicker: "LA CIUDAD",
    title: "Lumenfall está viva. Incluso mientras duermes.",
    paragraphs: [
      "Reconstruida sobre sus cenizas tras el Gran Apagón de 2061, Lumenfall está hoy gobernada por PANOPT: una inteligencia artificial a escala urbana que lo controla todo, del tráfico a los tribunales, de la red eléctrica a la propia memoria. Bajo su orden impecable se extiende un enorme ecosistema criminal repartido en nueve distritos.",
      "De los casinos de Puerto Neón a las calles de bandas del Cinturón de Óxido, de los callejones sumergidos de Bajoniebla hasta Ascenso, donde el ascensor orbital trepa hacia el cielo: cada distrito tiene su propia economía, sus propias reglas, su propia memoria. El olor de una calle, la rabia de un barrio, el precio que te pone un usurero: la ciudad no olvida nada.",
      "Y la ciudad te observa. Cada decisión que tomas queda escrita en el registro de PANOPT, esperando el día en que vuelva a buscarte.",
    ],
    stats: [
      { value: "9", label: "DISTRITOS" },
      { value: "310 KM²", label: "CIUDAD + CAPA ORBITAL" },
      { value: "1,2 M", label: "CIUDADANOS SIMULADOS" },
      { value: "100 %", label: "SIN CORTES — SIN PANTALLAS DE CARGA" },
    ],
    imageAlt:
      "A pie de calle en Lumenfall: multitudes en un cañón de neón, anuncios holográficos y reflejos en el asfalto mojado",
  },
  protagonists: {
    kicker: "TRES VIDAS, UN DESTINO",
    title: "¿Con qué ojos lo vivirás?",
    intro:
      "Tres personajes jugables, tres mundos distintos, y unas historias que se anudan en un único punto. Cambia entre ellos cuando quieras; cada uno sigue viviendo su vida mientras no estás.",
    characters: [
      {
        id: "mara",
        name: "Mara Vex",
        role: "Netrunner",
        tagline: "Busca a su hermano borrado.",
        bio: "La mejor ladrona de datos del Mercado de Sombras. Una noche, su hermano fue borrado de los bancos de memoria de PANOPT y de los recuerdos de todos. Mara se infiltrará en el corazón del sistema para robar de vuelta lo que este decidió olvidar.",
      },
      {
        id: "kaan",
        name: "Kaan “Ghost” Demir",
        role: "Exsicario",
        tagline: "El hombre que escapó del sistema.",
        bio: "Durante veinte años hizo el trabajo sucio del Compact; luego se negó a cumplir una orden y murió, según los registros oficiales. Ahora vaga como un fantasma por el Cinturón de Óxido. Ajustará cuentas con su pasado antes de que su pasado lo encuentre a él.",
      },
      {
        id: "solene",
        name: "Solene Adeyemi",
        role: "Contrabandista orbital",
        tagline: "La reina forajida del cielo.",
        bio: "La piloto que transporta todo lo que vuele entre Ascenso y el Anillo Cénit. La aduana es para ella una sugerencia; la gravedad, un tecnicismo. Hasta que un cargamento deja el destino de toda la ciudad en su cabina.",
      },
    ],
  },
  features: {
    kicker: "JUGABILIDAD",
    title: "Más que una ciudad. Un sistema.",
    items: [
      {
        title: "De la calle a la órbita",
        body: "Una persecución que empieza en el metro puede subir por el ascensor orbital y terminar en gravedad cero en el Anillo Cénit. Un mapa, un aliento: sin pantallas de carga.",
      },
      {
        title: "Una ciudad viva",
        body: "Cada uno de los 1,2 millones de ciudadanos tiene una identidad persistente: rutinas, relaciones, recuerdos. El vendedor ambulante al que golpeaste ayer te reconocerá mañana.",
      },
      {
        title: "Tres vidas, una historia",
        body: "Cambia al instante entre Mara, Kaan y Solene. Los personajes que no controlas siguen sus propias agendas; sus historias se cruzan a través de tus decisiones.",
      },
      {
        title: "El sistema de respuesta PANOPT",
        body: "No es un nivel de búsqueda: es una ciudad que te aprende. PANOPT analiza tus patrones delictivos y construye sus trampas a su alrededor. El mismo truco nunca funciona dos veces.",
      },
      {
        title: "Una economía impulsada por los jugadores",
        body: "Los precios de los nueve distritos se mueven con la oferta y la demanda reales. Monta rutas de contrabando o manipula el mercado: la economía es tu patio de juegos.",
      },
      {
        title: "El garaje sin fondo",
        body: "Más de 200 vehículos: de los deslizadores a las lanzaderas orbitales. Todos se modifican pieza a pieza y todos se pueden robar. Sí, la lanzadera también.",
      },
    ],
  },
  online: {
    kicker: "SERVICIO EN VIVO",
    title: "LUMENFALL Online: la ciudad es de todos.",
    body: "Levanta tu propio imperio criminal con una banda de cuatro. Con rotaciones de golpes por temporada, guerras de distritos y una economía escrita por los jugadores, Lumenfall es un mundo que sigue girando incluso cuando estás desconectado.",
    bullets: [
      "Temporadas de 12 semanas, cada una con nueva trama de distrito, golpe y eventos",
      "Sistema de bandas: equipos de 4, guaridas compartidas, caja común",
      "Guerras de distritos: el control de los nueve distritos cambia de manos cada semana",
      "Juego cruzado + progresión cruzada: una cuenta, todos los dispositivos",
      "Todo el contenido jugable se gana jugando: el poder nunca está en venta",
    ],
    ticker:
      "TEMPORADA 01: PROTOCOLO APAGÓN · NUEVO GOLPE: LA CÁMARA CÉNIT · GUERRA DE DISTRITO: PUERTO NEÓN · SEMANA DE LUMEN DOBLE",
    imageAlt:
      "Una banda de cuatro alrededor de una mesa holográfica de planificación en una guarida oscura",
  },
  editions: {
    kicker: "RESERVA",
    title: "Elige tu edición.",
    tiers: [
      {
        id: "standard",
        name: "Standard",
        tag: "",
        price: "79,99 €",
        contents: [
          "Juego base LUMENFALL",
          "Acceso a LUMENFALL Online",
          "Bonus de reserva: vinilo « Apagón » para vehículos",
        ],
        cta: "Elegir Standard",
      },
      {
        id: "deluxe",
        name: "Deluxe",
        tag: "La más popular",
        price: "109,99 €",
        contents: [
          "Juego base + LUMENFALL Online",
          "Acceso anticipado de 72 horas",
          "Libro de arte digital + banda sonora original",
          "Colección de atuendos « Mercado de Sombras »",
          "Pack cosmético Prisma de la Temporada 01",
        ],
        cta: "Elegir Deluxe",
      },
      {
        id: "eternal",
        name: "Eternal",
        tag: "Coleccionista",
        price: "139,99 €",
        contents: [
          "Todo lo de la Deluxe",
          "Pase de expansión del Año Uno (2 packs de historia)",
          "Apartamento en el Anillo Cénit (guarida en el juego)",
          "Serie exclusiva de vehículos con monograma « Eternal »",
          "Tu nombre en una calle de Lumenfall*",
        ],
        cta: "Elegir Eternal",
      },
    ],
    note: "*Limitado a las primeras 10 000 reservas Eternal. Todo el contenido es ficticio; los precios son orientativos. Nada que afecte a la jugabilidad se vende jamás por dinero real.",
    imageAlt:
      "Una caja de coleccionista de LUMENFALL con un emblema V cian y reflejos de neón sobre cristal negro",
  },
  newsletter: {
    title: "Apúntate a la lista del apagón.",
    body: "Tráilers, invitaciones a la beta cerrada y noticias de temporada. Sin spam, solo señal.",
    placeholder: "tu correo electrónico",
    button: "Apuntarme",
    success: "Estás en la lista. La oscuridad se pondrá en contacto.",
    privacy: "Date de baja cuando quieras, con un clic.",
  },
  footer: {
    fictional:
      "LUMENFALL es un juego ficticio creado como trabajo conceptual. No guarda relación con ningún producto, estudio o marca reales.",
    rights: "© 2099 Lumenworks Studios. Todos los derechos —de momento— reservados.",
    studio: "Lumenworks Studios",
  },
} satisfies Dictionary;
