import { ArrowRight, CheckCircle2, Clock, FileSearch, Stethoscope } from 'lucide-react';
import { CLINICAL_CASES } from '../../data/clinicalCases';
import type { CaseProgress, ClinicalCase } from '../../types/hipoklab';

interface CasesViewProps {
  caseProgress: Record<string, CaseProgress>;
  onOpenCase: (id: string) => void;
}

const DIFFICULTY_CLS: Record<ClinicalCase['difficulty'], string> = {
  Kolay: 'border-accent/30 bg-accent/10 text-accent',
  Orta: 'border-gold/30 bg-gold/10 text-gold',
  Zor: 'border-danger/30 bg-danger/10 text-danger',
};

/**
 * Klinik Vakalar — senaryo tabanlı karar verme modülü.
 */
export function CasesView({ caseProgress, onOpenCase }: CasesViewProps) {
  const completedCount = CLINICAL_CASES.filter((c) => caseProgress[c.id]?.completed).length;

  return (
    <div className="mx-auto max-w-6xl animate-fade-in px-5 pb-12 pt-6">
      {/* Başlık */}
      <div className="mb-6">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
          <Stethoscope size={12} /> Kanıta Dayalı Karar Verme
        </p>
        <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-fg">Klinik Vakalar</h2>
        <p className="mt-1 max-w-2xl text-sm text-sub">
          Gerçek klinik senaryoları adım adım yaşayın: anamnez → muayene → tetkikler → ayırıcı tanı →
          tedavi. Her adımda çoktan seçmeli sorularla karar verin, geri bildirimle pekiştirin.
        </p>
      </div>

      {/* İlerleme şeridi */}
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-panel">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/30 bg-accent/12 text-accent">
            <FileSearch size={18} />
          </span>
          <div>
            <p className="text-[12px] font-semibold text-fg">
              {completedCount} / {CLINICAL_CASES.length} vaka tamamlandı
            </p>
            <p className="text-[10px] text-faint">Her vaka ortalama 8-12 dakika sürer</p>
          </div>
        </div>
        <div className="ml-auto h-2 min-w-[180px] flex-1 overflow-hidden rounded-full bg-surface2 sm:max-w-xs">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-azure transition-all duration-500"
            style={{ width: `${(completedCount / CLINICAL_CASES.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Vaka kartları */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {CLINICAL_CASES.map((c) => {
          const progress = caseProgress[c.id];
          const done = progress?.completed ?? false;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onOpenCase(c.id)}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface p-6 text-left shadow-panel transition duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-float"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`rounded-md border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${DIFFICULTY_CLS[c.difficulty]}`}>
                    {c.difficulty}
                  </span>
                  <span className="rounded-md border border-line bg-surface2 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-faint">
                    {c.specialty}
                  </span>
                  {done ? (
                    <span className="flex items-center gap-1 rounded-md border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-accent">
                      <CheckCircle2 size={10} /> Tamamlandı
                    </span>
                  ) : null}
                </div>
                <span className="flex items-center gap-1 shrink-0 text-[10px] text-faint">
                  <Clock size={11} /> {c.minutes} dk
                </span>
              </div>

              <h3 className="mt-3 text-[15px] font-semibold leading-snug tracking-tight text-fg transition group-hover:text-accent">
                {c.title}
              </h3>
              <p className="mt-2 line-clamp-2 flex-1 text-[12px] leading-relaxed text-sub">{c.summary}</p>

              <div className="mt-4 flex items-center justify-between border-t border-line pt-3.5">
                <div className="flex flex-wrap gap-1">
                  {c.tags.slice(0, 3).map((t) => (
                    <span key={t} className="rounded bg-surface2 px-1.5 py-0.5 text-[9px] text-faint">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="flex items-center gap-1 text-[10px] font-medium text-faint transition group-hover:text-accent">
                  {progress && !done ? `Adım ${progress.stepIndex + 1}'de kaldınız` : 'Vakayı Aç'}
                  <ArrowRight size={12} className="transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
