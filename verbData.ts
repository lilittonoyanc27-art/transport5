export interface Conjugation {
  person: string;
  word: string;
}

export interface VerbInfo {
  verb: string;
  translation: string;
  conjugations: Conjugation[];
  type: string;
}

export interface BalloonPrompt {
  question: string;
  translation: string;
  correctAnswer: string;
  options: string[];
}

export const VERB_DATA: VerbInfo[] = [
  {
    verb: "Terminar",
    translation: "Ավարտել / Վերջացնել",
    type: "Կանոնավոր բայ",
    conjugations: [
      { person: "Yo", word: "termino" },
      { person: "Tú", word: "terminas" },
      { person: "Él/Ella/Ud.", word: "termina" },
      { person: "Nosotros", word: "terminamos" },
      { person: "Vosotros", word: "termináis" },
      { person: "Ellos/Ellas/Uds.", word: "terminan" }
    ]
  },
  {
    verb: "Empezar",
    translation: "Սկսել",
    type: "Անկանոն (e -> ie)",
    conjugations: [
      { person: "Yo", word: "empiezo" },
      { person: "Tú", word: "empiezas" },
      { person: "Él/Ella/Ud.", word: "empieza" },
      { person: "Nosotros", word: "empezamos" },
      { person: "Vosotros", word: "empezáis" },
      { person: "Ellos/Ellas/Uds.", word: "empiezan" }
    ]
  },
  {
    verb: "Comenzar",
    translation: "Սկսել (ավելի պաշտոնական)",
    type: "Անկանոն (e -> ie)",
    conjugations: [
      { person: "Yo", word: "comienzo" },
      { person: "Tú", word: "comienzas" },
      { person: "Él/Ella/Ud.", word: "comienza" },
      { person: "Nosotros", word: "comenzamos" },
      { person: "Vosotros", word: "comenzáis" },
      { person: "Ellos/Ellas/Uds.", word: "comienzan" }
    ]
  }
];

export const BALLOON_CHALLENGES: BalloonPrompt[] = [
  {
    question: "Yo ___ la tarea.",
    translation: "Ես ավարտում եմ տնային աշխատանքը:",
    correctAnswer: "termino",
    options: ["termino", "terminas", "termina"]
  },
  {
    question: "Tú ___ a trabajar.",
    translation: "Դու սկսում ես աշխատել:",
    correctAnswer: "empiezas",
    options: ["empiezas", "empezamos", "empiezan"]
  },
  {
    question: "La clase ___ a las ocho.",
    translation: "Դասը սկսվում է ժամը ութին:",
    correctAnswer: "comienza",
    options: ["comienzas", "comienza", "comienzan"]
  },
  {
    question: "Nosotros ___ la película.",
    translation: "Մենք ավարտում ենք ֆիլմը:",
    correctAnswer: "terminamos",
    options: ["termino", "terminamos", "terminan"]
  },
  {
    question: "Ellos ___ a estudiar.",
    translation: "Նրանք սկսում են սովորել:",
    correctAnswer: "empiezan",
    options: ["empieza", "empiezan", "empezáis"]
  },
  {
    question: "Usted ___ el examen.",
    translation: "Դուք ավարտում եք քննությունը (քաղաքավարի):",
    correctAnswer: "termina",
    options: ["terminas", "termina", "terminamos"]
  },
  {
    question: "Vosotros ___ las clases.",
    translation: "Դուք ավարտում եք դասերը:",
    correctAnswer: "termináis",
    options: ["terminamos", "termináis", "terminan"]
  },
  {
    question: "Ella ___ a leer un libro.",
    translation: "Նա սկսում է գիրք կարդալ:",
    correctAnswer: "empieza",
    options: ["empiezo", "empiezas", "empieza"]
  },
  {
    question: "Nosotros ___ el juego.",
    translation: "Մենք սկսում ենք խաղը:",
    correctAnswer: "comenzamos",
    options: ["comienzo", "comenzamos", "comienzan"]
  },
  {
    question: "Ustedes ___ el proyecto.",
    translation: "Դուք ավարտում եք նախագիծը (հոգնակի):",
    correctAnswer: "terminan",
    options: ["terminamos", "termináis", "terminan"]
  }
];
