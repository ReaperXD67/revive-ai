import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Revive — Autonomous Revenue Recovery',
  description: 'An agentic control plane that recovers failed recurring payments without risking customer trust.',
  openGraph: {
    title: 'Revive — Autonomous Revenue Recovery',
    description: 'Recover failed recurring payments with explainable AI agents and hard trust guardrails.',
    images: [{ url: '/og.png', width: 1792, height: 1024, alt: 'Revive — Autonomous revenue recovery' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Revive — Autonomous Revenue Recovery',
    description: 'Recover failed recurring payments with explainable AI agents and hard trust guardrails.',
    images: ['/og.png'],
  },
};

export const viewport: Viewport = { themeColor: '#17201d' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
