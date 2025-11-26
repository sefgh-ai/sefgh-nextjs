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
    <div className="w-full bg-slate-950 rounded-t-xl pt-12 pb-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
          {/* Left Column: Company Info */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center text-white font-bold text-xl">
                M
              </div>
              <span className="text-2xl font-semibold text-white">Mvpblocks</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Building the future of digital experiences with innovative solutions and reliable technologies.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Instagram, Twitter, Github, Dribbble].map((Icon, i) => (
                <button 
                  key={i}
                  className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-blue-500 hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Grid: 4 Columns */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Column 1: About Us */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-medium text-white">About Us</h3>
              <ul className="flex flex-col gap-3">
                {['Company History', 'Meet the Team', 'Employee Handbook', 'Careers'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Our Services */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-medium text-white">Our Services</h3>
              <ul className="flex flex-col gap-3">
                {['Web Development', 'Web Design', 'Marketing', 'Google Ads'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Helpful Links */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-medium text-white">Helpful Links</h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="#" className="group flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors">
                    <span>Live Chat</span>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact Us */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-medium text-white">Contact Us</h3>
              <ul className="flex flex-col gap-4">
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-400">support@mvpblocks.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-400">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <address className="text-sm text-slate-400 not-italic">
                    123 Innovation Dr,<br />Tech City, TC 90210
                  </address>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © 2025 Mvpblocks. All rights reserved.
          </p>
          <p className="text-sm text-slate-500">
            Designed with ❤️ for developers.
          </p>
        </div>
      </div>
    </div>
  );
}
