import type { Metadata, Viewport } from 'next';
import { Cinzel, Inter } from 'next/font/google';
import './globals.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#D4AF37',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://arkofhopeproject.com'),
  title: 'Ark of Hope Project | A Story of Faith in Nepal',
  description: 'Join hands to build the Ark of Hope in Chitwan, Nepal. A monumental vision of faith, family, and hope.',
  applicationName: 'Ark of Hope Project',
  authors: [{ name: 'Ark of Hope Project' }],
  generator: 'Next.js',
  keywords: ['Ark of Hope', 'Nepal Ark', 'Shanti Foundation Trust', 'Revival Zahaz', 'Chitwan Ark', 'Faith in Nepal', 'Build the Ark', 'Nepal SBI Bank NSBINPKA'],
  icons: {
    icon: [
      { url: '/logo.png?v=2', sizes: '512x512', type: 'image/png' },
      { url: '/icon.png?v=2', sizes: 'any', type: 'image/png' },
      { url: '/favicon.ico?v=2' },
    ],
    shortcut: '/logo.png?v=2',
    apple: [
      { url: '/apple-touch-icon.png?v=2', sizes: '180x180', type: 'image/png' },
      { url: '/logo.png?v=2' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://arkofhopeproject.com',
    siteName: 'Ark of Hope Project',
    title: 'Ark of Hope Project | A Story of Faith in Nepal',
    description: 'Join hands to build the Ark of Hope in Chitwan, Nepal. A monumental vision of faith, family, and hope.',
    images: [
      {
        url: '/logo.png',
        width: 1024,
        height: 1024,
        alt: 'Ark of Hope Project Logo',
      },
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ark of Hope Project Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ark of Hope Project | A Story of Faith in Nepal',
    description: 'Join hands to build the Ark of Hope in Chitwan, Nepal.',
    images: ['/logo.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NonprofitOrganization',
  name: 'Ark of Hope Project',
  alternateName: 'Revival Zahaz',
  url: 'https://arkofhopeproject.com',
  logo: 'https://arkofhopeproject.com/logo.png',
  image: 'https://arkofhopeproject.com/logo.png',
  description: 'A story of faith and building the Ark of Hope in Chitwan, Nepal.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Chitwan',
    addressCountry: 'Nepal',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+977-9847376096',
    contactType: 'customer support',
    email: 'ark4nepal@arkofhopeproject.com',
  },
};

import Script from 'next/script';
import NotificationProvider from '@/components/NotificationProvider';
import DonationProvider from '@/components/DonationProvider'; // [NEW]
import AuthProvider from '@/components/AuthProvider';
import ExitIntentOverlay from '@/components/ExitIntentOverlay';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cinzel.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/logo.png?v=2" type="image/png" />
        <link rel="icon" href="/icon.png?v=2" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AuthProvider>
          <NotificationProvider>
            <DonationProvider>
              {children}
              <ExitIntentOverlay />
            </DonationProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
