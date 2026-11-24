import { Coffee, Pause, Play, RotateCcw, SkipForward, Timer } from 'lucide-react';
import { PomodoroApi, formatPomodoroTime } from '../../hooks/usePomodoro';

/**
 * Üst bardaki kompakt Pomodoro zamanlayıcı widget'ı (25/5 dk).
 */
export function PomodoroTimer({ pomodoro }: { pomodoro: PomodoroApi }) {
  const { mode, secondsLeft, running, progress, toggle, reset, skip } = pomodoro;
  const isWork = mode === 'work';
  const accent = isWork ? 'text-accent' : 'text-azure';

  return (
    <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-2.5 py-1.5">
      {/* İnce ilerleme halkası */}
      <div className="relative h-8 w-8">
        <svg className="h-8 w-8 -rotate-90" viewBox="0 0 32 32" aria-hidden>
          <circle cx="16" cy="16" r="13" fill="none" stroke="rgb(var(--c-line))" strokeWidth="3" />
          <circle
            cx="16"
            cy="16"
            r="13"
            fill="none"
            stroke={isWork ? 'rgb(var(--c-accent))' : 'rgb(var(--c-azure))'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 13}`}
            strokeDashoffset={`${2 * Math.PI * 13 * (1 - progress)}`}
            style={{ transition: 'stroke-dashoffset 0.5s linear' }}
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center ${accent}`}>
          {isWork ? <Timer size={13} /> : <Coffee size={13} />}
        </span>
      </div>

      <div className="flex flex-col leading-tight">
        <span className={`font-mono text-sm font-semibold tabular-nums ${accent}`}>
          {formatPomodoroTime(secondsLeft)}
        </span>
        <span className="text-[9px] font-medium uppercase tracking-wider text-faint">
          {isWork ? 'Odaklanma' : 'Mola'} · 25/5
        </span>
      </div>

      <div className="ml-1 flex items-center gap-0.5">
        <button
          type="button"
          onClick={toggle}
          aria-label={running ? 'Duraklat' : 'Başlat'}
          title={running ? 'Duraklat' : 'Başlat'}
          className={`rounded-lg p-1.5 transition hover:bg-surface2 ${running ? 'text-fg' : accent}`}
        >
          {running ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button
          type="button"
          onClick={skip}
          aria-label="Faz atla"
          title="Faz atla"
          className="rounded-lg p-1.5 text-faint transition hover:bg-surface2 hover:text-fg"
        >
          <SkipForward size={14} />
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="Sıfırla"
          title="Sıfırla"
          className="rounded-lg p-1.5 text-faint transition hover:bg-surface2 hover:text-fg"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
}
