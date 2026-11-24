import { ArrowUpRight, Bookmark, BookmarkCheck, CheckCircle2, Clock, FileText } from 'lucide-react';
import { excerpt } from '../../data/libraryData';
import type { LibraryResource } from '../../types/hipoklab';

interface ResourceCardProps {
  resource: LibraryResource;
  completed: boolean;
  favorite: boolean;
  onOpen: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const COURSE_ACCENT: Record<string, string> = {
  Anatomi: 'border-azure/30 bg-azure/10 text-azure',
  Fizyoloji: 'border-accent/30 bg-accent/10 text-accent',
  Histoloji: 'border-gold/30 bg-gold/10 text-gold',
  Biyokimya: 'border-[#a78bfa]/30 bg-[#a78bfa]/10 text-[#a78bfa]',
  Patoloji: 'border-danger/30 bg-danger/10 text-danger',
};

export function ResourceCard({ resource, completed, favorite, onOpen, onToggleFavorite }: ResourceCardProps) {
  const accent = COURSE_ACCENT[resource.course] ?? 'border-line bg-surface2 text-sub';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(resource.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(resource.id);
        }
      }}
      className="group relative flex cursor-pointer flex-col rounded-2xl border border-line bg-surface p-5 text-left shadow-panel transition duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-float"
    >
      {/* Favori düğmesi */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(resource.id);
        }}
        aria-label={favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
        title={favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
        className={`absolute right-3.5 top-3.5 z-10 rounded-lg border p-1.5 transition ${
          favorite
            ? 'border-gold/40 bg-gold/15 text-gold'
            : 'border-line bg-surface2/80 text-faint opacity-0 hover:text-gold group-hover:opacity-100'
        }`}
      >
        {favorite ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
      </button>

      {/* Üst etiketler */}
      <div className="flex items-center gap-1.5">
        <span className={`rounded-md border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${accent}`}>
          {resource.course}
        </span>
        <span className="rounded-md border border-line bg-surface2 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-faint">
          {resource.resourceType}
        </span>
        <span className="ml-auto flex items-center gap-1 text-[10px] text-faint">
          <Clock size={10} /> {resource.minutes} dk
        </span>
      </div>

      {/* Başlık */}
      <h3 className="mt-3 text-[15px] font-semibold leading-snug tracking-tight text-fg transition group-hover:text-accent">
        {resource.title}
      </h3>
      <p className="mt-1.5 text-[11px] font-medium text-faint">{resource.subtitle}</p>

      {/* Özet */}
      <p className="mt-3 line-clamp-3 flex-1 text-[12px] leading-relaxed text-sub">
        {excerpt(resource, 140)}
      </p>

      {/* Alt bilgi */}
      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <div className="flex items-center gap-1.5 text-[10px] text-faint">
          <FileText size={11} />
          <span className="truncate max-w-[160px]">{resource.term} · {resource.committee.split('—')[0].trim()}</span>
        </div>
        {completed ? (
          <span className="flex items-center gap-1 rounded-md border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-accent">
            <CheckCircle2 size={10} /> Tamamlandı
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-medium text-faint transition group-hover:text-accent">
            Aç <ArrowUpRight size={11} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
    </div>
  );
}
