/* ===========================================================================
   HipokLab — Akademik Kütüphane Veri Katmanı
   Bu dosya; komite/ dönem sabitlerini, yardımcı işlevleri ve platformda yer alan
   uzun formatlı Türkçe ders notlarını içerir. Latince/İngilizce terimler
   parantez içinde verilmiştir.
   =========================================================================== */

import type {
  ContentBlock,
  Course,
  LibraryResource,
  ResourceType,
  TocEntry,
} from '../types/hipoklab';

/* ---------------------------------------------------------------------------
   Sabitler
--------------------------------------------------------------------------- */

export const TERMS = ['Dönem 1', 'Dönem 2', 'Dönem 3'] as const;

export const COMMITTEES = [
  '1. Kurul — Hücre, Doku ve Hareket Sistemi',
  '2. Kurul — Duyu Sistemleri ve Nörobilim',
  '3. Kurul — Kardiyovasküler ve Solunum Sistemleri',
  '4. Kurul — Gastrointestinal ve Üriner Sistemler',
  '5. Kurul — Endokrin, Üreme ve Bağışıklık',
] as const;

export const COURSES: Course[] = ['Anatomi', 'Fizyoloji', 'Histoloji', 'Biyokimya', 'Patoloji'];

export const RESOURCE_TYPES: ResourceType[] = ['Ders Notu', 'Spot Özet', 'Lab Föyü'];

export const ALL_COMMITTEES_LABEL = 'Tüm Kurullar';

/* ---------------------------------------------------------------------------
   Yardımcı İşlevler
--------------------------------------------------------------------------- */

let slugCounter = 0;

/** Başlıklardan benzersiz id üretir (içindekiler bağlantısı için). */
export function slugify(text: string): string {
  slugCounter += 1;
  const base = text
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${base || 'bolum'}-${slugCounter}`;
}

/** H (başlık) kısayolu — veri dosyasını okunur kılar. */
const h = (text: string): ContentBlock => ({ id: slugify(text), type: 'heading', text });

/** Paragraf kısayolu. */
const p = (text: string): ContentBlock => ({ type: 'paragraph', text });

/** Madde listesi kısayolu. */
const li = (...items: string[]): ContentBlock => ({ type: 'list', items });

/** Klinik Korelasyon kutusu. */
const clinical = (text: string, title?: string): ContentBlock => ({ type: 'clinical', text, title });

/** Sınav Spotu kutusu. */
const spot = (text: string): ContentBlock => ({ type: 'spot', text });

/** Karşılaştırma tablosu. */
const table = (headers: string[], rows: string[][], caption?: string): ContentBlock => ({
  type: 'table',
  headers,
  rows,
  caption,
});

/** Bloklardan içindekiler listesi üretir. */
export function deriveToc(blocks: ContentBlock[]): TocEntry[] {
  return blocks
    .filter((b): b is Extract<ContentBlock, { type: 'heading' }> => b.type === 'heading')
    .map((b) => ({ id: b.id, text: b.text, depth: 1 }));
}

/** Kaynak kartında gösterilecek kısa özet. */
export function excerpt(resource: LibraryResource, maxLength = 150): string {
  const firstPara = resource.blocks.find((b) => b.type === 'paragraph');
  if (!firstPara || firstPara.type !== 'paragraph') return resource.subtitle;
  const text = firstPara.text;
  return text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text;
}

/** Kullanıcının serbest metnini blok yapısına çevirir (Yeni Kaynak Ekle modalı). */
export function parseUserContent(raw: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  let listBuffer: string[] | null = null;

  const flushList = () => {
    if (listBuffer && listBuffer.length > 0) {
      blocks.push({ type: 'list', items: listBuffer });
    }
    listBuffer = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      flushList();
      blocks.push(h(trimmed.slice(3)));
    } else if (trimmed.startsWith('- ')) {
      if (!listBuffer) listBuffer = [];
      listBuffer.push(trimmed.slice(2));
    } else if (trimmed === '') {
      flushList();
    } else {
      flushList();
      blocks.push(p(trimmed));
    }
  }
  flushList();
  return blocks.length > 0 ? blocks : [p(raw.trim())];
}

/* ---------------------------------------------------------------------------
   Yüksek Verimli (High-Yield) Klinik Spotlar — Kontrol paneli kartı
--------------------------------------------------------------------------- */

export interface HighYieldSpot {
  id: string;
  text: string;
  source: string;
  tag: string;
}

export const HIGH_YIELD_SPOTS: HighYieldSpot[] = [
  {
    id: 'hy-1',
    text: 'S1 kalp sesi mitral ve triküspid kapakçıklarının kapanmasından kaynaklanır; S2 ise aort ve pulmoner kapakçıkların kapanmasıyla oluşur. İkinci sesin fizyolojik ayrılması (splitting) en iyi inspiryumda duyulur.',
    source: 'Kardiyak Siklus ve Kalp Sesleri',
    tag: 'Fizyoloji',
  },
  {
    id: 'hy-2',
    text: 'Aksiyon potansiyelinin yükseliş fazında (Faz 0) voltaj kapılı Na⁺ kanalları açılır ve membran potansiyeli hızla Na⁺ denge potansiyeline (+30 mV) yaklaşır. Bu faz miyelinli aksonlarda Ranvier boğumlarında sıçrayarak (saltatorik iletim) gerçekleşir.',
    source: 'Aksiyon Potansiyeli ve Sinaptik İletim',
    tag: 'Fizyoloji',
  },
  {
    id: 'hy-3',
    text: 'N. facialis (VII) paralizisinde alın kırışıklığı kaybolur (üst yüz kasları da etkilenir) — bu bulgu santral (üst motor nöron) lezyonlarla karşılaştırıldığında periferik lezyona özgüdür. Bell paralizisinde göz kapatılamaz ve ağız köşesi sarkar.',
    source: 'Kraniyal Sinirler ve Çekirdekleri',
    tag: 'Anatomi',
  },
  {
    id: 'hy-4',
    text: 'Glomerüler filtrasyon hızı (GFR) esas olarak glomerüler kapiller hidrostatik basınçla belirlenir. Efektif dolaşım volümü azaldığında (ör. kanama) afferent arteriolar dilatasyon, renal oto-regülasyon ile GFR’yi korur.',
    source: 'Nefron Fizyolojisi ve Glomerüler Filtrasyon',
    tag: 'Fizyoloji',
  },
  {
    id: 'hy-5',
    text: 'Kolera toksini Gs proteinini ADP-ribosilleyerek GTPaz aktivitesini inhibit eder; adenilat siklaz sürekli aktif kalır, cAMP yükselir ve ince bağırsakta masif Cl⁻/su sekresyonu gelişir (sulu ishal).',
    source: 'Hücre İçi Sinyal Yolakları',
    tag: 'Biyokimya',
  },
  {
    id: 'hy-6',
    text: 'Akut inflamasyonun beş kardinal bulgusu: rubor (kızarıklık), calor (ısı artışı), tumor (şişlik), dolor (ağrı) ve functio laesa (fonksiyon kaybı). Histamin damar geçirgenliğinin erken artmasından sorumludur.',
    source: 'İnflamasyon ve Doku Onarımı',
    tag: 'Patoloji',
  },
  {
    id: 'hy-7',
    text: 'Frank-Starling mekanizmasına göre diyastol sonu hacmi (preload) arttıkça sarkomerler optimal uzunluğa yaklaşır ve kasılma kuvveti yükselir; bu kalbin atım hacmini anlık değişimlere uyarlamasını sağlar.',
    source: 'Kardiyak Siklus ve Kalp Sesleri',
    tag: 'Fizyoloji',
  },
  {
    id: 'hy-8',
    text: 'Sinaptik iletimde presinaptik terminale Ca²⁺ girişi nörotransmitter veziküllerinin ekzositozunu tetikler. Botulinum toksini vezikül füzyonunu bloke ederken, tetanus toksini inhibitör (glisin/GABA) salınımını engeller.',
    source: 'Aksiyon Potansiyeli ve Sinaptik İletim',
    tag: 'Fizyoloji',
  },
  {
    id: 'hy-9',
    text: 'Proksimal konvolütübülde glukoz, Na⁺ ile birlikte SGLT2 taşıyıcıları ile geri emilir. Diyabetes mellitusda plazma glukozu taşıma maksimumunu (Tm) aşınca renal eşiğin üzerinde glukozüri ve osmotik diürez görülür.',
    source: 'Nefron Fizyolojisi ve Glomerüler Filtrasyon',
    tag: 'Fizyoloji',
  },
  {
    id: 'hy-10',
    text: 'Tip I kolajen olgun skarda baskınken, yara iyileşmesinin erken proliferatif fazında ilk sentezlenen tip III kolajendir. C vitamini (askorbik asit) hidroksilasyon için kofaktördür; eksikliğinde skar mukavemeti düşer.',
    source: 'İnflamasyon ve Doku Onarımı',
    tag: 'Patoloji',
  },
];

/* ===========================================================================
   DERS NOTU 1 — Kardiyak Siklus ve Kalp Sesleri
   =========================================================================== */

export const CARDIAC_CYCLE: LibraryResource = {
  id: 'kardiyak-siklus',
  title: 'Kardiyak Siklus ve Kalp Sesleri',
  subtitle: 'Basınç-hacim ilişkileri, kapak olayları ve oskültasyonun fizyolojik temeli',
  term: 'Dönem 2',
  committee: COMMITTEES[2],
  course: 'Fizyoloji',
  resourceType: 'Ders Notu',
  author: 'HipokLab Akademik Kurul',
  updatedAt: '2026-11-18',
  minutes: 22,
  blocks: [
    h('Giriş: Kardiyak Siklus Neyi İfade Eder?'),
    p(
      'Kardiyak siklus (cardiac cycle), kalbin bir kez atmasıyla meydana gelen olayların bütünüdür; yaklaşık 0,8 saniye sürer ve kalp atım hızı dakikada 75 olduğunda bir siklus bir diastol (gevşeme) ile bir sistol (kasılma) dönemini kapsar. Bu süreç boyunca odacıkların basıncı, hacmi, kapakçıkların konumu ve kalp seslerinin oluşumu sistematik biçimde değişir. Kardiyovasküler fizyolojinin en yüksek verimli konularından biri olan kardiyak siklus; hem yazılı sınavlarda hem de klinik stajlarda (oskültasyon, EKG korelasyonu) sürekli karşınıza çıkar.',
    ),
    p(
      'Siklusun anlaşılması için üç temel verinin eş zamanlı izlenmesi gerekir: (1) sol atriyum, sol ventrikül ve aort içi basınç eğrileri, (2) ventrikül hacmi, (3) elektrokardiyogram (EKG) dalgaları. Bu üç kayıt birlikte değerlendirildiğinde kapak seslerinin neden duyulduğu ve üfürüm gibi patolojik seslerin hangi olay sırasında ortaya çıktığı berraklaşır.',
    ),

    h('Kardiyak Siklusun Fazları'),
    p(
      'Sol ventrikül perspektifinden siklus dört mekanik faza ayrılır: diyastol sonu (gevşeme ve dolgu), izovolümik kasılma, ejeksiyon ve izovolümik gevşeme. Her fazın belirleyici özelliği kapakçıkların açık/kapalı durumu ve ventrikül basıncının hacimle ilişkisidir.',
    ),
    li(
      'İzovolümik kasılma (isovolumetric contraction): Mitral kapak kapanır, aort kapağı henüz açılmamıştır. Ventrikül basıncı hızla yükselirken hacim sabit kalır.',
      'Ejeksiyon (ejection): Ventrikül basıncı aort basıncını aşınca aort kapağı açılır ve atım hacminin (stroke volume) yaklaşık %70’i ilk üçte birlik dönemde çıkar.',
      'İzovolümik gevşeme (isovolumetric relaxation): Aort kapağı kapanır, mitral kapak henüz açılmamıştır; basınç düşer, hacim sabit kalır.',
      'Dolgu (filling): Mitral kapak açılır; pasif dolgunun ardından atriyal sistol ile ventrikülün son %20-30’u dolar (atriyal kick).',
    ),
    table(
      ['Faz', 'Kapak Durumu', 'Basınç / Hacim'],
      [
        ['İzovolümik kasılma', 'Mitral kapalı, aort kapalı', 'Basınç ↑↑, hacim sabit'],
        ['Hızlı ejeksiyon', 'Aort açık', 'Basınç tepe, hacim ↓↓'],
        ['Azalmış ejeksiyon', 'Aort açık', 'Basınç ↓, hacim ↓ (yavaş)'],
        ['İzovolümik gevşeme', 'Aort kapalı, mitral kapalı', 'Basınç ↓↓, hacim sabit'],
        ['Hızlı dolgu', 'Mitral açık', 'Hacim ↑↑, basınç düşük'],
        ['Atriyal sistol (a dalgası)', 'Mitral açık', 'Hacim son %20-30 artar'],
      ],
      'Sol ventrikülde kardiyak siklusun mekanik fazları',
    ),
    p(
      'Elektrokardiyogramla eşleştirmede P dalgası atriyal depolarizasyonu (atriyal sistol), QRS kompleksi ventriküler depolarizasyonu ve mekanik sistol başlangıcını, T dalgası ise ventriküler repolarizasyonu ve diyastol başlangıcını temsil eder. Mekanik olaylar ile elektriksel olaylar arasında yaklaşık 50-100 ms’lik bir gecikme bulunur.',
    ),
    clinical(
      'Perikard efüzyonunda perikardiyal kesede biriken sıvı, kalp seslerini uzaklaştırarak "kalp seslerinin silikleşmesine" (muffled heart sounds) yol açar; kardiyak tamponadda ise inspiryumda sistolik basınçta >10 mmHg düşüş (pulsus paradoksus) izlenir. Bu bulgular fizyolojik siklus bilgisinin doğrudan klinik uygulamasıdır.',
      'Kardiyak Tamponad ve Ses Değişimi',
    ),

    h('Preload, Afterload ve Frank-Starling Mekanizması'),
    p(
      'Preload, diyastol sonunda sarkomerlerin gerilmesine yol açan yüktür; pratikte diyastol sonu hacmi (EDV) veya basıncı (EDP) ile ifade edilir. Afterload, ventrikülün ejeksiyon sırasında karşılaştığı dirençtir; aort basıncı ve sistemik vasküler direnç (SVR) ile belirlenir. İnotropi ise kasılma kuvvetinin kontraktılite ile ilişkili bileşenidir ve kalsiyum duyarlılığına bağlıdır.',
    ),
    p(
      'Frank-Starling mekanizmasına göre, diyastol sonu hacim arttıkça (preload ↑) sarkomerler optimal filament uzunluğuna (≈2,2 µm) yaklaşır; aktin-miyozin örtüşmesi iyileşir ve isovolumik basınç yükselir. Bu sayede kalp, venöz dönüşteki ani artışları herhangi bir nöral uyarı olmaksızın atım hacmini artırarak karşılar. Patolojik aşırı gerilmede (kalp yetmezliğinde olduğu gibi) mekanizma tersine döner ve verim düşer.',
    ),
    spot(
      'Frank-Starling eğrisi sağa kayarsa (inotropik uyarı, örn. katekolaminler) aynı preload için daha yüksek atım hacmi üretilir. Kalp yetmezliğinde eğri sola değil sağa ve aşağı kayar: aynı EDV için daha az atım hacmi.',
    ),

    h('Kalp Sesleri: S1 ve S2'),
    p(
      'Birinci kalp sesi (S1, "lub"), mitral ve triküspid kapakçıklarının sistol başlangıcında kapanmasıyla oluşur. S1’in birinci bileşeni mitral kapağın kapanması, ikinci bileşeni triküspid kapağın kapanmasıdır; normalde tek bir ses olarak algılanır. S1 en iyi apeks üzerinde (mitral alan) dinlenir ve sıklıkla karotis nabzıyla eş zamanlıdır.',
    ),
    p(
      'İkinci kalp sesi (S2, "dub"), aort ve pulmoner kapakçıkların diyastol başlangıcında kapanmasıyla ortaya çıkar. İki bileşenden oluşur: aort kapak kapanması (A2) ve pulmoner kapak kapanması (P2). İspirasyon sırasında venöz dönüş artar ve sağ ventrikül ejeksiyonu uzar; P2 gecikir ve S2 "genişler" (fizyolojik splitting). Ekspirasyonda sesler yeniden birleşir.',
    ),
    table(
      ['Özellik', 'S1 (Lub)', 'S2 (Dub)'],
      [
        ['Kaynak', 'Mitral + triküspid kapağın kapanması', 'Aort + pulmoner kapağın kapanması'],
        ['Zamanlama', 'Sistol başlangıcı (QRS sonrası)', 'Diyastol başlangıcı (T dalgası sonrası)'],
        ['Süre / perde', 'Daha uzun, daha alçak perdeli', 'Daha kısa, daha yüksek perdeli'],
        ['En iyi oskültasyon', 'Apeks (mitral alan)', 'Üst sağ sternum kenarı (aortik alan)'],
        ['Fizyolojik varyant', 'İnsprasyonda hafif şiddetlenir', 'İnsprasyonda genişler (splitting)'],
      ],
      'S1 ve S2 kalp seslerinin karşılaştırılması',
    ),

    h('Ek Kalp Sesleri ve Üfürüm'),
    p(
      'Üçüncü kalp sesi (S3), hızlı ventriküler dolgu sırasında ortaya çıkar; çocuklarda ve gebelerde fizyolojik olabilirken erişkinde kalp yetmezliği ve volüm yüklenmesinin işaretidir. Dördüncü kalp sesi (S4), atriyal sistolun sert, uyumsuz ventrikül duvarına karşı kasılmasıyla oluşur ve ventrikül rijiditesi (hipertrofi, iskemi) ile ilişkilidir.',
    ),
    p(
      'Üfürüm (murmur), türbülanslı kan akımının oluşturduğu seslerdir. Üfürümün zamanlaması (sistolik/diyastolik), perdesi, yoğunluk eğrisi (kreşendo-dekreşendo) ve radyasyon alanı patolojiye işaret eder. Örneğin mitral yetmezlik holosistolik bir üfürüm üretirken, aort darlığı tardus-pardus (yavaş yükselip yavaş düşen) karakterli ejeksiyon üfürümü oluşturur.',
    ),
    clinical(
      'Mitral darlığında (mitral stenosis) S1 şiddetli ve "top gibi" (snapping) duyulur; diyastolik bir rulo üfürüm ve açılış snap (opening snap) karakteristiktir. Aort yetmezliğinde ise diyastolik azalan (decrescendo) üfürüm ve periferik nabızlarda geniş salınım (water-hammer pulse, Corrigan nabzı) birlikte değerlendirilir.',
      'Kapak Hastalıklarında Oskültasyon',
    ),
    spot(
      'Kural: S1 + karotis nabzı eş zamanlıysa nabız olayı sistoldür. Sistolik üfürüm S1 ile S2 arasında, diyastolik üfürüm S2 ile sonraki S1 arasında duyulur. S3 en iyi apekste, sol lateral dekübitus pozisyonunda belirginleşir.',
    ),

    h('Kardiyak Çıktı ve Düzenlenmesi'),
    p(
      'Kardiyak debi (cardiac output, CO) atım hacmi ile kalp atım hızının çarpımıdır (CO = SV × HR). 70 kg’lık bir erişkinde dinlenimde yaklaşık 5 L/dk’dır ve vücut yüzeyine normalize edildiğinde kardiyak indeks 2,5-4 L/dk/m² aralığında kabul edilir. Atım hacmi; preload, afterload ve inotropizm tarafından belirlenir.',
    ),
    li(
      'Kalp atım hızı: Sempatik sinir sistemi (β1) hızlandırır, vagal tonus (M2) yavaşlatır. Baroreseptör refleksi en hızlı düzenleme yoludur.',
      'Atım hacmi: Frank-Starling ile anlık, endokrin mekanizmalarla (adrenal medülla, RAAS) uzun süreli uyarlanır.',
      'Ekstraksiyon rezervi: Oksijen ekstraksiyon oranı dinlenimde %25 iken maksimum eforda %70-80’e çıkar; kalp bu yüzden iskemiye en duyarlı organdır.',
    ),
    clinical(
      'Kronik kalp yetmezliğinde atım hacmi düşüktür; kompanzasyon olarak sempatik aktivasyon ve RAAS uyarılır. Ancak uzun süren nörohormonal aktivasyon afterload’u artırarak ölümcül kısır döngüye (remodeling, dilatasyon) yol açar. Bu nedenle ACE inhibitörleri ve beta blokerler mortaliteyi azaltır.',
      'Kalp Yetezliğinde Nörohormonal Kısır Döngü',
    ),

    h('Olayların Zaman Çizelgesi ve Sentez'),
    p(
      'Bir kardiyak siklusu EKG üzerinde şöyle okuyun: P dalgasından sonra atriyal sistol tamamlanır; QRS ile ventriküller depolarize olur, mitral kapak kapanır ve S1 duyulur (izovolümik kasılma). R dalgasının zirvesinden sonra aort kapağı açılır, ejeksiyon gerçekleşir. T dalgasının bitiminde ventriküller repolarize olur, aort kapağı kapanır ve S2 duyulur; ardından hızlı ventriküler dolgu (S3’ün oluşabileceği evre) ve atriyal sistol (S4) gelir.',
    ),
    li(
      'S1 ↔ QRS ↔ mitral kapak kapanması ↔ sistol başlangıcı',
      'S2 ↔ T dalgası sonu ↔ aort kapak kapanması ↔ diyastol başlangıcı',
      'S3 ↔ hızlı dolgu fazı (protodiastol)',
      'S4 ↔ atriyal sistol (presistol)',
      'P dalgası ↔ atriyal depolarizasyon ↔ a dalgası (juguler ven)',
    ),
    clinical(
      'Juguler ven nabzındaki a dalgası atriyal sistolü yansıtır; triküspid darlığında belirginleşir. Konsolide bir muayene yaklaşımında juguler ven dalga analizi, kalp sesleri ve periferik nabızlar birlikte yorumlanmalıdır.',
      'Juguler Ven Dalgaları ile Kardiyak Siklus İlişkisi',
    ),
    spot(
      'Sınav klasiği: "Kardiyak siklusta hacmin en çok arttığı faz?" → Hızlı ventriküler dolgu. "Basıncın hacim sabitken en çok arttığı faz?" → İzovolümik kasılma. "En yüksek oksijen tüketimi hangi fazda?" → İzovolümik kasılma (duvar gerilimi maksimum).',
    ),

    h('Özet ve Hızlı Tekrar'),
    li(
      'Kardiyak siklus = elektriksel aktivasyon + mekanik kasılma + kapak olayları + ses üretimi.',
      'S1 (mitral/triküspid) sistol başı, S2 (aort/pulmoner) diyastol başıdır.',
      'Preload ↑ → Frank-Starling ile SV ↑; afterload ↑ → SV ↓; inotropi ↑ → eğri sağa kayar.',
      'S3 = hızlı dolgu (volüm yükü), S4 = atriyal kick (rijit ventrikül).',
      'Üfürüm = türbülans; zamanlama ve radyasyon lezyonu lokalize eder.',
    ),
    spot(
      'S2’nin genişlemesi (splitting) patolojikse sağ dal bloğu (genişleme kalıcı) veya ASD (fixed splitting, "sabit splitting") düşünülmelidir. Sabit splitting, atriyal septal defektin klasik oskültasyon bulgusudur.',
    ),
  ],
};

/* ===========================================================================
   DERS NOTU 2 — Aksiyon Potansiyeli ve Sinaptik İletim
   =========================================================================== */

export const ACTION_POTENTIAL: LibraryResource = {
  id: 'aksiyon-potansiyeli',
  title: 'Aksiyon Potansiyeli ve Sinaptik İletim',
  subtitle: 'Dinlenim potansiyeli, faz 0-4, refrakter dönem ve nörotransmitter serbestleşmesi',
  term: 'Dönem 2',
  committee: COMMITTEES[1],
  course: 'Fizyoloji',
  resourceType: 'Ders Notu',
  author: 'HipokLab Akademik Kurul',
  updatedAt: '2026-11-18',
  minutes: 24,
  blocks: [
    h('Dinlenim Membran Potansiyeli'),
    p(
      'Hücrelerin dinlenim halindeki membran potansiyeli tipik olarak −70 mV civarındadır ve üç temel mekanizmanın dengesiyle korunur: (1) K⁺’nın pasif sızıntısı (potasyum sızıntı kanalları), (2) Na⁺/K⁺-ATPaz pompasının her çevrimde 3 Na⁺ dışarı, 2 K⁺ içeri taşıması, (3) büyük ölçüde geçirimsiz olan organik anyonların (protein, ATP) hücre içinde kalması. Bu denge Goldman-Hodgkin-Katz denklemi ile modellenir ve dinlenim potansiyeli K⁺ denge potansiyeline (≈ −90 mV) en yakın değerde seyreder.',
    ),
    p(
      'Dinlenim potansiyeli yalnızca pasif bir bekleme hali değil, aktif bir homeostaz durumudur. Na⁺/K⁺-ATPaz toplam bazal enerji tüketiminin %20-40’ını tek başına harcar; bu yüzden iskemide ATP azalınca membran potansiyeli hızla bozulur ve hücre şişer.',
    ),
    spot(
      'Dinlenim potansiyeli büyük ölçüde K⁺ sızıntısına bağlıdır. Ekstrasellüler K⁺ artarsa (hiperkalemi) K⁺ denge potansiyeli yükselir (−90 → −80 mV), membran kısmen depolarize olur ve kardiyak aritmi riski doğar.',
    ),

    h('Aksiyon Potansiyelinin Fazları'),
    p(
      'Aksiyon potansiyeli (AP), eşik değerin aşılmasıyla membran potansiyelinin hızlı ve geri dönüşümlü bir depolarizasyon dalgası üretmesidir. "Her şey ya da hiçbir şey" (all-or-none) ilkesi uyarınca AP’nin genliği uyaran gücünden bağımsızdır; uyaran gücü yalnızca AP frekansını artırır.',
    ),
    table(
      ['Faz', 'Olay', 'İyon Akımları'],
      [
        ['Faz 4 (dinlenim)', '−70 mV sabit', 'K⁺ sızıntısı, Na⁺/K⁺ ATPaz'],
        ['Faz 0 (yükseliş)', 'Hızlı depolarizasyon', 'Voltaj kapılı Na⁺ kanalları açılır (Na⁺ içeri)'],
        ['Faz 1 (erken repolarizasyon)', 'Kısa tepe düşüşü', 'Na⁺ kanalları inaktive, A tipi K⁺ açılır'],
        ['Faz 2 (plato)', 'Uzayan plato (kalp kası)', 'Ca²⁺ içeri ↔ K⁺ dışarı dengesi'],
        ['Faz 3 (repolarizasyon)', 'Hızlı geri dönüş', 'K⁺ kanalları açık, Ca²⁺ kanalları kapanır'],
        ['Faz 4 (hücre tipi)', 'Sinirde dinlenim; SA nodunda yavaş depolarizasyon', 'If (funny current) — kalp otomatisitesi'],
      ],
      'Aksiyon potansiyeli fazları — nöron ve kalp kası için ortak şema',
    ),
    p(
      'İskelet kası ve sinir liflerinde AP yaklaşık 1-2 ms sürerken, kalp kasının plato fazı (Faz 2) nedeniyle 200-300 ms uzar. Platonun nedeni L-tipi voltaj kapılı Ca²⁺ kanallarının yavaş inaktivasyonudur; bu uzun refrakter dönem kalp kasının tetanize olmasını (sürekli kasılma) engeller ve dolaşımın sürekliliğini garanti eder.',
    ),
    clinical(
      'Hiperkalemide (K⁺ > 6 mEq/L) dinlenim potansiyeli yükselir; önce kas irritabilitesi artar, ilerleyen dönemde Na⁺ kanalları inaktif durumda kalır ve kas felci gelişir. EKG’de T dalgası dikleşir, P dalgası kaybolur ve "sinüs dalgası" (sine wave) görünümü ortaya çıkar — bu bir acil durumdur.',
      'Hiperkaleminin Elektrofizyolojisi',
    ),

    h('Eşik, Refrakter Dönem ve İletim Hızı'),
    p(
      'Eşik potansiyeli (threshold), voltaj kapılı Na⁺ kanallarının pozitif geri besleme ile kitlesel açılışını başlatan kritik depolarizasyon düzeyidir (tipik olarak −55 mV). Eşik aşılırsa AP tam genlikte üretilir; aşılmazsa yalnızca lokal (lokal anesteziklerin hedeflediği) gradüel potansiyel kalır.',
    ),
    li(
      'Mutlak refrakter dönem: Na⁺ kanalları inaktif konumdadır; hiçbir uyaran yeni AP başlatamaz. AP yönünün tek yönlü olmasını sağlar.',
      'Göreli refrakter dönem: Bazı Na⁺ kanalları kapanmaya başlamıştır; normalden güçlü bir uyaran AP başlatabilir. AP frekansının üst sınırını belirler.',
      'Ateşleme frekansı: Refrakter süre kısaldıkça (ör. soğukta sinir iletimi yavaşlar) maksimum frekans düşer.',
    ),
    p(
      'İletim hızını belirleyen başlıca iki faktör akson çapı ve miyelinleşmedir. Miyelinli aksonlarda akım Ranvier boğumları arasında sıçrayarak (saltatorik iletim, saltus) ilerler; iletim hızı 100 m/s’ye kadar çıkabilir. Demiyelinizan hastalıklarda (multipl skleroz) iletim bloklanır veya dispersiyon (zaman farklılaşması) ortaya çıkar.',
    ),
    clinical(
      'Lokal anestezikler (lidokain, prokain) voltaj kapılı Na⁺ kanallarının sitoplazmik ağzını bloke ederek Faz 0 yükselişini engeller. Etkileri hızla ateşlenen (yüksek frekanslı) liflerde (ağrı, sıcaklık) daha hızlı başlar; bu duruma "frekans bağımlı blok" denir.',
      'Lokal Anesteziklerin Mekanizması',
    ),
    spot(
      'İskelet kasında mutlak refrakter dönem çok kısa olduğu için yüksek frekanslı uyarılarla tetanizasyon mümkünken, kalp kasında plato fazı uzun mutlak refrakter dönem yaratır ve tetanizasyon imkânsızdır. Bu klasik bir sınav karşılaştırmasıdır.',
    ),

    h('Sinaptik İletim: Presinaptik Olaylar'),
    p(
      'Sinaps, presinaptik terminal, sinaptik aralık (≈20 nm) ve postsinaptik membrandan oluşur. AP terminale ulaştığında voltaj kapılı Ca²⁺ kanalları (N-tipi ve P/Q-tipi) açılır; Ca²⁺ girişi sinaptotagmin proteinini tetikleyerek sinaptik veziküllerin presinaptik membranla füzyonunu (ekzositoz) başlatır. Nörotransmitterler kuantal (paket) halinde salınır.',
    ),
    li(
      'Sentez: Nörotransmitterler terminalde sentezlenebilir (ör. asetilkolin, ACh) veya akson boyunca taşınabilir (ör. katekolaminler, veziküllerde depolanır).',
      'Salınım: Ca²⁺ bağımlı ekzositoz; her vezikül bir "kuantum" içerir (miniature end-plate potential).',
      'Uzaklaştırma: Diffüzyon, enzimatik yıkım (ACh → asetat + kolin, asetilkolinesteraz), geri alım (transporterlar) veya nöroglial tutulum.',
      'Reseptörler: İyontroprik (hızlı, iyon kanalı; örn. nAChR, GABA-A) ve metabotropik (yavaş, G proteinine bağlı; örn. muskarinik reseptörler).',
    ),
    clinical(
      'Myastenia gravis, postsinaptik nAChR reseptörlerine karşı otoantikorların üretildiği bir hastalıktır; kas güçsüzlüğü gün içinde artar (yorgunluk). Antikolineresteraz ilaçlar (neostigmin) sinaptik ACh düzeyini artırarak iletimi geçici olarak düzeltir. Buna karşılık botulinum toksini presinaptik ekzositozu bloke ederek flaksid paralizi yapar.',
      'Nöromusküler Kavşak Hastalıkları',
    ),

    h('Postsinaptik Potansiyeller ve Tümleyim'),
    p(
      'Nörotransmitter postsinaptik membranda iyon akımlarını değiştirir. Eksitatuar postsinaptik potansiyel (EPSP) depolarizasyon (Na⁺/Ca²⁺ içeri) ile eşik değerine yaklaştırır; inhibituar postsinaptik potansiyel (IPSP) ise hiperpolarizasyon (Cl⁻ içeri veya K⁺ dışarı) ile eşikten uzaklaştırır. EPSP ve IPSP gradüel (oransal) potansiyellerdir; yalnızca nükleer tepe (hücre gövdesi / akson tepe Tepesi) üzerinde toplanırlar.',
    ),
    li(
      'Zamansal tümleyim (temporal summation): Aynı presinaptik liften gelen hızlı, art arda uyarıların etkileri üst üste biner.',
      'Uzamsal tümleyim (spatial summation): Farklı sinir uçlarından eş zamanlı gelen EPSP/IPSP’ler hücre gövdesinde toplanır.',
      'Öğrenme ve hafıza mekanizmalarında (LTP — uzun süreli potansiyasyon) NMDA reseptörleri Ca²⁺ girişiyle sinaptik gücü kalıcı artırır.',
    ),
    spot(
      'Eşikte toplanan net depolarizasyon ≥ 10-15 mV ise akson tepesinde AP tetiklenir. IPSP baskın olursa AP hiç oluşmaz — sinir sisteminin "karar noktası" budur.',
    ),

    h('Nörotransmitter Sınıfları'),
    table(
      ['Nörotransmitter', 'Sınıf', 'Tipik Etki', 'Klinik Not'],
      [
        ['Asetilkolin (ACh)', 'Kolinerjik', 'Eksitatuar (nAChR), inhibituar (M2 kalp)', 'Myastenia gravis, Alzheimer'],
        ['Noradrenalin (NE)', 'Katekolamin', 'Eksitatuar (α1), inhibituar (α2, β2)', 'Depresyon, hipertansiyon'],
        ['Dopamin (DA)', 'Katekolamin', 'Yolağa bağlı (D1 eksitatuar, D2 inhibituar)', 'Parkinson, psikoz, bağımlılık'],
        ['Serotonin (5-HT)', 'İndolamin', 'Çoğunlukla modülatör', 'Depresyon, anksiyete, migren'],
        ['GABA', 'Amino asit', 'İnhibituar (GABA-A: Cl⁻; GABA-B: K⁺)', 'Epilepsi, anksiyete, sedasyon'],
        ['Glutamat', 'Amino asit', 'Ana eksitatuar (AMPA, NMDA, kainat)', 'Eksitotoksisite, inme, epilepsi'],
        ['Glisin', 'Amino asit', 'İnhibituar (omurilik, batın)', 'Tetanos toksini glisin salınımını bloke eder'],
        ['Endorfin / Enkefalin', 'Peptid', 'Ağrı modülasyonu (μ, δ, κ opioid reseptörleri)', 'Analjezi, bağımlılık'],
      ],
      'Başlıca nörotransmitterlerin sınıflandırılması ve klinik ilişkileri',
    ),
    clinical(
      'Tetanoz toksini (Clostridium tetani), omurilik internöronlarından glisin ve GABA salınımını inhibe ederek spastik paralizi ve trismus (çene kilitlenmesi) yapar. Botulinum toksini ise tam tersi yönde, presinaptik ACh salınımını bloke ederek flaksid paralizi oluşturur — ikisi mükemmel bir sınav karşılaştırmasıdır.',
      'Tetanus vs Botulizm',
    ),

    h('Özet ve Hızlı Tekrar'),
    li(
      'Dinlenim potansiyeli ≈ −70 mV; K⁺ sızıntısı ve Na⁺/K⁺ ATPaz tarafından korunur.',
      'AP Faz 0 = Na⁺ içeri (hızlı); Faz 3 = K⁺ dışarı (repolarizasyon); plato (kalp) = Ca²⁺.',
      'Mutlak refrakter dönem → tek yönlü iletim; göreli refrakter dönem → frekans sınırı.',
      'Sinaptik iletim: Ca²⁺ girişi → vezikül füzyonu → nörotransmitter → reseptör → EPSP/IPSP.',
      'Miyelin ve akson çapı iletim hızını belirler; demiyelinizasyon iletim dispersiyonu yapar.',
    ),
    spot(
      'NMDA reseptörü "koinsidens dedektörü"dür: hem glutamat bağlanması hem postsinaptik depolarizasyon (Mg²⁺ bloğunun kalkması) gerektirir. Bu özellik öğrenme ve hafızanın moleküler temelidir.',
    ),
  ],
};

/* ===========================================================================
   DERS NOTU 3 — Kraniyal Sinirler ve Çekirdekleri
   =========================================================================== */

export const CRANIAL_NERVES: LibraryResource = {
  id: 'kraniyal-sinirler',
  title: 'Kraniyal Sinirler ve Çekirdekleri',
  subtitle: 'On iki çift kraniyal sinirin kökeni, dağılımı, foramenleri ve klinik lezyon bulguları',
  term: 'Dönem 2',
  committee: COMMITTEES[1],
  course: 'Anatomi',
  resourceType: 'Ders Notu',
  author: 'HipokLab Akademik Kurul',
  updatedAt: '2026-11-18',
  minutes: 26,
  blocks: [
    h('Genel Plan: Kökler, Çekirdekler ve Sınıflandırma'),
    p(
      'Kraniyal sinirler (nervi craniales) beyin sapı ve beyinden çıkar; 12 çift olarak numaralandırılır ve işlevlerine göre duyusal (afferent), motor (efferent) veya karma olarak sınıflandırılır. Beyin sapından çıkan sinirlerin (III-XII) çekirdekleri orta beyin, pons ve medulla oblongata içinde yerleşir; I (olfaktör) ve II (optik) sinirler ise telensefalonun uzantısı kabul edilir ve meninkslerle sarılı oldukları için aslında birer beyin sapı türevi değil, beyin özü (tracts) olarak değerlendirilir.',
    ),
    li(
      'Duyusal: I (olfaktör), II (optik), VIII (vestibülokoklear)',
      'Motor: III (okülomotor), IV (troklear), VI (abducens), XI (aksesuar), XII (hipoglossal)',
      'Karma: V (trigeminal), VII (fasiyal), IX (glossofaringeal), X (vagus)',
      'Parasempatik bileşen taşıyanlar: III, VII, IX, X (okülomotorun Edinger-Westphal çekirdeği, superior/inferior salivatuar çekirdekler, dorsal motor çekirdek)',
    ),
    p(
      'Kraniyal sinir muayenesi bir lokalizasyon sanatıdır: pupil yanıtı, göz hareketleri, yüz simetrisi, tat, işitme, dil hareketleri ve farenks refleksi tek tek değerlendirilerek lezyonun nükleer, fasciküler veya periferik olduğu ayırt edilir.',
    ),

    h('I. Olfaktör Sinir (N. Olfactorius)'),
    p(
      'Koku duyusunu taşır. Koku epiteli (nazal mukozanın üst kısmı) reseptör nöronlarının aksonları lamina kribrosa’dan geçerek bulbus olfactorius’a ulaşır; buradan sinaptik bağlantı sonrası koku yolu (tractus olfactorius) üzerinden piriform korteks, amigdala ve hipotalamusa iletilir. Koku yolu, talamustan geçmeden kortekse ulaşan tek duyusal sistemdir.',
    ),
    clinical(
      'Anosmi (koku kaybı) burun travmalarında lamina kribrosa seviyesinde aksonların kopmasıyla sık görülür. Foster-Kennedy sendromunda frontal taban tümörü ipsilateral optik atrofi ve kontralateral papilloedem ile birlikte anosmiye yol açar. Koku halüsinasyonları (osmia) temporal lob epilepsisinin aura bulgusu olabilir.',
      'Koku Yolu ve Klinik İlişkiler',
    ),

    h('II. Optik Sinir (N. Opticus) ve Vizüel Yol'),
    p(
      'Retina ganglion hücrelerinin aksonları optik siniri oluşturur; kiazma seviyesinde nasal lifler (temporal görme alanından sorumlu) karşı tarafa geçer, temporal lifler aynı tarafta kalır. Kiazma sonrası optik trakt, corpus geniculatum laterale’de sinaps yapar ve radiatio optica aracılığıyla oksipital korteksin area striata’sına (V1) ulaşır.',
    ),
    table(
      ['Lezyon Seviyesi', 'Görme Alanı Defekti'],
      [
        ['Retina / optik sinir', 'İpsilateral monooküler görme kaybı (amaurosis)'],
        ['Optik kiazma (ortası)', 'Bitemporal hemianopsi (hipofiz adenomu!)'],
        ['Optik trakt', 'Kontralateral homonim hemianopsi'],
        ['Radiatio optica (parietal)', 'Kontralateral alt kadrantanopsi ("pie in the sky" değil, "pie on the floor")'],
        ['Oksipital korteks', 'Kontralateral homonim hemianopsi + maküler korunma'],
      ],
      'Vizüel yol seviyelerine göre görme alanı defektleri',
    ),
    spot(
      'Bitemporal hemianopsi = kiazma basısı (hipofiz adenomu, kraniyo-faringiom). Homonim hemianopsi = kiazma sonrası lezyon. Bu ayrım her sınavda sorulur.',
    ),

    h('III, IV ve VI. Sinirler: Göz Hareketleri'),
    p(
      'N. oculomotorius (III) orta beyinden çıkar; gözün içi kasları (m. rectus medialis, inferior, superior, m. obliquus inferior) ve m. levator palpebrae superioris’i innerve eder. Ayrıca parasempatik lifler (Edinger-Westphal çekirdeği) siliyer ganglion üzerinden m. sphincter pupillae ve m. ciliaris’i uyararak pupilde konstriksiyon ve akomodasyonu sağlar.',
    ),
    p(
      'N. trochlearis (IV) dorsal yüzeyden çıkan tek kraniyal sinirdir ve m. obliquus superior’u innerve eder; başın karşı tarafa eğilmesiyle aşağı-bakış hareketini kolaylaştırır. N. abducens (VI) m. rectus lateralis’i innerve eder ve abduksiyonu sağlar.',
    ),
    clinical(
      'III. sinir paralizisinde göz "aşağı-dışa" sapar (abduksiyon ve aşağı bakış serbest), ptoz gelişir ve parasempatik tutulum nedeniyle midriyazis (dilate pupil) izlenir — bu bulgu unkal herniasyonun (posterior communicating arter anevrizması) acil bir işaretidir. IV. sinir lezyonunda merdiven inerken diplopi ve başın karşı tarafa eğik tutulması (kompansatuar baş pozisyonu) tipiktir.',
      'Okülomotor Paraliziler ve Klinik',
    ),

    h('V. Trigeminal Sinir (N. Trigeminus)'),
    p(
      'En büyük kraniyal sinirdir; duyusal kökü (pons’tan) ve motor kökü (pons’tan, m. masseter, temporalis, pterygoidler) taşır. Üç ana dal oluşturur: V1 (oftalmik), V2 (maksiller), V3 (mandibular). Yüzün duyusunu, kornea refleksini ve çiğneme kaslarının motor kontrolünü sağlar.',
    ),
    table(
      ['Dal', 'Foramen', 'Duyusal Alan', 'Önemli Dallar'],
      [
        ['V1 (oftalmik)', 'Fissura orbitalis superior', 'Alın, üst göz kapağı, kornea', 'N. frontal, n. nasociliaris, n. lacrimalis'],
        ['V2 (maksiller)', 'Foramen rotundum', 'Orta yüz, üst dişler, burun mukozası', 'N. infraorbitalis, n. zygomaticus, n. pterygopalatinus'],
        ['V3 (mandibular)', 'Foramen ovale', 'Alt yüz, alt dişler, dilin ön 2/3 duyusu', 'N. alveolaris inferior, n. lingualis, n. auriculotemporalis'],
      ],
      'Trigeminal dalların foramen geçişleri ve duysal dağılımı',
    ),
    clinical(
      'Kornea refleksi afferent kol V1, efferent kol VII (orbicularis oculi) ile yürür. Trigeminal nevralji (tic douloureux) V2/V3 dağılımında elektrik çarpması tarzında, tetikleyici noktalarla (yüz yıkama, çiğneme) tetiklenen ataklar yapar; sıklıkla superior serebellar arterin sinir köküne basısıyla ilişkilidir.',
      'Kornea Refleksi ve Trigeminal Nevralji',
    ),

    h('VII. Fasiyal Sinir (N. Facialis)'),
    p(
      'Pons-medulla birleşiminden çıkan fasiyal sinir, internal akustik kanal → fallop kanalı (facial canal) yolunu izler ve foramen stylomastoideum’dan çıkar. Dört ana işlev taşır: (1) yüz mimik kaslarının motor inervasyonu (m. stapedius dahil), (2) tat duyusu (dilin ön 2/3’ü, chorda tympani), (3) submandibular ve sublingual bezlerin sekresyonu (salivatuar lifler), (4) kulak cildinin küçük bir alanının duyusu.',
    ),
    p(
      'Çekirdekleri: motor çekirdek (pons), superior salivatuar çekirdek (lakrimal ve tükürük), solitarius çekirdek (tah), spinal trigeminal çekirdek (kulak cildi duyusu). Stapedius kası ani yüksek seslere karşı refleks kasılma yapar; fasiyal paralizide bu refleks kaybolur ve hasta seslere karşı hassasiyet (hiperakuzi) bildirir.',
    ),
    clinical(
      'Bell paralizisi (idiyopatik periferik fasiyal paralizi) alın dahil tüm yüz kaslarında tek taraflı güçsüzlük yapar: alın kırışıklığı kaybolur, göz kapatılamaz (lagophtalmos), ağız köşesi sarkar. Santral (üst motor nöron) lezyonda ise alın kasları bilateral inervasyon nedeniyle korunur — bu kritik ayrım "alın tutuluyor mu?" sorusuyla yapılır.',
      'Periferik vs Santral Fasiyal Paralizi',
    ),
    spot(
      'Periferik fasiyal paralizi = tüm yüz etkilenir (alın dahil). Santral = alın korunur, yalnız alt yüz etkilenir (supranükleer). Chorda tympani lezyonunda tat kaybı + tükürük azalması eklenir.',
    ),

    h('VIII. Vestibülokoklear Sinir'),
    p(
      'İşitme (koklear kısım) ve denge (vestibüler kısım) duyularını taşır. Koklear bileşen spiral gangliondan başlar, internal akustik kanaldan geçerek nucleus cochlearis’e ulaşır; vestibüler bileşen vestibüler gangliondan gelir ve vestibüler çekirdeklere sinaps yapar. İşitme yolu bilateral olarak kortekse (temporal gyrus) ulaşır; bu nedenle tek taraflı santral lezyon tam sağırlık yapmaz.',
    ),
    p(
      'Oskültasyon testleri: Weber testinde çatal sesi alın üzerine konur; normalde orta hatta duyulur. Konduktif (iletimsel) işitme kaybında ses lezyon tarafına lateralize olur (kemik iletimi göreceli olarak artar). Sinirsel (sensörinöral) kayıpta ise ses sağlam tarafa lateralize olur. Rinne testinde kemik iletimi normalde hava iletiminden kısadır; konduktif kayıpta bu ilişki tersine döner.',
    ),
    clinical(
      'Vestibüler schwannoma (akustik nörinom) genellikle VIII. sinirin vestibüler bölümünden kaynaklanır ve işitme kaybı, tinnitus, dengesizlik üçlüsüyle seyreder. İlerleyen dönemde V ve VII sinirleri de baskı altında kalarak yüz uyuşukluğu ve fasiyal güçsüzlük eklenir.',
      'Akustik Nörinom',
    ),

    h('IX, X ve XI. Sinirler: Farenks, Larenks ve Vagus'),
    p(
      'Glossofaringeal sinir (IX) dilin posterior 1/3’ünün duyusu ve tat, farenks kasları (m. stylopharyngeus), parotis bezinin sekresyonu ve sinüs karoticus baroreseptörleri (aferent kol) ile ilişkilidir. Vagus siniri (X) boyun ve karın organlarının geniş parasempatik inervasyonunu sağlar; larenks ve farenks kaslarının motor kontrolü (n. laringeus superior ve recurrens) vagusa aittir.',
    ),
    p(
      'Aksesuar sinir (XI) sternokleidomastoid ve trapezius kaslarını innerve eder; başın karşı tarafa dönmesi ve omuz kaldırma hareketlerinden sorumludur. Hipoglossal sinir (XII) dilin ekstrinsik ve intrinsik kaslarını (genioglossus, hyoglossus, styloglossus, intrinsikler) kontrol eder; dil protrüzyonu lezyon tarafına doğru sapar.',
    ),
    clinical(
      'N. laringeus recurrens (özellikle sol) aort arkası ve mediasten yapısıyla yakın komşuluktadır; tiroid cerrahisi veya mediastinal tümörlerde hasarlanırsa ses kısıklığı (hoarseness) gelişir. Vagal tonus artışı (vazovagal senkop) bradikardi ve hipotansiyonla bayılmaya yol açar — bu refleksin afferent ve efferent kolları IX ve X sinirleridir.',
      'Rekürren Laringeal Sinir ve Vagal Refleksler',
    ),
    spot(
      'Dilin protrüzyonunda sapma lezyon tarafını gösterir (genioglossus kası dili karşı tarafa iter). Uvula sapması ise lezyonun karşı tarafına doğrudur — uvula’yı yukarı çeken kaslar bilateral inerve edilir ve sağlam taraf çeker.',
    ),

    h('Foramenler ve Çıkış Noktaları Hızlı Tablosu'),
    table(
      ['Foramen / Açıklık', 'Geçen Yapılar'],
      [
        ['Lamina kribrosa (ethmoid)', 'N. olfactorius (I)'],
        ['Canalis opticus', 'N. opticus (II), a. ophthalmica'],
        ['Fissura orbitalis superior', 'N. oculomotorius (III), N. trochlearis (IV), N. abducens (VI), N. ophthalmicus (V1)'],
        ['Foramen rotundum', 'N. maxillaris (V2)'],
        ['Foramen ovale', 'N. mandibularis (V3)'],
        ['Foramen spinosum', 'A. meningea media'],
        ['Meatus acusticus internus', 'N. facialis (VII), N. vestibulocochlearis (VIII)'],
        ['Foramen jugulare', 'N. glossopharyngeus (IX), N. vagus (X), N. accessorius (XI)'],
        ['Canalis hypoglossi', 'N. hypoglossus (XII)'],
        ['Foramen stylomastoideum', 'N. facialis (VII) — çıkış'],
      ],
      'Kraniyal sinirlerin kafa tabanı deliklerinden geçişleri',
    ),

    h('Özet ve Hızlı Tekrar'),
    li(
      'I-II: telensefalon türevi; III-XII: beyin sapı çekirdeklerinden.',
      'Göz hareketleri: III (medial/inferior/superior + ptoz), IV (superior oblik), VI (lateral rektus).',
      'V: yüz duyusu + çiğneme; VII: yüz motor + tat (ön 2/3) + tükürük.',
      'IX: posterior 1/3 tat + farinks; X: larenks + visseral parasempatik; XI: SCM + trapezius; XII: dil motor.',
      'Foramen rotundum = V2, ovale = V3, jugulare = IX-X-XI, stylomastoideum = VII.',
    ),
    spot(
      'Pupil konstriksiyonu: III. sinir parasempatik (Eddinger-Westphal). Pupil dilatasyonu: sempatik yol (hipotalamus → ciliospinal merkez → superior servikal ganglion → n. nasociliaris). Horner sendromunda miosis, ptoz ve anhidroz birliktedir — sempatik yolun kesintisini gösterir.',
    ),
  ],
};

/* ===========================================================================
   DERS NOTU 4 — Nefron Fizyolojisi ve Glomerüler Filtrasyon
   =========================================================================== */

export const NEPHRON_PHYSIOLOGY: LibraryResource = {
  id: 'nefron-fizyolojisi',
  title: 'Nefron Fizyolojisi ve Glomerüler Filtrasyon',
  subtitle: 'GFR regülasyonu, tübüler reabsorbsiyon-sekresyon ve renal asit-baz dengesi',
  term: 'Dönem 3',
  committee: COMMITTEES[3],
  course: 'Fizyoloji',
  resourceType: 'Ders Notu',
  author: 'HipokLab Akademik Kurul',
  updatedAt: '2026-11-18',
  minutes: 25,
  blocks: [
    h('Nefronun İşlevsel Anatomisi'),
    p(
      'Her böbrekte yaklaşık 1 milyon nefron bulunur ve böbreğin tüm işlevleri bu yapı taşlarının koordinasyonuyla gerçekleşir. Nefronun iki ana tipi vardır: kortikal nefronlar (kısa Henle döngüsü, kortikal medüllaya sınırlı) ve yakınındaki (juxtamedüller) nefronlar (uzun Henle döngüsü, medüllaya derin iner, yoğunluk regülasyonunda belirleyici). Bir nefron; renal korpuskül (glomerulus + Bowman kapsülü), proksimal konvolütübül (PCT), Henle döngüsü (ince kol, kalın kol), distal konvolütübül (DCT) ve toplayıcı kanaldan (collecting duct) oluşur.',
    ),
    p(
      'Jukstaglomerüler aparat (JGA) afferent arteriol, efferent arteriol ve makula densa hücrelerinin komşuluğunda yer alır; glomerüler filtrasyonun oto-regülasyonu ve renin-angiyotensin-aldosteron sisteminin (RAAS) başlatılmasından sorumludur.',
    ),

    h('Glomerüler Filtrasyon ve Bariyer'),
    p(
      'Glomerüler filtrasyon, kapiller basınç ile Bowman kapsülü içi basınç arasındaki net hidrostatik basınç farkı ve ona karşı çalışan onkotik basınç dengesiyle belirlenir. Normalde glomerüler filtrasyon hızı (GFR) erişkinde yaklaşık 125 mL/dk veya 180 L/gündür; bunun %99’undan fazlası tübüllerde geri emilir ve idrarla atılan hacim günde ortalama 1,5 L’dir.',
    ),
    table(
      ['Basınç Bileşeni', 'Değer (mmHg)', 'Etki'],
      [
        ['Glomerüler kapiller hidrostatik basınç', '≈ 60', 'Filtrasyonu destekler'],
        ['Bowman kapsülü hidrostatik basıncı', '≈ 18', 'Filtrasyona karşı direnç'],
        ['Glomerüler kapiller onkotik basınç', '≈ 32', 'Filtrasyona karşı direnç'],
        ['Net filtrasyon basıncı', '≈ 10', 'Filtrasyonun itici gücü'],
      ],
      'Glomerüler filtrasyonun Starling kuvvetleri',
    ),
    p(
      'Glomerüler bariyer üç katmanlıdır: (1) kapiller endotelin fenestrasyonları, (2) glomerüler bazal membran (GBM; tip IV kolajen, laminin, nidogen), (3) podositlerin interdigitasyonları arasındaki slit diyaframlar (nephrin, podocin). Bariyer hem boyut seçici (molekül ağırlığı >70 kDa filtrelenmez) hem yük seçicidir (negatif yüklü albümin itilir).',
    ),
    clinical(
      'Nefrotik sendromda slit diyafram proteinleri (nephrin) hasar görür; bariyerin yük seçiciliği bozularak masif proteinüri (>3,5 g/gün), hipoalbuminemi, ödem ve hiperlipidemi tetiklenir. Diyabetik nefropati ise GBM kalınlaşması ve mesangiyal ekspansiyonla GFR’de kademeli düşüşe yol açar.',
      'Nefrotik Sendrom ve Bariyer Patolojisi',
    ),

    h('GFR’nin Oto-regülasyonu'),
    p(
      'Böbrek, sistemik kan basıncı 80-180 mmHg aralığında değişirken GFR’yi nispeten sabit tutar. Bu oto-regülasyon iki mekanizmayla sağlanır: (1) miyogen refleks — afferent arteriolün gerilmeyle kasılması, (2) tübüloglomerüler geri besleme — makula densa’dan geçen NaCl miktarı arttığında afferent arteriolün vazokonstriksiyonu. Ek olarak sempatik aktivite ve prostaglandinler (vazodilatör, özellikle iskemide) lokal akımı düzenler.',
    ),
    li(
      'Filtrasyon fraksiyonu (FF) = GFR / renal plazma akımı ≈ 0,2 (%20). Efferent arteriol kasılınca FF artar.',
      'Renal plazma akımı (RPF) ≈ 625 mL/dk (PAH klirensi ile ölçülür).',
      'Klirens formülü: C = (U × V) / P; inülin klirensi GFR’nin altın standardıdır.',
      'Kreatinin klirensi pratikte GFR’yi yaklaşık olarak yansıtır (hafif yüksektir; tübüler sekresyon nedeniyle).',
    ),
    spot(
      'İnülin filtrasyonla atılır, geri emilmez veya sekretilmez → GFR ölçümünün altın standardı. PAH (para-aminohipürik asit) hem filtre olur hem sekretilir → efektif renal plazma akımını ölçer.',
    ),

    h('Proksimal Konvolütübül: Toplu Geri Emilim'),
    p(
      'Proksimal konvolütübül (PCT), filtratın yaklaşık %65-70’inin izo-osmotik geri emildiği ana segmenttir. Na⁺/K⁺-ATPaz bazolateral membranda aktif taşıma sağlar; lümendeki Na⁺ glukoz (SGLT2, SGLT1), amino asitler ve H⁺ (Na⁺/H⁺ antiport, NHE3) ile birlikte taşınır. Glukoz taşıması taşınma maksimumu (Tm) ile sınırlıdır; normal kan şekeri düzeylerinde Tm’nin altındadır.',
    ),
    li(
      'Su: Osmotik dengenin korunması için paraselüler yoldan bol miktarda geri emilir (kortikal PCT’de yüksek su geçirgenliği).',
      'Bikarbonat: Karbonik anhidraz inhibitörleri (asetazolamid) burada H⁺ sekresyonunu bloke ederek bikarbonatüri ve metabolik asidoz yapar.',
      'Üre: %50’si PCT’de pasif geri emilir; medüller konsantrasyon gradyanının sürdürülmesine katkıda bulunur.',
      'Fosfat: PTH PCT’de fosfat geri emilimini inhibe eder (fosfatüri).',
    ),
    clinical(
      'Diyabetes mellitusda plazma glukozu renal eşiği (≈180 mg/dL) aştığında SGLT taşıyıcıları doyar; glukoz idrarda osmotik yük oluşturarak osmotik diürez, poliüri ve polidipsiye yol açar. SGLT2 inhibitörleri (empagliflozin) bu mekanizmayı terapötik olarak kullanır; ayrıca glomerüler hipertansiyonu azaltarak nefroprotektif etki gösterir.',
      'Glukozüri ve SGLT2 İnhibitörleri',
    ),

    h('Henle Döngüsü ve Konsantrasyon Mekanizması'),
    p(
      'Henle döngüsü, medüller interstisyumda osmotik gradyan (300 → 1200 mOsm/kg) oluşturarak idrarın konsantre edilmesini sağlar. İnce inen kol su geçirgen, NaCl geçirgenliği düşük olduğu için filtrat medüllaya inerken konsantre olur; ince çıkan kol ise NaCl geçirirken su geçirgenliği düşüktür. Kalın çıkan kolda Na⁺-K⁺-2Cl⁻ (NKCC2) taşıyıcısı aktif olarak NaCl’i lümenden uzaklaştırır — bu taşıyıcı furosemid (loop diüretik) tarafından inhibe edilir.',
    ),
    p(
      'Üre döngüsü: ADH (vazopressin) toplayıcı kanalda üre kanalları (UT-A1) üzerinden üre geri emilimini artırarak medüller gradyanın kuvvetlenmesine katkıda bulunur. Bu mekanizma, özellikle protein alımı yüksek bireylerde idrar konsantrasyon kapasitesini artırır.',
    ),
    table(
      ['Segment', 'Taşınan Maddeler', 'Hormon / İlaç Etkisi'],
      [
        ['PCT', 'Na⁺, glukoz, amino asit, HCO₃⁻, üre', 'Asetazolamid (CA inhibitörü)'],
        ['İnce inen kol', 'Su (pasif)', '— (ADH bağımsız)'],
        ['İnce çıkan kol', 'NaCl (pasif)', '—'],
        ['Kalın çıkan kol', 'Na⁺-K⁺-2Cl⁻ (NKCC2)', 'Furosemid, bumetanid (loop)'],
        ['DCT (erken)', 'Na⁺-Cl⁻ (NCC)', 'Hidroklorotiyazid (tiazid)'],
        ['DCT (geç) / CD', 'Na⁺ (ENaC), K⁺, H⁺, su', 'Aldosteron, ADH, ANP'],
      ],
      'Tübüler segmentlerin taşıma özellikleri ve farmakolojik hedefleri',
    ),

    h('Distan Tübül ve Toplayıcı Kanal: Hormonal Düzenleme'),
    p(
      'Distal konvolütübül ve toplayıcı kanal, hacim ve elektrolit dengesinin ince ayarını yapar. Aldosteron (mineralokortikoid) ENaC sodyum kanalları ve ROMK potasyum kanallarını artırarak Na⁺ geri emilimini ve K⁺ sekresyonunu yükseltir. ADH (vazopressin) tip 2 reseptörler (V2) üzerinden cAMP-PKA yolağını uyararak akvaporin-2 (AQP2) kanallarının apikal membrana taşınmasını sağlar; su geri emilimi artar ve idrar konsantre olur.',
    ),
    li(
      'ANP (atriyal natriüretik peptid) volüm artışında salınır; GFR’yi artırır, Na⁺ geri emilimini azaltır ve renin sekresyonunu baskılar.',
      'PTH (paratiroid hormon) distal tübülde Ca²⁺ geri emilimini artırır, fosfatı azaltır.',
      'Aldosteron antagonistleri (spironolakton, eplerenon) K⁺ tutulumu yapar; hiperkalemi riskine dikkat.',
    ),
    clinical(
      'SIADH (uygunsuz ADH sekresyonu) toplayıcı kanalda su geri emilimini artırarak dilüsyonel hiponatremi ve konsantre idrar yapar. Buna karşılık nefrojenik diyabetes insipidusta böbrekler ADH’ye yanıt vermez (V2 veya AQP2 defekti); seyreltik idrar ve poliüri tablosu gelişir.',
      'SIADH ve Diabetes Insipidus',
    ),

    h('Renal Asit-Baz Dengesi'),
    p(
      'Böbrek asit-baz dengesini üç mekanizmayla sürdürür: (1) filtrelenmiş bikarbonatın geri emilimi (esas olarak PCT), (2) titrasyon asitlerinin (H⁺) atımı, (3) amonyağın (NH₃/NH₄⁺) sentezi ve atımı. PCT’de NHE3 antiportu H⁺ sekresyonuyla bikarbonatı korur; interkalat hücrelerde H⁺-ATPaz ve H⁺/K⁺-ATPaz kanalları idrarı asitleştirir.',
    ),
    li(
      'Tip A interkalat hücreler: H⁺ sekresyonu (H⁺-ATPaz). Distal renal tübüler asidozda (dRTA) bu mekanizma bozulur.',
      'Tip B interkalat hücreler: Bikarbonat sekresyonu (metabolik alkalozda aktifleşir).',
      'Amonyak döngüsü: Glutamin → NH₄⁺ + HCO₃⁻ (proximal); yeni bikarbonat üretimi asidozda 10 kat artar.',
    ),
    spot(
      'Metabolik asidozda böbrek idrar pH’ını 4,5’e kadar düşürebilir (H⁺ gradyanı). Kronik böbrek hastalığında amonyagenezis azalır → normal anyon gap’li (hiperkloremik) metabolik asidoz gelişir.',
    ),

    h('Klinik Uygulama: Diüretiklerin Etki Yerleri'),
    table(
      ['Diüretik Sınıfı', 'Etki Yeri', 'Mekanizma', 'Önemli Yan Etki'],
      [
        ['Loop diüretikler', 'Kalın çıkan kol (NKCC2)', 'Na⁺-K⁺-2Cl⁻ blokajı', 'Hipokalemi, ototoksisite'],
        ['Tiazidler', 'Erken DCT (NCC)', 'Na⁺-Cl⁻ blokajı', 'Hipokalemi, hiperürisemi, hiponatremi'],
        ['Potasyum tutan', 'Geç DCT / CD (ENaC)', 'Aldosteron antagonizması veya ENaC blokajı', 'Hiperkalemi'],
        ['Karbonik anhidraz inhibitörleri', 'PCT (CA)', 'H⁺ sekresyonu azalır', 'Metabolik asidoz, bikarbonatüri'],
        ['Ozmotik diüretikler', 'PCT + döngü (mannitol)', 'Tübüler lümende osmotik yük', 'Hacim artışı, pulmoner ödem riski'],
      ],
      'Diüretiklerin böbrek segmenti ve yan etki profili',
    ),
    clinical(
      'Furosemid, NKCC2 taşıyıcısını bloke ederek medüller gradyanı bozar ve en güçlü diürezi sağlar; buna "yüksek tavanlı diüretik" denir. Ototoksisite riski (özellikle hızla IV verildiğinde) ve işitme kaybı dikkat edilmesi gereken yan etkileridir.',
      'Loop Diüretiklerin Klinik Farmakolojisi',
    ),

    h('Özet ve Hızlı Tekrar'),
    li(
      'GFR ≈ 125 mL/dk; net filtrasyon basıncı ≈ 10 mmHg ve Starling kuvvetleriyle belirlenir.',
      'PCT filtratın %65-70’ini geri emer; glukoz ve amino asitler burada taşınır.',
      'Henle döngüsü medüller gradyanı yaratır; NKCC2 = furosemid hedefi.',
      'ADH (AQP2), aldosteron (ENaC) ve ANP idrar konsantrasyonu-hacmini ayarlar.',
      'İnülin = GFR; PAH = renal plazma akımı; kreatinin = pratik GFR göstergesi.',
    ),
    spot(
      "Bir hastada düşük GFR + normal idrar osmolalitesi + yüksek üre/kreatinin oranı düşünün: prerenal azotemi (volüm kaybı) — böbrek henüz sağlamdır, geri emilim artmıştır.",
    ),
  ],
};

/* ===========================================================================
   DERS NOTU 5 — Hücre İçi Sinyal Yolakları
   =========================================================================== */

export const SIGNALING_PATHWAYS: LibraryResource = {
  id: 'sinyal-yollari',
  title: 'Hücre İçi Sinyal Yolakları',
  subtitle: 'G proteinleri, ikinci haberciler, tirozin kinaz yolağı, JAK-STAT ve nükleer reseptör sinyalizasyonu',
  term: 'Dönem 1',
  committee: COMMITTEES[0],
  course: 'Biyokimya',
  resourceType: 'Ders Notu',
  author: 'HipokLab Akademik Kurul',
  updatedAt: '2026-11-18',
  minutes: 23,
  blocks: [
    h('Sinyal İletiminin Genel Prensipleri'),
    p(
      'Hücreler büyümelerini, farklılaşmalarını ve metabolizmalarını çevrelerinden gelen sinyallerle düzenler. Sinyal iletimi dört adımdan oluşur: (1) ligandın reseptöre bağlanması, (2) reseptörün konformasyonel değişimi ve hücre içi sinyalin başlatılması, (3) ikinci haberci veya efektör proteinler aracılığıyla sinyalin amplifikasyonu ve yayılması, (4) hedef genlerin ya da enzimlerin düzenlenmesi ve sinyalin sonlandırılması. Bu süreçteki her adım farmakolojik hedef veya patolojik mutasyon noktası olabilir.',
    ),
    p(
      'Reseptörler üç büyük sınıfta toplanır: G proteinine bağlı reseptörler (GPCR, 7-transmembran), tirozin kinaz aktiviteli reseptörler (RTK) ve iyon kanalı reseptörleri. Ayrıca steroid hormon reseptörleri gibi liganda bağlı transkripsiyon faktörleri doğrudan gen ekspresyonunu düzenler.',
    ),

    h('G Proteinine Bağlı Reseptörler (GPCR)'),
    p(
      'GPCR’ler hücre yüzeyinde yedi transmembran domenden oluşur ve ligand bağlandığında heterotrimerik G proteinini (Gα, Gβ, Gγ) aktive eder. Gα alt birimi GDP’yi GTP ile değiştirir ve efektör proteine (adenilat siklaz, fosfolipaz C vb.) bağlanır. Gα’nın kendi GTPaz aktivitesi sinyali sonlandırır; GTP hidroliz edilir ve G proteini yeniden inaktif konuma döner.',
    ),
    table(
      ['G Proteini', 'Efektör', 'İkinci Haberci', 'Örnek Reseptör'],
      [
        ['Gs', 'Adenilat siklaz ↑', 'cAMP ↑ → PKA', 'β-adrenerjik, glukagon, ACTH'],
        ['Gi', 'Adenilat siklaz ↓', 'cAMP ↓', 'M2 muskarinik, α2-adrenerjik, opioid'],
        ['Gq', 'Fosfolipaz C ↑', 'IP₃ + DAG → Ca²⁺ / PKC', 'α1-adrenerjik, H1, V1, TRH'],
        ['G12/13', 'Rho GTPaz', 'Sitokin iskeleti', 'Trombin reseptörü, lizofosfatidik asit'],
        ['Gt (transducin)', 'Fosfodiesteraz ↑', 'cGMP ↓ (görme)', 'Rodopsin (retina)'],
      ],
      'Heterotrimerik G proteinleri ve efektör sistemleri',
    ),
    clinical(
      'Kolera toksini (Vibrio cholerae) Gs alt birimini ADP-ribosilleyerek GTPaz aktivitesini durdurur; adenilat siklaz sürekli aktif kalır, enterositlerde cAMP yükselir ve lümene masif Cl⁻/Na⁺/su sekresyonu olur — sulu "pirinç suyu" ishal. Boğmaca toksini ise Gi’yi inhibe ederek cAMP artışına yol açar.',
      'Kolera ve Boğmaca Toksinleri',
    ),

    h('cAMP-PKA Yolağı ve Desensitizasyon'),
    p(
      'Adenilat siklaz ATP’yi cAMP’ye çevirir; cAMP proteinkinaz A’nın (PKA) regülatör alt birimlerine bağlanarak katalitik birimleri serbest bırakır. PKA, CREB (cAMP response element-binding protein) transkripsiyon faktörünü fosforile ederek hedef genlerin ekspresyonunu başlatır. Karaciğerde glikojen fosforilazını aktive ederken glikojen sentazını inhibe eder; bu, glukagonun glikojenoliz yanıtını açıklar.',
    ),
    li(
      'Fosfodiesteraz (PDE) cAMP’yi 5’-AMP’ye hidroliz ederek sinyali sonlandırır. Kafein PDE inhibitörüdür; sildenafil (viagra) PDE5 inhibitörü olarak cGMP düzeyini artırır.',
      'Reseptör desensitizasyonu: Sürekli uyarıda β-arrestin reseptöre bağlanır, G proteinini bloke eder ve reseptör internalize edilir (downregulation). Bu mekanizma toleransın (ör. opioid, β-agonist) moleküler temelidir.',
      'Cholera-esque kalıcı aktivasyon ile desensitizasyon arasındaki denge, sinyal sürekliliğini belirler.',
    ),

    h('Fosfolipaz C — IP₃ / DAG Yolağı'),
    p(
      'Gq proteiniyle eşleşen reseptörler fosfolipaz C-β’yı (PLCβ) aktive eder. PLC, membran fosfolipidi PIP₂’yi ikiye böler: IP₃ (inozitol 1,4,5-trifosfat) ve DAG (diasilgliserol). IP₃ endoplazmik retikulumda Ca²⁺ kanallarını açarak sitoplazmik Ca²⁺ düzeyini yükseltir; Ca²⁺-kalmodulin kompleksi CaMKII gibi kinazları aktive eder. DAG ise protein kinaz C’yi (PKC) aktif konuma getirir.',
    ),
    clinical(
      'Lityum (bipolar bozukluk tedavisi) inozitol monofosfataz enzimini inhibe ederek inozitol geri dönüşümünü (fosphoinositid döngüsü) bloke eder; PKC aktivitesi ve Ca²⁺ sinyalizasyonu azalır. Bu, psikiyatrik tedavinin biyokimyasal temelini oluşturur.',
      'Lityumun Mekanizması',
    ),

    h('Tirozin Kinaz Reseptörleri ve Ras-MAPK Yolağı'),
    p(
      'Büyüme faktörleri (EGF, PDGF, insülin, FGF) reseptör tirozin kinazlarını (RTK) dimerize ederek otofosforilasyonu başlatır. Fosfotirozin kalıntıları SH2 domenli adaptör proteinleri (Grb2, SOS) çeker; SOS, Ras GTPazını GDP→GTP ile değiştirir. Aktif Ras, Raf (MAPKKK) → MEK (MAPKK) → ERK (MAPK) kaskadını tetikler; ERK çekirdeğe girerek c-Myc, c-Fos gibi proliferasyon genlerini aktive eder.',
    ),
    li(
      'Ras, hücrelerin en sık mutasyona uğrayan onkogenidir (%30 insan kanserlerinde); GTPaz aktivitesini kaybeden Ras sürekli proliferasyon sinyali verir.',
      'NF-1 nörofibromini Ras-GAP olarak çalışır; kaybı nörofibromatozis tip 1’e yol açar.',
      'SHP-2 fosfatazları ve Sprouty proteinleri yolağı negatif düzenler.',
    ),
    clinical(
      'İmatinib (Gleevec), BCR-ABL füzyon tirozin kinazını seçici inhibe ederek kronik miyeloid lösemide (KML) çığır açan bir tedavi sağlar. Trastuzumab (Herceptin) HER2/ErbB2 reseptörüne karşı monoklonal antikordur; meme kanserinde Ras-MAPK yolağını baskılar.',
      'Hedefe Yönelik Kanser İlaçları',
    ),

    h('PI3K-Akt-mTOR Yolağı'),
    p(
      'RTK’lar ayrıca fosfatidilinozitol 3-kinazı (PI3K) aktive eder. PI3K, PIP₂’yi PIP₃’e çevirir; PIP₃, Akt (protein kinaz B) ve PDK1’i membrana çeker. Akt, apoptozu baskılar (BAD’i fosforiler, Bcl-2 ailesini düzenler), protein sentezini artırır (mTORC1 üzerinden S6 kinaz) ve glikoz alımını yükseltir (GLUT4 translokasyonu). PTEN fosfatazı PIP₃’ü PIP₂’ye geri çevirerek yolağı negatif düzenler.',
    ),
    clinical(
      'PTEN tümör baskılayıcısının kaybı (endometriyum, prostat, meme kanserleri) PI3K-Akt yolağının kontrolsüz aktivasyonuna ve apoptotik dirence yol açar. İnsülin reseptörü bu yolağı kullanarak glikoz alımını artırdığından, insülin direncinde (tip 2 diyabet) PI3K dalı baskılanırken Ras-MAPK dalı korunur — bu ayrım ateroskleroz riskini kısmen açıklar.',
      'PTEN, İnsülin Direnci ve Kanser',
    ),

    h('JAK-STAT Yolağı'),
    p(
      'Sitokin reseptörleri (interlökinler, eritropoetin, interferonlar, büyüme hormonu) kendi kinaz aktivitesi taşımaz; bunun yerine Janus kinazları (JAK1, JAK2, JAK3, TYK2) reseptörün sitoplazmik kuyruğuna bağlıdır. Ligand bağlanmasıyla JAK’lar karşılıklı fosforile olur ve reseptörün tirozin kalıntılarını fosforiler; STAT proteinleri (Signal Transducers and Activators of Transcription) bu fosfotirozinlere bağlanır, dimerize olur ve çekirdeğe girerek gen ekspresyonunu düzenler. SOCS proteinleri yolağı negatif geri beslemeyle sonlandırır.',
    ),
    clinical(
      'Polisitemi vera sıklıkla JAK2 V617F mutasyonuyla (sürekli aktif JAK2) karakterizedir; eritrosit üretimi EPO’dan bağımsız artar. JAK inhibitörleri (ruxolitinib) miyelofibroz ve polisitemi verada tedavi amacıyla kullanılır. Kronik granülomatöz hastalıkta ise NADPH oksidaz defekti nötrofil "solunum patlamasını" engeller.',
      'JAK2 Mutasyonları ve Hastalıklar',
    ),

    h('Wnt, Hedgehog ve Notch Yolağı (Kısa Bakış)'),
    li(
      'Wnt: Reseptör (Frizzled) → Dishevelled → β-katenin yıkım kompleksi inhibisyonu → β-katenin çekirdeğe girer, TCF/LEF ile gen aktive eder. APC mutasyonu (ailesel adenomatöz polipozis) β-katenin birikimi ve kolon kanserine yol açar.',
      'Hedgehog: Patched (PTCH) reseptörü Smoothened’ı (SMO) baskılar; Hedgehog ligandı bu baskıyı kaldırır → Gli transkripsiyon faktörleri. Bazal hücreli karsinomda SMO aktivasyonu sık görülür (vismodegib ile inhibit edilir).',
      'Notch: Hücre-hücre temasında ligand (Delta/Jagged) bağlanmasıyla Notch intraselüler domen (NICD) salınır ve çekirdekte HES/HEY genlerini düzenler. T-lenfoblastik lösemide Notch1 aktivasyon mutasyonları tanımlanmıştır.',
    ),

    h('Nükleer (Steroid) Hormon Reseptörleri'),
    p(
      'Steroid hormonlar (kortizol, östrojen, progesteron, testosteron, aldosteron, D vitamini, tiroid hormonları) lipofilik yapıda oldukları için membranı geçer ve sitoplazmada veya çekirdekte bulunan nükleer reseptörlere bağlanır. Hormon-reseptör kompleksi DNA’da hormon yanıt elemanlarına (HRE) bağlanarak transkripsiyonu düzenler. Etki başlangıcı yavaştır (saatler) ancak uzun sürelidir.',
    ),
    clinical(
      'Tamoksifen, östrojen reseptörüne bağlanarak meme dokusunda antagonist (ancak kemik ve endometriumda kısmi agonist) etki gösterir — seçici östrojen reseptör modülatörü (SERM) kavramının prototipidir. Glukokortikoidler (prednizolon) NF-κB transkripsiyon faktörünü baskılayarak anti-inflamatuvar etki yapar.',
      'SERM’ler ve Glukokortikoid Etkisi',
    ),

    h('Yolların Karşılaştırılması'),
    table(
      ['Yolak', 'Reseptör Tipi', 'Başlatıcı Sinyal', 'Hız', 'Tipik Sonuç'],
      [
        ['GPCR-cAMP', '7-TM', 'Gαs/Gαi', 'Saniye-dakika', 'Metabolik enzim aktivasyonu'],
        ['PLC-IP₃/Ca²⁺', '7-TM (Gq)', 'PIP₂ hidrolizi', 'Saniye', 'Kasılma, sekresyon'],
        ['Ras-MAPK', 'RTK', 'Büyüme faktörü', 'Dakika-saat', 'Proliferasyon, farklılaşma'],
        ['PI3K-Akt-mTOR', 'RTK', 'İnsülin, IGF-1', 'Dakika-saat', 'Hayatta kalma, protein sentezi'],
        ['JAK-STAT', 'Sitokin reseptörü', 'İnterferon, EPO, GH', 'Dakika-saat', 'İmmün yanıt, hematopoez'],
        ['Nükleer reseptör', 'İntraselüler', 'Steroid, tiroid hormonu', 'Saat-gün', 'Gen transkripsiyonu'],
      ],
      'Başlıca sinyal yolağı karşılaştırması',
    ),

    h('Özet ve Hızlı Tekrar'),
    li(
      'Gs → cAMP ↑ → PKA; Gi → cAMP ↓; Gq → PLC → IP₃ (Ca²⁺) + DAG (PKC).',
      'Ras-MAPK proliferasyonu, PI3K-Akt hayatta kalmayı, JAK-STAT immün/hematopoetik yanıtı yönetir.',
      'Kolera toksini Gs’i kilitle; lityum inozitol döngüsünü kes; imatinib BCR-ABL’i bloke et.',
      'Steroid hormonlar nükleer reseptörlerle saatler içinde gen ekspresyonunu değiştirir.',
      'Her yolakta negatif düzenleyiciler (GAP’lar, fosfatazlar, SOCS, PTEN) sinyal sonlandırmasını sağlar.',
    ),
    spot(
      "Sınav klasikleri: (1) İnsülin hangi yolu kullanır? → RTK → PI3K-Akt (glikoz alımı) + Ras-MAPK (büyüme). (2) Adrenalin kalpte Gs ile, damarda α1 ile Gq kullanır. (3) Steroid hormonların etkisi genomiktir; nörotransmitterlerin ki non-genomik ve hızlıdır.",
    ),
  ],
};

/* ===========================================================================
   DERS NOTU 6 — İnflamasyon ve Doku Onarımı
   =========================================================================== */

export const INFLAMMATION_REPAIR: LibraryResource = {
  id: 'inflamasyon-onarim',
  title: 'İnflamasyon ve Doku Onarımı',
  subtitle: 'Akut-kronik inflamasyon medyatörleri, nötrofil efüzyonu, granülom ve yara iyileşmesi evreleri',
  term: 'Dönem 3',
  committee: COMMITTEES[4],
  course: 'Patoloji',
  resourceType: 'Ders Notu',
  author: 'HipokLab Akademik Kurul',
  updatedAt: '2026-11-18',
  minutes: 24,
  blocks: [
    h('İnflamasyonun Tanımı ve Kardinal Bulgular'),
    p(
      'İnflamasyon, dokunun zararlı uyaranlara (enfeksiyon, travma, iskemi, toksin) karşı geliştirdiği lokal ve koruyucu bir yanıttır. Amaç hasarlı dokunun uzaklaştırılması, patojenlerin öldürülmesi ve onarımın başlatılmasıdır. Romalı hekim Celsus’un tanımladığı dört kardinal bulguya modern patoloji beşinci bulguyu (functio laesa — fonksiyon kaybı) eklemiştir.',
    ),
    li(
      'Rubor (kızarıklık): Lokal vazodilatasyon ve kan akımında artış.',
      'Calor (ısı artışı): Artan metabolizma ve kan akımı.',
      'Tumor (şişlik): Damar geçirgenliğinde artışla sıvı ve protein çıkışı (ödem).',
      'Dolor (ağrı): Bradykinin, prostaglandinler ve basınç nöreseptörleri uyarır.',
      'Functio laesa (fonksiyon kaybı): Ağrı, ödem ve doku hasarının birleşik sonucu.',
    ),

    h('Vasküler Değişiklikler ve Eksüda'),
    p(
      'İnflamatuvar yanıtın erken döneminde arteriolar vazodilatasyon gerçekleşir; histamin, prostaglandinler (PGE₂, PGI₂) ve nitrik oksit (NO) bu vazodilatasyonun başlıca aracılarıdır. Kan akımı artar (hiperemi), ardından damar geçirgenliği yükselerek plazma proteinleri interstisyuma sızar (eksüda). Sıvının protein yoğunluğuna göre transüda (protein <3 g/dL) ve eksüda (protein >3 g/dL) ayrımı yapılır.',
    ),
    table(
      ['Geçirgenlik Tipi', 'Mekanizma', 'Örnek'],
      [
        ['Ani geçici (15-30 dk)', 'Endotelyal kontraksiyon, venüllerde', 'Isı, hafif travma'],
        ['Ani kalıcı (saatler)', 'Endotelyal hasar, termal/ kimyasal yanık', 'Yanık, ciddi enfeksiyon'],
        ['Geç başlangıçlı (4-24 saat)', 'Sitokinler, lökosit mediasyonu (IL-1, TNF-α)', 'Pnömoni, immün kompleks hastalıkları'],
      ],
      'Damar geçirkenliğinin artış tipleri',
    ),

    h('Hücresel Olaylar: Lökosit Efüzyonu'),
    p(
      'İnflamasyonun hücresel fazı, lökositlerin damar dışına çıkarak hasar bölgesine ulaşmasını içerir. Adhezyon molekülleri (selektinler, integrinler) lökositlerin endotel yüzeyinde yuvarlanmasına (rolling), yapışmasına (adhesiyon) ve diapedezle (transmigrasyon) interstisyuma geçmesine aracılık eder. Kemotaksi, C5a, LTB₄, bakteriyel formil peptitler ve IL-8 gibi faktörlere doğru yönlendirilmiş harekettir.',
    ),
    li(
      'Erken faz (0-6 saat): Nötrofil baskın (akut inflamasyon).',
      'Geç faz (24-48 saat): Monosit/makrofaj baskın kronik evreye geçiş.',
      'Nötrofil fonksiyonları: Kemotaksi, fagositoz, degranülasyon, oksijenli patlama (NADPH oksidaz), nötrofil ekstraselüler tuzakları (NET).',
      'Makrofajlar: Doku rezident histiyositler, kan monositlerinden farklılaşır; granülom oluşumu ve onarımda merkezi rol.',
    ),
    clinical(
      'Lökosit adezyon defekti olan Lökosit adezyon eksikliği (LAD tip I) hastalarında β₂-integrin (CD18) mutasyonu bulunur; nötrofil yapışması bozulur, göreceli lökositoz (periferik kanda yüksek nötrofil) ile birlikte tekrarlayan bakteriyel enfeksiyonlar ve göbek kordonu düşme gecikmesi görülür.',
      'Lökosit Adezyon Eksikliği',
    ),

    h('İnflamatuvar Medyatörler'),
    p(
      'Medyatörler hızla salınır (histamin, NO) veya sentezlenir (prostaglandinler, lökotrienler) ve yanıtın şiddetini, süresini ve niteliğini belirler. COX enzimleri arakidonik asitten prostaglandin ve tromboksanları üretir; COX-1 mide koruması ve trombosit agregasyonu için gerekliyken COX-2 inflamasyonda indüklenir. NSAİİ’ler her iki izoenzimi inhibe ederek analjezi ve anti-inflamatuvar etki sağlar.',
    ),
    table(
      ['Medyatör', 'Kaynak', 'Temel Etkiler'],
      [
        ['Histamin', 'Mast hücreleri, bazofiller', 'Vazodilatasyon, geçirgenlik ↑, kaşıntı'],
        ['Prostaglandin (PGE₂, PGI₂)', 'Membran fosfolipidleri (COX)', 'Ateş, ağrı, vazodilatasyon'],
        ['Lökotrien (LTB₄, LTC₄)', 'Lökositler (LOX)', 'Kemotaksi, bronkokonstriksiyon, geçirgenlik ↑'],
        ['Tromboksan (TXA₂)', 'Trombositler', 'Vazokonstriksiyon, trombosit agregasyonu'],
        ['Nitrik oksit (NO)', 'Endotel, makrofaj (iNOS)', 'Vazodilatasyon, mikropsidal etki'],
        ['Sitokinler (IL-1, TNF-α, IL-6)', 'Makrofajlar', 'Akut faz yanıtı, ateş, adhezyon molekülleri'],
        ['Bradykinin', 'Plazma (kinin-kallikrein)', 'Ağrı, vazodilatasyon, geçirgenlik ↑'],
        ['Kompleman (C3a, C5a)', 'Karaciğer (alternatif/klasik yol)', 'Opsonizasyon (C3b), anafilatoksin (C3a/C5a), kemotaksi (C5a)'],
      ],
      'Başlıca inflamatuvar medyatörler',
    ),
    clinical(
      'Sepsiste TNF-α ve IL-1’in sistelik etkisi endotelyal hasara, dissemine intravasküler koagülasyona (DİK) ve septik şoka yol açar; refraktör hipotansiyon ve çoklu organ yetmezliği tabloya eklenir. IL-6 karaciğerde CRP (C-reaktif protein) ve fibrinojen sentezini indükleyerek akut faz yanıtını başlatır.',
      'Sepsis ve Akut Faz Yanıtı',
    ),

    h('Akut İnflamasyonun Sonuçlanma Şekilleri'),
    li(
      'Tam çözülme (resolution): Hasar hafifse, doku tamamen normale döner (ödem rezorbe olur, hücreler apoptoza uğrar).',
      'Pürulent (irinli) inflamasyon: Nötrofil baskın, irin oluşumu (abses); stafilokoklar tipik nedendir.',
      'Ülserasyon: Mukozal yüzeyin kaybı (peptik ülser, ülseratif kolit).',
      'Kronik inflamasyona geçiş: Persistan antijen (tüberküloz, otoimmün) veya tekrarlayan hasarla.',
      'Sistemik yanıt: Ateş, lökositoz, akut faz proteinleri, taşikardi.',
    ),

    h('Kronik İnflamasyon ve Granülom'),
    p(
      'Kronik inflamasyonda makrofajlar, lenfositler ve plazma hücreleri baskındır; doku yıkımı ve onarım eş zamanlı ilerler (fibrozis, anjiyogenez). Granülom, makrofajların epitelyoid hücrelere ve dev hücrelere (Langhans tipi) farklılaşarak oluşturduğu organize nodüler lezyondur; tipik olarak T-hücre aracılı (tip IV) hipersensitivite yanıtı ile oluşur.',
    ),
    li(
      'Yabancı cisim granülomu: Çok çekirdekli dev hücreler rastgele çekirdek dizilimiyle (föreign-body giant cells).',
      'Tüberküloz granülomu: Langhans dev hücreleri (çekirdekler at nalı şeklinde periferde), kazeifikasyon nekrozu ile birlikte.',
      'Sarkoidoz: Kazeifikasyonsuz (non-kazeifiye) granülomlar, akciğer ve lenf nodlarında.',
      'Crohn hastalığı: Non-kazeifiye granülomlar (ülsere kolit granülom içermez — sınav klasikleri!).',
    ),
    clinical(
      'Ülseratif kolit ile Crohn hastalığının ayrımında granülom varlığı Crohn’u destekler. Crohn’da transmural tutulum, "skip lezyonlar" ve bağırsak fistülleri karakteristiktir; ülseratif kolit ise rektumdan başlayıp sürekli ve mukoza ile sınırlıdır.',
      'Crohn vs Ülseratif Kolit',
    ),

    h('Yara İyileşmesi: Birincil ve İkincil İyileşme'),
    p(
      'Yara iyileşmesi üç evrede ilerler: (1) inflamatuvar faz (kanama, trombosit tıkacı, nötrofil-makrofaj göçü), (2) proliferatif faz (granülasyon dokusu, anjiyogenez, fibroblast proliferasyonu, epitelizasyon), (3) remodeling fazı (kollajen yeniden düzenlenmesi, skar olgunlaşması, mukavemetin artması).',
    ),
    li(
      'Birincil iyileşme (primary intention): Kenarları birbirine yakın temiz cerrahi kesilerde; az granülasyon dokusu, ince skar.',
      'İkincil iyileşme (secondary intention): Geniş doku kaybı, kenarlar uzakta; bol granülasyon dokusu, miyofibroblastlarla kontraksiyon, geniş skar.',
      'Kollajen sentezi: Fibroblastlar 3. günde tip III kollajen üretmeye başlar; 3 hafta sonra tip I kollajen baskın olur ve mukavemet hızla artar.',
      'C vitamini (askorbik asit) prolin-lizin hidroksilasyonu için kofaktördür; eksiklikte skarlaşma bozuk (skörbut) olur.',
    ),
    clinical(
      'Diyabetik hastalarda ileri glikasyon son ürünler (AGE) ve mikroanjiyopati nedeniyle yara iyileşmesi gecikir; ayak ülserleri kronikleşir. Hipertrofik skarlar yara sınırları içinde kalırken, keloidler yara sınırını aşan, kollajen birikimiyle oluşan patolojik skarlardır.',
      'Yara İyileşmesini Etkileyen Faktörler',
    ),
    spot(
      'Yara mukavemeti 1. haftada normalin ~%10’u, 3. haftada ~%30’u, 3 ayda ~%80’i kadardır; tam normal mukavemete hiçbir zaman ulaşılmaz. Bu yüzden cerrahi dikişlerin erken alınması dehisansa yol açabilir.',
    ),

    h('Özet ve Hızlı Tekrar'),
    li(
      'Akut inflamasyon: Vazodilatasyon → geçirgenlik ↑ → nötrofil efüzyonu → fagositoz.',
      'Histamin erken geçirgenliği, prostaglandinler ağrı-ateşi, sitokinler akut faz yanıtını yönetir.',
      'Kronik inflamasyon: Makrofaj-lenfosit baskın; granülom (Crohn, tüberküloz, sarkoidoz).',
      'Yara iyileşmesi: Inflamatuvar → proliferatif → remodeling; tip III → tip I kollajen geçişi.',
      'İkincil iyileşmede granülasyon dokusu ve kontraksiyon baskın; birincil iyileşmede ince skar oluşur.',
    ),
    spot(
      'Sınav seti: Kazeifikasyon nekrozu = tüberküloz. Langhans dev hücreleri = tüberküloz/sarkoidoz. Non-kazeifiye granülom = Crohn, sarkoidoz. Primer biliyer kolanjitte granülomlar safra kanallarını yıkarak "florid duct lesion" yapar.',
    ),
  ],
};

/* ===========================================================================
   EK KAYNAK 7 — Histoloji Lab Föyü: Epitel Doku
   =========================================================================== */

export const EPITHELIUM_LAB: LibraryResource = {
  id: 'epitel-doku-lab',
  title: 'Histoloji Lab Föyü: Epitel Doku',
  subtitle: 'Epitel tipleri, bezler, bazal membran ve mikroskobik tanı kriterleri',
  term: 'Dönem 1',
  committee: COMMITTEES[0],
  course: 'Histoloji',
  resourceType: 'Lab Föyü',
  author: 'HipokLab Histoloji Anabilim Dalı',
  updatedAt: '2026-11-15',
  minutes: 12,
  blocks: [
    h('Epitel Dokunun Genel Özellikleri'),
    p(
      'Epitel doku, hücrelerin birbirine sıkı bağlantılarla (tight junctions, desmozomlar) bağlandığı, bazal membrana oturduğu ve kendi damar beslemesi olmayan (besinleri difüzyonla alttaki bağ dokusundan alan) bir doku tipidir. Sürekli yenilenme kapasitesi yüksektir (mitoz oranı yüksek), sinir ucu bakımından zengindir ve koruma, salgı, emilim, algılama gibi işlevleri yerine getirir.',
    ),

    h('Epitel Tipleri ve Sınıflandırma'),
    table(
      ['Epitel Tipi', 'Katman / Şekil', 'Örnek Lokalizasyon', 'İşlev'],
      [
        ['Yassı tek katlı', 'İnce, düzensiz çekirdekli', 'Alveol, endotel, lenfatikler', 'Gaz değişimi, difüzyon'],
        ['Kübik tek katlı', 'Küp şeklinde hücreler', 'Böbrek tübülleri, tiroit folikülleri', 'Salgı, emilim'],
        ['Silindirik tek katlı', 'Uzun hücreler, fırçalı kenar', 'Bağırsak mukozası, uterus', 'Emilim, salgı'],
        ['Sahte çok katlı silindirik', 'Tek kat, farklı yükseklikte çekirdekler', 'Trakea, bronşlar, burun', 'Mukus salgısı, mukosilier taşıma'],
        ['Çok katlı yassı', 'Çok katlı, yüzeysel keratinize olabilir', 'Deri (keratinize), özofagus (non-keratinize)', 'Mekanik koruma'],
        ['Çok katlı kübik/ silindirik', 'Çok katlı, yüzey silindirik', 'Üretra, büyük kanallar', 'Koruma, salgı'],
        ['Transizyonel (ürotelyum)', 'Çok katlı, gerilebilir', 'Mesane, üreter', 'Gerginliğe uyum'],
      ],
      'Epitel tiplerinin karşılaştırmalı tablosu',
    ),
    clinical(
      'Keratinize çok katlı yassı epitel derinin dış yüzeyinde su kaybını önler; non-keratinize olan ise (özofagus, vajina) mekanik aşınmaya dayanıklıdır ama su geçirgenliği daha yüksektir. Transizyonel epitelde yüzeysel "şemsiye hücreler" (umbrella cells) mesane dolduğunda düzleşir.',
      'Keratinizasyon ve Klinik İlişkiler',
    ),

    h('Bezler ve Salgı Çeşitleri'),
    li(
      'Ekrin (merokrin) bezler: Sekresyon ürününde hücre kaybı yok (ter bezleri, pankreas).',
      'Apokrin bezler: Sitoplazmanın apikal kısmı koparak salınır (koltuk altı bezleri, meme).',
      'Holokrin bezler: Hücre tamamen parçalanır (sebum bezleri).',
      'Tekli bezler (mukus hücreleri) ve bileşik bezler (tükürük, pankreas) salgı kanalı yapısına göre ayrılır.',
    ),
    spot(
      'Lab sınavında en sık karıştırılan ikili: keratinize çok katlı yassı epitel (deri) vs non-keratinize (özofagus). Boya ile keratin pembe/eozinofilik, çekirdekler yüzeysel katlarda kaybolmuştur.',
    ),

    h('Bazal Membran ve Hücre Bağlantıları'),
    p(
      'Bazal membran, epitel ile altta yatan bağ dokusunu ayıran ince, bazofilik matriks tabakasıdır; tip IV kolajen, laminin ve proteoglikanlardan oluşur. Işık mikroskopunda PAS (+) olarak boyanır. Hücre bağlantıları: sıkı bağlantı (occludin, kladinler), adezyon bağlantıları (kaderinler), desmozomlar (plakofilin, desmoplakin) ve gap junctions (koneksinler).',
    ),
    clinical(
      'Pemfigus vulgaris desmozomlara (desmoglein 3) karşı otoantikorlarla karakterizedir; epitel hücreleri birbirinden ayrılır (akantolizis) ve intraepidermal büller oluşur. Bazal membran hasarında (Bülloz pemfigoid) subepidermal büller görülür.',
      'Desmozom Hastalıkları',
    ),
  ],
};

/* ===========================================================================
   EK KAYNAK 8 — Spot Özet: Endokrin Sistem ve Hormon Sınıfları
   =========================================================================== */

export const ENDOCRINE_SPOT: LibraryResource = {
  id: 'endokrin-spot',
  title: 'Spot Özet: Endokrin Sistem ve Hormon Sınıfları',
  subtitle: 'Hipofiz-tiroid-adrenal-pankreas aksları, geri besleme döngüleri ve hormon sınıflandırması',
  term: 'Dönem 3',
  committee: COMMITTEES[4],
  course: 'Fizyoloji',
  resourceType: 'Spot Özet',
  author: 'HipokLab Akademik Kurul',
  updatedAt: '2026-11-18',
  minutes: 10,
  blocks: [
    h('Hormon Sınıflandırması'),
    table(
      ['Sınıf', 'Örnekler', 'Taşınma', 'Reseptör / Etki'],
      [
        ['Peptid / protein', 'İnsülin, GH, PTH, ADH', 'Plazmada serbest veya proteinle', 'Yüzey reseptörü (cAMP, Ca²⁺, RTK)'],
        ['Steroid', 'Kortizol, aldosteron, östrojen, testosteron', 'CBG, SHBG, albuminle', 'Nükleer reseptör (genomik)'],
        ['Amino asit türevi', 'Tiroksin (T4), katekolaminler', 'TBG ile (T4), serbest (NE)', 'Nükleer (T4) / yüzey (katekolamin)'],
      ],
      'Hormonların kimyasal sınıflandırması',
    ),

    h('Hipofiz-Tiroid Aksı'),
    p(
      'Hipotalamus TRH salgılar → ön hipofiz TSH salgılar → tiroid T3/T4 üretir. T3/T4 negatif geri beslemeyle TRH ve TSH’ı baskılar. T3’ün büyük kısmı periferik deiyodinasyonla (T4 → T3) üretilir. Tiroid hormonları bazal metabolizmayı artırır, kalp atım hızını yükseltir ve fetal sinir sistemi gelişimi için zorunludur.',
    ),
    clinical(
      'Hipertiroidide (Graves) TSH baskılanmış, T3/T4 yüksek; göz kapağı retraksiyonu, eksoftalmi, tremor ve taşikardi görülür. Primer hipotiroidide TSH yüksek, T4 düşüktür; guatr, kilo artışı ve soğuk intoleransı karakteristiktir. TSH düzeyi her zaman ilk bakılacak parametredir.',
      'Tiroid Hastalıklarında Laboratuvar Yorumu',
    ),

    h('Hipofiz-Adrenal Aksı'),
    p(
      'Hipotalamus CRH → ön hipofiz ACTH → adrenal korteks (zona fasciculata) kortizol üretir. Kortizol negatif geri beslemeyle CRH/ACTH’ı baskılar. Renin-anjiyotensin-aldosteron sistemi (RAAS) ve plazma K⁺ düzeyi ise aldosteron salınımını (zona glomerulosa) düzenler; ACTH’nin bu katmandaki rolü ikincildir.',
    ),
    li(
      'Addison (primer adrenal yetmezlik): Kortizol ↓, ACTH ↑ (hiperpigmentasyon), hiponatremi, hiperkalemi.',
      'Cushing sendromu: Kortizol ↑, ACTH bağımlı (hipofiz adenomu) veya bağımsız (adrenal tümör, ekzojen steroid).',
      '11β-hidroksilaz eksikliği: Kortizol ↓, androjen ↑, hipertansiyon (11-deoksikortikosteron artışı).',
      '21-hidroksilaz eksikliği (en sık konjenital adrenal hiperplazi): Kortizol ↓, aldosteron ↓, androjen ↑; kızlarda virilizasyon.',
    ),

    h('Pankreas ve Kalsiyum Düzenlemesi'),
    p(
      'Pankreasın Langerhans adacıkları; β hücrelerinden insülin (anabolik, glukoz alımını artırır), α hücrelerinden glukagon (katabolik, glikojenoliz), δ hücrelerinden somatostatin (inhibitör) salgılar. İnsülin reseptörü bir RTK’dır; PI3K-Akt yoluyla GLUT4 translokasyonunu uyarır.',
    ),
    p(
      'Kalsiyum dengesi üç hormonla düzenlenir: PTH (kalsiyumu ↑, fosfatı ↓), kalsitonin (kalsiyumu ↓, tiroid C hücreleri) ve aktif D vitamini (1,25-(OH)₂-D₃, kalsiyum emilimini ↑). PTH, böbrekten D vitamini aktivasyonunu ve kemikten kalsiyum salınımını artırır.',
    ),
    clinical(
      'Hiperparatiroidizmde yüksek PTH, hiperkalsemi, kemik ağrısı (osteitis fibrosa kistik), böbrek taşı ve kabızlık yapar. Primer hiperparatiroidizmin en sık nedeni paratiroid adenomudur; D vitamini zehirlenmesi ve sarkoidoz da hiperkalsemiye yol açabilir.',
      'Hiperkalsemi ve PTH',
    ),

    h('Geri Besleme ve Klinik Sentez'),
    li(
      'Negatif geri besleme: T3/T4 → TSH ↓; kortizol → ACTH ↓; insülin → glukagon antagonizması.',
      'Pozitif geri besleme: Ovulasyonda östrojen LH salınımını artırır (LH dalgası).',
      'Parakrin/ otokrin sinyaller: Histamin, prostaglandinler, büyüme faktörleri yerel etki gösterir.',
    ),
    spot(
      'TSH yüksek + T4 düşük = primer hipotiroidi. TSH düşük + T4 yüksek = primer hipertiroidi. TSH düşük + T4 düşük = sekonder (hipofizer) hipotiroidi — bu üçlü sınav ve USMLE klasiklerindendir.',
    ),
  ],
};

/* ---------------------------------------------------------------------------
   Kütüphane Koleksiyonu
--------------------------------------------------------------------------- */

export const LIBRARY_RESOURCES: LibraryResource[] = [
  CARDIAC_CYCLE,
  ACTION_POTENTIAL,
  CRANIAL_NERVES,
  NEPHRON_PHYSIOLOGY,
  SIGNALING_PATHWAYS,
  INFLAMMATION_REPAIR,
  EPITHELIUM_LAB,
  ENDOCRINE_SPOT,
];

export function getAllResources(custom: LibraryResource[]): LibraryResource[] {
  return [...custom, ...LIBRARY_RESOURCES];
}
