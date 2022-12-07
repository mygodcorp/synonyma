import getErrorMessage from "lib/openai/get-error-msg";

const getSynonymes = async (word: string) => {
  console.log(word);
  try {
    const res = await fetch(`/api/public/synonyme/${word}`);
    return await res.json();
  } catch (e) {
    return getErrorMessage(e);
  }
};

export default getSynonymes;
