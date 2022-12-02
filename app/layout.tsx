interface LayoutProps {
  children: React.ReactNode;
}

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
