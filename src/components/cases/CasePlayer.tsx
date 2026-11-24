import {
  ArrowLeft,
  ArrowRight,
  Award,
  Beaker,
  Check,
  CheckCircle2,
  ClipboardList,
  HeartPulse,
  Lightbulb,
  ListChecks,
  Stethoscope,
  Syringe,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CaseProgress, CaseStep, ClinicalCase } from '../../types/hipoklab';

interface CasePlayerProps {
  clinicalCase: ClinicalCase;
  progress: CaseProgress | undefined;
  onProgress: (progress: CaseProgress) => void;
  onBack: () => void;
}

const STEP_ICONS: Record<CaseStep['kind'], typeof Stethoscope> = {
  anamnesis: ClipboardList,
  examination: Stethoscope,
  labs: Beaker,
  question: ListChecks,
  diagnosis: HeartPulse,
  treatment: Syringe,
  discussion: Lightbulb,
};

const STEP_LABELS: Record<CaseStep['kind'], string> = {
  anamnesis: 'Anamnez',
  examination: 'Fizik Muayene',
  labs: 'Tetkikler',
  question: 'Karar Soruları',
  diagnosis: 'Tanı',
  treatment: 'Tedavi',
  discussion: 'Tartışma',
};

/**
 * Adım adım klinik vaka oynatıcısı.
 */
export function CasePlayer({ clinicalCase, progress, onProgress, onBack }: CasePlayerProps) {
  const [stepIndex, setStepIndex] = useState(progress?.stepIndex ?? 0);
  const [answers, setAnswers] = useState<Record<string, number>>(progress?.answers ?? {});
  const [revealFor, setRevealFor] = useState<string | null>(null);

  const steps = clinicalCase.steps;
  const step = steps[stepIndex] ?? null;
  const isLast = stepIndex >= steps.length - 1;
  const allAnswered = useMemo(() => {
    const questionIds = steps.flatMap((s) => (s.questions ?? []).map((q) => q.id));
    return questionIds.every((id) => answers[id] !== undefined);
  }, [steps, answers]);

  // İlerlemeyi anında kaydet
  useEffect(() => {
    onProgress({
      stepIndex,
      answers,
      completed: progress?.completed ?? false,
      completedAt: progress?.completedAt ?? null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, answers]);

  const handleAnswer = useCallback((questionId: string, chosen: number) => {
    setAnswers((prev) => (prev[questionId] !== undefined ? prev : { ...prev, [questionId]: chosen }));
    setRevealFor(questionId);
  }, []);

  const handleFinish = useCallback(() => {
    onProgress({ stepIndex, answers, completed: true, completedAt: Date.now() });
    setStepIndex(steps.length); // bitiş ekranı
  }, [onProgress, stepIndex, answers, steps.length]);

  /* ------------------------- Bitiş ekranı ------------------------- */
  if (stepIndex >= steps.length) {
    const questionIds = steps.flatMap((s) => (s.questions ?? []).map((q) => q.id));
    const correct = questionIds.filter((id) => {
      const q = steps.flatMap((s) => s.questions ?? []).find((qq) => qq.id === id);
      return q && answers[id] === q.correctIndex;
    }).length;
    const score = questionIds.length > 0 ? Math.round((correct / questionIds.length) * 100) : 100;

    return (
      <div className="mx-auto max-w-2xl animate-fade-in px-5 pb-12 pt-12">
        <div className="rounded-2xl border border-line bg-surface p-8 text-center shadow-float">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/40 bg-accent/15 text-accent">
            <Award size={30} />
          </span>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-fg">Vaka Tamamlandı</h2>
          <p className="mt-2 text-sm text-sub">
            {clinicalCase.title} — karar verme sürecini tamamladınız.
          </p>

          {questionIds.length > 0 ? (
            <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-4">
              <div className="rounded-2xl border border-line bg-surface2/60 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-faint">Doğru Karar</p>
                <p className="mt-1.5 text-2xl font-semibold text-accent">
                  {correct} / {questionIds.length}
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-surface2/60 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-faint">Başarı</p>
                <p className="mt-1.5 text-2xl font-semibold text-azure">%{score}</p>
              </div>
            </div>
          ) : null}

          {/* İnciler */}
          <div className="mt-7 rounded-2xl border border-gold/30 bg-gold/[0.07] p-5 text-left">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gold">
              <Lightbulb size={12} /> Klinik İnciler
            </p>
            <ul className="mt-2.5 space-y-2">
              {clinicalCase.pearls.map((p, i) => (
                <li key={i} className="flex gap-2 text-[12px] leading-relaxed text-fg/90">
                  <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-gold" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-7 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-[13px] font-semibold text-[#04211d] transition hover:brightness-110"
            >
              <ArrowLeft size={15} /> Vakalara Dön
            </button>
            <button
              type="button"
              onClick={() => {
                setStepIndex(0);
                setAnswers({});
                setRevealFor(null);
                onProgress({ stepIndex: 0, answers: {}, completed: false, completedAt: null });
              }}
              className="flex items-center gap-2 rounded-xl border border-line bg-surface2 px-5 py-2.5 text-[13px] font-medium text-sub transition hover:border-accent/40 hover:text-accent"
            >
              <ArrowRight size={15} /> Vakayı Baştan Oyna
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------- Adım görünümü ------------------------- */
  const StepIcon = step ? STEP_ICONS[step.kind] : ClipboardList;

  return (
    <div className="mx-auto max-w-3xl animate-fade-in px-5 pb-12 pt-5">
      {/* Üst çubuk */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[11px] font-medium text-sub transition hover:border-accent/40 hover:text-accent"
        >
          <ArrowLeft size={13} /> Vakalar
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold text-fg">{clinicalCase.title}</p>
          <p className="truncate text-[10px] text-faint">{clinicalCase.specialty}</p>
        </div>
      </div>

      {/* Adım göstergesi */}
      <div className="mt-4 flex items-center gap-1.5">
        {steps.map((s, i) => (
          <div key={s.id} className="flex-1">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i < stepIndex ? 'bg-accent' : i === stepIndex ? 'bg-gradient-to-r from-accent to-azure' : 'bg-surface2'
              }`}
            />
            <p
              className={`mt-1.5 hidden truncate text-[8.5px] font-medium uppercase tracking-wider sm:block ${
                i === stepIndex ? 'text-accent' : 'text-faint'
              }`}
            >
              {STEP_LABELS[s.kind]}
            </p>
          </div>
        ))}
      </div>

      {/* Adım kartı */}
      {step ? (
        <div className="mt-5 rounded-2xl border border-line bg-surface p-6 shadow-panel animate-slide-up">
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-accent">
            <StepIcon size={13} /> {STEP_LABELS[step.kind]}
          </p>
          <h3 className="mt-2 text-[17px] font-semibold tracking-tight text-fg">{step.title}</h3>

          {/* Paragraflar */}
          {(step.paragraphs ?? []).map((p, i) => (
            <p key={i} className="mt-3.5 text-[13px] leading-relaxed text-sub">
              {p}
            </p>
          ))}

          {/* Tetkik tablosu */}
          {step.table ? (
            <figure className="mt-5">
              {step.table.caption ? (
                <figcaption className="mb-2 text-[10px] font-medium text-faint">{step.table.caption}</figcaption>
              ) : null}
              <div className="overflow-x-auto rounded-xl border border-line">
                <table className="w-full border-collapse text-left text-[11.5px]">
                  <thead>
                    <tr>
                      {step.table.headers.map((h, i) => (
                        <th key={i} className="border-b border-line bg-surface2 px-3.5 py-2 font-semibold text-fg">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {step.table.rows.map((row, ri) => (
                      <tr key={ri} className="border-b border-line/60 last:border-0 hover:bg-surface2/50">
                        {row.map((cell, ci) => (
                          <td key={ci} className={`px-3.5 py-2 align-top ${ci === 0 ? 'font-medium text-fg' : 'text-sub'}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </figure>
          ) : null}

          {/* Vurgu kutuları */}
          {(step.highlights ?? []).map((hl, i) => (
            <div key={i} className="mt-4 rounded-xl border border-accent/30 bg-accent/[0.08] p-4">
              <p className="text-[9.5px] font-bold uppercase tracking-wider text-accent">{hl.label}</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-fg/90">{hl.text}</p>
            </div>
          ))}

          {/* Sorular */}
          {(step.questions ?? []).map((q) => {
            const chosen = answers[q.id];
            const revealed = chosen !== undefined;
            return (
              <div key={q.id} className="mt-5 rounded-xl border border-line bg-surface2/50 p-4">
                <p className="text-[12.5px] font-semibold leading-relaxed text-fg">{q.prompt}</p>
                <div className="mt-3 space-y-2">
                  {q.options.map((opt, i) => {
                    const isCorrect = i === q.correctIndex;
                    const isChosen = chosen === i;
                    let cls = 'border-line bg-surface text-sub hover:border-azure/40 hover:text-fg';
                    if (revealed) {
                      if (isCorrect) cls = 'border-accent/50 bg-accent/12 text-accent';
                      else if (isChosen) cls = 'border-danger/50 bg-danger/12 text-danger';
                      else cls = 'border-line bg-surface/50 text-faint opacity-70';
                    }
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={revealed}
                        onClick={() => handleAnswer(q.id, i)}
                        className={`flex w-full items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-[12px] transition ${cls}`}
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[9px] font-bold">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {revealed && isCorrect ? <Check size={14} /> : null}
                        {revealed && isChosen && !isCorrect ? <X size={14} /> : null}
                      </button>
                    );
                  })}
                </div>
                {revealFor === q.id && chosen !== undefined ? (
                  <div
                    className={`mt-3 rounded-lg border p-3 text-[11.5px] leading-relaxed ${
                      chosen === q.correctIndex
                        ? 'border-accent/35 bg-accent/[0.07] text-fg/90'
                        : 'border-gold/35 bg-gold/[0.07] text-fg/90'
                    }`}
                  >
                    <span className="font-semibold">
                      {chosen === q.correctIndex ? 'Doğru! ' : 'Doğrusu bu değildi. '}
                    </span>
                    {q.explanation}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Gezinme */}
      <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          disabled={stepIndex === 0}
          className="flex items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2.5 text-[12px] font-medium text-sub transition hover:border-accent/40 hover:text-accent disabled:opacity-40"
        >
          <ArrowLeft size={14} /> Önceki Adım
        </button>
        {isLast ? (
          <button
            type="button"
            onClick={handleFinish}
            disabled={
              (step?.questions ?? []).some((q) => answers[q.id] === undefined) ||
              (steps.some((s) => (s.questions ?? []).length > 0) && !allAnswered)
            }
            className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-[12.5px] font-semibold text-[#04211d] shadow-glow-accent transition hover:brightness-110 disabled:opacity-40"
          >
            <CheckCircle2 size={15} /> Vakayı Tamamla
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}
            disabled={(step?.questions ?? []).some((q) => answers[q.id] === undefined)}
            className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-[12.5px] font-semibold text-[#04211d] transition hover:brightness-110 disabled:opacity-40"
          >
            Sonraki Adım <ArrowRight size={15} />
          </button>
        )}
      </div>
      {(step?.questions ?? []).some((q) => answers[q.id] === undefined) ? (
        <p className="mt-2 text-right text-[10px] text-faint">
          Devam etmek için bu adımdaki soruları yanıtlayın.
        </p>
      ) : null}
    </div>
  );
}
