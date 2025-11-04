"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "components/container/container";
import { Text } from "components/text/text";
import { Box } from "components/box/box";

interface GenerateClientProps {
  word: string;
}

export default function GenerateClient({ word }: GenerateClientProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"generating" | "success" | "error">("generating");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const generateWord = async () => {
      try {
        setStatus("generating");

        const response = await fetch("/api/public/generate-word", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ word }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Erreur lors de la génération du mot");
        }

        setStatus("success");

        // Redirect to the word page after successful generation
        setTimeout(() => {
          router.push(`/${encodeURIComponent(word)}`);
        }, 1000);
      } catch (error) {
        setStatus("error");
        setErrorMessage(error instanceof Error ? error.message : "Une erreur est survenue");
      }
    };

    generateWord();
  }, [word, router]);

  return (
    <Container>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: "2rem",
        }}
      >
        {status === "generating" && (
          <>
            <Text as="h1" size="large" weight="bold">
              Génération en cours...
            </Text>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <Text as="p" size="medium">
                Création du mot "{word}"
              </Text>
              <Text as="p" size="small" style={{ color: "#666" }}>
                Génération des synonymes, antonymes et définition...
              </Text>
              <Text as="p" size="small" style={{ color: "#999" }}>
                Cela peut prendre quelques secondes
              </Text>
            </Box>
          </>
        )}

        {status === "success" && (
          <>
            <Text as="h1" size="large" weight="bold" style={{ color: "green" }}>
              ✓ Mot généré avec succès !
            </Text>
            <Text as="p" size="medium">
              Redirection en cours...
            </Text>
          </>
        )}

        {status === "error" && (
          <>
            <Text as="h1" size="large" weight="bold" style={{ color: "red" }}>
              ✗ Erreur
            </Text>
            <Text as="p" size="medium">
              {errorMessage}
            </Text>
            <button
              onClick={() => router.push("/")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              Retour à l&apos;accueil
            </button>
          </>
        )}
      </Box>
    </Container>
  );
}
