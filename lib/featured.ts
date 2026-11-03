// Hand-picked headwords for the home page. test/data.test.mjs checks each one has a page.

/** "Les plus consultés": common words people look up synonyms for. */
export const POPULAR = [
  "beau", "important", "faire", "aimer", "content", "rapide", "triste", "grand", "petit", "dire",
  "manger", "parler", "voir", "heureux", "travail", "maison", "bon", "difficile", "problème", "aider",
  "peur", "fort", "intéressant", "joli", "permettre", "mettre", "donner", "penser", "fatigué", "colère",
  "gentil", "ami", "argent", "voiture", "facile", "chance",
];

/** Short list shown under the search field. */
export const TRENDING = ["important", "content", "permettre", "difficile"];

/** Pool for "Mot du jour": words with rich, pleasant entries. */
export const WORD_OF_THE_DAY = [
  "flâner", "éphémère", "mélancolie", "sérendipité", "insouciance", "vertige", "bienveillance", "pétillant",
  "nostalgie", "chimère", "audace", "volubile", "quiétude", "étincelle", "farfelu", "gourmandise",
  "allégresse", "rêverie", "subtil", "tumulte", "ivresse", "éblouir", "frivole", "envoûtant",
];

/** Suggestions under "Un mot vous manque ?". */
export const TRY = ["courageux", "épanouissement", "minutieux"];
