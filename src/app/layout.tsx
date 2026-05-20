import { site } from '@/config/site';
import { SiteFooter } from '@/widgets/site-footer';
import { SiteHeader } from '@/widgets/site-header';
import type { Metadata, Viewport } from 'next';
import { Geist_Mono, Open_Sans } from 'next/font/google';
import '@/shared/styles/globals.css';

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
});

const displayFont = Open_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['700', '800'],
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.author }],
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: site.name,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme={site.defaultTheme}
      className={`${openSans.variable} ${displayFont.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <div className="app-shell">
          <SiteHeader />
          <main className="app-main">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
