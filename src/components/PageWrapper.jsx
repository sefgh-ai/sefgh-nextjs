'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function PageWrapper({ children }) {
  const pathname = usePathname();
  
  // Don't show footer on landing page
  const isLandingPage = pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        {children}
      </div>
      {!isLandingPage && <Footer />}
    </div>
  );
}
