import {
  BookOpen,
  Command,
  Download,
  FilePlus2,
  LayoutDashboard,
  Moon,
  Search,
  Sun,
  Timer,
  Upload,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface CommandAction {
  id: string;
  label: string;
  hint?: string;
  icon: typeof Search;
  section: string;
  /** Filtrelemeye dahil edilen ek anahtar kelimeler (eş anlamlılar). */
  keywords?: string;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  actions: CommandAction[];
}

/**
 * Ctrl+K / Cmd+K ile açılan global arama paleti.
 * Kaynaklar ve eylemler üzerinde anlık filtreleme + klavye gezinmesi.
 */
export function CommandPalette({ open, onClose, actions }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.toLocaleLowerCase('tr').trim();
    if (!q) return actions;
    return actions.filter(
      (a) =>
        a.label.toLocaleLowerCase('tr').includes(q) ||
        (a.hint ?? '').toLocaleLowerCase('tr').includes(q) ||
        a.section.toLocaleLowerCase('tr').includes(q) ||
        (a.keywords ?? '').toLocaleLowerCase('tr').includes(q),
    );
  }, [actions, query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      // Açılışta odak
      window.setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % Math.max(filtered.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + filtered.length) % Math.max(filtered.length, 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const action = filtered[activeIndex];
        if (action) {
          action.run();
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, filtered, activeIndex, onClose]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${activeIndex}"]`);
    el?.scrollIntoView?.({ block: 'nearest' });
  }, [activeIndex]);

  if (!open) return null;

  // Bölüm başlıklarını koruyarak grupla
  let lastSection = '';

  return (
    <div
      className="overlay-backdrop fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh] animate-fade-in"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Global arama paleti"
    >
      <div className="w-full max-w-xl animate-slide-up overflow-hidden rounded-2xl border border-line bg-surface shadow-float">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
          <Search size={17} className="text-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kaynak, sayfa veya eylem ara…"
            className="flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-faint"
            aria-label="Arama"
          />
          <kbd className="rounded-md border border-line bg-surface2 px-1.5 py-0.5 text-[10px] font-medium text-faint">
            ESC
          </kbd>
        </div>
        <div ref={listRef} className="max-h-[52vh] overflow-y-auto px-2 py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm text-sub">Sonuç bulunamadı.</p>
              <p className="mt-1 text-xs text-faint">Farklı bir anahtar kelime deneyin.</p>
            </div>
          ) : (
            filtered.map((action, idx) => {
              const showHeader = action.section !== lastSection;
              lastSection = action.section;
              const Icon = action.icon;
              return (
                <div key={action.id}>
                  {showHeader ? (
                    <div className="px-3 pb-1 pt-2.5 text-[10px] font-semibold uppercase tracking-wider text-faint">
                      {action.section}
                    </div>
                  ) : null}
                  <button
                    type="button"
                    data-idx={idx}
                    onClick={() => {
                      action.run();
                      onClose();
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                      idx === activeIndex ? 'bg-surface2 text-fg' : 'text-sub hover:bg-surface2/60'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-line bg-surface2 ${
                        idx === activeIndex ? 'text-accent' : 'text-faint'
                      }`}
                    >
                      <Icon size={14} />
                    </span>
                    <span className="flex-1 truncate text-sm">{action.label}</span>
                    {action.hint ? (
                      <span className="shrink-0 text-[11px] text-faint">{action.hint}</span>
                    ) : null}
                  </button>
                </div>
              );
            })
          )}
        </div>
        <div className="flex items-center gap-4 border-t border-line bg-surface2/50 px-4 py-2.5 text-[10px] text-faint">
          <span className="flex items-center gap-1.5">
            <Command size={11} /> ↑↓ gezin
          </span>
          <span>↵ aç</span>
          <span>esc kapat</span>
        </div>
      </div>
    </div>
  );
}

/** Komut paleti için standart eylem ikonları. */
export const CommandIcons = {
  dashboard: LayoutDashboard,
  library: BookOpen,
  newResource: FilePlus2,
  theme: Moon,
  themeLight: Sun,
  pomodoro: Timer,
  backup: Download,
  restore: Upload,
};
