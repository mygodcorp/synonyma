const regex = /\[([^\[\]]+)\]/;
export function match(word: string | undefined) {
  return word?.match(regex)![1];
}

export default function format(word: string | undefined) {
  if (match(word)) {
    return match(word)!
      .split(",")
      .map((item) => item.trim())
      .filter((item) => {
        if (item.match(/\s/)) return;
        return item;
      });
  }
  return [];
}
