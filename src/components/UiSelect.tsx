import React, { useEffect, useRef, useState } from 'react';

export interface UiSelectOption {
  id: string;
  name: string;
}

interface UiSelectProps {
  value: string;
  onChange: (id: string) => void;
  options: UiSelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

export default function UiSelect({ value, onChange, options, placeholder = 'Seleccionar', disabled = false }: UiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.id === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (id: string) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div className={`relative ${disabled ? 'opacity-60 pointer-events-none' : ''}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-left placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/60 flex items-center justify-between"
      >
        <span className={selected ? '' : 'text-white/60'}>{selected ? selected.name : placeholder}</span>
        <svg className={`h-4 w-4 ml-3 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-white/15 bg-white/20 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.25)] p-1 max-h-60 overflow-auto e-soft-pulse">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-white/60">No hay opciones</div>
          ) : (
            <ul className="divide-y divide-white/10">
              {options.map(opt => (
                <li key={opt.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(opt.id)}
                    className={`w-full text-left px-3 py-2 rounded hover:bg-white/25 ${opt.id === value ? 'text-sky-300' : 'text-white'}`}
                  >
                    {opt.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}


