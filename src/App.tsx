import {
  BookOpen,
  Download,
  FilePlus2,
  LayoutDashboard,
  Moon,
  Shapes,
  Sun,
  Timer,
  Upload,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AtlasView, AtlasTarget } from './components/atlas/AtlasView';
import { CommandAction, CommandPalette } from './components/common/CommandPalette';
import { ToastItem, ToastStack } from './components/common/Toast';
import { Dashboard } from './components/dashboard/Dashboard';
import { AddResourceModal } from './components/library/AddResourceModal';
import { EMPTY_FILTERS, LibraryFilters } from './components/library/FilterBar';
import { LibraryView } from './components/library/LibraryView';
import { NOTE_PREFIX } from './components/library/NotebookPanel';
import { SplitViewReader } from './components/library/SplitViewReader';
import { Sidebar, ViewKey } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import {
  ALL_COMMITTEES_LABEL,
  getAllResources,
} from './data/libraryData';
import { ATLAS_DIAGRAMS } from './data/atlasData';
import { useLocalStorage, readPrefixedStorage, writePrefixedStorage } from './hooks/useLocalStorage';
import { usePomodoro } from './hooks/usePomodoro';
import type { LibraryResource, PersistedState } from './types/hipoklab';

const STATE_KEY = 'hipoklab:state';

const DEFAULT_STATE: PersistedState = {
  settings: {
    theme: 'dark',
    sidebarCollapsed: false,
    dailyGoal: 3,
    activeCommittee: ALL_COMMITTEES_LABEL,
    fontSizeStep: 1,
  },
  completed: {},
  lastRead: null,
  customResources: [],
  pomodoroSessions: 0,
  pomodoroDate: new Date().toISOString().slice(0, 10),
};

const PAGE_META: Record<ViewKey, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Kontrol Paneli',
    subtitle: 'Günlük çalışma ilerlemeniz ve akademik görünümünüz',
  },
  library: {
    title: 'Akademik Kütüphane',
    subtitle: 'Komite odaklı kaynaklar · Split-View çalışma masası',
  },
  atlas: {
    title: 'Görsel Atlas',
    subtitle: 'İnteraktif anatomik ve histolojik diyagramlar',
  },
};

export default function App() {
  const [persisted, setPersisted] = useLocalStorage<PersistedState>(STATE_KEY, DEFAULT_STATE);
  const [view, setView] = useState<ViewKey>('dashboard');
  const [activeResourceId, setActiveResourceId] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [filters, setFilters] = useState<LibraryFilters>(EMPTY_FILTERS);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [notesVersion, setNotesVersion] = useState(0);
  const [atlasTarget, setAtlasTarget] = useState<AtlasTarget | null>(null);
  const [presentationMode, setPresentationMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastIdRef = useRef(1);

  const { settings, completed, lastRead, customResources } = persisted;

  /* ---------------------------------------------------------------------- */
  /* Bildirimler                                                            */
  /* ---------------------------------------------------------------------- */
  const notify = useCallback((message: string, tone: ToastItem['tone'] = 'success') => {
    const id = toastIdRef.current++;
    setToasts((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Tema                                                                   */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('light', settings.theme === 'light');
    root.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.theme]);

  const toggleTheme = useCallback(() => {
    setPersisted((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        theme: prev.settings.theme === 'dark' ? 'light' : 'dark',
      },
    }));
  }, [setPersisted]);

  /* ---------------------------------------------------------------------- */
  /* Pomodoro                                                               */
  /* ---------------------------------------------------------------------- */
  const pomodoro = usePomodoro(
    useCallback(
      (finishedMode: 'work' | 'break') => {
        if (finishedMode === 'work') {
          setPersisted((prev) => {
            const today = new Date().toISOString().slice(0, 10);
            return {
              ...prev,
              pomodoroSessions:
                prev.pomodoroDate === today ? prev.pomodoroSessions + 1 : 1,
              pomodoroDate: today,
            };
          });
          notify('Odaklanma seansı tamamlandı! Kısa mola zamanı. ☕', 'info');
        } else {
          notify('Mola bitti — yeni odaklanma seansına hazırsınız.', 'info');
        }
      },
      [notify, setPersisted],
    ),
  );

  /* ---------------------------------------------------------------------- */
  /* Kaynaklar                                                              */
  /* ---------------------------------------------------------------------- */
  const allResources = useMemo(
    () => getAllResources(customResources),
    [customResources],
  );

  const activeResource = useMemo(
    () => allResources.find((r) => r.id === activeResourceId) ?? null,
    [allResources, activeResourceId],
  );

  const openResource = useCallback(
    (id: string) => {
      setActiveResourceId(id);
      setPersisted((prev) => ({ ...prev, lastRead: { id, at: Date.now() } }));
    },
    [setPersisted],
  );

  const toggleComplete = useCallback(
    (id: string) => {
      setPersisted((prev) => {
        const next = { ...prev.completed };
        if (next[id] !== undefined) {
          delete next[id];
          return { ...prev, completed: next };
        }
        next[id] = Date.now();
        return { ...prev, completed: next };
      });
    },
    [setPersisted],
  );

  const handleSaveResource = useCallback(
    (resource: LibraryResource) => {
      setPersisted((prev) => ({
        ...prev,
        customResources: [resource, ...prev.customResources.filter((r) => r.id !== resource.id)],
      }));
      notify(`"${resource.title}" kütüphaneye eklendi.`);
      setView('library');
    },
    [setPersisted, notify],
  );

  /* ---------------------------------------------------------------------- */
  /* JSON Yedekleme / İçe Aktarma                                           */
  /* ---------------------------------------------------------------------- */
  const handleExport = useCallback(() => {
    const notes = readPrefixedStorage<string>(NOTE_PREFIX);
    const payload = {
      app: 'HipokLab',
      version: 1,
      exportedAt: new Date().toISOString(),
      state: persisted,
      notes,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hipoklab-yedek-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    notify('JSON yedeğiniz indirildi.');
  }, [persisted, notify]);

  const handleImportFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result)) as {
            state?: PersistedState;
            notes?: Record<string, string>;
          };
          if (!parsed || typeof parsed !== 'object') throw new Error('Geçersiz dosya');
          setPersisted((prev) => ({
            ...DEFAULT_STATE,
            ...prev,
            ...parsed.state,
            settings: { ...DEFAULT_STATE.settings, ...(parsed.state?.settings ?? {}) },
          }));
          if (parsed.notes) {
            writePrefixedStorage(NOTE_PREFIX, parsed.notes);
            setNotesVersion((v) => v + 1);
          }
          notify('Yedek başarıyla içe aktarıldı.');
        } catch {
          notify('Yedek dosyası okunamadı — lütfen geçerli bir HipokLab JSON dosyası seçin.', 'warning');
        }
      };
      reader.readAsText(file);
    },
    [setPersisted, notify],
  );

  /* ---------------------------------------------------------------------- */
  /* Global kısayollar (Ctrl/Cmd + K)                                       */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Komut paleti eylemleri                                                 */
  /* ---------------------------------------------------------------------- */
  const commandActions = useMemo<CommandAction[]>(() => {
    const resourceActions: CommandAction[] = allResources.map((r) => ({
      id: `open-${r.id}`,
      label: r.title,
      hint: r.course,
      icon: BookOpen,
      section: 'Kaynaklar',
      run: () => {
        setView('library');
        openResource(r.id);
      },
    }));

    // Görsel Atlas: anatomik / histolojik yapıları global aramada bul
    const atlasActions: CommandAction[] = ATLAS_DIAGRAMS.flatMap((d) =>
      d.pins.map((pin) => ({
        id: `atlas-${pin.id}`,
        label: `${pin.nameTr} — ${pin.nameLa}`,
        hint: d.title,
        icon: Shapes,
        section: 'Görsel Atlas',
        keywords: pin.aliases.join(' '),
        run: () => {
          setView('atlas');
          setAtlasTarget({ diagramId: d.id, pinId: pin.id, nonce: Date.now() });
        },
      })),
    );

    return [
      {
        id: 'goto-dashboard',
        label: 'Kontrol Paneli’ne Git',
        hint: 'Sayfa',
        icon: LayoutDashboard,
        section: 'Gezinme',
        run: () => {
          setView('dashboard');
          setActiveResourceId(null);
        },
      },
      {
        id: 'goto-library',
        label: 'Akademik Kütüphane’ye Git',
        hint: 'Sayfa',
        icon: BookOpen,
        section: 'Gezinme',
        run: () => {
          setView('library');
          setActiveResourceId(null);
        },
      },
      {
        id: 'new-resource',
        label: 'Yeni Kaynak Ekle',
        hint: 'Eylem',
        icon: FilePlus2,
        section: 'Eylemler',
        run: () => setAddModalOpen(true),
      },
      {
        id: 'toggle-theme',
        label: settings.theme === 'dark' ? 'Açık Moda Geç' : 'Koyu Moda Geç',
        hint: 'Görünüm',
        icon: settings.theme === 'dark' ? Sun : Moon,
        section: 'Eylemler',
        run: toggleTheme,
      },
      {
        id: 'pomodoro-toggle',
        label: pomodoro.running ? 'Pomodoro’yu Duraklat' : 'Pomodoro’yu Başlat',
        hint: '25/5 dk',
        icon: Timer,
        section: 'Eylemler',
        run: pomodoro.toggle,
      },
      {
        id: 'export',
        label: 'JSON Yedeği İndir',
        hint: 'Yedekleme',
        icon: Download,
        section: 'Eylemler',
        run: handleExport,
      },
      {
        id: 'import',
        label: 'JSON Yedeği İçe Aktar',
        hint: 'Yedekleme',
        icon: Upload,
        section: 'Eylemler',
        run: () => fileInputRef.current?.click(),
      },
      ...resourceActions,
      ...atlasActions,
    ];
  }, [
    allResources,
    settings.theme,
    pomodoro.running,
    pomodoro.toggle,
    toggleTheme,
    handleExport,
    openResource,
  ]);

  /* ---------------------------------------------------------------------- */
  /* Render                                                                 */
  /* ---------------------------------------------------------------------- */
  return (
    <div className="flex h-screen overflow-hidden bg-base text-fg">
      {/* Sol navigasyon — sunum modunda gizli */}
      {!presentationMode ? (
        <Sidebar
          currentView={view}
          onViewChange={(v) => {
            setView(v);
            setActiveResourceId(null);
          }}
          collapsed={settings.sidebarCollapsed}
          onToggleCollapsed={() =>
            setPersisted((prev) => ({
              ...prev,
              settings: { ...prev.settings, sidebarCollapsed: !prev.settings.sidebarCollapsed },
            }))
          }
        />
      ) : null}

      {/* Ana alan */}
      <div className="flex min-w-0 flex-1 flex-col">
        {!presentationMode ? (
          <TopBar
            title={activeResource ? activeResource.title : PAGE_META[view].title}
            subtitle={activeResource ? `${activeResource.course} · Split-View Okuyucu` : PAGE_META[view].subtitle}
            theme={settings.theme}
            onToggleTheme={toggleTheme}
            activeCommittee={settings.activeCommittee}
            onCommitteeChange={(committee) => {
              setPersisted((prev) => ({ ...prev, settings: { ...prev.settings, activeCommittee: committee } }));
              if (committee !== ALL_COMMITTEES_LABEL) {
                setFilters((f) => ({ ...f, committee }));
              }
            }}
            pomodoro={pomodoro}
            onOpenPalette={() => setPaletteOpen(true)}
            onExport={handleExport}
            onImport={() => fileInputRef.current?.click()}
          />
        ) : null}

        <main className="flex-1 overflow-y-auto">
          {view === 'dashboard' ? (
            <Dashboard
              resources={allResources}
              completed={completed}
              lastRead={lastRead}
              activeCommittee={settings.activeCommittee}
              dailyGoal={settings.dailyGoal}
              onOpenResource={(id) => {
                setView('library');
                openResource(id);
              }}
              onNavigateLibrary={() => setView('library')}
            />
          ) : view === 'atlas' ? (
            <AtlasView target={atlasTarget} onPresentationChange={setPresentationMode} />
          ) : (
            <LibraryView
              resources={allResources}
              completed={completed}
              filters={filters}
              onFiltersChange={setFilters}
              onOpenResource={openResource}
              onAddResource={() => setAddModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Split-View Okuyucu */}
      {activeResource ? (
        <SplitViewReader
          key={`reader-${activeResource.id}`}
          resource={activeResource}
          completed={completed[activeResource.id] !== undefined}
          onToggleComplete={() => {
            toggleComplete(activeResource.id);
            notify(
              completed[activeResource.id] !== undefined
                ? 'Konu tamamlanmadı olarak işaretlendi.'
                : 'Tebrikler! Konu tamamlandı olarak işaretlendi.',
            );
          }}
          onBack={() => setActiveResourceId(null)}
          onNotify={notify}
          fontSizeStep={settings.fontSizeStep}
          onFontSizeStep={(step) =>
            setPersisted((prev) => ({
              ...prev,
              settings: { ...prev.settings, fontSizeStep: step },
            }))
          }
          notesVersion={notesVersion}
        />
      ) : null}

      {/* Modallar ve palet */}
      <AddResourceModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleSaveResource}
      />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        actions={commandActions}
      />

      {/* JSON dosya seçici */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImportFile(file);
          e.target.value = '';
        }}
      />

      {/* Bildirimler */}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
