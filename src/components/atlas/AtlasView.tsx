import {
  Brain,
  CheckCircle2,
  GraduationCap,
  Layers,
  MonitorPlay,
  RefreshCw,
  ScanEye,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ATLAS_DIAGRAMS,
  AtlasDiagramId,
  AtlasPin,
  findPin,
  getDiagram,
} from '../../data/atlasData';
import { AnatomySvgCanvas, QuizFeedback } from './AnatomySvgCanvas';

export interface AtlasTarget {
  diagramId: AtlasDiagramId;
  pinId: string;
  nonce: number;
}

interface AtlasViewProps {
  target: AtlasTarget | null;
  onPresentationChange: (active: boolean) => void;
}

type StudyMode = 'inspect' | 'quiz' | 'present';

interface QuizState {
  order: string[];
  index: number;
  firstTryCorrect: number;
  wrongIds: string[];
  feedback: QuizFeedback | null;
  finished: boolean;
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Görsel Atlas çalışma kokpiti.
 * Modlar: İnceleme · Kendini Test Et (Etiket Gizle) · Hoca Sunum (Projeksiyon).
 */
export function AtlasView({ target, onPresentationChange }: AtlasViewProps) {
  const [diagramId, setDiagramId] = useState<AtlasDiagramId>('heart');
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [showFlow, setShowFlow] = useState(true);
  const [mode, setMode] = useState<StudyMode>('inspect');
  const [quiz, setQuiz] = useState<QuizState>({
    order: [],
    index: 0,
    firstTryCorrect: 0,
    wrongIds: [],
    feedback: null,
    finished: false,
  });

  const diagram = useMemo(() => getDiagram(diagramId), [diagramId]);
  const selectedPin = useMemo(
    () => (selectedPinId ? findPin(diagramId, selectedPinId) ?? null : null),
    [diagramId, selectedPinId],
  );

  /* ---------------------------------------------------------------------- */
  /* Sunum modu: üst barı / yan menüyü gizle, ESC ile çık                    */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    onPresentationChange(mode === 'present');
    return () => onPresentationChange(false);
  }, [mode, onPresentationChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mode === 'present') {
        setMode('inspect');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode]);

  /* ---------------------------------------------------------------------- */
  /* Komut paletinden gelen hedef (diyagram + pin)                          */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    if (!target) return;
    setDiagramId(target.diagramId);
    setSelectedPinId(target.pinId);
    setMode('inspect');
  }, [target]);

  /* ---------------------------------------------------------------------- */
  /* Sınav motoru                                                            */
  /* ---------------------------------------------------------------------- */
  const startQuiz = useCallback(
    (pinIds?: string[]) => {
      const ids = pinIds ?? diagram.pins.map((p) => p.id);
      setQuiz({
        order: shuffle(ids),
        index: 0,
        firstTryCorrect: 0,
        wrongIds: [],
        feedback: null,
        finished: false,
      });
      setSelectedPinId(null);
    },
    [diagram],
  );

  const handlePinSelect = useCallback(
    (pin: AtlasPin) => {
      if (mode !== 'quiz') {
        setSelectedPinId(pin.id);
        return;
      }
      // Sınav modu: doğru/yanlış değerlendirme
      setQuiz((prev) => {
        if (prev.finished || prev.order.length === 0 || prev.feedback) return prev;
        const currentId = prev.order[prev.index];
        if (pin.id === currentId) {
          const isFirstTry = !prev.wrongIds.includes(currentId);
          return {
            ...prev,
            firstTryCorrect: prev.firstTryCorrect + (isFirstTry ? 1 : 0),
            feedback: { status: 'correct', correctPinId: currentId },
          };
        }
        return {
          ...prev,
          wrongIds: prev.wrongIds.includes(currentId) ? prev.wrongIds : [...prev.wrongIds, currentId],
          feedback: { status: 'wrong', wrongPinId: pin.id, correctPinId: currentId },
        };
      });
    },
    [mode],
  );

  // Geri bildirimden sonra sonraki soruya geç
  useEffect(() => {
    if (mode !== 'quiz' || !quiz.feedback || quiz.finished) return;
    const isTerminal = quiz.feedback.status === 'correct' || quiz.feedback.status === 'wrong';
    if (!isTerminal) return;
    const timer = window.setTimeout(() => {
      setQuiz((prev) => {
        const nextIndex = prev.index + 1;
        if (nextIndex >= prev.order.length) {
          return { ...prev, index: nextIndex, feedback: null, finished: true };
        }
        return { ...prev, index: nextIndex, feedback: null };
      });
      setSelectedPinId(null);
    }, quiz.feedback.status === 'correct' ? 700 : 1400);
    return () => window.clearTimeout(timer);
  }, [quiz.feedback, quiz.finished, mode]);

  const changeMode = (next: StudyMode) => {
    if (next === 'quiz') {
      startQuiz();
    } else {
      setQuiz((prev) => ({ ...prev, feedback: null, finished: false }));
    }
    setMode(next);
    if (next !== 'inspect') setSelectedPinId(null);
    if (next === 'present') setSelectedPinId(selectedPinId ?? diagram.pins[0]?.id ?? null);
  };

  const changeDiagram = (id: AtlasDiagramId) => {
    setDiagramId(id);
    setSelectedPinId(null);
    if (mode === 'quiz') startQuiz(getDiagram(id).pins.map((p) => p.id));
  };

  /* ---------------------------------------------------------------------- */
  /* Quiz görünümü verileri                                                  */
  /* ---------------------------------------------------------------------- */
  const quizTotal = quiz.order.length;
  const currentQuestionPin = quiz.order.length > 0 && !quiz.finished ? findPin(diagramId, quiz.order[quiz.index]) : null;
  const quizScorePercent = quizTotal > 0 ? Math.round((quiz.firstTryCorrect / quizTotal) * 100) : 0;

  const currentQuestionLabel = quiz.finished
    ? 'Sınav tamamlandı'
    : currentQuestionPin
      ? `Soru ${quiz.index + 1}/${quizTotal}: ${currentQuestionPin.nameTr} yapısını diyagram üzerinde işaretleyin`
      : 'Hazır';

  /* ---------------------------------------------------------------------- */
  /* Bilgi paneli                                                            */
  /* ---------------------------------------------------------------------- */
  const renderPinDetails = (pin: AtlasPin, large = false) => (
    <div className="space-y-4">
      <div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-md border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-accent">
            Pin {pin.number}
          </span>
          <span className="rounded-md border border-line bg-surface2 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-faint">
            {diagram.title}
          </span>
        </div>
        <h3 className={`mt-2.5 font-semibold leading-snug tracking-tight text-fg ${large ? 'text-xl' : 'text-[15px]'}`}>
          {pin.nameTr}
        </h3>
        <p className={`mt-1 italic text-sub ${large ? 'text-sm' : 'text-[12px]'}`}>{pin.nameLa}</p>
      </div>

      <div className="rounded-xl border border-line bg-surface2/60 p-3.5">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-faint">Bölge / Katman</p>
        <p className="mt-1 text-[12px] leading-relaxed text-sub">{pin.region}</p>
      </div>

      <div>
        <p className="text-[9px] font-semibold uppercase tracking-wider text-faint">Anatomik Komşuluklar</p>
        <ul className="mt-1.5 space-y-1.5">
          {pin.neighbors.map((n, i) => (
            <li key={i} className="flex gap-2 text-[12px] leading-relaxed text-sub">
              <span className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-azure/70" />
              {n}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[9px] font-semibold uppercase tracking-wider text-faint">Fizyolojik Görevler</p>
        <ul className="mt-1.5 space-y-1.5">
          {pin.functions.map((f, i) => (
            <li key={i} className="flex gap-2 text-[12px] leading-relaxed text-sub">
              <span className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-accent/70" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-accent/[0.1] to-accent/[0.03] p-3.5">
        <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-accent">
          <Sparkles size={11} /> Klinik Korelasyon — Hasarında Ne Olur?
        </p>
        <p className={`mt-1.5 leading-relaxed text-fg/90 ${large ? 'text-[13.5px]' : 'text-[12px]'}`}>{pin.clinical}</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col animate-fade-in">
      {/* --- Atlas başlık / araç çubuğu --- */}
      <div className="border-b border-line px-5 pb-3 pt-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
              <Layers size={12} /> İnteraktif Tıbbi Diyagramlar
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-fg">Görsel Atlas</h2>
            <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-sub">
              {diagram.description}
            </p>
          </div>

          {/* Çalışma modu seçici */}
          <div className="flex items-center gap-1.5 rounded-xl border border-line bg-surface p-1.5">
            {(
              [
                { key: 'inspect' as StudyMode, label: 'İnceleme', icon: ScanEye },
                { key: 'quiz' as StudyMode, label: 'Kendini Test Et', icon: GraduationCap },
                { key: 'present' as StudyMode, label: 'Hoca Sunum', icon: MonitorPlay },
              ]
            ).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => changeMode(key)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold transition ${
                  mode === key
                    ? 'bg-accent/15 text-accent shadow-[inset_0_0_0_1px] shadow-accent/30'
                    : 'text-faint hover:bg-surface2 hover:text-sub'
                }`}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Diyagram sekmeleri */}
        <div className="mt-3.5 flex flex-wrap gap-2">
          {ATLAS_DIAGRAMS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => changeDiagram(d.id)}
              className={`rounded-xl border px-3.5 py-2 text-left text-[11px] font-medium transition ${
                d.id === diagramId
                  ? 'border-accent/45 bg-accent/12 text-accent'
                  : 'border-line bg-surface text-sub hover:border-line2 hover:text-fg'
              }`}
            >
              <span className="block">{d.title}</span>
              <span className="mt-0.5 block text-[9px] font-normal text-faint">
                {d.subtitle} · {d.pins.length} yapı
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* --- Ana gövde: kanvas + bilgi paneli --- */}
      <div className="flex min-h-0 flex-1 gap-4 p-4">
        <div className="min-w-0 flex-1">
          <AnatomySvgCanvas
            diagram={diagram}
            selectedPinId={mode === 'quiz' ? quiz.feedback?.correctPinId ?? null : selectedPinId}
            onSelectPin={handlePinSelect}
            showLabels={showLabels}
            onToggleLabels={() => setShowLabels((v) => !v)}
            showFlow={showFlow}
            onToggleFlow={() => setShowFlow((v) => !v)}
            quizActive={mode === 'quiz'}
            quizFeedback={quiz.feedback}
            highContrast={mode === 'present'}
          />
        </div>

        {/* Sağ bilgi paneli */}
        <aside
          className={`flex shrink-0 flex-col overflow-hidden rounded-2xl border border-line bg-surface ${
            mode === 'present' ? 'w-[400px]' : 'w-[330px] xl:w-[360px]'
          }`}
        >
          {/* Sınav modu: soru kartı */}
          {mode === 'quiz' ? (
            <>
              <div className="border-b border-line px-4 py-3.5">
                <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                  <GraduationCap size={12} /> Kendini Test Et — Etiketler Gizli
                </p>
                <p className="mt-2 text-[13px] font-medium leading-relaxed text-fg">{currentQuestionLabel}</p>
                {/* İlerleme */}
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-surface2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-azure transition-all duration-300"
                    style={{ width: `${quizTotal > 0 ? (quiz.index / quizTotal) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                {quiz.feedback?.status === 'wrong' ? (
                  <div className="rounded-xl border border-danger/35 bg-danger/10 p-3.5">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold text-danger">
                      <XCircle size={13} /> Yanlış! Doğru pin sarı renkte gösteriliyor.
                    </p>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-sub">
                      {currentQuestionPin?.nameTr} ({currentQuestionPin?.nameLa}) yapısını bir sonraki
                      tekrarınızda mutlaka gözden geçirin.
                    </p>
                  </div>
                ) : quiz.feedback?.status === 'correct' ? (
                  <div className="rounded-xl border border-accent/35 bg-accent/10 p-3.5">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold text-accent">
                      <CheckCircle2 size={13} /> Doğru!
                    </p>
                  </div>
                ) : quiz.finished ? (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-line bg-surface2/60 p-4 text-center">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-faint">
                        Toplam Başarı
                      </p>
                      <p className="mt-1.5 text-4xl font-semibold tracking-tight text-accent">
                        %{quizScorePercent}
                      </p>
                      <p className="mt-1 text-[11px] text-sub">
                        {quizTotal} sorudan {quiz.firstTryCorrect} tanesi ilk denemede doğru
                      </p>
                    </div>

                    {quiz.wrongIds.length > 0 ? (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-faint">
                          Yanlış Bilinen Yapılar ({quiz.wrongIds.length})
                        </p>
                        <ul className="mt-2 space-y-1.5">
                          {quiz.wrongIds.map((id) => {
                            const p = findPin(diagramId, id);
                            return p ? (
                              <li
                                key={id}
                                className="flex items-center gap-2 rounded-lg border border-danger/25 bg-danger/[0.07] px-3 py-2 text-[11px] text-sub"
                              >
                                <XCircle size={12} className="shrink-0 text-danger" />
                                <span className="font-medium text-fg">{p.nameTr}</span>
                                <span className="truncate italic text-faint">{p.nameLa}</span>
                              </li>
                            ) : null;
                          })}
                        </ul>
                        <button
                          type="button"
                          onClick={() => startQuiz(quiz.wrongIds)}
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-accent/40 bg-accent/12 px-4 py-2.5 text-[12px] font-semibold text-accent transition hover:bg-accent/20"
                        >
                          <RefreshCw size={14} /> Yanlışları Tekrar Et
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-accent/30 bg-accent/10 p-3.5 text-center">
                        <p className="text-[12px] font-medium text-accent">
                          Mükemmel! Tüm yapıları ilk denemede doğru işaretlediniz.
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => startQuiz()}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-[12px] font-semibold text-[#04211d] transition hover:brightness-110"
                    >
                      <RefreshCw size={14} /> Yeni Sınav Başlat
                    </button>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center px-2 text-center">
                    <ScanEye size={26} className="text-faint" />
                    <p className="mt-3 text-[12px] leading-relaxed text-sub">
                      İsimler gizlendi. Sorulan yapıyı bulmak için diyagram üzerindeki numaralı
                      pinlere tıklayın. Yanlış tıklamada doğru pin gösterilir.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* İnceleme / Sunum modu: pin detayları */}
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                  {mode === 'present' ? <MonitorPlay size={12} /> : <Brain size={12} />}
                  {mode === 'present' ? 'Hoca Sunum Modu — ESC ile çıkın' : 'Yapı İnceleme'}
                </p>
                {selectedPin ? (
                  <span className="rounded-md border border-line bg-surface2 px-1.5 py-0.5 text-[9px] font-semibold text-faint">
                    {selectedPin.number} / {diagram.pins.length}
                  </span>
                ) : null}
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {selectedPin ? (
                  renderPinDetails(selectedPin, mode === 'present')
                ) : (
                  <div className="flex h-full flex-col items-center justify-center px-2 text-center">
                    <ScanEye size={26} className="text-faint" />
                    <p className="mt-3 text-[12px] leading-relaxed text-sub">
                      Diyagram üzerindeki numaralı pinlerden birine tıklayın; yapının Türkçe +
                      Latince adı, bölgesi, anatomik komşulukları, fizyolojik görevi ve klinik
                      korelasyonu burada açılır.
                    </p>
                    <div className="mt-5 w-full space-y-1.5 text-left">
                      {diagram.pins.slice(0, 6).map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedPinId(p.id)}
                          className="flex w-full items-center gap-2 rounded-lg border border-line bg-surface2/50 px-3 py-2 text-[11px] text-sub transition hover:border-accent/40 hover:text-fg"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-[#04211d]">
                            {p.number}
                          </span>
                          <span className="truncate">{p.nameTr}</span>
                        </button>
                      ))}
                      {diagram.pins.length > 6 ? (
                        <p className="pt-1 text-center text-[10px] text-faint">
                          + {diagram.pins.length - 6} yapı daha
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
