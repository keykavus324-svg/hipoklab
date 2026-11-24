import { FilePlus2, Info } from 'lucide-react';
import { FormEvent, useState } from 'react';
import {
  COMMITTEES,
  COURSES,
  RESOURCE_TYPES,
  TERMS,
  parseUserContent,
  slugify,
} from '../../data/libraryData';
import type { Course, LibraryResource, ResourceType } from '../../types/hipoklab';
import { Modal } from '../common/Modal';

interface AddResourceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (resource: LibraryResource) => void;
}

const inputClass =
  'w-full rounded-xl border border-line bg-surface2 px-3.5 py-2.5 text-[13px] text-fg outline-none transition placeholder:text-faint hover:border-line2 focus:border-accent/50';

/**
 * "Yeni Kaynak Ekle" modalı — kullanıcının kendi ders notunu kütüphaneye ekler.
 */
export function AddResourceModal({ open, onClose, onSave }: AddResourceModalProps) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [term, setTerm] = useState<string>(TERMS[0]);
  const [committee, setCommittee] = useState<string>(COMMITTEES[0]);
  const [course, setCourse] = useState<Course>('Anatomi');
  const [resourceType, setResourceType] = useState<ResourceType>('Ders Notu');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const reset = () => {
    setTitle('');
    setSubtitle('');
    setTerm(TERMS[0]);
    setCommittee(COMMITTEES[0]);
    setCourse('Anatomi');
    setResourceType('Ders Notu');
    setContent('');
    setError('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 3) {
      setError('Başlık en az 3 karakter olmalıdır.');
      return;
    }
    if (content.trim().length < 20) {
      setError('İçerik en az 20 karakter olmalıdır — ders notunuzu biraz daha detaylandırın.');
      return;
    }

    const blocks = parseUserContent(content);
    const resource: LibraryResource = {
      id: `kisisel-${slugify(title)}`,
      title: title.trim(),
      subtitle: subtitle.trim() || 'Kullanıcı tarafından eklenen kişisel ders notu',
      term,
      committee,
      course,
      resourceType,
      author: 'Kişisel Not',
      updatedAt: new Date().toISOString().slice(0, 10),
      minutes: Math.max(1, Math.round(content.trim().split(/\s+/).length / 180)),
      blocks,
    };
    onSave(resource);
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setError('');
        onClose();
      }}
      title="Yeni Kaynak Ekle"
      subtitle="Kendi ders notunuzu başlık, kurul, ders ve içerik bilgileriyle kütüphaneye ekleyin."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="res-title" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-faint">
              Başlık *
            </label>
            <input
              id="res-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn. Karaciğer Metabolizması — Ders Notu"
              className={inputClass}
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="res-subtitle" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-faint">
              Alt Başlık
            </label>
            <input
              id="res-subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Kısa bir açıklama (isteğe bağlı)"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="res-term" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-faint">
              Dönem
            </label>
            <select
              id="res-term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              {TERMS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="res-committee" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-faint">
              Kurul / Komite
            </label>
            <select
              id="res-committee"
              value={committee}
              onChange={(e) => setCommittee(e.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              {COMMITTEES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="res-course" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-faint">
              Ders
            </label>
            <select
              id="res-course"
              value={course}
              onChange={(e) => setCourse(e.target.value as Course)}
              className={`${inputClass} cursor-pointer`}
            >
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="res-type" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-faint">
              Kaynak Türü
            </label>
            <select
              id="res-type"
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value as ResourceType)}
              className={`${inputClass} cursor-pointer`}
            >
              {RESOURCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="res-content" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-faint">
            İçerik *
          </label>
          <textarea
            id="res-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={9}
            placeholder={
              'Metninizi buraya yazın. Satır başında "## " ile bölüm başlığı, "- " ile madde listesi oluşturabilirsiniz.\n\n## Bölüm Başlığı\nParagraf metni…\n- Madde 1\n- Madde 2'
            }
            className={`${inputClass} resize-y font-mono text-[12px] leading-relaxed`}
          />
          <p className="mt-1.5 flex items-start gap-1.5 text-[10px] leading-relaxed text-faint">
            <Info size={11} className="mt-0.5 shrink-0" />
            İpucu: <code className="rounded bg-surface px-1">## Başlık</code> ile bölüm başlığı,{' '}
            <code className="rounded bg-surface px-1">- madde</code> ile liste oluşturun. Notlarınız
            bu cihazda saklanır ve JSON yedeğiyle taşınabilir.
          </p>
        </div>

        {error ? (
          <p className="rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-[12px] text-danger">
            {error}
          </p>
        ) : null}

        <div className="flex items-center justify-end gap-2.5 border-t border-line pt-4">
          <button
            type="button"
            onClick={() => {
              setError('');
              onClose();
            }}
            className="rounded-xl border border-line bg-surface2 px-4 py-2.5 text-[12px] font-medium text-sub transition hover:border-line2 hover:text-fg"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-[12px] font-semibold text-[#04211d] transition hover:brightness-110 active:scale-[0.98]"
          >
            <FilePlus2 size={15} /> Kütüphaneye Ekle
          </button>
        </div>
      </form>
    </Modal>
  );
}
