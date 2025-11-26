'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function PageWrapper({ children }) {
  const pathname = usePathname();
  
  // Don't show footer on landing page or 404 page
  const isLandingPage = pathname === '/';
  const is404Page = pathname && !pathname.match(/^\/[a-z-]+$/);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
      {!isLandingPage && <Footer />}
    </div>
  );
}
