'use client';

import React from 'react';
import { Search, Filter } from 'lucide-react';

const SearchComponent = ({ placeholder, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('q');
    if (onSearch && query) {
      onSearch(query);
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto isolate">
      {/* Outer Glow Container - Positioned absolutely behind the input with negative inset to show the border */}
      <div className="absolute -inset-[2px] rounded-xl overflow-hidden z-[-1]">
        <div className="absolute inset-0 flex items-center justify-center">
            {/* Layer 1: Main Rotating Gradient - Large square to cover the wide bar */}
            <div className="absolute w-[1200px] h-[1200px] bg-[conic-gradient(from_0deg,#000000_0%,#2563eb_10%,#000000_20%,#000000_50%,#0d9488_60%,#000000_70%)] 
                            animate-[spin_4s_linear_infinite] opacity-100">
            </div>
            
            {/* Layer 2: Secondary Gradient for more color depth */}
            <div className="absolute w-[1000px] h-[1000px] bg-[conic-gradient(from_90deg,transparent_0%,#3b82f6_10%,transparent_20%,transparent_50%,#14b8a6_60%,transparent_70%)] 
                            animate-[spin_3s_linear_infinite] opacity-70">
            </div>
        </div>
      </div>

      {/* Blur Filter Layer - To soften the hard edges of the conic gradient */}
      <div className="absolute -inset-[2px] rounded-xl z-[-1] backdrop-blur-[2px]"></div>

      {/* Main Input Container */}
      <form onSubmit={handleSubmit} className="relative group w-full z-10 bg-slate-950 rounded-xl">
        <input 
          placeholder={placeholder || "Search..."} 
          type="text" 
          name="q" 
          className="bg-transparent border-none w-full h-14 rounded-xl text-white pl-14 pr-14 text-lg focus:outline-none placeholder-slate-500" 
        />
        
        {/* Input Mask Effect */}
        <div className="pointer-events-none w-[100px] h-[20px] absolute bg-gradient-to-r from-transparent to-slate-950/50 top-[18px] left-[70px] group-focus-within:hidden"></div>
        
        {/* Color Splash Mask */}
        <div className="pointer-events-none w-[30px] h-[20px] absolute bg-blue-500 top-[10px] left-[5px] blur-2xl opacity-60 transition-all duration-2000 group-hover:opacity-0"></div>
        
        {/* Search Icon */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors">
          <Search className="w-6 h-6" />
        </div>

        {/* Filter Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors z-20">
           <Filter className="w-5 h-5 text-slate-400 hover:text-blue-400" />
        </div>
      </form>
    </div>
  );
};

export default SearchComponent;
