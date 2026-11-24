import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CalendarClock,
  Check,
  Flame,
  GraduationCap,
  Layers,
  ListChecks,
  Stethoscope,
  Target,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Course, UserProfile } from '../../types/hipoklab';
import { toISODate } from '../../data/studyPlan';

interface OnboardingModalProps {
  open: boolean;
  initial: UserProfile | null;
  onClose: () => void;
  onComplete: (profile: UserProfile) => void;
}

const EXAM_LABELS = ['Komite 1', 'Komite 2', 'Komite 3', 'Komite 4', 'Komite 5', 'Komite 6', 'Kurul Sınavı', 'TUS Denemesi'];
const MINUTE_OPTIONS = [30, 60, 90, 120];
const COURSES: Course[] = ['Anatomi', 'Fizyoloji', 'Histoloji', 'Biyokimya', 'Patoloji'];

function defaultExamDate(): string {
  return toISODate(new Date(Date.now() + 21 * 24 * 60 * 60 * 1000));
}

/**
 * Kurulum sihirbazı — kişisel çalışma planı için gerekli bilgileri toplar.
 * Üç adım: karşılama → sınav hedefi → ders öncelikleri.
 */
export function OnboardingModal({ open, initial, onClose, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [examLabel, setExamLabel] = useState('Komite 3');
  const [examDate, setExamDate] = useState(defaultExamDate());
  const [dailyMinutes, setDailyMinutes] = useState(60);
  const [courses, setCourses] = useState<Course[]>([]);

  // Düzenleme modunda mevcut profil alanları ön doldurulur
  useEffect(() => {
    if (!open) return;
    setStep(initial ? 1 : 0);
    setName(initial?.name ?? '');
    setExamLabel(initial?.examLabel ?? 'Komite 3');
    setExamDate(initial?.examDate ?? defaultExamDate());
    setDailyMinutes(initial?.dailyMinutes ?? 60);
    setCourses(initial?.courses ?? []);
  }, [open, initial]);

  if (!open) return null;

  const toggleCourse = (c: Course) => {
    setCourses((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const handleComplete = () => {
    onComplete({
      name: name.trim(),
      examLabel: examLabel.trim() || 'Sınav',
      examDate: examDate || defaultExamDate(),
      dailyMinutes,
      courses,
      onboarded: true,
    });
  };

  const stepTitles = ['Hoş Geldin', 'Sınav Hedefin', 'Ders Önceliklerin'];

  return (
    <div
      className="overlay-backdrop fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-[6vh] animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl animate-slide-up rounded-2xl border border-line bg-surface shadow-float">
        {/* Üst: adım göstergesi */}
        <div className="border-b border-line px-7 pt-6 pb-5">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
              <GraduationCap size={13} /> HipokLab Kurulumu
            </p>
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] text-faint transition hover:text-fg"
            >
              {initial ? 'Kapat' : 'Şimdilik atla'}
            </button>
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-fg">{stepTitles[step]}</h2>

          {/* Adım çubukları */}
          <div className="mt-4 flex items-center gap-1.5">
            {stepTitles.map((t, i) => (
              <div key={t} className="flex-1">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i < step ? 'bg-accent' : i === step ? 'bg-gradient-to-r from-accent to-azure' : 'bg-surface2'
                  }`}
                />
                <p className={`mt-1.5 text-[8.5px] font-medium uppercase tracking-wider ${i === step ? 'text-accent' : 'text-faint'}`}>
                  {t}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-7 py-6">
          {/* -------- Adım 1: Karşılama -------- */}
          {step === 0 ? (
            <div>
              <p className="text-sm leading-relaxed text-sub">
                HipokLab sıradan bir ders notu arşivi değil —{' '}
                <span className="font-medium text-fg">sınav tarihine göre size kişisel bir çalışma planı kuran</span>,
                her sabah "bugün ne çalışmalıyım" sorusunun cevabını veren bir kokpittir.
              </p>

              <div className="mt-5 space-y-2.5">
                {[
                  {
                    icon: CalendarClock,
                    title: 'Sınav geri sayımı ve günlük görevler',
                    text: 'Sınav tarihinizi girin; HipokLab kalan konuları günlere yaysın, her gün size yapacak 4 görev versin.',
                  },
                  {
                    icon: Brain,
                    title: 'Unutma eğrisine karşı aralıklı tekrar',
                    text: 'SM-2 algoritmasıyla kart tekrarlarınız otomatik planlanır — ne zaman ne tekrar edeceğinizi düşünmezsiniz.',
                  },
                  {
                    icon: Stethoscope,
                    title: 'Klinik vakalarla karar pratiği',
                    text: 'Anamnezden tedaviye adım adım vakalar; gerçek klinik muhakemenizi sınavdan önce geliştirir.',
                  },
                ].map((f) => (
                  <div key={f.title} className="flex gap-3.5 rounded-xl border border-line bg-surface2/50 p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/12 text-accent">
                      <f.icon size={16} />
                    </span>
                    <div>
                      <p className="text-[12.5px] font-semibold text-fg">{f.title}</p>
                      <p className="mt-1 text-[11.5px] leading-relaxed text-sub">{f.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <label className="mt-5 block">
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-sub">
                  <User size={12} /> Adın (isteğe bağlı)
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ör. Elif"
                  maxLength={24}
                  className="mt-1.5 w-full rounded-xl border border-line bg-surface2 px-3.5 py-2.5 text-[13px] text-fg placeholder:text-faint focus:border-accent/50 focus:outline-none"
                />
              </label>
            </div>
          ) : null}

          {/* -------- Adım 2: Sınav hedefi -------- */}
          {step === 1 ? (
            <div>
              <p className="text-sm leading-relaxed text-sub">
                Planın merkezinde sınavın var. Tarihi gir, gerisini HipokLab halletsin.
              </p>

              <div className="mt-5">
                <p className="flex items-center gap-1.5 text-[11px] font-medium text-sub">
                  <Target size={12} /> Hangi sınava hazırlanıyorsun?
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {EXAM_LABELS.map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setExamLabel(label)}
                      className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition ${
                        examLabel === label
                          ? 'border-accent/50 bg-accent/15 text-accent'
                          : 'border-line bg-surface2 text-sub hover:border-accent/40 hover:text-fg'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                  <input
                    type="text"
                    value={EXAM_LABELS.includes(examLabel) ? '' : examLabel}
                    onChange={(e) => setExamLabel(e.target.value)}
                    placeholder="veya özel ad yazın"
                    maxLength={24}
                    className="w-36 rounded-lg border border-line bg-surface2 px-2.5 py-1.5 text-[11px] text-fg placeholder:text-faint focus:border-accent/50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-sub">
                    <CalendarClock size={12} /> Sınav tarihi
                  </span>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-line bg-surface2 px-3.5 py-2.5 text-[13px] text-fg focus:border-accent/50 focus:outline-none"
                  />
                </label>
                <div>
                  <p className="flex items-center gap-1.5 text-[11px] font-medium text-sub">
                    <Flame size={12} /> Günlük çalışma hedefi
                  </p>
                  <div className="mt-1.5 flex gap-1.5">
                    {MINUTE_OPTIONS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setDailyMinutes(m)}
                        className={`flex-1 rounded-xl border px-2 py-2.5 text-[12px] font-semibold transition ${
                          dailyMinutes === m
                            ? 'border-accent/50 bg-accent/15 text-accent'
                            : 'border-line bg-surface2 text-sub hover:border-accent/40'
                        }`}
                      >
                        {m} dk
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* -------- Adım 3: Dersler -------- */}
          {step === 2 ? (
            <div>
              <p className="text-sm leading-relaxed text-sub">
                Hangi derslere ağırlık vereceksin? Günlük görevler ve haftalık plan buna göre önceliklendirilir.
                Seçmezsen tüm dersler planlanır.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {COURSES.map((c) => {
                  const active = courses.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCourse(c)}
                      className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-left transition ${
                        active
                          ? 'border-accent/50 bg-accent/12 text-fg'
                          : 'border-line bg-surface2 text-sub hover:border-accent/40'
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                          active ? 'border-accent bg-accent text-[#04211d]' : 'border-line text-transparent'
                        }`}
                      >
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span className="text-[12px] font-semibold">{c}</span>
                    </button>
                  );
                })}
              </div>

              {/* Özet */}
              <div className="mt-5 rounded-xl border border-accent/30 bg-accent/[0.07] p-4">
                <p className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-wider text-accent">
                  <ListChecks size={12} /> Plan Özeti
                </p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-fg/90">
                  <span className="font-semibold">{examLabel}</span> için planlanıyor ·{' '}
                  {examDate ? new Date(`${examDate}T12:00:00`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'} ·
                  günde <span className="font-semibold">{dailyMinutes} dakika</span> ·{' '}
                  {courses.length > 0 ? courses.join(', ') : 'tüm dersler'}
                </p>
                <p className="mt-1.5 text-[11px] text-sub">
                  Planı dilediğin zaman Kontrol Paneli'nden düzenleyebilirsin.
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Alt: gezinme düğmeleri */}
        <div className="flex items-center justify-between border-t border-line px-7 py-5">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 rounded-xl border border-line bg-surface2 px-4 py-2.5 text-[12.5px] font-medium text-sub transition hover:border-accent/40 hover:text-accent"
            >
              <ArrowLeft size={14} /> Geri
            </button>
          ) : (
            <span />
          )}
          {step < 2 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-[12.5px] font-semibold text-[#04211d] shadow-glow-accent transition hover:brightness-110"
            >
              Devam <ArrowRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-[12.5px] font-semibold text-[#04211d] shadow-glow-accent transition hover:brightness-110"
            >
              <Layers size={15} /> Planımı Oluştur
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
