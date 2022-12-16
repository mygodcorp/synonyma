import getErrorMessage from "lib/openai/get-error-msg";

const getDictionaryClient = async (
  letter: string,
  page: number
): Promise<PaginatedResponse> => {
  try {
    const res = await fetch(`/api/public/dictionary/${letter}?page=${page}`);
    return await res.json();
  } catch (e) {
    throw getErrorMessage(e);
  }
};

export default getDictionaryClient;
