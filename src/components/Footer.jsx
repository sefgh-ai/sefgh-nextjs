'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { href: '/terms', label: 'Terms' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/security', label: 'Security' },
    { href: '/status', label: 'Status' },
    { href: '/docs', label: 'Docs' },
    { href: '/contact', label: 'Contact' },
    { href: '/settings', label: 'Manage cookies' },
    { href: '/settings', label: 'Do not share my personal information' },
  ];

  return (
    <footer className="w-full py-3 px-4 mt-auto border-t border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl">
        {/* Single line layout */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground flex-wrap">
          {/* Copyright */}
          <span className="whitespace-nowrap">© {currentYear} SEFGH, Inc.</span>
          
          {/* Separator */}
          <span className="text-muted-foreground/50">•</span>
          
          {/* Links */}
          {footerLinks.map((link, index) => (
            <div key={link.label} className="flex items-center gap-2">
              <Link 
                href={link.href} 
                className="hover:text-foreground transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
              {index < footerLinks.length - 1 && (
                <span className="text-muted-foreground/50">•</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
