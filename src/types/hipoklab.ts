/* ===========================================================================
   HipokLab — Çekirdek Tip Tanımları
   =========================================================================== */

export type Course = 'Anatomi' | 'Fizyoloji' | 'Histoloji' | 'Biyokimya' | 'Patoloji';

export type ResourceType = 'Ders Notu' | 'Spot Özet' | 'Lab Föyü';

export type ThemeMode = 'dark' | 'light';

/** Başlık bloğu — içindekiler navigasyonunu besler. */
export interface HeadingBlock {
  id: string;
  type: 'heading';
  text: string;
}

export interface ParagraphBlock {
  type: 'paragraph';
  text: string;
}

export interface ListBlock {
  type: 'list';
  items: string[];
}

/** "Klinik Korelasyon" bilgi kutusu. */
export interface ClinicalBlock {
  type: 'clinical';
  title?: string;
  text: string;
}

/** "Sınav Spotu" bilgi kutusu. */
export interface SpotBlock {
  type: 'spot';
  text: string;
}

/** Karşılaştırma tablosu. */
export interface TableBlock {
  type: 'table';
  caption?: string;
  headers: string[];
  rows: string[][];
}

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | ClinicalBlock
  | SpotBlock
  | TableBlock;

export interface TocItem {
  id: string;
  text: string;
}

/** Kütüphanedeki bir akademik kaynak. */
export interface LibraryResource {
  id: string;
  title: string;
  subtitle: string;
  term: string; // "Dönem 2"
  committee: string;
  course: Course;
  resourceType: ResourceType;
  author: string;
  updatedAt: string; // ISO tarih
  minutes: number; // tahmini okuma süresi (dakika)
  blocks: ContentBlock[];
}

/** Kullanıcının eklediği kaynaklar dahil tüm kaynak görünümü. */
export type AnyResource = LibraryResource;

export interface AppSettings {
  theme: ThemeMode;
  sidebarCollapsed: boolean;
  dailyGoal: number;
  activeCommittee: string;
  fontSizeStep: number; // 0..3
}

/** localStorage'da kalıcı olarak tutulan kullanıcı verisi. */
export interface PersistedState {
  settings: AppSettings;
  completed: Record<string, number>; // resourceId -> tamamlanma zaman damgası
  lastRead: { id: string; at: number } | null;
  customResources: LibraryResource[];
  pomodoroSessions: number; // bugünkü tamamlanan pomodoro sayısı
  pomodoroDate: string; // YYYY-MM-DD
}

export interface TocEntry extends TocItem {
  depth: number;
}
