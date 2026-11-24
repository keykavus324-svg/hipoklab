import { Command, Download, Moon, Search, Sun, Upload } from 'lucide-react';
import { PomodoroTimer } from '../common/PomodoroTimer';
import { PomodoroApi } from '../../hooks/usePomodoro';
import { ALL_COMMITTEES_LABEL, COMMITTEES } from '../../data/libraryData';
import { ThemeMode } from '../../types/hipoklab';

interface TopBarProps {
  title: string;
  subtitle: string;
  theme: ThemeMode;
  onToggleTheme: () => void;
  activeCommittee: string;
  onCommitteeChange: (committee: string) => void;
  pomodoro: PomodoroApi;
  onOpenPalette: () => void;
  onExport: () => void;
  onImport: () => void;
}

/**
 * Üst bar: komite seçici, pomodoro, global arama, yedekleme ve tema geçişi.
 */
export function TopBar({
  title,
  subtitle,
  theme,
  onToggleTheme,
  activeCommittee,
  onCommitteeChange,
  pomodoro,
  onOpenPalette,
  onExport,
  onImport,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-base/85 backdrop-blur-xl">
      <div className="flex h-[62px] items-center gap-3 px-5">
        {/* Sayfa başlığı */}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[15px] font-semibold tracking-tight text-fg">{title}</h1>
          <p className="truncate text-[11px] text-faint">{subtitle}</p>
        </div>

        {/* Aktif Komite Seçici */}
        <div className="hidden lg:block">
          <select
            value={activeCommittee}
            onChange={(e) => onCommitteeChange(e.target.value)}
            aria-label="Aktif komite seçici"
            className="h-9 max-w-[240px] cursor-pointer appearance-none truncate rounded-xl border border-line bg-surface px-3 pr-8 text-[12px] font-medium text-sub outline-none transition hover:border-line2 hover:text-fg"
          >
            <option value={ALL_COMMITTEES_LABEL}>{ALL_COMMITTEES_LABEL}</option>
            {COMMITTEES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Pomodoro */}
        <div className="hidden md:block">
          <PomodoroTimer pomodoro={pomodoro} />
        </div>

        {/* Global Arama */}
        <button
          type="button"
          onClick={onOpenPalette}
          className="group flex h-9 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-[12px] text-faint transition hover:border-accent/40 hover:text-sub"
          aria-label="Global aramayı aç"
        >
          <Search size={14} />
          <span className="hidden xl:inline">Ara…</span>
          <kbd className="hidden items-center gap-0.5 rounded-md border border-line bg-surface2 px-1.5 py-0.5 text-[10px] font-medium text-faint sm:flex">
            <Command size={9} /> K
          </kbd>
        </button>

        {/* Yedekle / İçe Aktar */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onExport}
            title="JSON olarak yedekle"
            aria-label="JSON olarak yedekle"
            className="flex h-9 items-center gap-1.5 rounded-xl border border-line bg-surface px-2.5 text-[12px] font-medium text-sub transition hover:border-accent/40 hover:text-fg"
          >
            <Download size={14} />
            <span className="hidden xl:inline">Yedekle</span>
          </button>
          <button
            type="button"
            onClick={onImport}
            title="JSON yedeğini içe aktar"
            aria-label="JSON yedeğini içe aktar"
            className="flex h-9 items-center gap-1.5 rounded-xl border border-line bg-surface px-2.5 text-[12px] font-medium text-sub transition hover:border-accent/40 hover:text-fg"
          >
            <Upload size={14} />
            <span className="hidden xl:inline">İçe Aktar</span>
          </button>
        </div>

        {/* Tema Geçişi */}
        <button
          type="button"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Açık moda geç' : 'Koyu moda geç'}
          aria-label={theme === 'dark' ? 'Açık moda geç' : 'Koyu moda geç'}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-sub transition hover:border-gold/50 hover:text-gold"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
}
