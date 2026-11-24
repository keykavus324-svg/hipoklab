/* ===========================================================================
   HipokLab — Kişisel Çalışma Planı Motoru
   Sınav tarihine göre günlük görevler ve haftalık çalışma planı üretir.
   Tüm fonksiyonlar deterministiktir: aynı gün, aynı veri → aynı plan.
   =========================================================================== */

import type {
  CardProgress,
  CaseProgress,
  LibraryResource,
  MissionLog,
  UserProfile,
} from '../types/hipoklab';
import { CLINICAL_CASES } from './clinicalCases';

const DAY_MS = 24 * 60 * 60 * 1000;

/* ---------------------------------------------------------------------------
   Tarih yardımcıları
--------------------------------------------------------------------------- */

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

/** Sınav tarihine kalan gün sayısı (bugün dahil). Geçtiyse 0. */
export function daysUntil(examDate: string): number {
  const exam = new Date(`${examDate}T23:59:59`);
  if (Number.isNaN(exam.getTime())) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((exam.getTime() - today.getTime()) / DAY_MS));
}

/** "Bugün" | "Yarın" | "26 Kasım Perşembe" */
export function dayLabel(dateISO: string): string {
  const d = new Date(`${dateISO}T12:00:00`);
  const today = todayISO();
  if (dateISO === today) return 'Bugün';
  const tomorrow = toISODate(new Date(Date.now() + DAY_MS));
  if (dateISO === tomorrow) return 'Yarın';
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });
}

function isSameDay(ts: number | null, dateISO: string): boolean {
  if (!ts) return false;
  return toISODate(new Date(ts)) === dateISO;
}

/* ---------------------------------------------------------------------------
   Günlük görevler (Bugünün Görevleri)
--------------------------------------------------------------------------- */

export interface DailyMission {
  id: string;
  kind: 'review' | 'case' | 'read' | 'focus';
  title: string;
  detail: string;
  minutes: number;
  /** Tek tıkla nereye gidileceği. */
  action: 'exam' | 'case' | 'resource' | 'none';
  actionTargetId?: string;
  done: boolean;
  /** Veriden otomatik tamamlandıysa elle işaretlenemez. */
  autoDone: boolean;
}

interface MissionArgs {
  now: number;
  profile: UserProfile | null;
  resources: LibraryResource[];
  completed: Record<string, number>;
  cardProgress: Record<string, CardProgress>;
  caseProgress: Record<string, CaseProgress>;
  studyLog: Record<string, number>;
  missionLog: MissionLog;
  dueCardCount: number;
}

/** Gün bazında deterministik örnekleme için gün sayısı. */
function dayNumber(dateISO: string): number {
  return Math.floor(new Date(`${dateISO}T12:00:00`).getTime() / DAY_MS);
}

export function buildDailyMissions(args: MissionArgs, dateISO: string): DailyMission[] {
  const { profile, resources, completed, cardProgress, caseProgress, studyLog, missionLog, dueCardCount } = args;
  const manualDone = missionLog[dateISO] ?? [];
  const isDone = (id: string, auto: boolean) => auto || manualDone.includes(id);

  const missions: DailyMission[] = [];

  /* 1. Flashcard tekrarı */
  const reviewedToday = Object.values(cardProgress).filter((p) => isSameDay(p.lastReviewed, dateISO)).length;
  const reviewTarget = dueCardCount > 0 ? Math.min(10, dueCardCount) : 10;
  const reviewAuto = reviewedToday >= reviewTarget;
  missions.push({
    id: 'mission-review',
    kind: 'review',
    title: 'Flashcard tekrarı',
    detail:
      dueCardCount > 0
        ? `${dueCardCount} kart tekrar bekliyor — bugünün hedefi ${reviewTarget} kart`
        : `Vadesi gelen kart yok — ${reviewTarget} yeni kartla unutma eğrisini besle`,
    minutes: Math.max(5, Math.round(reviewTarget * 0.8)),
    action: 'exam',
    done: isDone('mission-review', reviewAuto),
    autoDone: reviewAuto,
  });

  /* 2. Günün klinik vakası — tamamlanmamış vakalar arasında dönüşümlü */
  const incompleteCases = CLINICAL_CASES.filter((c) => !caseProgress[c.id]?.completed);
  const casePool = incompleteCases.length > 0 ? incompleteCases : CLINICAL_CASES;
  const pick = casePool[dayNumber(dateISO) % casePool.length];
  const caseAuto = isSameDay(caseProgress[pick.id]?.completedAt ?? null, dateISO);
  missions.push({
    id: `mission-case-${pick.id}`,
    kind: 'case',
    title: 'Günün klinik vakası',
    detail: `${pick.title} · ${pick.specialty} · ${pick.difficulty.toLowerCase()} zorluk`,
    minutes: pick.minutes,
    action: 'case',
    actionTargetId: pick.id,
    done: isDone(`mission-case-${pick.id}`, caseAuto),
    autoDone: caseAuto,
  });

  /* 3. Konu okuması — profil derslerine ve tamamlanmamış kaynaklara öncelik */
  const incomplete = resources.filter((r) => completed[r.id] === undefined);
  const priority = profile?.courses.length ? profile.courses : [];
  const pool = (incomplete.length > 0 ? incomplete : resources).slice().sort((a, b) => {
    const pa = priority.length ? priority.indexOf(a.course) : 0;
    const pb = priority.length ? priority.indexOf(b.course) : 0;
    if (pa !== pb) return (pa < 0 ? 99 : pa) - (pb < 0 ? 99 : pb);
    return a.minutes - b.minutes;
  });
  const readPicks = pool.slice(0, 2);
  const readAuto =
    readPicks.length > 0 && readPicks.every((r) => completed[r.id] !== undefined);
  const readMinutes = readPicks.reduce((s, r) => s + r.minutes, 0);
  missions.push({
    id: `mission-read-${readPicks.map((r) => r.id).join('-')}`,
    kind: 'read',
    title: readPicks.length > 1 ? 'Konu okuması (2 kaynak)' : 'Konu okuması',
    detail:
      readPicks.length > 0
        ? readPicks.map((r) => `${r.title} (${r.minutes} dk)`).join(' · ')
        : 'Kütüphane boş görünüyor — kendi notunu ekleyebilirsin',
    minutes: readMinutes,
    action: 'resource',
    actionTargetId: readPicks[0]?.id,
    done: isDone(`mission-read-${readPicks.map((r) => r.id).join('-')}`, readAuto),
    autoDone: readAuto,
  });

  /* 4. Günlük odak hedefi */
  const focusMinutes = profile?.dailyMinutes ?? 60;
  const studiedToday = studyLog[dateISO] ?? 0;
  const focusAuto = studiedToday >= focusMinutes;
  missions.push({
    id: 'mission-focus',
    kind: 'focus',
    title: 'Günlük odak hedefi',
    detail: `Bugün ${studiedToday}/${focusMinutes} dakika — pomodoro, okuma ve kart oturumları sayılır`,
    minutes: focusMinutes,
    action: 'none',
    done: isDone('mission-focus', focusAuto),
    autoDone: focusAuto,
  });

  return missions;
}

/* ---------------------------------------------------------------------------
   Haftalık plan — sınav tarihine kalan konuların günlere dağılımı
--------------------------------------------------------------------------- */

export interface PlanDay {
  dateISO: string;
  label: string;
  isToday: boolean;
  /** O günün konu başlıkları. */
  items: string[];
  /** Kart tekrarı hatırlatması. */
  reviewNote: string | null;
}

interface WeeklyArgs {
  profile: UserProfile | null;
  resources: LibraryResource[];
  completed: Record<string, number>;
}

/**
 * Kalan (tamamlanmamış) kaynakları sınav tarihine kadar günlere yayar.
 * Günde 1-3 konu; konular bitince tekrar günleri planlanır.
 */
export function buildWeeklyPlan(args: WeeklyArgs, dateISO: string, days = 7): PlanDay[] {
  const { profile, resources, completed } = args;

  const incomplete = resources.filter((r) => completed[r.id] === undefined);
  const priority = profile?.courses.length ? profile.courses : [];
  const pool = (incomplete.length > 0 ? incomplete : resources).slice().sort((a, b) => {
    const pa = priority.length ? priority.indexOf(a.course) : 0;
    const pb = priority.length ? priority.indexOf(b.course) : 0;
    if (pa !== pb) return (pa < 0 ? 99 : pa) - (pb < 0 ? 99 : pb);
    return 0;
  });

  const examLeft = profile ? daysUntil(profile.examDate) : days;
  const planDays = Math.max(1, Math.min(days, examLeft === 0 ? 1 : examLeft));
  const perDay = Math.max(1, Math.min(3, Math.ceil(pool.length / planDays)));

  const plan: PlanDay[] = [];
  let cursor = 0;
  for (let i = 0; i < days; i += 1) {
    const d = new Date(new Date(`${dateISO}T12:00:00`).getTime() + i * DAY_MS);
    const iso = toISODate(d);
    const slice = pool.slice(cursor, cursor + perDay);
    cursor += slice.length;

    const items =
      slice.length > 0
        ? slice.map((r) => `${r.title} · ${r.course}`)
        : i < planDays
          ? ['Esnek gün — zayıf konularını tekrar et']
          : ['Sınav sonrası tekrar planı'];
    const reviewNote =
      slice.length > 0 && slice.length < perDay
        ? 'Kalan sürede flashcard tekrarı yap'
        : slice.length === 0 && i < planDays
          ? 'Destelerden günde 10 kart tekrar et'
          : null;

    plan.push({ dateISO: iso, label: dayLabel(iso), isToday: i === 0, items, reviewNote });
  }
  return plan;
}
