"use client";

import { usePathname } from "next/navigation";
import { memo } from "react";
import Footer from "./Footer";

const PageWrapper = memo(function PageWrapper({ children }) {
  const pathname = usePathname();

  // Don't show footer on landing page or 404 page
  const isLandingPage = pathname === "/";
  const is404Page = pathname && !pathname.match(/^\/[a-z-]+$/);

  // Pages with their own sidebar layout handle footer internally
  const hasOwnLayout =
    pathname === "/home" ||
    pathname === "/search" ||
    pathname === "/chat" ||
    pathname === "/trending" ||
    pathname === "/playground" ||
    pathname === "/submissions";

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0">{children}</div>
      {!isLandingPage && !hasOwnLayout && <Footer />}
    </div>
  );
});

export default PageWrapper;
