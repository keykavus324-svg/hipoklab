import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ALL_COMMITTEES_LABEL, COMMITTEES, COURSES, RESOURCE_TYPES, TERMS } from '../../data/libraryData';
import { Course, ResourceType } from '../../types/hipoklab';

export interface LibraryFilters {
  term: string;
  committee: string;
  course: string;
  resourceType: string;
  query: string;
}

export const EMPTY_FILTERS: LibraryFilters = {
  term: '',
  committee: ALL_COMMITTEES_LABEL,
  course: '',
  resourceType: '',
  query: '',
};

interface FilterBarProps {
  filters: LibraryFilters;
  onChange: (filters: LibraryFilters) => void;
  resultCount: number;
}

/**
 * Dönem → Kurul/Komite → Ders → Kaynak Türü + anlık metin araması.
 */
export function FilterBar({ filters, onChange, resultCount }: FilterBarProps) {
  const set = <K extends keyof LibraryFilters>(key: K, value: string) =>
    onChange({ ...filters, [key]: value });

  const hasActive =
    filters.term !== '' ||
    filters.committee !== ALL_COMMITTEES_LABEL ||
    filters.course !== '' ||
    filters.resourceType !== '' ||
    filters.query.trim() !== '';

  const selectClass =
    'h-9 cursor-pointer appearance-none rounded-xl border border-line bg-surface px-3 pr-8 text-[12px] font-medium text-sub outline-none transition hover:border-line2 hover:text-fg';

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-panel">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="flex items-center gap-1.5 pr-1 text-[11px] font-semibold uppercase tracking-wider text-faint">
          <SlidersHorizontal size={12} /> Filtrele
        </span>

        <select
          value={filters.term}
          onChange={(e) => set('term', e.target.value)}
          aria-label="Dönem filtresi"
          className={selectClass}
        >
          <option value="">Tüm Dönemler</option>
          {TERMS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={filters.committee}
          onChange={(e) => set('committee', e.target.value)}
          aria-label="Kurul / komite filtresi"
          className={`${selectClass} max-w-[260px]`}
        >
          <option value={ALL_COMMITTEES_LABEL}>{ALL_COMMITTEES_LABEL}</option>
          {COMMITTEES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filters.course}
          onChange={(e) => set('course', e.target.value)}
          aria-label="Ders filtresi"
          className={selectClass}
        >
          <option value="">Tüm Dersler</option>
          {COURSES.map((c: Course) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filters.resourceType}
          onChange={(e) => set('resourceType', e.target.value)}
          aria-label="Kaynak türü filtresi"
          className={selectClass}
        >
          <option value="">Tüm Türler</option>
          {RESOURCE_TYPES.map((t: ResourceType) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Anlık metin araması */}
        <div className="relative min-w-[200px] flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            value={filters.query}
            onChange={(e) => set('query', e.target.value)}
            placeholder="Başlık, konu veya içerikte ara…"
            aria-label="Metin araması"
            className="h-9 w-full rounded-xl border border-line bg-surface pl-9 pr-8 text-[12px] text-fg outline-none transition placeholder:text-faint hover:border-line2 focus:border-accent/50"
          />
          {filters.query ? (
            <button
              type="button"
              onClick={() => set('query', '')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-faint transition hover:text-fg"
              aria-label="Aramayı temizle"
            >
              <X size={12} />
            </button>
          ) : null}
        </div>

        {hasActive ? (
          <button
            type="button"
            onClick={() => onChange({ ...EMPTY_FILTERS })}
            className="h-9 rounded-xl border border-line bg-surface2 px-3 text-[11px] font-medium text-faint transition hover:border-danger/40 hover:text-danger"
          >
            Filtreleri Temizle
          </button>
        ) : null}
      </div>

      <p className="mt-2.5 text-[11px] text-faint">
        <span className="font-semibold text-sub">{resultCount}</span> kaynak listeleniyor
      </p>
    </div>
  );
}
