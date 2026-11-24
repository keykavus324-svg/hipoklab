import {
  ArrowRight,
  BookOpen,
  Brain,
  CalendarClock,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Flame,
  ListChecks,
  Pencil,
  RefreshCw,
  Rocket,
  Sparkles,
  Stethoscope as StethoscopeIcon,
  Target,
  Timer,
  TrendingUp,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  ALL_COMMITTEES_LABEL,
  COMMITTEES,
  HIGH_YIELD_SPOTS,
  excerpt,
} from '../../data/libraryData';
import { buildDailyMissions, buildWeeklyPlan, daysUntil, todayISO } from '../../data/studyPlan';
import type {
  CardProgress,
  CaseProgress,
  LibraryResource,
  MissionLog,
  UserProfile,
} from '../../types/hipoklab';
import { RichText } from '../common/Markdown';
import { StudyHeatmap } from './StudyHeatmap';

interface DashboardProps {
  resources: LibraryResource[];
  completed: Record<string, number>;
  lastRead: { id: string; at: number } | null;
  activeCommittee: string;
  dailyGoal: number;
  studyLog: Record<string, number>;
  cardProgress: Record<string, CardProgress>;
  caseProgress: Record<string, CaseProgress>;
  missionLog: MissionLog;
  profile: UserProfile | null;
  dueCardCount: number;
  onToggleMission: (dateISO: string, missionId: string) => void;
  onOpenProfile: () => void;
  onOpenResource: (id: string) => void;
  onNavigateLibrary: () => void;
  onOpenExam: () => void;
  onOpenCases: (caseId?: string) => void;
}

const MISSION_ICONS: Record<string, typeof Brain> = {
  review: RefreshCw,
  case: StethoscopeIcon,
  read: BookOpen,
  focus: Timer,
};

const DAY_LABELS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const MONTH_LABELS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function Dashboard({
  resources,
  completed,
  lastRead,
  activeCommittee,
  dailyGoal,
  studyLog,
  cardProgress,
  caseProgress,
  missionLog,
  profile,
  dueCardCount,
  onToggleMission,
  onOpenProfile,
  onOpenResource,
  onNavigateLibrary,
  onOpenExam,
  onOpenCases,
}: DashboardProps) {
  // Her yüklemede rastgele bir spot — "Yenile" ile yeniden çekilir
  const [spotIndex, setSpotIndex] = useState(() => Math.floor(Math.random() * HIGH_YIELD_SPOTS.length));
  const spot = HIGH_YIELD_SPOTS[spotIndex % HIGH_YIELD_SPOTS.length];

  const now = new Date();
  const dateLabel = `${now.getDate()} ${MONTH_LABELS[now.getMonth()]} ${now.getFullYear()}, ${DAY_LABELS[now.getDay()]}`;

  /* Kişisel plan: günlük görevler + haftalık program + geri sayım */
  const isoToday = todayISO();
  const missions = useMemo(
    () =>
      buildDailyMissions(
        {
          now: Date.now(),
          profile,
          resources,
          completed,
          cardProgress,
          caseProgress,
          studyLog,
          missionLog,
          dueCardCount,
        },
        isoToday,
      ),
    [profile, resources, completed, cardProgress, caseProgress, studyLog, missionLog, dueCardCount, isoToday],
  );
  const weeklyPlan = useMemo(
    () => buildWeeklyPlan({ profile, resources, completed }, isoToday),
    [profile, resources, completed, isoToday],
  );
  const missionsDone = missions.filter((m) => m.done).length;
  const examLeft = profile ? daysUntil(profile.examDate) : 0;
  const preparedness = useMemo(() => {
    const total = resources.length;
    const done = resources.filter((r) => completed[r.id] !== undefined).length;
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }, [resources, completed]);

  const stats = useMemo(() => {
    const total = resources.length;
    const done = Object.keys(completed).filter((id) => resources.some((r) => r.id === id)).length;
    const todayStart = startOfDay(Date.now());
    const doneToday = Object.values(completed).filter((ts) => ts >= todayStart).length;
    // Son 7 günün okuma/ tamamlama sayısı (seri tahmini)
    const weekAgo = todayStart - 6 * 24 * 60 * 60 * 1000;
    const doneThisWeek = Object.values(completed).filter((ts) => ts >= weekAgo).length;
    return {
      total,
      done,
      doneToday,
      doneThisWeek,
      percent: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  }, [resources, completed]);

  const committeeProgress = useMemo(() => {
    return COMMITTEES.map((committee) => {
      const items = resources.filter((r) => r.committee === committee);
      const done = items.filter((r) => completed[r.id] !== undefined).length;
      return {
        committee,
        total: items.length,
        done,
        percent: items.length > 0 ? Math.round((done / items.length) * 100) : 0,
      };
    }).filter((c) => c.total > 0 || activeCommittee === ALL_COMMITTEES_LABEL || activeCommittee === c.committee);
  }, [resources, completed, activeCommittee]);

  const lastResource = useMemo(() => {
    if (lastRead) {
      const found = resources.find((r) => r.id === lastRead.id);
      if (found) return found;
    }
    return resources[0] ?? null;
  }, [resources, lastRead]);

  // Günlük ilerleme halkası
  const dailyPercent = Math.min(100, Math.round((stats.doneToday / dailyGoal) * 100));
  const circumference = 2 * Math.PI * 42;

  return (
    <div className="mx-auto max-w-6xl animate-fade-in px-5 pb-12 pt-6">
      {/* Sınav geri sayımı / kişisel plan */}
      {profile ? (
        <div className="relative mb-4 overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/[0.10] via-surface to-azure/[0.07] p-6 shadow-panel">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-accent">
                <CalendarDays size={12} /> {dateLabel}
              </p>
              <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-fg">
                {profile.name ? `Merhaba ${profile.name}, ` : 'Merhaba, '}
                <span className="text-accent">{profile.examLabel}</span> yaklaşıyor.
              </h2>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-[52px] font-semibold leading-none tracking-tight text-fg tabular-nums">
                  {examLeft}
                </span>
                <span className="pb-1.5 text-sm text-sub">
                  gün kaldı
                  <span className="ml-2 text-faint">
                    · {new Date(`${profile.examDate}T12:00:00`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                  </span>
                </span>
              </div>
              <p className="mt-2 max-w-lg text-[12.5px] leading-relaxed text-sub">
                Bugünün görevlerini tamamla, haftalık plana sadık kal —{' '}
                <span className="font-medium text-fg">istikrar, sınav haftasının en güçlü stratejisidir.</span>
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              {/* Hazırlık göstergesi */}
              <div className="relative h-[104px] w-[104px]">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(var(--c-line))" strokeWidth="9" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="rgb(var(--c-accent))"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={2 * Math.PI * 42 * (1 - preparedness / 100)}
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-semibold tabular-nums text-fg">%{preparedness}</span>
                  <span className="text-[8.5px] uppercase tracking-wider text-faint">hazırlık</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 rounded-xl border border-line bg-surface2 px-3.5 py-2 text-[11px] font-medium text-sub transition hover:border-accent/40 hover:text-accent"
              >
                <Pencil size={12} /> Planı Düzenle
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-accent/45 bg-accent/[0.06] p-6">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/35 bg-accent/15 text-accent">
              <Rocket size={20} />
            </span>
            <div>
              <p className="text-[14px] font-semibold text-fg">Kişisel çalışma planını oluştur</p>
              <p className="mt-0.5 text-[12px] text-sub">
                Sınav tarihinizi girin — HipokLab kalan konuları günlere yaysın, her gün ne çalışacağınızı söylesin.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-[13px] font-semibold text-[#04211d] shadow-glow-accent transition hover:brightness-110"
          >
            <Rocket size={15} /> Planımı Oluştur
          </button>
        </div>
      )}

      {/* Bugünün görevleri + haftalık plan */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Günlük görevler */}
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-panel lg:col-span-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-fg">
                <ListChecks size={13} className="text-accent" /> Bugünün Görevleri
              </h3>
              <p className="mt-1 text-[11px] text-faint">
                {missionsDone}/{missions.length} tamamlandı · her görev ilerlemeni otomatik izler
              </p>
            </div>
            <div className="flex items-center gap-1">
              {missions.map((m) => (
                <span
                  key={m.id}
                  className={`h-2 w-2 rounded-full transition ${m.done ? 'bg-accent' : 'bg-surface2'}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            {missions.map((m) => {
              const Icon = MISSION_ICONS[m.kind] ?? Target;
              return (
                <div
                  key={m.id}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 transition ${
                    m.done
                      ? 'border-accent/35 bg-accent/[0.07]'
                      : 'border-line bg-surface2/50 hover:border-accent/30'
                  }`}
                >
                  {/* İşaretleme */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!m.autoDone) onToggleMission(isoToday, m.id);
                    }}
                    disabled={m.autoDone}
                    title={m.autoDone ? 'Bu görev ilerlemenizle otomatik tamamlandı' : 'Görevi işaretle'}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition ${
                      m.done
                        ? 'border-accent bg-accent text-[#04211d]'
                        : m.autoDone
                          ? 'border-line text-faint opacity-50'
                          : 'border-line text-transparent hover:border-accent/50'
                    }`}
                  >
                    <Check size={13} strokeWidth={3} />
                  </button>

                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                      m.done ? 'border-accent/30 bg-accent/12 text-accent' : 'border-line bg-surface text-faint'
                    }`}
                  >
                    <Icon size={15} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className={`text-[12px] font-semibold ${m.done ? 'text-accent' : 'text-fg'}`}>
                      {m.title}
                    </p>
                    <p className="truncate text-[10.5px] text-faint">{m.detail}</p>
                  </div>

                  <span className="shrink-0 rounded-md border border-line bg-surface px-1.5 py-0.5 text-[9px] font-medium text-faint tabular-nums">
                    ~{m.minutes} dk
                  </span>

                  {m.action !== 'none' ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (m.action === 'exam') onOpenExam();
                        else if (m.action === 'case') onOpenCases(m.actionTargetId);
                        else if (m.action === 'resource' && m.actionTargetId) onOpenResource(m.actionTargetId);
                      }}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-line text-faint transition hover:border-accent/45 hover:text-accent"
                      title="Göreve başla"
                    >
                      <ArrowRight size={13} />
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Haftalık plan */}
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-panel lg:col-span-2">
          <h3 className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-fg">
            <CalendarClock size={13} className="text-azure" /> Bu Haftanın Planı
          </h3>
          <p className="mt-1 text-[11px] text-faint">
            {profile ? `${profile.examLabel} tarihine göre otomatik dağıtıldı` : 'Profil oluşturunca sınav tarihine göre planlanır'}
          </p>

          <div className="mt-3.5 space-y-1.5">
            {weeklyPlan.map((d) => (
              <div
                key={d.dateISO}
                className={`rounded-xl border px-3.5 py-2.5 transition ${
                  d.isToday
                    ? 'border-accent/40 bg-accent/[0.08]'
                    : 'border-line/70 bg-surface2/40 hover:border-line'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className={`text-[10.5px] font-semibold uppercase tracking-wider ${d.isToday ? 'text-accent' : 'text-faint'}`}>
                    {d.label}
                  </p>
                  {d.isToday ? (
                    <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-accent">
                      bugün
                    </span>
                  ) : null}
                </div>
                <ul className="mt-1 space-y-0.5">
                  {d.items.map((item, i) => (
                    <li key={i} className="truncate text-[11px] leading-relaxed text-sub">
                      · {item}
                    </li>
                  ))}
                </ul>
                {d.reviewNote ? (
                  <p className="mt-1 text-[9.5px] font-medium text-gold">↻ {d.reviewNote}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Üst istatistik satırı */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Günlük ilerleme */}
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-panel">
          <div className="flex items-center gap-4">
            <div className="relative h-[92px] w-[92px] shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(var(--c-line))" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgb(var(--c-accent))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - dailyPercent / 100)}
                  style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-semibold tabular-nums text-fg">{dailyPercent}%</span>
                <span className="text-[9px] uppercase tracking-wider text-faint">bugün</span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-faint">
                Günlük İlerleme
              </p>
              <p className="mt-1 text-sm font-medium text-fg">
                {stats.doneToday} / {dailyGoal} konu
              </p>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-sub">
                <Flame size={12} className="text-gold" /> Bu hafta {stats.doneThisWeek} konu
              </p>
            </div>
          </div>
        </div>

        {/* Tamamlanan konu yüzdesi */}
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-panel">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-faint">
                Toplam Müfredat
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-fg">%{stats.percent}</p>
              <p className="mt-1 text-sm text-sub">
                {stats.done} / {stats.total} kaynak tamamlandı
              </p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
              <Target size={16} />
            </span>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-azure transition-all duration-500"
              style={{ width: `${stats.percent}%` }}
            />
          </div>
        </div>

        {/* Bu hafta */}
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-panel">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-faint">
                Haftalık Ritim
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-fg">{stats.doneThisWeek}</p>
              <p className="mt-1 text-sm text-sub">son 7 günde tamamlanan konu</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-azure/30 bg-azure/10 text-azure">
              <TrendingUp size={16} />
            </span>
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-faint">
            Düzenli tekrar, unutma eğrisini (Ebbinghaus) düzleştirir ve kalıcı öğrenmeyi destekler.
          </p>
        </div>

        {/* Kalan konu */}
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-panel">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-faint">
                Sıradaki Adım
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-fg">
                {Math.max(stats.total - stats.done, 0)}
              </p>
              <p className="mt-1 text-sm text-sub">kayıt seni bekliyor</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
              <BookOpen size={16} />
            </span>
          </div>
          <button
            type="button"
            onClick={onNavigateLibrary}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-line bg-surface2 py-2 text-xs font-medium text-sub transition hover:border-accent/40 hover:text-accent"
          >
            Kütüphaneye Git <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Orta satır: Kaldığın yerden devam + High-yield spot */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Kaldığın Yerden Devam Et */}
        <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-panel lg:col-span-3">
          <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-accent/10 blur-3xl" />
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
            <Clock size={12} /> Kaldığın Yerden Devam Et
          </p>
          {lastResource ? (
            <>
              <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-fg">
                {lastResource.title}
              </h3>
              <p className="mt-1 text-xs font-medium text-faint">
                {lastResource.course} · {lastResource.committee}
              </p>
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-sub">
                {excerpt(lastResource, 180)}
              </p>
              <div className="mt-5 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onOpenResource(lastResource.id)}
                  className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-[13px] font-semibold text-[#04211d] transition hover:brightness-110 active:scale-[0.98]"
                >
                  Okumaya Başla <ArrowRight size={15} />
                </button>
                {lastRead ? (
                  <span className="text-[11px] text-faint">
                    Son okuma: {new Date(lastRead.at).toLocaleString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                ) : null}
              </div>
            </>
          ) : (
            <p className="mt-3 text-sm text-sub">Kütüphaneden bir kaynak seçerek başlayın.</p>
          )}
        </div>

        {/* Yüksek Verimli Klinik Spot */}
        <div className="relative overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/[0.09] via-surface to-azure/[0.07] p-6 shadow-panel lg:col-span-2">
          <div className="flex items-start justify-between">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
              <Sparkles size={12} /> Yüksek Verimli Klinik Spot
            </p>
            <button
              type="button"
              onClick={() => setSpotIndex((i) => (i + 1 + Math.floor(Math.random() * 3)) % HIGH_YIELD_SPOTS.length)}
              className="rounded-lg border border-line/70 p-1.5 text-faint transition hover:border-accent/40 hover:text-accent"
              title="Yeni spot getir"
              aria-label="Yeni spot getir"
            >
              <RefreshCw size={13} />
            </button>
          </div>
          <p className="mt-4 text-[13.5px] leading-relaxed text-fg/90">
            <RichText text={spot.text} />
          </p>
          <div className="mt-5 flex items-center gap-2">
            <span className="rounded-md border border-accent/30 bg-accent/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent">
              {spot.tag}
            </span>
            <span className="truncate text-[11px] text-faint">{spot.source}</span>
          </div>
        </div>
      </div>

      {/* Çalışma ritmi + kart istatistikleri */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <StudyHeatmap studyLog={studyLog} weeks={14} />
        </div>

        {/* Kart / tekrar istatistikleri */}
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-panel lg:col-span-2">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
            <Target size={12} /> Flashcard Durumu
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-line bg-surface2/50 p-3">
              <p className="text-[9.5px] font-semibold uppercase tracking-wider text-faint">Toplam Kart</p>
              <p className="mt-1 text-[16px] font-semibold text-fg">{Object.keys(cardProgress).length}</p>
            </div>
            <div className="rounded-xl border border-line bg-surface2/50 p-3">
              <p className="text-[9.5px] font-semibold uppercase tracking-wider text-faint">Ustalaşılan</p>
              <p className="mt-1 text-[16px] font-semibold text-accent">
                {Object.values(cardProgress).filter((p) => p.interval >= 21).length}
              </p>
            </div>
          </div>

          {/* Tekrar bekleyen kartlar */}
          <button
            type="button"
            onClick={onOpenExam}
            className="mt-3 flex w-full items-center gap-3 rounded-xl border border-line bg-surface2/60 p-3.5 text-left transition hover:border-accent/40"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-azure/30 bg-azure/12 text-azure">
              <RefreshCw size={17} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-fg">
                {dueCardCount > 0 ? `${dueCardCount} flashcard tekrar bekliyor` : 'Tekrar bekleyen kart yok'}
              </p>
              <p className="text-[10px] text-faint">
                {dueCardCount > 0
                  ? 'Aralıklı tekrar takviminize göre bugünün kartları hazır'
                  : 'Yeni bir oturumla kartlarınızı pekiştirebilirsiniz'}
              </p>
            </div>
            <ArrowRight size={15} className="shrink-0 text-faint" />
          </button>

          {/* Klinik vaka CTA */}
          <button
            type="button"
            onClick={() => onOpenCases()}
            className="mt-2.5 flex w-full items-center gap-3 rounded-xl border border-line bg-surface2/60 p-3.5 text-left transition hover:border-accent/40"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-danger/30 bg-danger/12 text-danger">
              <StethoscopeIcon size={17} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-fg">Bir klinik vaka çöz</p>
              <p className="text-[10px] text-faint">Anamnezden tedaviye adım adım karar verme pratiği</p>
            </div>
            <ArrowRight size={15} className="shrink-0 text-faint" />
          </button>
        </div>
      </div>

      {/* Komite ilerleme çubukları */}
      <div className="mt-4 rounded-2xl border border-line bg-surface p-6 shadow-panel">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-fg">
              Komite Bazlı İlerleme
            </h3>
            <p className="mt-1 text-xs text-faint">
              Kurul programına göre tamamlanan kaynakların dağılımı
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateLibrary}
            className="flex items-center gap-1.5 rounded-xl border border-line bg-surface2 px-3.5 py-2 text-xs font-medium text-sub transition hover:border-accent/40 hover:text-accent"
          >
            Tüm Kaynaklar <ArrowRight size={13} />
          </button>
        </div>
        <div className="mt-5 space-y-4">
          {committeeProgress.map((item) => (
            <div key={item.committee}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-sub">{item.committee}</span>
                <span className="tabular-nums text-faint">
                  {item.done}/{item.total} · %{item.percent}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.percent >= 100
                      ? 'bg-accent'
                      : 'bg-gradient-to-r from-accent/80 to-azure/80'
                  }`}
                  style={{ width: `${Math.max(item.percent, item.total > 0 ? 3 : 0)}%` }}
                />
              </div>
            </div>
          ))}
          {committeeProgress.length === 0 ? (
            <p className="text-sm text-faint">Seçili komite için henüz kaynak yok.</p>
          ) : null}
        </div>
      </div>

      {/* Hızlı erişim: tamamlananlar / önerilen */}
      <div className="mt-4 rounded-2xl border border-line bg-surface p-6 shadow-panel">
        <h3 className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-fg">
          <CheckCircle2 size={14} className="text-accent" /> Hızlı Erişim — Öne Çıkan Kaynaklar
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {resources.slice(0, 3).map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onOpenResource(r.id)}
              className="group rounded-xl border border-line bg-surface2/50 p-4 text-left transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-panel"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md border border-line bg-surface px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-faint">
                  {r.course}
                </span>
                {completed[r.id] ? (
                  <CheckCircle2 size={14} className="text-accent" />
                ) : (
                  <ArrowRight size={14} className="text-faint transition group-hover:translate-x-0.5 group-hover:text-accent" />
                )}
              </div>
              <p className="mt-2.5 line-clamp-2 text-[13px] font-medium leading-snug text-fg">
                {r.title}
              </p>
              <p className="mt-1.5 line-clamp-1 text-[11px] text-faint">{r.subtitle}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
