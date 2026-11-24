import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  Flame,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  ALL_COMMITTEES_LABEL,
  COMMITTEES,
  HIGH_YIELD_SPOTS,
  excerpt,
} from '../../data/libraryData';
import type { LibraryResource } from '../../types/hipoklab';
import { RichText } from '../common/Markdown';

interface DashboardProps {
  resources: LibraryResource[];
  completed: Record<string, number>;
  lastRead: { id: string; at: number } | null;
  activeCommittee: string;
  dailyGoal: number;
  onOpenResource: (id: string) => void;
  onNavigateLibrary: () => void;
}

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
  onOpenResource,
  onNavigateLibrary,
}: DashboardProps) {
  // Her yüklemede rastgele bir spot — "Yenile" ile yeniden çekilir
  const [spotIndex, setSpotIndex] = useState(() => Math.floor(Math.random() * HIGH_YIELD_SPOTS.length));
  const spot = HIGH_YIELD_SPOTS[spotIndex % HIGH_YIELD_SPOTS.length];

  const now = new Date();
  const dateLabel = `${now.getDate()} ${MONTH_LABELS[now.getMonth()]} ${now.getFullYear()}, ${DAY_LABELS[now.getDay()]}`;

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
      {/* Karşılama */}
      <div className="mb-6">
        <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-accent">
          <CalendarDays size={12} /> {dateLabel}
        </p>
        <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-fg">
          Merhaba, çalışmaya kaldığın yerden devam edelim.
        </h2>
        <p className="mt-1 text-sm text-sub">
          Bugün {stats.doneToday} konu tamamladın — hedefin {dailyGoal} konu. İstikrar, sınav haftasının
          en güçlü stratejisidir.
        </p>
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
