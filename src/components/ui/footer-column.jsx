"use client";

import React from "react";
import Link from "next/link";

export default function FooterColumn() {
  return (
    <div className="w-full bg-slate-950 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Bottom Legal Row */}
        <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} SEFGH-AI. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { name: "Terms of Service", href: "/terms" },
              { name: "Privacy Policy", href: "/privacy" },
              { name: "Cookie Settings", href: "/cookie-policy" },
              { name: "Accessibility", href: "/accessibility" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
