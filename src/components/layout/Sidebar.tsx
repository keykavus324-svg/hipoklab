import {
  Activity,
  BookOpen,
  ChevronsLeft,
  ChevronsRight,
  FlaskConical,
  GraduationCap,
  Images,
  LayoutDashboard,
  Stethoscope,
} from 'lucide-react';

export type ViewKey = 'dashboard' | 'library' | 'atlas' | 'exam' | 'cases';

interface SidebarProps {
  currentView: ViewKey;
  onViewChange: (view: ViewKey) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

interface NavItem {
  key: ViewKey | 'exam' | 'cases';
  label: string;
  icon: typeof Activity;
  enabled: boolean;
  soon?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Kontrol Paneli', icon: LayoutDashboard, enabled: true },
  { key: 'library', label: 'Akademik Kütüphane', icon: BookOpen, enabled: true },
  { key: 'atlas', label: 'Görsel Atlas', icon: Images, enabled: true },
  { key: 'exam', label: 'Sınav & Flashcard', icon: GraduationCap, enabled: true },
  { key: 'cases', label: 'Klinik Vakalar', icon: Stethoscope, enabled: true },
];

/**
 * Daraltılabilir sol navigasyon menüsü.
 */
export function Sidebar({ currentView, onViewChange, collapsed, onToggleCollapsed }: SidebarProps) {
  return (
    <aside
      className={`relative z-30 flex h-screen shrink-0 flex-col border-r border-line bg-surface transition-[width] duration-200 ease-out ${
        collapsed ? 'w-[68px]' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-4 pb-3 pt-5 ${collapsed ? 'justify-center px-0' : ''}`}>
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-gradient-to-br from-accent/20 to-azure/10 shadow-glow-accent">
          <Activity size={18} className="text-accent" />
        </span>
        {!collapsed ? (
          <div className="flex flex-col leading-tight">
            <span className="text-[15px] font-semibold tracking-tight text-fg">
              Hipok<span className="text-accent">Lab</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-faint">
              Akademik Kokpit
            </span>
          </div>
        ) : null}
      </div>

      <div className="mx-3 mb-2 h-px bg-line" />

      {/* Navigasyon */}
      <nav className={`flex-1 space-y-1 overflow-y-auto px-3 py-2 ${collapsed ? 'px-2' : ''}`}>
        {!collapsed ? (
          <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-faint">
            Çalışma Alanı
          </p>
        ) : null}
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.enabled && item.key === currentView;
          return (
            <button
              key={item.key}
              type="button"
              disabled={!item.enabled}
              onClick={() => {
                if (item.enabled) onViewChange(item.key as ViewKey);
              }}
              title={collapsed ? item.label : undefined}
              className={`group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium transition ${
                collapsed ? 'justify-center px-0' : ''
              } ${
                isActive
                  ? 'bg-accent/12 text-accent shadow-[inset_0_0_0_1px] shadow-accent/25'
                  : item.enabled
                    ? 'text-sub hover:bg-surface2 hover:text-fg'
                    : 'cursor-not-allowed text-faint/70 hover:bg-surface2/50'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-accent' : ''} />
              {!collapsed ? (
                <span className="flex-1 truncate">{item.label}</span>
              ) : null}
              {!collapsed && item.soon ? (
                <span className="rounded-md border border-line2/70 bg-surface2 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-faint">
                  Yakında
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Alt bilgi */}
      <div className={`space-y-2 px-3 pb-4 pt-2 ${collapsed ? 'px-2' : ''}`}>
        {!collapsed ? (
          <div className="rounded-xl border border-line bg-surface2/60 p-3">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
              <FlaskConical size={11} /> v3 · Tam Sürüm
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-faint">
              Kontrol paneli, kütüphane ve split-view çalışma masası aktif. Modüller zamanla
              genişleyecek.
            </p>
          </div>
        ) : null}
        <button
          type="button"
          onClick={onToggleCollapsed}
          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12px] font-medium text-faint transition hover:bg-surface2 hover:text-fg ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title={collapsed ? 'Menüyü genişlet' : 'Menüyü daralt'}
        >
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          {!collapsed ? <span>Menüyü Daralt</span> : null}
        </button>
      </div>
    </aside>
  );
}
