import getErrorMessage from "lib/openai/get-error-msg";

const getDefinition = async (word: string) => {
  try {
    const res = await fetch(`/api/public/definition/${word}`);
    return await res.json();
  } catch (e) {
    return getErrorMessage(e);
  }
};

export default getDefinition;
