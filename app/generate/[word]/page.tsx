import GenerateClient from "./generate-client";

export default async function GeneratePage({
  params,
}: {
  params: Promise<{ word: string }>;
}) {
  const { word } = await params;
  const decodedWord = decodeURIComponent(word);

  return <GenerateClient word={decodedWord} />;
}
