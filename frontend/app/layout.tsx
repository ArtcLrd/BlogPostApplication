import './globals.css';
import React, { Suspense } from 'react';
import { AuthProvider } from './auth-provider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/Header';
import { ThemeProvider } from '@/context/ThemeProvider'; // custom ThemeProvider from shadcn setup
import { Toaster } from '@/components/ui/sonner'; // shadcn-styled Sonner component

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BlogApp - Create and Share Your Stories',
  description: 'A modern blogging platform to create, edit, and publish your stories',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
        <ThemeProvider
          defaultTheme="system"
        >
          <Header />
          <main className="min-h-screen pt-16 flex items-center justify-center">
            <div className="w-full">
            <Suspense fallback={<div>Loading...</div>}>
            {children}
            </Suspense>
            </div>
          </main>
          <Toaster richColors closeButton />
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
