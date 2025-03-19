import "./globals.css";
import { TamboProvider } from "@tambo-ai/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TamboProvider apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY ?? ""}>
          {children}
        </TamboProvider>
      </body>
    </html>
  );
}
