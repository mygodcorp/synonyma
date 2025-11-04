import getErrorMessage from "lib/openai/get-error-msg";

const getSynonymes = async (word: string) => {
  try {
    const res = await fetch(`/api/public/synonyme/${encodeURIComponent(word)}`);
    return await res.json();
  } catch (e) {
    return getErrorMessage(e);
  }
};

export default getSynonymes;
