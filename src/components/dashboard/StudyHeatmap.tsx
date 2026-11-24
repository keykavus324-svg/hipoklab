import { useMemo } from 'react';

interface StudyHeatmapProps {
  /** YYYY-MM-DD -> dakika */
  studyLog: Record<string, number>;
  weeks?: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Son N haftalık çalışma dakikalarını gösteren ısı haritası.
 * Koyu teal tonları = daha çok çalışma.
 */
export function StudyHeatmap({ studyLog, weeks = 14 }: StudyHeatmapProps) {
  const { days, streak, todayMinutes, weekMinutes } = useMemo(() => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const totalDays = weeks * 7;
    const dayList: { key: string; minutes: number; date: Date }[] = [];

    // Pazartesi başlangıçlı hizalama
    const dayOfWeek = (today.getDay() + 6) % 7; // Pzt=0
    const start = new Date(today.getTime() - (totalDays - 1 - dayOfWeek) * DAY_MS);

    for (let i = 0; i < totalDays; i += 1) {
      const d = new Date(start.getTime() + i * DAY_MS);
      const key = dateKey(d);
      dayList.push({ key, minutes: studyLog[key] ?? 0, date: d });
    }

    // Seri (streak): bugünden geriye doğru ardışık aktif günler
    let streakCount = 0;
    const cursor = new Date(today);
    for (;;) {
      const key = dateKey(cursor);
      const hasActivity = (studyLog[key] ?? 0) > 0;
      if (!hasActivity) {
        if (dateKey(cursor) === dateKey(today)) {
          cursor.setTime(cursor.getTime() - DAY_MS);
          continue;
        }
        break;
      }
      streakCount += 1;
      cursor.setTime(cursor.getTime() - DAY_MS);
    }

    const todayMinutes = studyLog[dateKey(today)] ?? 0;
    let weekMinutes = 0;
    for (let i = 0; i < 7; i += 1) {
      const d = new Date(today.getTime() - i * DAY_MS);
      weekMinutes += studyLog[dateKey(d)] ?? 0;
    }

    return { days: dayList, streak: streakCount, todayMinutes, weekMinutes };
  }, [studyLog, weeks]);

  const maxMinutes = Math.max(...days.map((d) => d.minutes), 30);
  const colorFor = (minutes: number) => {
    if (minutes <= 0) return 'bg-surface2';
    const ratio = Math.min(minutes / maxMinutes, 1);
    if (ratio < 0.25) return 'bg-accent/25';
    if (ratio < 0.5) return 'bg-accent/45';
    if (ratio < 0.75) return 'bg-accent/70';
    return 'bg-accent';
  };

  // Haftalık sütunlara böl
  const columns: { key: string; minutes: number; date: Date }[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    columns.push(days.slice(i, i + 7));
  }

  const monthLabels = useMemo(() => {
    const labels: { index: number; text: string }[] = [];
    let lastMonth = -1;
    columns.forEach((col, i) => {
      const m = col[0].date.getMonth();
      if (m !== lastMonth) {
        labels.push({ index: i, text: col[0].date.toLocaleDateString('tr-TR', { month: 'short' }) });
        lastMonth = m;
      }
    });
    return labels;
  }, [columns]);

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-panel">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-wider text-fg">Çalışma Ritmi</h3>
          <p className="mt-1 text-[11px] text-faint">
            Son {weeks} hafta · pomodoro, okuma ve flashcard oturumları
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <div>
            <p className="text-faint">Günlük seri</p>
            <p className="text-[15px] font-semibold text-gold">{streak} gün</p>
          </div>
          <div>
            <p className="text-faint">Bugün</p>
            <p className="text-[15px] font-semibold text-accent">{todayMinutes} dk</p>
          </div>
          <div>
            <p className="text-faint">Bu hafta</p>
            <p className="text-[15px] font-semibold text-azure">{weekMinutes} dk</p>
          </div>
        </div>
      </div>

      {/* Isı haritası */}
      <div className="mt-4 overflow-x-auto pb-1">
        <div className="inline-block">
          <div className="relative">
            {/* Ay etiketleri — kolon pikselleriyle hizalı (13px hücre + 3px aralık) */}
            <div className="mb-1 ml-[33px] h-3">
              {monthLabels.map((m) => (
                <span
                  key={`${m.index}-${m.text}`}
                  className="absolute text-[8.5px] font-medium uppercase tracking-wider text-faint"
                  style={{ left: 33 + m.index * 16 }}
                >
                  {m.text}
                </span>
              ))}
            </div>
            <div className="flex gap-[3px]">
              {/* Gün etiketleri — 7 satır (Pzt=0, Çar=2, Cum=4) */}
              <div className="mr-1 grid w-[28px] grid-rows-7 gap-[3px]">
                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((d, i) => (
                  <span key={d} className="h-[13px] text-[8px] leading-[13px] text-faint">
                    {i % 2 === 0 ? d : ''}
                  </span>
                ))}
              </div>
              {columns.map((col, ci) => (
                <div key={ci} className="flex flex-col gap-[3px]">
                  {col.map((day) => (
                    <div
                      key={day.key}
                      title={`${day.date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} · ${day.minutes} dk`}
                      className={`h-[13px] w-[13px] rounded-[3px] transition hover:ring-1 hover:ring-accent/60 ${colorFor(day.minutes)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Açıklama */}
      <div className="mt-3 flex items-center gap-1.5 text-[9px] text-faint">
        <span>Az</span>
        <span className="h-[10px] w-[10px] rounded-[2px] bg-surface2" />
        <span className="h-[10px] w-[10px] rounded-[2px] bg-accent/25" />
        <span className="h-[10px] w-[10px] rounded-[2px] bg-accent/45" />
        <span className="h-[10px] w-[10px] rounded-[2px] bg-accent/70" />
        <span className="h-[10px] w-[10px] rounded-[2px] bg-accent" />
        <span>Çok</span>
      </div>
    </div>
  );
}
