import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MuiProvider from "@/components/MuiProvider";
import { fetchWordPressGraphQL } from "@/lib/wordpress-ssr";
import { GET_HEADER_DATA } from "@/lib/wordpress-queries";

interface HeaderDataResponse {
  page: {
    landingPage: {
      headerInfo: {
        companyLogo: { node: { mediaItemUrl: string; altText: string } } | null;
        contactEmail: string;
        contactPhoneNumber: string;
        serviceArea: string;
        slogan: string;
      };
    };
  };
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ck-electric.com"),
  title: {
    default: "CK Electric | Premier Electrical Contractor Puget Sound",
    template: "%s | CK Electric",
  },
  description:
    "Licensed electrical contractors serving the Puget Sound from Tacoma to Skagit Valley. Commercial TIs, residential wiring, EV charger installation, panel upgrades.",
  openGraph: {
    siteName: "CK Electric",
    type: "website",
    locale: "en_US",
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=20240306", sizes: "any" },
      { url: "/favicon-16x16.png?v=20240306", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png?v=20240306", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png?v=20240306", sizes: "180x180", type: "image/png" },
  },
  manifest: "/site.webmanifest?v=20240306",
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["ElectricalContractor", "LocalBusiness"],
  "@id": "https://ck-electric.com/#business",
  name: "CK Electric",
  description:
    "Licensed electrical contractors serving the Puget Sound from Tacoma to Skagit Valley. Commercial TIs, residential wiring, EV charger installation, panel upgrades.",
  url: "https://ck-electric.com",
  telephone: "+1-206-295-6363",
  priceRange: "$$",
  areaServed: [
    { "@type": "City", "name": "Seattle", "sameAs": "https://www.wikidata.org/wiki/Q5083" },
    { "@type": "City", "name": "Tacoma" },
    { "@type": "City", "name": "Bellevue" },
    { "@type": "City", "name": "Everett" },
    { "@type": "City", "name": "Kirkland" },
    { "@type": "City", "name": "Redmond" },
    { "@type": "City", "name": "Renton" },
    { "@type": "City", "name": "Lynnwood" },
    { "@type": "City", "name": "Marysville" },
    { "@type": "City", "name": "Issaquah" },
  ],
  address: {
    "@type": "PostalAddress",
    addressRegion: "WA",
    addressCountry: "US",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Electrical Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Commercial Electrical Tenant Improvements" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Residential Electrical Wiring & Rewiring" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Panel Upgrades & Replacements" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "EV Charger Installation" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "LED Lighting Solutions" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Emergency Electrical Repair" } },
    ],
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "18:00",
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerResponse = await fetchWordPressGraphQL<HeaderDataResponse>(GET_HEADER_DATA);
  const headerInfo = headerResponse?.page?.landingPage?.headerInfo;

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://ckelectric.kinsta.cloud" crossOrigin="" />
        <link rel="preconnect" href="https://lh3.googleusercontent.com" crossOrigin="" />
      </head>
      <body className={`${playfairDisplay.variable} ${inter.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary-500 focus:text-neutral-950 focus:px-4 focus:py-2 focus:font-bold focus:rounded"
        >
          Skip to main content
        </a>
        <Header
          serviceArea={headerInfo?.serviceArea ?? ""}
          slogan={headerInfo?.slogan ?? ""}
          contactEmail={headerInfo?.contactEmail ?? ""}
          contactPhone={headerInfo?.contactPhoneNumber ?? ""}
          companyLogo={headerInfo?.companyLogo ?? null}
        />
        <MuiProvider>
          <main id="main-content">
            {children}
          </main>
          <Footer />
        </MuiProvider>
      </body>
    </html>
  );
}
