import "./globals.css";
import { TamboProvider } from "@tambo-ai/react";
import { tamboComponents } from "@/utils/registerComponents";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TamboProvider
          apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY ?? ""}
          tamboUrl={process.env.NEXT_PUBLIC_TAMBO_API_URL}
          components={tamboComponents}
        >
          {children}
        </TamboProvider>
      </body>
    </html>
  );
}
