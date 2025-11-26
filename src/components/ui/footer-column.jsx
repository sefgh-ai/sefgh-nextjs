'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Github, 
  Dribbble, 
  Mail, 
  Phone, 
  MapPin, 
  MessageCircle 
} from 'lucide-react';

export default function FooterColumn() {
  return (
    <div className="w-full bg-slate-950 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Bottom Legal Row */}
        <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © 2025 SEFGH. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {['Terms of Service', 'Privacy Policy', 'Cookie Settings', 'Accessibility'].map((item) => (
              <Link key={item} href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
