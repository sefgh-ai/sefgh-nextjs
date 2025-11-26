'use client';

import React from 'react';
import FooterNewsletter from './footer-newsletter';
import FooterColumn from './footer-column';

export default function AppFooter() {
  return (
    <footer className="w-full bg-slate-950">
      {/* 
        Composition Strategy:
        1. FooterNewsletter contains the top "Hero" section and the main navigation links (Company, Resources, Legal, Status).
        2. FooterColumn contains the specific "Contact Us" and "Helpful Links" (with Live Chat) sections.
        
        We stack them to provide the full comprehensive footer experience requested.
      */}
      
      {/* Top Section: Newsletter & Main Site Map */}
      <FooterNewsletter />
      
      {/* Bottom Section: Detailed Contact & Services Info */}
      {/* We use a wrapper to ensure background continuity if needed, though both use slate-950 */}
      <div className="relative z-10">
        <FooterColumn />
      </div>
    </footer>
  );
}
