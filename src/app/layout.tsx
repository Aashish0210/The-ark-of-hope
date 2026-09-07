import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: 'Ark of Hope Project | A Story of Faith in Nepal',
  description: 'Every great journey begins with a single plank. Once gifted for the Ark, see the work, and please be ready—one donation at a time.',
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
        {/* Google Pay script removed as it is not supported in Nepal */}
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
