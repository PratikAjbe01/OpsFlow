'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { updateTheme, ThemeConfig } from '@/lib/redux/slices/builderSlice';
import { Palette, Box, Layers } from 'lucide-react';

export default function DesignPanel() {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.builder);

  const handleChange = (key: keyof ThemeConfig, value: string) => {
    dispatch(updateTheme({ [key]: value }));
  };

  return (
    <div className="p-5 space-y-8 h-full overflow-y-auto">
      
      {/* 1. Colors Section */}
      <section className="space-y-4">
        <h3 className="flex items-center text-xs font-bold uppercase text-gray-500 tracking-wider">
          <Palette className="w-3 h-3 mr-2" /> Colors
        </h3>
        
        <ColorPicker label="Page Background" value={theme.bgColor} onChange={(v) => handleChange('bgColor', v)} />
        <ColorPicker label="Form Container" value={theme.cardColor} onChange={(v) => handleChange('cardColor', v)} />
        <ColorPicker label="Text Color" value={theme.textColor} onChange={(v) => handleChange('textColor', v)} />
        <ColorPicker label="Button Color" value={theme.btnColor} onChange={(v) => handleChange('btnColor', v)} />
        <ColorPicker label="Border Color" value={theme.borderColor} onChange={(v: string) => handleChange('borderColor', v)} />
      </section>

      <hr className="border-gray-100" />

      {/* 2. Layout & Borders */}
      <section className="space-y-4">
        <h3 className="flex items-center text-xs font-bold uppercase text-gray-500 tracking-wider">
          <Box className="w-3 h-3 mr-2" /> Structure
        </h3>

        {/* Rounded Corners */}
        <div>
          <label className="text-sm text-gray-600 block mb-2">Corner Radius</label>
          <div className="grid grid-cols-5 gap-2">
            {['none', 'sm', 'md', 'lg', 'full'].map((opt) => (
              <button
                key={opt}
                onClick={() => handleChange('borderRadius', opt)}
                className={`h-8 rounded border text-gray-700 ${theme.borderRadius === opt ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}
                title={opt}
              >
                <div className={`w-4 h-4 mx-auto border-t-2 border-l-2 border-current ${
                    opt === 'none' ? 'rounded-none' : 
                    opt === 'sm' ? 'rounded-sm' : 
                    opt === 'md' ? 'rounded-md' : 
                    opt === 'lg' ? 'rounded-lg' : 'rounded-full'
                }`}></div>
              </button>
            ))}
          </div>
        </div>

        {/* Border Style */}
        <div>
           <label className="text-sm text-gray-600 block mb-2">Border Style</label>
           <select 
             value={theme.borderStyle}
             onChange={(e) => handleChange('borderStyle', e.target.value)}
             className="w-full rounded-md border text-gray-700 border-gray-300 p-2 text-sm bg-white"
           >
             <option value="none">None</option>
             <option value="thin">Thin Line (1px)</option>
             <option value="thick">Thick Line (2px)</option>
             <option value="double">Double Line</option>
           </select>
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* 3. Effects */}
      <section className="space-y-4">
        <h3 className="flex items-center text-xs font-bold uppercase text-gray-500 tracking-wider">
          <Layers className="w-3 h-3 mr-2" /> Effects
        </h3>
        
        {/* Shadow */}
        <div>
           <label className="text-sm text-gray-600 block mb-2">Shadow Depth</label>
           <input 
             type="range" 
             min="0" max="4" step="1"
             value={['none', 'sm', 'md', 'lg', 'xl'].indexOf(theme.shadow)}
             onChange={(e) => {
               const map = ['none', 'sm', 'md', 'lg', 'xl'];
               handleChange('shadow', map[Number(e.target.value)]);
             }}
             className="w-full accent-blue-600"
           />
           <div className="flex justify-between text-xs text-gray-400 mt-1">
             <span>Flat</span>
             <span>Deep</span>
           </div>
        </div>
      </section>
    </div>
  );
}

// Helper Color Component
function ColorPicker({ label, value, onChange }: any) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm text-gray-600">{label}</label>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 font-mono">{value}</span>
        <input 
          type="color" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 rounded overflow-hidden cursor-pointer border-0 p-0 shadow-sm"
        />
      </div>
    </div>
  );
}