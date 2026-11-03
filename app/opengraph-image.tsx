import { ogCard } from "@/lib/og";

export { size, contentType } from "@/lib/og";
export const alt = "Synonyma, dictionnaire des synonymes et antonymes français";

export default function Image() {
  return ogCard("Le mot juste.", "Dictionnaire des synonymes", "Synonymes, antonymes et définitions de 130 000 mots français");
}
