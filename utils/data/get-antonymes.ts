import getErrorMessage from "lib/openai/get-error-msg";

const getAntonymes = async (word: string) => {
  try {
    const res = await fetch(`/api/public/antonyme/${word}`);
    return await res.json();
  } catch (e) {
    return getErrorMessage(e);
  }
};

export default getAntonymes;
