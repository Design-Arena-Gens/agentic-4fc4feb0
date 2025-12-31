import type { Metadata } from 'next';
import { Inter, Inter_Tight } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const interTight = Inter_Tight({ subsets: ['latin'], variable: '--font-inter-tight' });

export const metadata: Metadata = {
  title: 'ShortForge | AI Shorts Workflow',
  description:
    'Generate end-to-end YouTube Shorts workflows with automated scripting, shotlists, assets, and publishing checklists.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`}>
      <body className="grid-overlay min-h-screen text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
