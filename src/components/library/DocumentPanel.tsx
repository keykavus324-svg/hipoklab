import { Check, CheckCircle2, ListTree, Type } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { deriveToc } from '../../data/libraryData';
import type { ContentBlock, LibraryResource } from '../../types/hipoklab';
import { RichText } from '../common/Markdown';

interface DocumentPanelProps {
  resource: LibraryResource;
  completed: boolean;
  onToggleComplete: () => void;
  fontSizeStep: number;
  onFontSizeStep: (step: number) => void;
}

const FONT_SIZES = [14, 15.5, 17, 18.5];

/**
 * Sol panel — Akademik doküman görüntüleyici:
 * İçindekiler navigasyonu, yazı boyutu, klinik kutular, tablolar ve
 * "Konuyu Tamamlandı İşaretle" kontrolü.
 */
export function DocumentPanel({
  resource,
  completed,
  onToggleComplete,
  fontSizeStep,
  onFontSizeStep,
}: DocumentPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const [tocOpen, setTocOpen] = useState(true);

  const toc = useMemo(() => deriveToc(resource.blocks), [resource]);
  const fontSize = FONT_SIZES[Math.min(Math.max(fontSizeStep, 0), FONT_SIZES.length - 1)];

  // Başlık takibi — kaydırırken aktif bölümü işaretle
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const onScroll = () => {
      const headingEls = container.querySelectorAll<HTMLElement>('[data-heading]');
      let current: string | null = null;
      headingEls.forEach((el) => {
        if (el.offsetTop - container.scrollTop <= 120) {
          current = el.dataset.heading ?? null;
        }
      });
      setActiveHeading(current);
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => container.removeEventListener('scroll', onScroll);
  }, [resource.id]);

  // Kaynak değişince en üste dön
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    setActiveHeading(null);
  }, [resource.id]);

  const jumpTo = (id: string) => {
    const container = scrollRef.current;
    const el = container?.querySelector<HTMLElement>(`[data-heading="${id}"]`);
    if (container && el) {
      container.scrollTo({ top: el.offsetTop - 24, behavior: 'smooth' });
    }
  };

  const renderBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'heading':
        return (
          <h2
            key={`${block.id}-${index}`}
            data-heading={block.id}
            className="group mb-3 mt-8 scroll-mt-6 border-l-2 border-accent/60 pl-3.5 text-[1.22em] font-semibold leading-snug tracking-tight text-fg first:mt-0"
          >
            {block.text}
          </h2>
        );
      case 'paragraph':
        return (
          <p key={index} className="mb-3.5">
            <RichText text={block.text} />
          </p>
        );
      case 'list':
        return (
          <ul key={index} className="mb-4 space-y-1.5 pl-1">
            {block.items.map((item, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
                <span>
                  <RichText text={item} />
                </span>
              </li>
            ))}
          </ul>
        );
      case 'clinical':
        return (
          <aside
            key={index}
            className="my-5 rounded-xl border border-accent/30 bg-gradient-to-br from-accent/[0.1] to-accent/[0.03] p-4"
          >
            <p className="mb-1.5 flex items-center gap-1.5 text-[0.72em] font-bold uppercase tracking-wider text-accent">
              <span className="flex h-4 w-4 items-center justify-center rounded bg-accent/20 text-[9px]">✚</span>
              Klinik Korelasyon{block.title ? ` · ${block.title}` : ''}
            </p>
            <p className="leading-relaxed text-fg/90">
              <RichText text={block.text} />
            </p>
          </aside>
        );
      case 'spot':
        return (
          <aside
            key={index}
            className="my-5 rounded-xl border border-gold/35 bg-gradient-to-br from-gold/[0.12] to-gold/[0.03] p-4"
          >
            <p className="mb-1.5 flex items-center gap-1.5 text-[0.72em] font-bold uppercase tracking-wider text-gold">
              <span className="flex h-4 w-4 items-center justify-center rounded bg-gold/20 text-[9px]">⚡</span>
              Sınav Spotu
            </p>
            <p className="leading-relaxed text-fg/90">
              <RichText text={block.text} />
            </p>
          </aside>
        );
      case 'table':
        return (
          <figure key={index} className="my-5">
            {block.caption ? (
              <figcaption className="mb-2 text-[0.78em] font-medium text-faint">{block.caption}</figcaption>
            ) : null}
            <div className="overflow-x-auto rounded-xl border border-line">
              <table className="w-full border-collapse text-left text-[0.82em]">
                <thead>
                  <tr>
                    {block.headers.map((header, i) => (
                      <th
                        key={i}
                        className="border-b border-line bg-surface2 px-3.5 py-2.5 font-semibold text-fg"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, ri) => (
                    <tr key={ri} className="border-b border-line/60 last:border-0 hover:bg-surface2/50">
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className={`px-3.5 py-2.5 align-top ${
                            ci === 0 ? 'font-medium text-fg' : 'text-sub'
                          }`}
                        >
                          <RichText text={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </figure>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-w-0 flex-1">
      {/* İçindekiler */}
      {tocOpen ? (
        <nav className="hidden w-52 shrink-0 overflow-y-auto border-r border-line bg-surface/40 px-3 py-5 lg:block">
          <p className="flex items-center gap-1.5 px-2 pb-2.5 text-[10px] font-semibold uppercase tracking-wider text-faint">
            <ListTree size={11} /> İçindekiler
          </p>
          <ul className="space-y-0.5">
            {toc.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => jumpTo(item.id)}
                  className={`w-full rounded-md px-2 py-1.5 text-left text-[11px] leading-snug transition ${
                    activeHeading === item.id
                      ? 'bg-accent/12 font-semibold text-accent'
                      : 'text-faint hover:bg-surface2 hover:text-sub'
                  }`}
                >
                  {item.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {/* Belge gövdesi */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Belge araç çubuğu */}
        <div className="flex flex-wrap items-center gap-2 border-b border-line bg-surface/60 px-5 py-2.5">
          <button
            type="button"
            onClick={() => setTocOpen((v) => !v)}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition ${
              tocOpen ? 'border-accent/30 bg-accent/10 text-accent' : 'border-line bg-surface text-faint hover:text-sub'
            }`}
            title="İçindekiler panelini aç/kapat"
          >
            <ListTree size={13} /> İçindekiler
          </button>

          <div className="flex items-center gap-1 rounded-lg border border-line bg-surface px-1.5 py-1">
            <button
              type="button"
              onClick={() => onFontSizeStep(Math.max(0, fontSizeStep - 1))}
              className="flex h-6 w-6 items-center justify-center rounded text-[11px] font-semibold text-faint transition hover:bg-surface2 hover:text-fg"
              aria-label="Yazı boyutunu küçült"
              title="Yazı boyutunu küçült (A-)"
            >
              A−
            </button>
            <span className="flex items-center gap-1 px-1 text-[10px] font-medium text-faint">
              <Type size={11} /> {Math.round(fontSize)}px
            </span>
            <button
              type="button"
              onClick={() => onFontSizeStep(Math.min(FONT_SIZES.length - 1, fontSizeStep + 1))}
              className="flex h-6 w-6 items-center justify-center rounded text-faint transition hover:bg-surface2 hover:text-fg"
              aria-label="Yazı boyutunu büyüt"
              title="Yazı boyutunu büyüt (A+)"
            >
              <span className="text-xs font-bold leading-none">A+</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onToggleComplete}
            className={`ml-auto flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-[11px] font-semibold transition active:scale-[0.98] ${
              completed
                ? 'border-accent/40 bg-accent/15 text-accent'
                : 'border-line bg-surface2 text-sub hover:border-accent/40 hover:text-accent'
            }`}
          >
            {completed ? (
              <>
                <CheckCircle2 size={14} /> Tamamlandı
              </>
            ) : (
              <>
                <Check size={14} /> Konuyu Tamamlandı İşaretle
              </>
            )}
          </button>
        </div>

        {/* Kaydırılabilir içerik */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div
            className="doc-body mx-auto max-w-[720px] px-6 py-7"
            style={{ fontSize: `${fontSize}px` }}
          >
            {/* Başlık bloğu */}
            <header className="mb-7 border-b border-line pb-6">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-md border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                  {resource.course}
                </span>
                <span className="rounded-md border border-line bg-surface2 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-faint">
                  {resource.resourceType}
                </span>
                <span className="rounded-md border border-line bg-surface2 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-faint">
                  {resource.term}
                </span>
              </div>
              <h1 className="mt-3 text-[1.65em] font-bold leading-tight tracking-tight text-fg">
                {resource.title}
              </h1>
              <p className="mt-2 text-[0.88em] leading-relaxed text-sub">{resource.subtitle}</p>
              <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.76em] text-faint">
                <span>{resource.author}</span>
                <span className="h-1 w-1 rounded-full bg-line2" />
                <span>
                  {new Date(resource.updatedAt).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="h-1 w-1 rounded-full bg-line2" />
                <span>≈ {resource.minutes} dakikalık okuma</span>
              </p>
            </header>

            {resource.blocks.map(renderBlock)}

            {/* Alt tamamlama kontrolü */}
            <div className="mt-10 rounded-xl border border-line bg-surface2/50 p-5 text-center">
              <p className="text-[0.85em] text-sub">
                Bu konuyu bitirdiniz mi? İlerlemenizi kaydedin ve kontrol panelinde takip edin.
              </p>
              <button
                type="button"
                onClick={onToggleComplete}
                className={`mt-3.5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[0.82em] font-semibold transition active:scale-[0.98] ${
                  completed
                    ? 'border border-accent/40 bg-accent/15 text-accent'
                    : 'bg-accent text-[#04211d] hover:brightness-110'
                }`}
              >
                {completed ? (
                  <>
                    <CheckCircle2 size={15} /> Tamamlandı olarak işaretlendi
                  </>
                ) : (
                  <>
                    <Check size={15} /> Konuyu Tamamlandı İşaretle
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
