import Fuse from "fuse.js";
import Words from "public/search.json";
const getSearch = (search: string) => {
  const fuse = new Fuse(Words, {
    keys: ["word"],
    threshold: 0.1,
    isCaseSensitive: true,
  });
  return fuse.search(search, { limit: 5 });
};

export default getSearch;
