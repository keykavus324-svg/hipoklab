import { ArrowLeft, X } from 'lucide-react';
import { useEffect } from 'react';
import type { LibraryResource } from '../../types/hipoklab';
import { DocumentPanel } from './DocumentPanel';
import { NotebookPanel } from './NotebookPanel';

interface SplitViewReaderProps {
  resource: LibraryResource;
  completed: boolean;
  onToggleComplete: () => void;
  onBack: () => void;
  onNotify: (message: string) => void;
  fontSizeStep: number;
  onFontSizeStep: (step: number) => void;
  notesVersion: number;
}

/**
 * Split-View Çalışma Masası:
 * Sol = akademik doküman, Sağ = kişisel not defteri.
 */
export function SplitViewReader({
  resource,
  completed,
  onToggleComplete,
  onBack,
  onNotify,
  fontSizeStep,
  onFontSizeStep,
  notesVersion,
}: SplitViewReaderProps) {
  // ESC ile okuyucudan çıkış
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onBack]);

  return (
    <div className="fixed inset-0 z-40 flex animate-fade-in bg-base">
      {/* Sol: Akademik doküman + kişisel defter sütunu */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Okuyucu üst çubuğu */}
        <div className="flex h-[52px] shrink-0 items-center gap-3 border-b border-line bg-surface px-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg border border-line bg-surface2 px-2.5 py-1.5 text-[11px] font-medium text-sub transition hover:border-accent/40 hover:text-accent"
          >
            <ArrowLeft size={13} /> Kütüphaneye Dön
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold text-fg">{resource.title}</p>
            <p className="truncate text-[10px] text-faint">
              {resource.course} · {resource.resourceType} · {resource.committee}
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-faint transition hover:bg-surface2 hover:text-fg"
            aria-label="Okuyucuyu kapat"
            title="Kapat (Esc)"
          >
            <X size={15} />
          </button>
        </div>

        {/* Split gövde */}
        <div className="flex min-h-0 flex-1">
          <DocumentPanel
            resource={resource}
            completed={completed}
            onToggleComplete={onToggleComplete}
            fontSizeStep={fontSizeStep}
            onFontSizeStep={onFontSizeStep}
          />
          <NotebookPanel
            key={`${resource.id}-${notesVersion}`}
            resourceId={resource.id}
            resourceTitle={resource.title}
            onNotify={onNotify}
          />
        </div>
      </div>
    </div>
  );
}
