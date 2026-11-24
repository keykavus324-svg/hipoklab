import { Download, Eye, NotebookPen, PenLine, Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { MarkdownPreview } from '../common/Markdown';

interface NotebookPanelProps {
  resourceId: string;
  resourceTitle: string;
  onNotify: (message: string) => void;
}

export const NOTE_PREFIX = 'hipoklab:note:';

/**
 * Sağ panel — Kişisel çalışma notu defteri.
 * Notlar derse (kaynağa) özel localStorage'a anında kaydedilir;
 * Düzenle/Önizle modları ve tek tıkla .md indirme bulunur.
 */
export function NotebookPanel({ resourceId, resourceTitle, onNotify }: NotebookPanelProps) {
  const [note, setNote] = useLocalStorage<string>(NOTE_PREFIX + resourceId, '');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [saved, setSaved] = useState(true);

  // Kaynak değişince varsayılan mod
  useEffect(() => {
    setMode('edit');
    setSaved(true);
  }, [resourceId]);

  // Otomatik kaydetme göstergesi
  useEffect(() => {
    if (saved) return;
    const t = window.setTimeout(() => {
      setSaved(true);
      onNotify('Notlarınız otomatik olarak kaydedildi.');
    }, 900);
    return () => window.clearTimeout(t);
  }, [note, saved, onNotify]);

  const downloadMd = () => {
    const content = `# ${resourceTitle} — Çalışma Notlarım\n\n${note}\n`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resourceTitle
      .toLocaleLowerCase('tr')
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')}-notlarim.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onNotify('Notlarınız .md dosyası olarak indirildi.');
  };

  const wordCount = useMemo(() => note.trim() === '' ? 0 : note.trim().split(/\s+/).length, [note]);

  return (
    <div className="flex w-[340px] shrink-0 flex-col border-l border-line bg-surface xl:w-[380px]">
      {/* Başlık */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-azure/30 bg-azure/10 text-azure">
          <NotebookPen size={13} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-fg">
            Çalışma Notlarım
          </p>
          <p className="truncate text-[10px] text-faint">{resourceTitle}</p>
        </div>
      </div>

      {/* Mod düğmeleri */}
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
        <button
          type="button"
          onClick={() => setMode('edit')}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition ${
            mode === 'edit'
              ? 'bg-accent/12 text-accent shadow-[inset_0_0_0_1px] shadow-accent/25'
              : 'text-faint hover:bg-surface2 hover:text-sub'
          }`}
        >
          <PenLine size={12} /> Düzenle
        </button>
        <button
          type="button"
          onClick={() => setMode('preview')}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition ${
            mode === 'preview'
              ? 'bg-accent/12 text-accent shadow-[inset_0_0_0_1px] shadow-accent/25'
              : 'text-faint hover:bg-surface2 hover:text-sub'
          }`}
        >
          <Eye size={12} /> Önizle
        </button>
        <button
          type="button"
          onClick={downloadMd}
          title=".md olarak indir"
          className="ml-auto flex items-center gap-1.5 rounded-lg border border-line bg-surface2 px-2.5 py-1.5 text-[11px] font-medium text-sub transition hover:border-accent/40 hover:text-accent"
        >
          <Download size={12} /> .md İndir
        </button>
      </div>

      {/* İçerik */}
      <div className="flex-1 overflow-y-auto">
        {mode === 'edit' ? (
          <textarea
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setSaved(false);
            }}
            placeholder={`## ${resourceTitle}\n\nBu konuyla ilgili notlarınızı buraya yazın…\n\n- Vurgulamak istediğiniz noktalar\n- Kendi kelimelerinizle özet\n- Sınavda çıkacağını düşündüğünüz bilgiler\n\n> Markdown desteklenir: **kalın**, *italik*, \`kod\`, # Başlık`}
            spellCheck={false}
            className="h-full min-h-[300px] w-full resize-none bg-transparent px-4 py-4 font-mono text-[12px] leading-relaxed text-fg outline-none placeholder:text-faint/70"
          />
        ) : note.trim() === '' ? (
          <div className="flex h-full flex-col items-center justify-center px-6 py-14 text-center">
            <NotebookPen size={26} className="text-faint" />
            <p className="mt-3 text-[12px] font-medium text-sub">Henüz not eklenmedi</p>
            <p className="mt-1 text-[11px] leading-relaxed text-faint">
              Düzenleme moduna geçerek bu kaynak için kişisel notlarınızı oluşturmaya başlayın.
            </p>
          </div>
        ) : (
          <div className="px-4 py-4">
            <MarkdownPreview text={note} />
          </div>
        )}
      </div>

      {/* Alt durum çubuğu */}
      <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-[10px] text-faint">
        <span className="flex items-center gap-1.5">
          {saved ? (
            <>
              <Save size={11} className="text-accent" /> Kaydedildi (localStorage)
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-gold" /> Kaydediliyor…
            </>
          )}
        </span>
        <span className="tabular-nums">{wordCount} kelime</span>
      </div>
    </div>
  );
}
