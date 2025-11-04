import getErrorMessage from "lib/openai/get-error-msg";

const getPageClient = async (slug: string) => {
  try {
    const res = await fetch(`/api/public/page/${encodeURIComponent(slug)}`);
    return await res.json();
  } catch (e) {
    return getErrorMessage(e);
  }
};

export default getPageClient;
