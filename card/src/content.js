// All page content lives here, in both languages.
// Entries marked confirm:true render a small "please confirm" marker in draft mode.

export const PROFILE = {
  name: "Patrick Sarpen",
  initials: "PS",
  photo: "assets/portrait.jpg",
  location: "Berlin, Deutschland",
  locationEn: "Berlin, Germany",
  email: "patrick.sarpen21@gmail.com",
  phone: "",          // deliberately not published
  linkedin: "https://www.linkedin.com/in/patrick-sarpen-4449591a2/",
  website: ""
};

export const CONTENT = {
  de: {
    nav: { work: "Projekte", career: "Werdegang", contact: "Kontakt", write: "Schreiben" },
    hero: {
      eyebrow: "Digitale Visitenkarte",
      role: "Senior Full Cycle Sales Manager & Gründer",
      tagline:
        "Seit zwanzig Jahren im Vertrieb — und nebenbei baue ich die Produkte, die mir selbst gefehlt haben.",
      saveContact: "Kontakt speichern",
      writeEmail: "E-Mail schreiben",
      stats: [
        { value: "20+", label: "Jahre Berufserfahrung" },
        { value: "2", label: "eigene Projekte" },
        { value: "DE / EN / TR", label: "Sprachen" }
      ]
    },
    about: {
      label: "Über mich",
      title: "Verkaufen und bauen — seit zwanzig Jahren.",
      body: [
        "Seit 2005 im Vertrieb — vom Verkaufsstand des Familienbetriebs über die Kaltakquise und die Leitung eines Zwölfer-Teams bis heute ins Enterprise-Geschäft. Erstkontakt, Pilot, Vertrag, Abschluss: ich sitze jeden Tag zwischen Fachabteilung, Entscheidern und Einkauf und übersetze zwischen allen dreien.",
        "Dazwischen viereinhalb Jahre eigenes Unternehmen: MOODBOWL, von der Idee bis zum laufenden Betrieb. Seitdem baue ich weiter eigene Produkte — nicht als Hobby, sondern weil ich in Gesprächen ständig Probleme höre, für die es noch nichts Gutes gibt. Zwei davon sind bisher entstanden."
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
    exchange: {
      label: "Kontakt aufnehmen",
      title: "Hinterlassen Sie mir Ihre Daten.",
      intro: "Melden Sie sich mit Google an und schreiben Sie mir. Was Sie schreiben, sehen nur Sie und ich — niemand sonst.",
      signIn: "Mit Google anmelden",
      signOut: "Abmelden",
      signedInAs: "Angemeldet als",
      nameLabel: "Ihr Name",
      companyLabel: "Firma (optional)",
      messageLabel: "Ihre Nachricht",
      messagePlaceholder: "Worum geht es?",
      send: "Nachricht senden",
      sending: "Wird gesendet …",
      sent: "Danke — Ihre Nachricht ist bei mir angekommen.",
      yourMessages: "Ihre Nachrichten",
      noMessages: "Noch keine Nachricht von Ihnen.",
      inbox: "Posteingang",
      inboxEmpty: "Noch keine Nachrichten.",
      inboxCount: "Nachrichten insgesamt",
      privacyNote: "Nur Sie sehen Ihre eigenen Nachrichten. Ich sehe alle.",
      errorSignIn: "Die Anmeldung ist noch nicht freigeschaltet. Bitte später erneut versuchen.",
      errorSend: "Das hat nicht geklappt. Bitte noch einmal versuchen.",
      required: "Bitte Name und Nachricht ausfüllen."
    },
    footer: { rights: "Alle Rechte vorbehalten.", imprint: "Impressum" },
    draft: {
      title: "Entwurf",
      body: "Werdegang und Projekttexte sind Platzhalter, bis Patrick sie bestätigt hat."
    }
  },
  en: {
    nav: { work: "Projects", career: "Career", contact: "Contact", write: "Write" },
    hero: {
      eyebrow: "Digital business card",
      role: "Senior Full Cycle Sales Manager & Founder",
      tagline:
        "Twenty years in sales — and on the side I build the products I kept wishing existed.",
      saveContact: "Save contact",
      writeEmail: "Write an email",
      stats: [
        { value: "20+", label: "years in the field" },
        { value: "2", label: "own projects" },
        { value: "DE / EN / TR", label: "languages" }
      ]
    },
    about: {
      label: "About",
      title: "Selling and building — for twenty years.",
      body: [
        "In sales since 2005 — from the family market stall through cold calling and leading a team of twelve, to enterprise deals today. First contact, pilot, contract, close: every day I sit between the business side, the decision makers and procurement, and translate between all three.",
        "In between, four and a half years running my own company: MOODBOWL, from idea to a working business. I have kept building my own products since — not as a hobby, but because I keep hearing problems in those conversations that nothing good solves yet. Two of them exist so far."
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
    exchange: {
      label: "Get in touch",
      title: "Leave me your details.",
      intro: "Sign in with Google and write to me. What you write is visible to you and me only — nobody else.",
      signIn: "Sign in with Google",
      signOut: "Sign out",
      signedInAs: "Signed in as",
      nameLabel: "Your name",
      companyLabel: "Company (optional)",
      messageLabel: "Your message",
      messagePlaceholder: "What is this about?",
      send: "Send message",
      sending: "Sending …",
      sent: "Thank you — your message reached me.",
      yourMessages: "Your messages",
      noMessages: "No message from you yet.",
      inbox: "Inbox",
      inboxEmpty: "No messages yet.",
      inboxCount: "messages in total",
      privacyNote: "Only you can see your own messages. I can see all of them.",
      errorSignIn: "Sign-in is not switched on yet. Please try again later.",
      errorSend: "That did not work. Please try again.",
      required: "Please fill in your name and a message."
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
    from: "06/2026", to: null, company: "hey circle — Reusable Packaging",
    role: { de: "Senior Full Cycle Sales Manager", en: "Senior Full Cycle Sales Manager" },
    body: {
      de: "Mehrwegverpackungen statt Karton: der komplette Vertriebszyklus von der ersten Ansprache bis zum Abschluss.",
      en: "Reusable packaging instead of cardboard: the full sales cycle from first contact to close."
    }
  },
  {
    from: "11/2025", to: "06/2026", company: "Eye-Able (Web Inclusion GmbH)",
    role: { de: "Enterprise Sales Manager", en: "Enterprise Sales Manager" },
    body: {
      de: "Digitale Barrierefreiheit für große Organisationen: Enterprise-Kunden von der ersten Ansprache bis zum Rollout.",
      en: "Digital accessibility for large organisations: enterprise accounts from first outreach through to rollout."
    }
  },
  {
    from: "06/2022", to: "10/2025", company: "WorkMotion Software GmbH, Berlin",
    role: { de: "Senior Account Executive", en: "Senior Account Executive" },
    body: {
      de: "Neukundengeschäft von der Ansprache bis zum Abschluss, Messen, Vertriebstrainings, Projektsteuerung, QBRs und Forecasting.",
      en: "New business from first contact to close, trade fairs, sales training, project management, QBRs and forecasting."
    }
  },
  {
    from: "06/2021", to: "06/2022", company: "Cameo Systems GmbH, Berlin",
    role: { de: "Sales & Recruiting Specialist", en: "Sales & Recruiting Specialist" },
    body: {
      de: "Vermittlung von IT-Fachkräften, Headhunting, Key Accounting und Netzwerkaufbau.",
      en: "Placing IT specialists, headhunting, key accounting and network building."
    }
  },
  {
    from: "05/2019", to: "12/2023", company: "MOODBOWL, Berlin",
    role: { de: "Gründer und Geschäftsführer", en: "Founder and CEO" },
    body: {
      de: "Eigenes Unternehmen von der Idee bis zum laufenden Betrieb: Einkauf und Rezepturen, Kundengewinnung, Events, Buchhaltung, Website und Social Media.",
      en: "My own company from idea to running operation: purchasing and recipes, winning customers, events, bookkeeping, website and social media."
    }
  },
  {
    from: "07/2018", to: "04/2019", company: "Sabbatical",
    role: { de: "Auszeit und Reisen", en: "Time out and travel" },
    body: { de: "Zehn Monate unterwegs.", en: "Ten months on the road." },
    kind: "break"
  },
  {
    from: "11/2015", to: "06/2018", company: "DNS:NET Internet Service GmbH, Berlin",
    role: { de: "Stellvertretender Vertriebsleiter", en: "Deputy Sales Manager" },
    body: {
      de: "Vertriebsinnendienst und Neukundenberatung, dazu Personalplanung, Messen, Systemadministration und Marketing.",
      en: "Inside sales and new-customer advice, plus staff planning, trade fairs, systems administration and marketing."
    },
    early: true
  },
  {
    from: "03/2015", to: "11/2015", company: "Gillanation UG, Berlin",
    role: { de: "Projektmanager Vertrieb", en: "Project Manager, Sales" },
    body: {
      de: "Marketing und Vermarktung einer Tanzplattform.",
      en: "Marketing and go-to-market for a dance platform."
    },
    early: true
  },
  {
    from: "04/2012", to: "03/2015", company: "Creditsafe Deutschland GmbH, Berlin",
    role: { de: "Teamleiter Vertrieb und Marketing", en: "Team Leader, Sales and Marketing" },
    body: {
      de: "Start in der Kaltakquise, dann Führung eines Teams von zwölf Mitarbeitenden: Zielsetzung, Trainings, Messen und Leadgenerierung.",
      en: "Started in cold outreach, then led a team of twelve: goal setting, training, trade fairs and lead generation."
    },
    early: true
  },
  {
    from: "10/2011", to: "03/2012", company: "Z Personaldienstleistungen GmbH, Berlin",
    role: { de: "Produktionshelfer bei Klosterfrau", en: "Production assistant at Klosterfrau" },
    body: { de: "Abfüllung und Qualitätskontrolle.", en: "Packing, filling and quality control." },
    early: true
  },
  {
    from: "10/2009", to: "06/2011", company: "OSZ Bürowirtschaft und Verwaltung, Berlin",
    role: { de: "Allgemeine Hochschulreife, Schwerpunkt Wirtschaft", en: "Abitur, focus on business" },
    body: { de: "Hochschulreife im zweiten Bildungsweg.", en: "University entrance qualification, second-chance route." },
    kind: "education", early: true
  },
  {
    from: "12/2006", to: "12/2009", company: "Tecis Finanzdienstleistungen AG",
    role: { de: "Investmentberater und Versicherungsfachmann", en: "Investment consultant and insurance specialist" },
    body: {
      de: "Beratung von Privatkunden — parallel zur Ausbildung.",
      en: "Advising private clients — alongside vocational training."
    },
    early: true
  },
  {
    from: "10/2006", to: "05/2009", company: "OSZ Bürowirtschaft und Verwaltung, Berlin",
    role: { de: "Ausbildung zum Kaufmann für Bürokommunikation", en: "Apprenticeship, office management" },
    body: { de: "Abschlussnote „gut“.", en: "Graded “good”." },
    kind: "education", early: true
  },
  {
    from: "09/2005", to: "11/2006", company: "Obst- und Gemüsehandel Sarpen, Berlin",
    role: { de: "Einkauf und Verkauf", en: "Buying and selling" },
    body: {
      de: "Familienbetrieb: Einkauf im Großhandel, Verkauf am Stand. Der Anfang.",
      en: "Family business: wholesale buying, selling at the stall. Where it started."
    },
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
    tags: ["App", "Gesundheit", "Zyklus"],
    tagline: { de: "Dein Zyklus. Dein Rhythmus.", en: "Your cycle. Your rhythm." },
    body: {
      de: "Eine App für die Frau. Kalender, Ernährung, Sport und Zyklus — alles an einem Ort, abgestimmt auf deinen Körper.",
      en: "An app for women. Calendar, nutrition, training and cycle — all in one place, tuned to your body."
    }
  }
];

export const DRAFT_MODE = false;
