import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "DevStay - IT Apartment Bad Friedrichshall | Kurzzeitvermietung für Entwickler",
  description: "Vollmöbliertes Tech-Apartment in Bad Friedrichshall mit 400 Mbit Glasfaser, Dual-Monitor Setup und allem was ITler brauchen. Perfekt für Remote Work und Geschäftsreisen.",
  keywords: ["IT Apartment", "Bad Friedrichshall", "Kurzzeitvermietung", "Remote Work", "Entwickler", "Heilbronn", "Tech Apartment", "Glasfaser Internet"],
  authors: [{ name: "DevStay" }],
  creator: "DevStay",
  publisher: "DevStay",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://devstay.de"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "DevStay - IT Apartment Bad Friedrichshall",
    description: "Vollmöbliertes Tech-Apartment mit 400 Mbit Glasfaser und Dual-Monitor Setup. Perfekt für ITler und Remote Worker.",
    url: "https://devstay.de",
    siteName: "DevStay",
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DevStay - IT Apartment Bad Friedrichshall",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevStay - IT Apartment Bad Friedrichshall",
    description: "Vollmöbliertes Tech-Apartment mit 400 Mbit Glasfaser und Dual-Monitor Setup.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
