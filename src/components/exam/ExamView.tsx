import { ArrowRight, Brain, Clock, Flame, GraduationCap, Layers, Play, Sparkles, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FLASHCARD_DECKS, deckStats, getDeckCards, getDueCardIds } from '../../data/flashcardData';
import type { CardProgress, CardRating, FlashcardDeck } from '../../types/hipoklab';
import { FlashcardStudy } from './FlashcardStudy';

interface ExamViewProps {
  cardProgress: Record<string, CardProgress>;
  onRateCard: (cardId: string, rating: CardRating) => void;
  studyLogBump: (minutes: number) => void;
}

const DECK_ACCENT: Record<FlashcardDeck['color'], { ring: string; badge: string; glow: string }> = {
  teal: { ring: 'border-accent/40', badge: 'bg-accent/12 text-accent', glow: 'from-accent/[0.12]' },
  azure: { ring: 'border-azure/40', badge: 'bg-azure/12 text-azure', glow: 'from-azure/[0.12]' },
  gold: { ring: 'border-gold/40', badge: 'bg-gold/12 text-gold', glow: 'from-gold/[0.12]' },
  violet: { ring: 'border-[#a78bfa]/40', badge: 'bg-[#a78bfa]/12 text-[#a78bfa]', glow: 'from-[#a78bfa]/[0.12]' },
  danger: { ring: 'border-danger/40', badge: 'bg-danger/12 text-danger', glow: 'from-danger/[0.12]' },
};

/**
 * Sınav & Flashcard modülü — desteler, aralıklı tekrar ve çalışma oturumu.
 */
export function ExamView({ cardProgress, onRateCard, studyLogBump }: ExamViewProps) {
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);

  const allCards = useMemo(() => FLASHCARD_DECKS.flatMap((d) => d.cards), []);
  const totalDue = useMemo(() => getDueCardIds(allCards, cardProgress).length, [allCards, cardProgress]);

  const globalStats = useMemo(() => {
    let mastered = 0;
    let learning = 0;
    let newCount = 0;
    for (const card of allCards) {
      const p = cardProgress[card.id];
      if (!p || p.reps === 0) newCount += 1;
      else if (p.interval >= 21) mastered += 1;
      else learning += 1;
    }
    return { total: allCards.length, mastered, learning, newCount };
  }, [allCards, cardProgress]);

  const activeDeck = activeDeckId ? FLASHCARD_DECKS.find((d) => d.id === activeDeckId) ?? null : null;

  /* ------------------------- Çalışma oturumu ------------------------- */
  if (activeDeck) {
    return (
      <FlashcardStudy
        deck={activeDeck}
        cards={getDeckCards(activeDeck.id)}
        cardProgress={cardProgress}
        onFinish={() => setActiveDeckId(null)}
        onRateCard={onRateCard}
        studyLogBump={studyLogBump}
      />
    );
  }

  /* ------------------------- Deste görünümü ------------------------- */
  return (
    <div className="mx-auto max-w-6xl animate-fade-in px-5 pb-12 pt-6">
      {/* Başlık */}
      <div className="mb-6">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
          <GraduationCap size={12} /> Aralıklı Tekrar · Aktif Öğrenme
        </p>
        <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-fg">Sınav & Flashcard</h2>
        <p className="mt-1 max-w-2xl text-sm text-sub">
          Ders notlarındaki "Sınav Spotu" kutularından otomatik üretilen ve müfredata göre
          hazırlanmış kartlarla çalışın. Sistem, unutma eğrisine göre (SM-2) tekrar zamanlarınızı
          planlar.
        </p>
      </div>

      {/* Üst istatistikler */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-panel">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-faint">
            <Clock size={11} /> Bugün Tekrar Edilecek
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-accent">{totalDue}</p>
          <p className="mt-1 text-[11px] text-sub">vadesi gelen kart</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-panel">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-faint">
            <Layers size={11} /> Toplam Kart
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-fg">{globalStats.total}</p>
          <p className="mt-1 text-[11px] text-sub">5 deste · 5 ders</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-panel">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-faint">
            <TrendingUp size={11} /> Öğrenilen
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-azure">{globalStats.learning}</p>
          <p className="mt-1 text-[11px] text-sub">
            {globalStats.mastered} kart ustalaştı · {globalStats.newCount} yeni
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-panel">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-faint">
            <Flame size={11} /> Ustalık Oranı
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-gold">
            %{globalStats.total > 0 ? Math.round((globalStats.mastered / globalStats.total) * 100) : 0}
          </p>
          <p className="mt-1 text-[11px] text-sub">21+ günlük aralığa ulaşanlar</p>
        </div>
      </div>

      {/* Hızlı başlat */}
      {totalDue > 0 ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-accent/30 bg-gradient-to-r from-accent/[0.1] via-surface to-azure/[0.07] p-5 shadow-panel">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/30 bg-accent/15 text-accent">
              <Brain size={20} />
            </span>
            <div>
              <p className="text-[14px] font-semibold text-fg">Tekrar zamanı geldi!</p>
              <p className="mt-0.5 text-[12px] text-sub">
                Bugün {totalDue} kart sizi bekliyor — 10 dakikalık bir oturum bile unutma eğrisini
                düzleştirir.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              // En çok vadesi gelen desteden başla
              const best = FLASHCARD_DECKS.map((d) => ({ d, due: deckStats(d.id, cardProgress).due })).sort(
                (a, b) => b.due - a.due,
              )[0];
              if (best) setActiveDeckId(best.d.id);
            }}
            className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-[13px] font-semibold text-[#04211d] shadow-glow-accent transition hover:brightness-110 active:scale-[0.98]"
          >
            <Play size={15} /> Hemen Çalışmaya Başla
          </button>
        </div>
      ) : null}

      {/* Deste kartları */}
      <h3 className="mt-8 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-faint">
        <Sparkles size={12} className="text-accent" /> Ders Desteği Seçin
      </h3>
      <div className="mt-3.5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {FLASHCARD_DECKS.map((deck) => {
          const stats = deckStats(deck.id, cardProgress);
          const accent = DECK_ACCENT[deck.color];
          const learnedPercent = stats.total > 0 ? Math.round(((stats.mastered + stats.learning) / stats.total) * 100) : 0;
          return (
            <button
              key={deck.id}
              type="button"
              onClick={() => setActiveDeckId(deck.id)}
              className={`group relative overflow-hidden rounded-2xl border bg-surface p-5 text-left shadow-panel transition duration-200 hover:-translate-y-0.5 hover:shadow-float ${accent.ring}`}
            >
              <div className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br ${accent.glow} to-transparent blur-2xl`} />
              <div className="flex items-start justify-between">
                <div>
                  <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${accent.badge}`}>
                    {deck.course}
                  </span>
                  <h4 className="mt-2.5 text-[15px] font-semibold tracking-tight text-fg transition group-hover:text-accent">
                    {deck.title}
                  </h4>
                  <p className="mt-1 text-[11px] leading-relaxed text-faint">{deck.description}</p>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-surface2 text-faint transition group-hover:border-accent/40 group-hover:text-accent">
                  <ArrowRight size={15} />
                </span>
              </div>

              {/* İlerleme çubuğu */}
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-[10px]">
                  <span className="text-faint">Öğrenme ilerlemesi</span>
                  <span className="font-semibold tabular-nums text-sub">%{learnedPercent}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-azure transition-all duration-500"
                    style={{ width: `${learnedPercent}%` }}
                  />
                </div>
              </div>

              {/* Mini istatistikler */}
              <div className="mt-3.5 flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-sub">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {stats.total} kart
                </span>
                <span className="flex items-center gap-1 text-gold">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" /> {stats.due} tekrar
                </span>
                <span className="flex items-center gap-1 text-azure">
                  <span className="h-1.5 w-1.5 rounded-full bg-azure" /> {stats.mastered} ustalaştı
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Nasıl çalışır */}
      <div className="mt-8 rounded-2xl border border-line bg-surface p-6 shadow-panel">
        <h3 className="text-[12px] font-semibold uppercase tracking-wider text-faint">
          Aralıklı Tekrar Nasıl Çalışır?
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: 'Kartı Çevir',
              text: 'Önce soruyu tahmin edin, sonra "Arka Yüzü Göster" ile cevabı kontrol edin (Boşluk tuşu).',
            },
            {
              title: 'Kendinizi Puanlayın',
              text: 'Tekrar / Zor / İyi / Kolay. Sistem bir sonraki tekrar aralığını SM-2 algoritmasıyla planlar.',
            },
            {
              title: 'Unutma Eğrisi',
              text: 'Zor kartlar daha sık, iyi bildikleriniz giderek seyrek sorulur. Böylece zamanınız en çok ihtiyaç duyulan kartlara gider.',
            },
            {
              title: 'Ustalık',
              text: '21 günlük aralığa ulaşan kartlar "ustalaştı" sayılır. Günlük kısa oturumlar en yüksek getiriyi sağlar.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-line bg-surface2/50 p-4">
              <p className="text-[12px] font-semibold text-fg">{item.title}</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-sub">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
