import getErrorMessage from "lib/openai/get-error-msg";

const getSearch = async (search: string) => {
  try {
    const res = await fetch(`/api/public/search/${search}`);
    return await res.json();
  } catch (e) {
    return getErrorMessage(e);
  }
};

export default getSearch;
