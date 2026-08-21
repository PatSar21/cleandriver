// All page content lives here, in both languages.
// Entries marked confirm:true render a small "please confirm" marker in draft mode.

export const PROFILE = {
  name: "Patrick Sarpen",
  initials: "PS",
  photo: "assets/portrait.jpg",
  location: "Berlin, Deutschland",
  locationEn: "Berlin, Germany",
  email: "",          // filled in once confirmed
  phone: "",          // filled in once confirmed
  linkedin: "https://www.linkedin.com/in/patrick-sarpen-4449591a2/",
  website: ""
};

export const CONTENT = {
  de: {
    nav: { work: "Projekte", career: "Werdegang", contact: "Kontakt" },
    hero: {
      eyebrow: "Digitale Visitenkarte",
      role: "Enterprise Sales Manager & Gründer",
      tagline:
        "Ich verkaufe Software an große Organisationen — und baue nebenbei die Produkte, die mir selbst gefehlt haben.",
      saveContact: "Kontakt speichern",
      writeEmail: "E-Mail schreiben",
      stats: [
        { value: "2", label: "eigene Projekte" },
        { value: "Berlin", label: "Basis" },
        { value: "DE / EN", label: "Sprachen" }
      ]
    },
    about: {
      label: "Über mich",
      title: "Verkaufen und bauen — beides.",
      body: [
        "Im Hauptberuf bringe ich Enterprise-Software zu großen Kunden: Erstkontakt, Pilot, Vertrag, Rollout. Ich sitze dabei jeden Tag zwischen Fachabteilung, IT und Einkauf und übersetze zwischen allen dreien.",
        "Daneben baue ich eigene Produkte. Nicht als Hobby, sondern weil ich in Gesprächen ständig Probleme höre, für die es noch nichts Gutes gibt. Zwei davon sind bisher entstanden."
      ]
    },
    career: {
      label: "Werdegang",
      title: "Stationen",
      present: "heute",
      showEarlier: "Frühere Stationen anzeigen",
      hideEarlier: "Frühere Stationen ausblenden",
      unknownEnd: "Ende offen"
    },
    projects: {
      label: "Was ich gebaut habe",
      title: "Projekte",
      open: "Öffnen",
      statusLive: "Live",
      statusBuilding: "In Entwicklung"
    },
    contact: {
      label: "Kontakt",
      title: "Sprechen wir.",
      body: "Am schnellsten per E-Mail. Oder scannen Sie den Code und haben Sie diese Seite auf dem Handy.",
      copy: "Kopieren",
      copied: "Kopiert",
      qrHint: "Diese Seite scannen",
      vcard: "Als Kontakt speichern (.vcf)"
    },
    footer: { rights: "Alle Rechte vorbehalten.", imprint: "Impressum" },
    draft: {
      title: "Entwurf",
      body: "Werdegang und Projekttexte sind Platzhalter, bis Patrick sie bestätigt hat."
    }
  },
  en: {
    nav: { work: "Projects", career: "Career", contact: "Contact" },
    hero: {
      eyebrow: "Digital business card",
      role: "Enterprise Sales Manager & Founder",
      tagline:
        "I sell software to large organisations — and build the products I kept wishing existed.",
      saveContact: "Save contact",
      writeEmail: "Write an email",
      stats: [
        { value: "2", label: "own projects" },
        { value: "Berlin", label: "based in" },
        { value: "DE / EN", label: "languages" }
      ]
    },
    about: {
      label: "About",
      title: "Selling and building — both.",
      body: [
        "By day I bring enterprise software to large customers: first contact, pilot, contract, rollout. Every day I sit between the business side, IT and procurement, and translate between all three.",
        "On the side I build my own products. Not as a hobby — because I keep hearing problems in those conversations that nothing good solves yet. Two of them exist so far."
      ]
    },
    career: {
      label: "Career",
      title: "Where I've been",
      present: "present",
      showEarlier: "Show earlier stations",
      hideEarlier: "Hide earlier stations",
      unknownEnd: "end date pending"
    },
    projects: {
      label: "What I've built",
      title: "Projects",
      open: "Open",
      statusLive: "Live",
      statusBuilding: "In development"
    },
    contact: {
      label: "Contact",
      title: "Let's talk.",
      body: "Email is fastest. Or scan the code to carry this page on your phone.",
      copy: "Copy",
      copied: "Copied",
      qrHint: "Scan this page",
      vcard: "Save as contact (.vcf)"
    },
    footer: { rights: "All rights reserved.", imprint: "Imprint" },
    draft: {
      title: "Draft",
      body: "Career and project copy are placeholders until Patrick confirms them."
    }
  }
};

export const CAREER = [
  {
    from: "", to: null, company: "Eye-Able (Web Inclusion GmbH)",
    role: { de: "Enterprise Sales Manager", en: "Enterprise Sales Manager" },
    body: {
      de: "Digitale Barrierefreiheit für große Organisationen: Enterprise-Kunden von der ersten Ansprache bis zum Rollout.",
      en: "Digital accessibility for large organisations: enterprise accounts from first outreach through to rollout."
    },
    confirm: true
  },
  {
    from: "11/2015", to: "", toUnknown: true, company: "DNS:NET Internet Service GmbH",
    role: { de: "Assistent der Vertriebsleitung", en: "Assistant to the Head of Sales" },
    body: {
      de: "Vertriebsinnendienst und Neukundenberatung online und am Telefon, dazu Systemadministration und Marketing.",
      en: "Inside sales and new-customer advice by phone and email, plus systems administration and marketing."
    },
    confirm: true
  },
  {
    from: "03/2015", to: "11/2015", company: "Gillanation UG",
    role: { de: "Assistent der Geschäftsführung", en: "Assistant to the Managing Director" },
    body: {
      de: "Rechte Hand der Geschäftsführung im Tagesgeschäft.",
      en: "Right hand to the management in day-to-day operations."
    }
  },
  {
    from: "04/2012", to: "03/2015", company: "Creditsafe Deutschland GmbH",
    role: { de: "Telesales, Teamleitung, Marketing", en: "Telesales, team lead, marketing" },
    body: {
      de: "Start in der Kaltakquise, dann Teamleitung, zuletzt Leadgenerierung und Messen im Marketing-Team.",
      en: "Started in cold outreach, then team lead, finally lead generation and trade fairs in the marketing team."
    }
  },
  {
    from: "10/2011", to: "03/2012", company: "Z Personaldienstleistungen GmbH",
    role: { de: "Zeitarbeit, Einsatz bei Klosterfrau", en: "Temporary assignment at Klosterfrau" },
    body: { de: "Befristeter Einsatz beim Kunden Klosterfrau.", en: "Fixed-term assignment with client Klosterfrau." },
    early: true
  },
  {
    from: "10/2009", to: "06/2011", company: "OSZ für Bürowirtschaft und Verwaltung, Berlin",
    role: { de: "Allgemeine Hochschulreife, Schwerpunkt Wirtschaft", en: "Abitur, focus on business" },
    body: { de: "Hochschulreife im zweiten Bildungsweg.", en: "University entrance qualification, second-chance route." },
    kind: "education", early: true
  },
  {
    from: "12/2006", to: "12/2009", company: "tecis Finanzdienstleistungen AG",
    role: { de: "Investmentberatung", en: "Investment advisor" },
    body: {
      de: "Beratung von Privatkunden zu Investment- und Vorsorgeprodukten — parallel zur Ausbildung.",
      en: "Advising private clients on investment and pension products — alongside vocational training."
    },
    early: true
  },
  {
    from: "10/2006", to: "05/2009", company: "OSZ für Bürowirtschaft und Verwaltung, Berlin",
    role: { de: "Ausbildung zum Kaufmann für Bürokommunikation", en: "Apprenticeship, office management" },
    body: { de: "Abschlussnote „gut“.", en: "Graded “good”." },
    kind: "education", early: true
  },
  {
    from: "09/2005", to: "04/2006", company: "Obst- und Gemüsehandel Sarpen GbR",
    role: { de: "Einkauf und Verkauf", en: "Buying and selling" },
    body: {
      de: "Familienbetrieb: Einkauf im Großhandel, Verkauf am Stand, Auf- und Abbau.",
      en: "Family business: wholesale buying, selling at the stall, setting up and packing down."
    },
    early: true
  },
  {
    from: "08/2005", to: "09/2005", company: "Restaurant Brachvogel, Berlin",
    role: { de: "Küchenhilfe", en: "Kitchen hand" },
    body: { de: "Der erste Job: Küche, Pizzaofen, Spüle.", en: "The first job: kitchen, pizza oven, dishes." },
    early: true
  }
];

export const PROJECTS = [
  {
    name: "CleanDriver",
    status: "building",
    url: "",
    tags: ["Mobility", "Marktplatz", "Recht"],
    body: {
      de: "Ein Fahrer kommt zu Ihnen und fährt Sie in Ihrem eigenen Auto — buchbar wie ein Taxi, aber ohne Ihr Auto stehen zu lassen. Buchungsstrecke, Fahrer-Vermittlung und die rechtliche Konstruktion dahinter.",
      en: "A driver comes to you and drives you in your own car — bookable like a taxi, without leaving your car behind. Booking flow, driver matching, and the legal construction behind it."
    },
    confirm: true
  },
  {
    name: "Rhythmus",
    status: "building",
    url: "",
    tags: ["App"],
    body: {
      de: "[Kurzbeschreibung folgt — bitte in einem Satz sagen, was Rhythmus macht und für wen.]",
      en: "[Short description pending — one sentence on what Rhythmus does and who it is for.]"
    },
    confirm: true,
    placeholder: true
  }
];

export const DRAFT_MODE = true;
