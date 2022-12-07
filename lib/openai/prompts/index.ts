export const prompts = {
  synonymes: (word: string | undefined) =>
    `Mot: manger\nSynonymes : [absorber, consommer, ingérer, ingurgiter, prendre]\n\nMot: boire\nSynonymes : [s'abreuver, absorber, avaler, consommer, se désaltérer, étancher sa soif, ingurgiter, lever son verre, porter un toast]\n\nMot: aimer\nSynonymes : [adorer, apprécier, chérir, désirer, estimer, priser, se plaire à, souhaiter, vénérer]\n\nMot :${word}\n`,
  antonymes: (word: string) =>
    `Mot: manger\nAntonymes: [cracher, rendre, vomir].\n\nMot: boire\nAntonymes: [régurgiter]\n\nMot :${word}\n`,
  definition: (word: string) =>
    `Mot: manger\nDéfinition: [Avaler (un aliment solide ou pâteux) après l'avoir mâché.]\n\nMot: boire\nDéfinition: [Avaler un liquide]\n\nMot:chier\nDéfinition: [Expulser des matières fécales par l'anus.]\n\nMot:craindre\nDéfinition: [Éprouver de la peur ou de l'inquiétude à l'égard d'un événement ou d'une situation.]\n\nMot: casser\nDéfinition: [Diviser en morceaux ou en fragments un objet solide.]\n\nMot :${word}\n`,
  familiers: (word: string) =>
    `prompt: "Mot: manger\nSynonymes familiers : [enfourner].\n\n\nMot: boire\nSynonymes familiers:  [s'enfiler, lamper, prendre un pot, siffler, siroter].\n\n\nMot:chier\nSynonymes familiers: [chiaquer, cramer, dégueuler, déguster, dégueulasser, dépêcher, déposer]\n\nMot :${word}\n`,
};
