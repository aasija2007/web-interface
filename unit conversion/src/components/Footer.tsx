import React from 'react';
import { Compass, Keyboard, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full glass-panel border-t-2 border-[#D8C9A3] mt-16 px-8 py-10 text-sm text-[#241F16] bg-[#FBF7EC]">
      <div className="max-w-7xl xl:max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* About */}
        <div>
          <h4 className="text-base font-black font-serif-map text-[#2B4570] mb-3 flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-[#B5442E]" />
            <span>Cartographer Pro</span>
          </h4>
          <p className="text-xs sm:text-sm leading-relaxed text-[#8C7F63] font-semibold">
            Translating one representation of spatial & physical dimensions into another with high-precision NIST algorithms, live exchange rates, and spatial scale visualizers.
          </p>
        </div>

        {/* Keyboard Shortcuts Cheat Sheet */}
        <div>
          <h4 className="text-base font-black font-serif-map text-[#2B4570] mb-3 flex items-center gap-2.5">
            <Keyboard className="w-5 h-5 text-[#7A8B69]" />
            <span>Navigation Shortcuts</span>
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm font-mono font-bold">
            <li className="flex items-center justify-between">
              <span className="text-[#8C7F63]">Command Palette:</span>
              <span className="bg-[#F1E9D8] border border-[#D8C9A3] px-2 py-0.5 rounded text-[#241F16]">Ctrl + K</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-[#8C7F63]">Swap Dimensions:</span>
              <span className="bg-[#F1E9D8] border border-[#D8C9A3] px-2 py-0.5 rounded text-[#241F16]">Alt + S</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-[#8C7F63]">Natural Language:</span>
              <span className="bg-[#F1E9D8] border border-[#D8C9A3] px-2 py-0.5 rounded text-[#241F16]">Type in search</span>
            </li>
          </ul>
        </div>

        {/* Features summary */}
        <div>
          <h4 className="text-base font-black font-serif-map text-[#2B4570] mb-3">Cartographic Capabilities</h4>
          <div className="flex flex-wrap gap-2">
            {[
              '16+ Spatial Domains',
              'Natural Language Omnibox',
              'Voice Commands',
              'Live Currency Exchange',
              'Multi-Unit Grid',
              'Batch CSV Export',
              'Custom Units',
              'PWA Offline'
            ].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-[#2B4570]/10 border border-[#2B4570]/30 text-[#2B4570] text-xs font-bold"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t-2 border-[#D8C9A3] text-center text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-between gap-3 text-[#8C7F63]">
        <div>
          © {new Date().getFullYear()} Cartographer Pro. All conversions follow standard NIST & ISO spatial standards.
        </div>
        <div className="flex items-center gap-1.5 text-[#241F16]">
          <span>Crafted with</span>
          <Heart className="w-4 h-4 text-[#B5442E] fill-[#B5442E]" />
          <span>for spatial precision & beauty</span>
        </div>
      </div>
    </footer>
  );
};
