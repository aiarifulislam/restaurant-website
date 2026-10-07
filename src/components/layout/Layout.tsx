import { type ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ToastContainer } from '@/components/ui/Toast';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 pt-16 lg:pt-20">{children}</main>
      <Footer />
      <ToastContainer />
    </div>
  );
}