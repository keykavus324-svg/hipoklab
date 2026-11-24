import { ArrowLeft, Check, Eye, RotateCcw, Sparkles, Trophy, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CardProgress, CardRating, Flashcard, FlashcardDeck } from '../../types/hipoklab';

interface FlashcardStudyProps {
  deck: FlashcardDeck;
  cards: Flashcard[];
  cardProgress: Record<string, CardProgress>;
  onFinish: () => void;
  onRateCard: (cardId: string, rating: CardRating) => void;
  studyLogBump: (minutes: number) => void;
}

const RATING_LABELS: { key: CardRating; label: string; hint: string; icon: 'x' | 'check' | null; cls: string }[] = [
  { key: 'again', label: 'Tekrar', hint: '10 dk', icon: 'x', cls: 'border-danger/45 bg-danger/12 text-danger hover:bg-danger/20' },
  { key: 'hard', label: 'Zor', hint: 'yakın', icon: null, cls: 'border-gold/45 bg-gold/12 text-gold hover:bg-gold/20' },
  { key: 'good', label: 'İyi', hint: 'günler', icon: null, cls: 'border-accent/45 bg-accent/12 text-accent hover:bg-accent/20' },
  { key: 'easy', label: 'Kolay', hint: 'haftalar', icon: 'check', cls: 'border-azure/45 bg-azure/12 text-azure hover:bg-azure/20' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Flashcard çalışma oturumu: 3B kart çevirme, SM-2 puanlama ve oturum özeti.
 * "Tekrar" puanlanan kart oturumun sonuna eklenir; tüm kartlar bitince oturum kapanır.
 */
export function FlashcardStudy({ deck, cards, cardProgress, onFinish, onRateCard, studyLogBump }: FlashcardStudyProps) {
  const startedAtRef = useRef(Date.now());
  const [queue, setQueue] = useState<Flashcard[]>(() => {
    const now = Date.now();
    const due = cards.filter((c) => {
      const p = cardProgress[c.id];
      return !p || p.due <= now;
    });
    const fresh = cards.filter((c) => !due.some((d) => d.id === c.id));
    return [...shuffle(due), ...shuffle(fresh)];
  });
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = queue[index] ?? null;
  const remaining = Math.max(queue.length - index, 0);

  const handleRate = useCallback(
    (rating: CardRating) => {
      if (!current || finished) return;
      // SM-2 tekrar zamanı hesaplanır ve kalıcı duruma yazılır
      onRateCard(current.id, rating);
      setReviewedCount((n) => n + 1);
      if (rating !== 'again') setCorrectCount((n) => n + 1);

      // "Tekrar" kartı kuyruğun sonuna eklenir
      const nextQueue = rating === 'again' ? [...queue, current] : queue;
      if (rating === 'again') setQueue(nextQueue);

      const nextIndex = index + 1;
      if (nextIndex >= nextQueue.length) {
        setFinished(true);
      } else {
        setFlipped(false);
        setIndex(nextIndex);
      }
    },
    [current, finished, queue, index, onRateCard],
  );

  // Oturum bitişinde çalışma defterine süre yaz
  useEffect(() => {
    if (!finished) return;
    const minutes = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 60000));
    studyLogBump(minutes);
  }, [finished, studyLogBump]);

  // Klavye kısayolları: Boşluk = çevir, 1-4 = puanla
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (finished) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setFlipped(true);
        return;
      }
      if (!flipped) return;
      if (e.key === '1') handleRate('again');
      else if (e.key === '2') handleRate('hard');
      else if (e.key === '3') handleRate('good');
      else if (e.key === '4') handleRate('easy');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipped, finished, handleRate]);

  const totalPlanned = useMemo(() => Math.max(queue.length, reviewedCount), [queue.length, reviewedCount]);
  const sessionPercent = totalPlanned > 0 ? Math.round((reviewedCount / totalPlanned) * 100) : 0;
  const minutes = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 60000));

  /* ------------------------- Oturum özeti ------------------------- */
  if (finished) {
    const accuracy = reviewedCount > 0 ? Math.round((correctCount / reviewedCount) * 100) : 0;
    return (
      <div className="mx-auto flex max-w-2xl animate-fade-in flex-col items-center px-5 pb-12 pt-14 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/40 bg-gold/15 text-gold">
          <Trophy size={30} />
        </span>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-fg">Oturum Tamamlandı!</h2>
        <p className="mt-2 text-sm text-sub">
          {deck.title} destesinden {reviewedCount} kart tekrar edildi. Tekrar zamanlarınız güncellendi.
        </p>

        <div className="mt-7 grid w-full grid-cols-3 gap-4">
          <div className="rounded-2xl border border-line bg-surface p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-faint">Tekrar</p>
            <p className="mt-1.5 text-2xl font-semibold text-fg">{reviewedCount}</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-faint">İsabet</p>
            <p className="mt-1.5 text-2xl font-semibold text-accent">%{accuracy}</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-faint">Süre</p>
            <p className="mt-1.5 text-2xl font-semibold text-azure">{minutes} dk</p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={onFinish}
            className="flex items-center gap-2 rounded-xl border border-line bg-surface2 px-5 py-2.5 text-[13px] font-medium text-sub transition hover:border-accent/40 hover:text-accent"
          >
            <ArrowLeft size={15} /> Destelere Dön
          </button>
          <button
            type="button"
            onClick={() => {
              setQueue(shuffle(cards));
              setIndex(0);
              setFlipped(false);
              setReviewedCount(0);
              setCorrectCount(0);
              setFinished(false);
              startedAtRef.current = Date.now();
            }}
            className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-[13px] font-semibold text-[#04211d] transition hover:brightness-110"
          >
            <RotateCcw size={15} /> Yeni Oturum Başlat
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------- Çalışma ekranı ------------------------- */
  return (
    <div className="mx-auto flex max-w-3xl animate-fade-in flex-col px-5 pb-10 pt-5">
      {/* Üst çubuk */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onFinish}
          className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[11px] font-medium text-sub transition hover:border-accent/40 hover:text-accent"
        >
          <ArrowLeft size={13} /> Çık
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold text-fg">{deck.title}</p>
          <p className="text-[10px] text-faint">
            {reviewedCount + 1} / {totalPlanned} kart · {remaining} sırada
          </p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[10px] text-faint sm:flex">
          <Sparkles size={11} className="text-accent" /> Boşluk: çevir · 1-4: puanla
        </span>
      </div>

      {/* İlerleme */}
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-azure transition-all duration-300"
          style={{ width: `${sessionPercent}%` }}
        />
      </div>

      {/* Kart (3B çevirme) */}
      {current ? (
        <div className="mt-6" style={{ perspective: '1400px' }}>
          <div
            className={`relative w-full transition-transform duration-500 ${flipped ? '[transform:rotateY(180deg)]' : ''}`}
            style={{ transformStyle: 'preserve-3d', minHeight: '340px' }}
          >
            {/* Ön yüz */}
            <div
              className="absolute inset-0 flex flex-col rounded-2xl border border-line bg-surface p-8 shadow-float"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                Soru · {current.tag}
              </p>
              <p className="mt-5 flex-1 text-[19px] font-medium leading-relaxed text-fg">{current.front}</p>
              <button
                type="button"
                onClick={() => setFlipped(true)}
                className="mx-auto mt-6 flex items-center gap-2 rounded-xl border border-line bg-surface2 px-5 py-2.5 text-[12px] font-semibold text-sub transition hover:border-accent/40 hover:text-accent"
              >
                <Eye size={15} /> Arka Yüzü Göster
              </button>
            </div>

            {/* Arka yüz */}
            <div
              className="absolute inset-0 flex flex-col rounded-2xl border border-accent/35 bg-gradient-to-br from-accent/[0.08] via-surface to-azure/[0.06] p-8 shadow-float"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-accent">Cevap</p>
              <p className="mt-5 flex-1 text-[16.5px] leading-relaxed text-fg/95">{current.back}</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Puanlama */}
      {flipped && current ? (
        <div className="mt-6 grid grid-cols-2 gap-2.5 animate-slide-up sm:grid-cols-4">
          {RATING_LABELS.map((r, i) => (
            <button
              key={r.key}
              type="button"
              onClick={() => handleRate(r.key)}
              className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-[12px] font-semibold transition active:scale-[0.97] ${r.cls}`}
            >
              <span className="flex items-center gap-1.5">
                {r.icon === 'x' ? <X size={13} /> : r.icon === 'check' ? <Check size={13} /> : null}
                {r.label}
              </span>
              <span className="text-[9px] font-normal opacity-70">
                {r.hint} · tuş {i + 1}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setFlipped(true)}
            className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-[13px] font-semibold text-[#04211d] shadow-glow-accent transition hover:brightness-110 active:scale-[0.98]"
          >
            <Eye size={15} /> Kartı Çevir (Boşluk)
          </button>
        </div>
      )}
    </div>
  );
}
