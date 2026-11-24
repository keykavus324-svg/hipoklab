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

/* ---------------------------------------------------------------------------
   Sınav & Flashcard
--------------------------------------------------------------------------- */

/** SM-2 benzeri aralıklı tekrar (spaced repetition) durumu. */
export interface CardProgress {
  interval: number; // gün cinsinden sonraki tekrar aralığı
  ease: number; // kolaylık katsayısı (1.3 - 2.8)
  due: number; // epoch ms — bir sonraki tekrar zamanı
  reps: number; // toplam doğru/tekrar sayısı
  lapses: number; // unutma ("Tekrar") sayısı
  lastReviewed: number | null;
}

export type CardRating = 'again' | 'hard' | 'good' | 'easy';

export interface Flashcard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  /** Kaynak kaynaklı kartlarda ilgili ders notu id'si. */
  sourceResourceId?: string;
  tag: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  course: Course;
  committee: string;
  color: 'teal' | 'azure' | 'gold' | 'violet' | 'danger';
  cards: Flashcard[];
}

export interface StudySessionResult {
  reviewed: number;
  correct: number;
  minutes: number;
}

/* ---------------------------------------------------------------------------
   Klinik Vakalar
--------------------------------------------------------------------------- */

export interface CaseQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CaseStep {
  id: string;
  kind: 'anamnesis' | 'examination' | 'labs' | 'question' | 'diagnosis' | 'treatment' | 'discussion';
  title: string;
  /** Düz metin paragrafları. */
  paragraphs?: string[];
  /** Tablo (tetkik sonuçları). */
  table?: { headers: string[]; rows: string[][]; caption?: string };
  /** Adımdaki çoktan seçmeli sorular. */
  questions?: CaseQuestion[];
  /** Tanı / tedavi adımlarında vurgu kutuları. */
  highlights?: { label: string; text: string }[];
}

export interface ClinicalCase {
  id: string;
  title: string;
  specialty: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  committee: string;
  minutes: number;
  summary: string;
  tags: string[];
  steps: CaseStep[];
  /** Finalde gösterilen "inci"ler (pearls). */
  pearls: string[];
}

export interface CaseProgress {
  stepIndex: number;
  answers: Record<string, number>; // questionId -> chosenIndex
  completed: boolean;
  completedAt: number | null;
}

/* ---------------------------------------------------------------------------
   Kişisel çalışma planı
--------------------------------------------------------------------------- */

/** Kullanıcının sınav hedefi ve çalışma tercihleri. */
export interface UserProfile {
  name: string;
  /** Sınavın adı — ör. "Komite 3", "Kurul Sınavı", "TUS Denemesi". */
  examLabel: string;
  /** Sınav tarihi (YYYY-MM-DD). */
  examDate: string;
  /** Günlük çalışma hedefi (dakika). */
  dailyMinutes: number;
  /** Öncelik verilecek dersler (boşsa tüm dersler). */
  courses: Course[];
  onboarded: boolean;
}

/** Günlük görevlerden tamamlananların kaydı (YYYY-MM-DD -> görev id'leri). */
export type MissionLog = Record<string, string[]>;

/* ---------------------------------------------------------------------------
   Kalıcı kullanıcı verisi
--------------------------------------------------------------------------- */

/** localStorage'da kalıcı olarak tutulan kullanıcı verisi. */
export interface PersistedState {
  settings: AppSettings;
  completed: Record<string, number>; // resourceId -> tamamlanma zaman damgası
  lastRead: { id: string; at: number } | null;
  customResources: LibraryResource[];
  pomodoroSessions: number; // bugünkü tamamlanan pomodoro sayısı
  pomodoroDate: string; // YYYY-MM-DD
  favorites: string[]; // favorilenen resourceId listesi
  cardProgress: Record<string, CardProgress>;
  caseProgress: Record<string, CaseProgress>;
  /** YYYY-MM-DD -> dakika (pomodoro + okuma + flashcard çalışma süresi). */
  studyLog: Record<string, number>;
  /** Kişisel çalışma planı profili (kurulum sihirbazında oluşturulur). */
  profile: UserProfile | null;
  /** Kurulum sihirbazı en az bir kez gösterildi mi? */
  onboardingSeen: boolean;
  /** Günlük görevlerin elle işaretlenen tamamlanma kaydı. */
  missionLog: MissionLog;
}

export interface TocEntry extends TocItem {
  depth: number;
}
