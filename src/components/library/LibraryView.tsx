import { ArrowDownUp, BookOpen, Bookmark, Library, Plus, SearchX } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { LibraryResource } from '../../types/hipoklab';
import { FilterBar, LibraryFilters } from './FilterBar';
import { ResourceCard } from './ResourceCard';

interface LibraryViewProps {
  resources: LibraryResource[];
  completed: Record<string, number>;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  filters: LibraryFilters;
  onFiltersChange: (filters: LibraryFilters) => void;
  onOpenResource: (id: string) => void;
  onAddResource: () => void;
}

type SortKey = 'newest' | 'az' | 'shortest';

/**
 * Komite odaklı kütüphane: filtreleme + kaynak kartları.
 */
export function LibraryView({
  resources,
  completed,
  favorites,
  onToggleFavorite,
  filters,
  onFiltersChange,
  onOpenResource,
  onAddResource,
}: LibraryViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>('newest');
  const [favOnly, setFavOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = filters.query.toLocaleLowerCase('tr').trim();
    const list = resources.filter((r) => {
      if (favOnly && !favorites.includes(r.id)) return false;
      if (filters.term && r.term !== filters.term) return false;
      if (filters.committee !== 'Tüm Kurullar' && r.committee !== filters.committee) return false;
      if (filters.course && r.course !== filters.course) return false;
      if (filters.resourceType && r.resourceType !== filters.resourceType) return false;
      if (q) {
        const haystack = `${r.title} ${r.subtitle} ${r.course} ${r.author} ${r.blocks
          .map((b) => {
            if (b.type === 'paragraph' || b.type === 'heading' || b.type === 'clinical' || b.type === 'spot')
              return b.text;
            if (b.type === 'list') return b.items.join(' ');
            if (b.type === 'table') return `${b.caption ?? ''} ${b.headers.join(' ')} ${b.rows.map((row) => row.join(' ')).join(' ')}`;
            return '';
          })
          .join(' ')}`.toLocaleLowerCase('tr');
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    const sorted = [...list];
    if (sortKey === 'newest') {
      sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    } else if (sortKey === 'az') {
      sorted.sort((a, b) => a.title.localeCompare(b.title, 'tr'));
    } else {
      sorted.sort((a, b) => a.minutes - b.minutes);
    }
    return sorted;
  }, [resources, filters, favOnly, favorites, sortKey]);

  return (
    <div className="mx-auto max-w-6xl animate-fade-in px-5 pb-12 pt-6">
      {/* Başlık */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
            <Library size={12} /> Split-View Çalışma Masası
          </p>
          <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-fg">Akademik Kütüphane</h2>
          <p className="mt-1 max-w-2xl text-sm text-sub">
            Komite programına göre düzenlenmiş ders notları, spot özetler ve lab föyleri. Bir kaynağa
            tıklayın; belgeyi sol panelde okurken kişisel not defterinizi sağ panelde tutun.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddResource}
          className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-[13px] font-semibold text-[#04211d] shadow-glow-accent transition hover:brightness-110 active:scale-[0.98]"
        >
          <Plus size={16} /> Yeni Kaynak Ekle
        </button>
      </div>

      {/* Filtreler */}
      <FilterBar filters={filters} onChange={onFiltersChange} resultCount={filtered.length} />

      {/* Sıralama / Favoriler */}
      <div className="mt-3 flex flex-wrap items-center justify-end gap-1.5">
        <button
          type="button"
          onClick={() => setFavOnly((v) => !v)}
          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-medium transition ${
            favOnly
              ? 'border-gold/45 bg-gold/12 text-gold'
              : 'border-line bg-surface text-faint hover:border-gold/40 hover:text-gold'
          }`}
        >
          <Bookmark size={11} /> Favoriler{favOnly ? ' (etkin)' : ''}
        </button>
        <label className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[10px] text-faint">
          <ArrowDownUp size={11} />
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="cursor-pointer bg-transparent text-[10px] font-medium text-sub outline-none"
          >
            <option value="newest">En yeni güncellenen</option>
            <option value="az">Ada göre (A-Z)</option>
            <option value="shortest">En kısa okuma</option>
          </select>
        </label>
      </div>

      {/* Kartlar */}
      {filtered.length > 0 ? (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r) => (
            <ResourceCard
              key={r.id}
              resource={r}
              completed={completed[r.id] !== undefined}
              favorite={favorites.includes(r.id)}
              onOpen={onOpenResource}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-line2 bg-surface/50 px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-surface2 text-faint">
            <SearchX size={22} />
          </span>
          <h3 className="mt-4 text-[15px] font-semibold text-fg">Eşleşen kaynak bulunamadı</h3>
          <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-sub">
            Filtreleri gevşetmeyi veya farklı bir anahtar kelime denemeyi ya da kendi notunuzu
            eklemeyi düşünebilirsiniz.
          </p>
          <button
            type="button"
            onClick={onAddResource}
            className="mt-5 flex items-center gap-2 rounded-xl border border-line bg-surface2 px-4 py-2.5 text-[13px] font-medium text-sub transition hover:border-accent/40 hover:text-accent"
          >
            <BookOpen size={15} /> Kendi Notumu Ekle
          </button>
        </div>
      )}
    </div>
  );
}
