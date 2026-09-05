import type { Metadata } from "next";
import Providers from "@/components/layout/Providers";
import HomeScrollRestoreScript from "@/components/shared/HomeScrollRestoreScript";
import { SITE_OWNER, siteUrl } from "@/lib/site";
import "@/index.css";
import "@/styles/globals.css";

const siteDescription =
  "Product designer based in Waterloo. Currently exploring design systems, product craft, and creative engineering.";

const siteOgImage = {
  url: siteUrl("/favicon.png"),
  width: 512,
  height: 512,
  alt: SITE_OWNER,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "lucas vu",
  description: siteDescription,
  keywords:
    "Lucas Vu, Product Designer, UX Designer, UI Designer, Design Portfolio",
  authors: [{ name: SITE_OWNER }],
  openGraph: {
    title: "lucas vu",
    description: siteDescription,
    type: "website",
    url: siteUrl(),
    images: [siteOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "lucas vu",
    description: siteDescription,
    images: [siteOgImage.url],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

const devtoolsComment = String.raw`<!--
                   ▄▄          ▄▄ ▄▄         ▄▄
         ▀▀        ██          ██ ██         ██ ▀▀
███▄███▄ ██  ▄████ ████▄ ▄█▀█▄ ██ ██ ▄█▀█▄   ██ ██  ██ ██
██ ██ ██ ██  ██    ██ ██ ██▄█▀ ██ ██ ██▄█▀   ██ ██  ██ ██
██ ██ ██ ██▄ ▀████ ██ ██ ▀█▄▄▄ ██ ██ ▀█▄▄▄   ██ ██▄ ▀██▀█

  hi, curious stranger :)
-->`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Must stay blocking and ahead of the body to beat the first paint. */}
        <HomeScrollRestoreScript />
      </head>
      <body suppressHydrationWarning>
        <div hidden dangerouslySetInnerHTML={{ __html: devtoolsComment }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
