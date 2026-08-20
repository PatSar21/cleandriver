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
        { value: "3", label: "eigene Projekte" },
        { value: "Berlin", label: "Basis" },
        { value: "DE / EN", label: "Sprachen" }
      ]
    },
    about: {
      label: "Über mich",
      title: "Verkaufen und bauen — beides.",
      body: [
        "Im Hauptberuf bringe ich Enterprise-Software zu großen Kunden: Erstkontakt, Pilot, Vertrag, Rollout. Ich sitze dabei jeden Tag zwischen Fachabteilung, IT und Einkauf und übersetze zwischen allen dreien.",
        "Daneben baue ich eigene Produkte. Nicht als Hobby, sondern weil ich in Gesprächen ständig Probleme höre, für die es noch nichts Gutes gibt. Drei davon sind bisher entstanden."
      ]
    },
    career: {
      label: "Werdegang",
      title: "Stationen",
      present: "heute"
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
        { value: "3", label: "own projects" },
        { value: "Berlin", label: "based in" },
        { value: "DE / EN", label: "languages" }
      ]
    },
    about: {
      label: "About",
      title: "Selling and building — both.",
      body: [
        "By day I bring enterprise software to large customers: first contact, pilot, contract, rollout. Every day I sit between the business side, IT and procurement, and translate between all three.",
        "On the side I build my own products. Not as a hobby — because I keep hearing problems in those conversations that nothing good solves yet. Three of them exist so far."
      ]
    },
    career: { label: "Career", title: "Where I've been", present: "present" },
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
    from: "2024",
    to: null,
    company: "Eye-Able",
    role: { de: "Enterprise Sales Manager", en: "Enterprise Sales Manager" },
    body: {
      de: "Digitale Barrierefreiheit für große Organisationen: Verantwortung für Enterprise-Kunden von der ersten Ansprache bis zum Rollout.",
      en: "Digital accessibility for large organisations: owning enterprise accounts from first outreach through to rollout."
    },
    confirm: true
  },
  {
    from: "",
    to: "",
    company: "[Vorherige Station]",
    role: { de: "[Rolle]", en: "[Role]" },
    body: {
      de: "Platzhalter — bitte Angaben aus dem LinkedIn-Profil ergänzen.",
      en: "Placeholder — to be filled in from the LinkedIn profile."
    },
    confirm: true,
    placeholder: true
  },
  {
    from: "",
    to: "",
    company: "OSZ Louise-Schroeder-Schule, Berlin",
    role: { de: "Bürowirtschaft und Verwaltung", en: "Business administration" },
    body: {
      de: "Ausbildung in Berlin.",
      en: "Vocational education in Berlin."
    },
    kind: "education",
    confirm: true
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
    name: "Mans Stuff",
    status: "building",
    url: "",
    tags: ["App"],
    body: {
      de: "[Kurzbeschreibung folgt — bitte in einem Satz sagen, was Mans Stuff macht und für wen.]",
      en: "[Short description pending — one sentence on what Mans Stuff does and who it is for.]"
    },
    confirm: true,
    placeholder: true
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
