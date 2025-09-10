import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ClearClause - AI Legal Document Analyzer',
  description: 'Scan legal documents for potentially problematic clauses with AI-powered analysis.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen`}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <footer className="py-6 px-4 bg-gray-900 border-t border-gray-800">
            <div className="container mx-auto text-center text-gray-400 text-sm">
              <p>© {new Date().getFullYear()} ClearClause. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
