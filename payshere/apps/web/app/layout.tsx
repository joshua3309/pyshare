import './globals.css';
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@workspace/ui';
import { Toaster } from '@workspace/ui';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PaySphere — The Financial Hub for Modern Business',
  description:
    'Payments, wallets, invoicing, and analytics in one powerful platform. Built for businesses that move fast.',
  keywords: ['fintech', 'payments', 'wallet', 'invoicing', 'banking', 'PaySphere'],
  authors: [{ name: 'PaySphere' }],
  openGraph: {
    title: 'PaySphere — The Financial Hub for Modern Business',
    description:
      'Payments, wallets, invoicing, and analytics in one powerful platform.',
    type: 'website',
    siteName: 'PaySphere',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PaySphere — The Financial Hub for Modern Business',
    description:
      'Payments, wallets, invoicing, and analytics in one powerful platform.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jakarta.variable} ${mono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
