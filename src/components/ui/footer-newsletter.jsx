'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Instagram, Twitter, Linkedin, Youtube, Zap } from 'lucide-react';

export default function FooterNewsletter() {
  return (
    <div className="relative w-full bg-slate-950 text-slate-200 overflow-hidden pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Newsletter Glass Card */}
        <div className="w-full rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-8 md:p-12 mb-16 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left: Content & Form */}
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Stay ahead with Acme Inc.
                </h2>
                <p className="text-slate-400 max-w-md">
                  Join our newsletter to get the latest updates, news, and exclusive offers delivered straight to your inbox.
                </p>
              </div>
              
              <form className="flex flex-col sm:flex-row gap-3 w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-lg transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group/btn">
                  Subscribe
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>

            {/* Right: Image Card (Desktop Only) */}
            <div className="hidden lg:block relative h-full min-h-[240px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-teal-600/20 rounded-2xl rotate-3 scale-95 blur-sm"></div>
              <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden shadow-2xl border border-slate-700/50">
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" 
                  alt="Office Team" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Multi-column Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Column 1: Brand Summary (Spans 2 cols on large screens if needed, but 1 here for 5-col layout) */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xl font-bold text-white">Acme Inc.</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering businesses with reliable, scalable, and innovative solutions for the modern web.
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <Link 
                  key={i} 
                  href="#" 
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Company */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white">Company</h3>
            <ul className="flex flex-col gap-3">
              {['About', 'Contact Us', 'Pricing', 'Careers', 'Press'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white">Resources</h3>
            <ul className="flex flex-col gap-3">
              {['Home Page', 'Search Page', 'Research Paper', 'Articles', 'Versions'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white">Legal</h3>
            <ul className="flex flex-col gap-3">
              {['Cookie Policy', 'Terms & Conditions', 'Terms of Use', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Status Page */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white">Status Page</h3>
            <ul className="flex flex-col gap-3">
              {['Playground', 'Doc Page', 'Downloads', 'Trending', 'Latest News', 'Forum'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © 2023 Acme Inc. All rights reserved.
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
