'use client';

import { Github } from 'lucide-react';

export default function SocialProof() {
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm uppercase tracking-widest text-[#8b949e]">Trusted by developers</p>
      <div className="flex items-center justify-center gap-10 opacity-80">
        {/* GitHub logo as requested; more logos can be added later */}
        <div className="flex items-center gap-3 text-[#8b949e]">
          <Github className="w-6 h-6" />
          <span className="text-sm">GitHub Community</span>
        </div>
      </div>
    </div>
  );
}
