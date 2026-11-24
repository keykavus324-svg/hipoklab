import {
  BookOpen,
  Download,
  FilePlus2,
  GraduationCap,
  LayoutDashboard,
  Moon,
  Shapes,
  Stethoscope,
  Sun,
  Timer,
  Upload,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AtlasView, AtlasTarget } from './components/atlas/AtlasView';
import { CasesView } from './components/cases/CasesView';
import { CasePlayer } from './components/cases/CasePlayer';
import { CommandAction, CommandPalette } from './components/common/CommandPalette';
import { ToastItem, ToastStack } from './components/common/Toast';
import { Dashboard } from './components/dashboard/Dashboard';
import { ExamView } from './components/exam/ExamView';
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
import { CLINICAL_CASES, getCaseById } from './data/clinicalCases';
import { FLASHCARD_DECKS, defaultCardProgress, getDueCardIds, rateCard } from './data/flashcardData';
import { toISODate } from './data/studyPlan';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { useLocalStorage, readPrefixedStorage, writePrefixedStorage } from './hooks/useLocalStorage';
import { usePomodoro } from './hooks/usePomodoro';
import type { CardRating, CaseProgress, Course, LibraryResource, PersistedState, UserProfile } from './types/hipoklab';

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
  favorites: [],
  cardProgress: {},
  caseProgress: {},
  studyLog: {},
  profile: null,
  onboardingSeen: false,
  missionLog: {},
};

/* Kalıcı durum nesnesi mi? */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

const COURSE_LIST: Course[] = ['Anatomi', 'Fizyoloji', 'Histoloji', 'Biyokimya', 'Patoloji'];

function defaultExamDate(): string {
  return toISODate(new Date(Date.now() + 21 * 24 * 60 * 60 * 1000));
}

/**
 * Kalıcı durumu güncel sürüme normalize eder.
 * Eski sürümlerden (Faz 1/2) kalan kayıtlarda favorites/cardProgress/caseProgress/
 * studyLog alanları bulunmaz; normalize edilmeden okunursa uygulama çöker.
 * Eksik veya bozuk alanlar güvenli varsayılanlarla tamamlanır.
 */
function normalizeState(raw: unknown): PersistedState {
  const r = isRecord(raw) ? raw : {};
  const s = isRecord(r.settings) ? r.settings : {};
  const lastRead = isRecord(r.lastRead) && typeof r.lastRead.id === 'string' ? r.lastRead : null;

  // Kart ilerlemesi: her girişin sayısal alanları doğrulanır
  const cardProgress: PersistedState['cardProgress'] = {};
  if (isRecord(r.cardProgress)) {
    for (const [cardId, p] of Object.entries(r.cardProgress)) {
      if (!isRecord(p)) continue;
      cardProgress[cardId] = {
        interval: Number.isFinite(p.interval) ? Number(p.interval) : 0,
        ease: Number.isFinite(p.ease) ? Math.min(2.8, Math.max(1.3, Number(p.ease))) : 2.5,
        due: Number.isFinite(p.due) ? Number(p.due) : 0,
        reps: Number.isFinite(p.reps) ? Number(p.reps) : 0,
        lapses: Number.isFinite(p.lapses) ? Number(p.lapses) : 0,
        lastReviewed: Number.isFinite(p.lastReviewed) ? Number(p.lastReviewed) : null,
      };
    }
  }

  // Vaka ilerlemesi
  const caseProgress: PersistedState['caseProgress'] = {};
  if (isRecord(r.caseProgress)) {
    for (const [caseId, p] of Object.entries(r.caseProgress)) {
      if (!isRecord(p)) continue;
      const answers: Record<string, number> = {};
      if (isRecord(p.answers)) {
        for (const [qid, chosen] of Object.entries(p.answers)) {
          if (Number.isFinite(chosen)) answers[qid] = Number(chosen);
        }
      }
      caseProgress[caseId] = {
        stepIndex: Number.isFinite(p.stepIndex) ? Math.max(0, Number(p.stepIndex)) : 0,
        answers,
        completed: p.completed === true,
        completedAt: Number.isFinite(p.completedAt) ? Number(p.completedAt) : null,
      };
    }
  }

  // Çalışma defteri: YYYY-MM-DD -> dakika
  const studyLog: Record<string, number> = {};
  if (isRecord(r.studyLog)) {
    for (const [day, minutes] of Object.entries(r.studyLog)) {
      if (Number.isFinite(minutes)) studyLog[day] = Math.max(0, Number(minutes));
    }
  }

  // Kişisel profil
  let profile: PersistedState['profile'] = null;
  if (isRecord(r.profile)) {
    const p = r.profile;
    profile = {
      name: typeof p.name === 'string' ? p.name : '',
      examLabel: typeof p.examLabel === 'string' && p.examLabel ? p.examLabel : 'Sınav',
      examDate: typeof p.examDate === 'string' && p.examDate ? p.examDate : defaultExamDate(),
      dailyMinutes: Number.isFinite(p.dailyMinutes) && Number(p.dailyMinutes) > 0 ? Number(p.dailyMinutes) : 60,
      courses: Array.isArray(p.courses)
        ? (p.courses as unknown[]).filter((c): c is Course => COURSE_LIST.includes(c as Course))
        : [],
      onboarded: p.onboarded === true,
    };
  }

  // Görev günlüğü: YYYY-MM-DD -> string[]
  const missionLog: Record<string, string[]> = {};
  if (isRecord(r.missionLog)) {
    for (const [day, ids] of Object.entries(r.missionLog)) {
      if (Array.isArray(ids)) {
        missionLog[day] = ids.filter((id): id is string => typeof id === 'string');
      }
    }
  }

  return {
    settings: {
      theme: s.theme === 'light' ? 'light' : 'dark',
      sidebarCollapsed: s.sidebarCollapsed === true,
      dailyGoal: Number.isFinite(s.dailyGoal) && Number(s.dailyGoal) > 0 ? Number(s.dailyGoal) : 3,
      activeCommittee: typeof s.activeCommittee === 'string' ? s.activeCommittee : ALL_COMMITTEES_LABEL,
      fontSizeStep: Number.isFinite(s.fontSizeStep) ? Number(s.fontSizeStep) : 1,
    },
    completed: isRecord(r.completed) ? (r.completed as PersistedState['completed']) : {},
    lastRead: lastRead as PersistedState['lastRead'],
    customResources: Array.isArray(r.customResources)
      ? (r.customResources as PersistedState['customResources'])
      : [],
    pomodoroSessions: Number.isFinite(r.pomodoroSessions) ? Number(r.pomodoroSessions) : 0,
    pomodoroDate:
      typeof r.pomodoroDate === 'string' && r.pomodoroDate
        ? r.pomodoroDate
        : DEFAULT_STATE.pomodoroDate,
    favorites: Array.isArray(r.favorites)
      ? (r.favorites as unknown[]).filter((f): f is string => typeof f === 'string')
      : [],
    cardProgress,
    caseProgress,
    studyLog,
    profile,
    onboardingSeen: r.onboardingSeen === true,
    missionLog,
  };
}

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
  exam: {
    title: 'Sınav & Flashcard',
    subtitle: 'SM-2 aralıklı tekrar sistemi · Aktif öğrenme',
  },
  cases: {
    title: 'Klinik Vakalar',
    subtitle: 'Anamnezden tedaviye adım adım karar verme pratiği',
  },
};

export default function App() {
  const [persisted, setPersisted] = useLocalStorage<PersistedState>(STATE_KEY, DEFAULT_STATE, normalizeState);
  const [view, setView] = useState<ViewKey>('dashboard');
  const [activeResourceId, setActiveResourceId] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [filters, setFilters] = useState<LibraryFilters>(EMPTY_FILTERS);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [notesVersion, setNotesVersion] = useState(0);
  const [atlasTarget, setAtlasTarget] = useState<AtlasTarget | null>(null);
  const [presentationMode, setPresentationMode] = useState(false);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastIdRef = useRef(1);

  const { settings, completed, lastRead, customResources, favorites, cardProgress, caseProgress, studyLog, profile, onboardingSeen, missionLog } =
    persisted;

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
          const today = new Date().toISOString().slice(0, 10);
          setPersisted((prev) => ({
            ...prev,
            pomodoroSessions:
              prev.pomodoroDate === today ? prev.pomodoroSessions + 1 : 1,
            pomodoroDate: today,
            // Odak seansı çalışma defterine 25 dk olarak işlensin
            studyLog: { ...prev.studyLog, [today]: (prev.studyLog[today] ?? 0) + 25 },
          }));
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
  /* Favoriler                                                              */
  /* ---------------------------------------------------------------------- */
  const toggleFavorite = useCallback(
    (id: string) => {
      setPersisted((prev) => {
        const isFav = prev.favorites.includes(id);
        return {
          ...prev,
          favorites: isFav ? prev.favorites.filter((f) => f !== id) : [id, ...prev.favorites],
        };
      });
    },
    [setPersisted],
  );

  /* ---------------------------------------------------------------------- */
  /* Flashcard (SM-2)                                                       */
  /* ---------------------------------------------------------------------- */
  const handleRateCard = useCallback(
    (cardId: string, rating: CardRating) => {
      setPersisted((prev) => ({
        ...prev,
        cardProgress: {
          ...prev.cardProgress,
          [cardId]: rateCard(prev.cardProgress[cardId] ?? defaultCardProgress(), rating),
        },
      }));
    },
    [setPersisted],
  );

  // Çalışma defterine dakika ekle (bugünün YYYY-MM-DD anahtarıyla)
  const studyLogBump = useCallback(
    (minutes: number) => {
      if (minutes <= 0) return;
      const today = new Date().toISOString().slice(0, 10);
      setPersisted((prev) => ({
        ...prev,
        studyLog: { ...prev.studyLog, [today]: (prev.studyLog[today] ?? 0) + minutes },
      }));
    },
    [setPersisted],
  );

  /* ---------------------------------------------------------------------- */
  /* Klinik vakalar                                                         */
  /* ---------------------------------------------------------------------- */
  const handleCaseProgress = useCallback(
    (caseId: string, progress: CaseProgress) => {
      setPersisted((prev) => ({ ...prev, caseProgress: { ...prev.caseProgress, [caseId]: progress } }));
    },
    [setPersisted],
  );

  const activeCase = useMemo(() => (activeCaseId ? getCaseById(activeCaseId) : null), [activeCaseId]);

  /* ---------------------------------------------------------------------- */
  /* Kişisel çalışma planı (kurulum sihirbazı)                              */
  /* ---------------------------------------------------------------------- */
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  // İlk ziyarette sihirbazı göster (bir kez)
  useEffect(() => {
    if (!onboardingSeen) setOnboardingOpen(true);
  }, [onboardingSeen]);

  const handleProfileComplete = useCallback(
    (p: UserProfile) => {
      setPersisted((prev) => ({ ...prev, profile: p, onboardingSeen: true }));
      setOnboardingOpen(false);
      notify(
        p.examDate
          ? `Planın hazır! ${p.examLabel} için günlük görevlerin Kontrol Paneli'nde seni bekliyor.`
          : 'Planın hazır! Kontrol Paneli\'nden takip edebilirsin.',
      );
    },
    [setPersisted, notify],
  );

  const closeOnboarding = useCallback(() => {
    setPersisted((prev) => ({ ...prev, onboardingSeen: true }));
    setOnboardingOpen(false);
  }, [setPersisted]);

  // Günlük görevi elle işaretle / kaldır
  const toggleMission = useCallback(
    (dateISO: string, missionId: string) => {
      setPersisted((prev) => {
        const day = prev.missionLog[dateISO] ?? [];
        const next = day.includes(missionId) ? day.filter((m) => m !== missionId) : [...day, missionId];
        return { ...prev, missionLog: { ...prev.missionLog, [dateISO]: next } };
      });
    },
    [setPersisted],
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
            ...normalizeState(parsed.state),
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
        id: 'goto-exam',
        label: 'Sınav & Flashcard’a Git',
        hint: 'Sayfa',
        icon: GraduationCap,
        section: 'Gezinme',
        run: () => {
          setView('exam');
          setActiveResourceId(null);
        },
      },
      {
        id: 'goto-cases',
        label: 'Klinik Vakalar’a Git',
        hint: 'Sayfa',
        icon: Stethoscope,
        section: 'Gezinme',
        run: () => {
          setView('cases');
          setActiveResourceId(null);
        },
      },
      ...FLASHCARD_DECKS.map<CommandAction>((d) => ({
        id: `study-deck-${d.id}`,
        label: `“${d.title}” destesiyle çalış`,
        hint: `${d.cards.length} kart · ${d.course}`,
        icon: GraduationCap,
        section: 'Çalışma',
        keywords: `${d.title} flashcard deste kart`,
        run: () => {
          setView('exam');
          setActiveResourceId(null);
        },
      })),
      ...CLINICAL_CASES.map<CommandAction>((c) => ({
        id: `case-${c.id}`,
        label: `Vaka: ${c.title}`,
        hint: c.specialty,
        icon: Stethoscope,
        section: 'Çalışma',
        keywords: `${c.title} ${c.specialty} ${c.tags.join(' ')} vaka`,
        run: () => {
          setView('cases');
          setActiveResourceId(null);
          setActiveCaseId(c.id);
        },
      })),
      {
        id: 'new-resource',
        label: 'Yeni Kaynak Ekle',
        hint: 'Eylem',
        icon: FilePlus2,
        section: 'Eylemler',
        run: () => setAddModalOpen(true),
      },
      {
        id: 'edit-plan',
        label: profile ? 'Çalışma Planımı Düzenle' : 'Kişisel Planımı Oluştur',
        hint: 'Plan',
        icon: Timer,
        section: 'Eylemler',
        keywords: 'plan sınav hedef profil onboarding kurulum',
        run: () => setOnboardingOpen(true),
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

  // Bugünkü tekrar bekleyen kart sayısı (Dashboard için)
  const dueCardCount = useMemo(() => {
    const allCards = FLASHCARD_DECKS.flatMap((d) => d.cards);
    return getDueCardIds(allCards, cardProgress).length;
  }, [cardProgress]);

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
            setActiveCaseId(null);
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
            title={
              activeResource
                ? activeResource.title
                : activeCase
                  ? activeCase.title
                  : PAGE_META[view].title
            }
            subtitle={
              activeResource
                ? `${activeResource.course} · Split-View Okuyucu`
                : activeCase
                  ? `${activeCase.specialty} · Klinik Vaka`
                  : PAGE_META[view].subtitle
            }
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
              studyLog={studyLog}
              cardProgress={cardProgress}
              caseProgress={caseProgress}
              missionLog={missionLog}
              profile={profile}
              dueCardCount={dueCardCount}
              onToggleMission={toggleMission}
              onOpenProfile={() => setOnboardingOpen(true)}
              onOpenResource={(id) => {
                setView('library');
                openResource(id);
              }}
              onNavigateLibrary={() => setView('library')}
              onOpenExam={() => setView('exam')}
              onOpenCases={(caseId?: string) => {
                setView('cases');
                if (caseId) setActiveCaseId(caseId);
              }}
            />
          ) : view === 'atlas' ? (
            <AtlasView target={atlasTarget} onPresentationChange={setPresentationMode} />
          ) : view === 'exam' ? (
            <ExamView
              cardProgress={cardProgress}
              onRateCard={handleRateCard}
              studyLogBump={studyLogBump}
            />
          ) : view === 'cases' ? (
            activeCase ? (
              <CasePlayer
                clinicalCase={activeCase}
                progress={caseProgress[activeCase.id]}
                onProgress={(p) => handleCaseProgress(activeCase.id, p)}
                onBack={() => setActiveCaseId(null)}
              />
            ) : (
              <CasesView
                caseProgress={caseProgress}
                onOpenCase={(id) => setActiveCaseId(id)}
              />
            )
          ) : (
            <LibraryView
              resources={allResources}
              completed={completed}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
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
      <OnboardingModal
        open={onboardingOpen}
        initial={profile}
        onClose={closeOnboarding}
        onComplete={handleProfileComplete}
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
