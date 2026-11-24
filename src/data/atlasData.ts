/* ===========================================================================
   HipokLab — Görsel Atlas Veri Katmanı
   4 adet tıbbi diyagram için anatomik/histolojik pin koordinatları,
   Türkçe + Latince isimler, anatomik komşuluklar, fizyolojik görevler ve
   "Klinik Korelasyon (Hasarında Ne Olur?)" açıklamaları.

   Koordinat sistemi: her diyagramın kendi viewBox uzayı (0 0 820 760).
   =========================================================================== */

export type AtlasDiagramId = 'heart' | 'nephron' | 'brainstem' | 'cell';

export interface AtlasPin {
  id: string;
  diagramId: AtlasDiagramId;
  number: number;
  x: number;
  y: number;
  /** Etiketin pinden uzaklığı (SVG koordinatı). */
  labelDx: number;
  labelDy: number;
  labelAnchor: 'start' | 'middle' | 'end';
  nameTr: string;
  nameLa: string;
  /** Bulunduğu bölge / katman. */
  region: string;
  /** Anatomik komşuluklar. */
  neighbors: string[];
  /** Fizyolojik görevler. */
  functions: string[];
  /** Klinik Korelasyon (Hasarında Ne Olur?). */
  clinical: string;
  /** Global arama için eş anlamlılar. */
  aliases: string[];
}

export interface AtlasDiagram {
  id: AtlasDiagramId;
  title: string;
  subtitle: string;
  description: string;
  viewBox: string;
  pins: AtlasPin[];
}

/** Katman kontrolleri (AnatomySvgCanvas üzerinde açılıp kapanır). */
export const ATLAS_LAYERS = {
  labels: { id: 'labels', label: 'İsim Etiketlerini Göster', hint: 'Yapı isimleri (Türkçe)' },
  flow: { id: 'flow', label: 'Akış Yönleri / İletim Yolları', hint: 'Damar akış okları ve iletim yolları' },
} as const;

const v = '0 0 820 760';

/* ===========================================================================
   DİYAGRAM 1 — Kalp Anatomisi (Ön Kesit)
   Görüntü düzlemi: hastaya karşdan bakış (hastanın sağ = görüntünün solu).
   =========================================================================== */

const HEART_PINS: AtlasPin[] = [
  {
    id: 'heart-sag-atriyum',
    diagramId: 'heart',
    number: 1,
    x: 248,
    y: 252,
    labelDx: -18,
    labelDy: 46,
    labelAnchor: 'middle',
    nameTr: 'Sağ Atriyum',
    nameLa: 'Atrium dextrum',
    region: 'Kalbin üst-ön bölümü, sağ kardiyak odacık',
    neighbors: ['Vena kava superior (üst), vena kava inferior (alt)', 'Triküspit kapak (alt)', 'İntratriyal septum (sol)', 'Pulmoner arter konisi (ön)'],
    functions: [
      'Sistemik venöz dönüşü (VCS ve VİÇ) toplar; oksijenlenmemiş kanı triküspit kapaktan sağ ventriküle yönlendirir.',
      'Sinoatriyal (SA) düğüm içerir: kalbin normaldeki başlıca pacemaker’i burada yerleşiktir.',
      'Atriyal sistol ile ventrikül dolgusunun son %20-30’unu tamamlar (atriyal kick).',
    ],
    clinical:
      'Atriyal fibrilasyonda düzensiz ve koordinasyonsuz atriyal kasılma kanın göllenmesine yol açar; sağ atriyal trombus oluşumu pulmoner emboliye, sol atriyal trombus ise sistemik emboliye (inme) neden olur. Triküspid yetersizliğinde sağ atriyum dilate olur ve juguler venlerde belirginleşme (c dalgası) izlenir.',
    aliases: ['sağ atriyum', 'atrium dextrum', 'sağ kulakçık', 'sag atriyum'],
  },
  {
    id: 'heart-sol-atriyum',
    diagramId: 'heart',
    number: 2,
    x: 566,
    y: 226,
    labelDx: 16,
    labelDy: -18,
    labelAnchor: 'start',
    nameTr: 'Sol Atriyum',
    nameLa: 'Atrium sinistrum',
    region: 'Kalbin üst-arka bölümü, sol kardiyak odacık',
    neighbors: ['Pulmoner venler (sağ kenar)', 'Mitral kapak (alt)', 'Aort arkası (üst)', 'İntratriyal septum (sağ)'],
    functions: [
      'Akciğerlerden gelen oksijenlenmiş kanı dört pulmoner ven aracılığıyla toplar.',
      'Kanı mitral kapak üzerinden sol ventriküle iletir; atriyal sistol ile dolumu destekler.',
      'Sol ventrikül dolgusunun son bölümünü tamamlayan atriyal kick’i üretir.',
    ],
    clinical:
      'Romatizmal mitral darlığında sol atriyum basınçla dilate olur; bu durum atriyal fibrilasyon, pulmoner venöz hipertansiyon ve pulmoner ödemle sonuçlanır. Atriyal septal defekt (ASD) kanın sağ atriyuma şantlanmasına izin verir ve seskültasyonda sabit ikinci ses ayrılması (fixed splitting) oluşturur.',
    aliases: ['sol atriyum', 'atrium sinistrum', 'sol kulakçık'],
  },
  {
    id: 'heart-sag-ventrikul',
    diagramId: 'heart',
    number: 3,
    x: 288,
    y: 498,
    labelDx: -6,
    labelDy: 44,
    labelAnchor: 'middle',
    nameTr: 'Sağ Ventrikül',
    nameLa: 'Ventriculus dexter',
    region: 'Kalbin alt-ön bölümü, sağ kardiyak odacık',
    neighbors: ['Triküspit kapak (üst)', 'Pulmoner kapak ve trunkus pulmonalis (üst-çıkış)', 'İnterventriküler septum (sol)', 'Sol ventrikül (sol-arka)'],
    functions: [
      'Oksijenlenmemiş kanı alçak basınçlı pulmoner dolaşıma (akciğerlere) pompalar.',
      'Duvar kalınlığı sol ventrikülün yaklaşık üçte biri kadardır; basınca karşı direnci düşüktür.',
      'İnsprasyonla artan venöz dönüşü Frank-Starling mekanizmasıyla karşılar.',
    ],
    clinical:
      'Pulmoner hipertansiyonda sağ ventrikül basınç yüküyle hipertrofiye uğrar; ilerleyen dönemde sağ kalp yetmezliği (cor pulmonale) gelişir. Miyokard enfarktüsü sonrası sağ ventrikül tutulumu (inferior MI) kardiyojenik şok ve ödemle seyreder.',
    aliases: ['sağ ventrikül', 'ventriculus dexter', 'sağ karıncık', 'sag ventrikul'],
  },
  {
    id: 'heart-sol-ventrikul',
    diagramId: 'heart',
    number: 4,
    x: 556,
    y: 505,
    labelDx: 8,
    labelDy: 44,
    labelAnchor: 'middle',
    nameTr: 'Sol Ventrikül',
    nameLa: 'Ventriculus sinister',
    region: 'Kalbin alt-sağ bölümü (apex), en kalın kas duvarı',
    neighbors: ['Mitral kapak (üst)', 'Aort kapağı (üst-çıkış)', 'İnterventriküler septum (sağ)', 'Sağ ventrikül (ön-sağ)'],
    functions: [
      'Oksijenlenmiş kanı yüksek basınçla sistemik dolaşıma (aorta) pompalar.',
      'Duvarı 3-4 kat daha kalındır (≈13-15 mm); sistolik basıncı üretir.',
      'Kardiyak debinin yaklaşık %70-80’ini tek başına sağlar.',
    ],
    clinical:
      'Kronik hipertansiyonda basınç yüküyle konzentrik hipertrofi (LVH) gelişir; bu durum diyastolik yetmezliğe ve koroner iskemiye zemin hazırlar. Anterior miyokard enfarktüsü sonrası sol ventrikül duvarında anevrizma, trombus ve rüptür riski doğar.',
    aliases: ['sol ventrikül', 'ventriculus sinister', 'sol karıncık', 'apex', 'kalbin apeksi'],
  },
  {
    id: 'heart-septum',
    diagramId: 'heart',
    number: 5,
    x: 452,
    y: 500,
    labelDx: 22,
    labelDy: 20,
    labelAnchor: 'start',
    nameTr: 'İnterventriküler Septum',
    nameLa: 'Septum interventriculare',
    region: 'Ventriküller arası kas duvarı',
    neighbors: ['Sağ ventrikül (sol)', 'Sol ventrikül (sağ)', 'His demeti (üst-orta)', 'Apikal bölge (alt)'],
    functions: [
      'Sağ ve sol ventrikül dolaşımlarını birbirinden ayırarak karışımı önler.',
      'Purkinje sisteminin sol ve sağ dal kolları septum boyunca seyreder.',
      'Sol ventrikül kasılmasına katılarak ejeksiyon kuvvetine katkıda bulunur.',
    ],
    clinical:
      'Ventriküler septal defekt (VSD) en sık konjenital kalp anomalilerindendir; sol-sağ şantla sistolik üfürüm yapar. Miyokard enfarktüsü sonrası septal rüptür ani kardiyak tamponad ve kardiyojenik şokla sonuçlanan bir acil durumdur.',
    aliases: ['interventriküler septum', 'septum interventriculare', 'karıncıklar arası septum', 'ventriküler septum'],
  },
  {
    id: 'heart-trikuspid',
    diagramId: 'heart',
    number: 6,
    x: 336,
    y: 372,
    labelDx: -22,
    labelDy: -18,
    labelAnchor: 'end',
    nameTr: 'Triküspid Kapak',
    nameLa: 'Valva atrioventricularis dextra',
    region: 'Sağ atriyum ile sağ ventrikül arasında',
    neighbors: ['Sağ atriyum (üst)', 'Sağ ventrikül (alt)', 'AV düğümü (sağ-üst)', 'İnterventriküler septum (sol)'],
    functions: [
      'Diastolde açılarak kanın sağ atriyumdan sağ ventriküle geçişini sağlar.',
      'Sistolde kapaklanarak kanın sağ atriyuma geri kaçışını (regürjitasyon) önler.',
      'Korda tendineae ve papiller kaslar sistolde kapak yapraklarının atriyuma bombeleşmesini engeller.',
    ],
    clinical:
      'Triküspid yetersizliği sıklıkla sağ ventrikül dilatasyonu (pulmoner hipertansiyon, kapak romatizması) sonucu gelişir; juguler venlerde pozitif dalgalar ve karaciğerde konjesyon yapar. Enjeksiyon bağımlı uyuşturucu kullanıcılarında sağ kalp kapakçıklarında enfektif endokardit riski yüksektir.',
    aliases: ['triküspid kapak', 'triküspid', 'valva atrioventricularis dextra', 'üç yapraklı kapak', 'sağ atriyal kapak'],
  },
  {
    id: 'heart-mitral',
    diagramId: 'heart',
    number: 7,
    x: 528,
    y: 372,
    labelDx: 22,
    labelDy: -18,
    labelAnchor: 'start',
    nameTr: 'Mitral Kapak',
    nameLa: 'Valva atrioventricularis sinistra (valva bicuspidalis)',
    region: 'Sol atriyum ile sol ventrikül arasında',
    neighbors: ['Sol atriyum (üst)', 'Sol ventrikül (alt)', 'Aort kapağı (sol-üst)', 'Atriyal septum (sağ)'],
    functions: [
      'Diastolde açılarak oksijenli kanın sol atriyumdan sol ventriküle geçişini sağlar.',
      'Sistolde sıkıca kapaklanarak sol atriyuma regürjitasyonu önler.',
      'İki yaprakçığı (anterior/posterior) ile yüksek basınç altında dayanıklılık sağlar.',
    ],
    clinical:
      'Romatizmal ateş sonrası mitral darlığı en sık kapak hastalığıdır; diastolik rulo üfürüm, açılış snap ve sol atriyal dilatasyon yapar. Mitral kapak prolapsusunda klik + geç sistolik üfürüm duyulur; akut miyokard enfarktüsüne bağlı papiller kas rüptürü ani ve ağır mitral yetmezliğe yol açar.',
    aliases: ['mitral kapak', 'mitral', 'biküspit kapak', 'valva mitralis', 'valva bicuspidalis', 'mitral kapakçık', 'cor mitrale'],
  },
  {
    id: 'heart-aort-kapagi',
    diagramId: 'heart',
    number: 8,
    x: 510,
    y: 292,
    labelDx: 26,
    labelDy: -12,
    labelAnchor: 'start',
    nameTr: 'Aort Kapağı',
    nameLa: 'Valva aortae',
    region: 'Sol ventrikül çıkım yolu ile aort kökü arasında',
    neighbors: ['Sol ventrikül çıkış yolu (alt)', 'Aort kökü / sinüsler (üst)', 'Mitral kapak (sol)', 'İnterventriküler septum (sağ)'],
    functions: [
      'Sistolde açılarak kanın aorta atılmasını sağlar.',
      'Diastolde kapanarak kanın sol ventriküle geri kaçışını önler.',
      'Aort sinüslerinden çıkan koroner arter akımını diastolde besler.',
    ],
    clinical:
      'Yaşla birlikte kalsifik aort darlığı en sık kapak patolojisidir; tardus-pardus ejeksiyon üfürümü, senkop ve anjina yapar. Aort yetersizliğinde diastolik decrescendo üfürüm ve water-hammer (Corrigan) nabızları gelişir. Romatizmal aort kapağı endokarditte en sık tutulan kapaktır.',
    aliases: ['aort kapağı', 'aort kapak', 'valva aortae', 'aortik kapak', 'üç semiluner kapak'],
  },
  {
    id: 'heart-pulmoner-kapak',
    diagramId: 'heart',
    number: 9,
    x: 400,
    y: 292,
    labelDx: -26,
    labelDy: -12,
    labelAnchor: 'end',
    nameTr: 'Pulmoner Kapak',
    nameLa: 'Valva pulmonalis',
    region: 'Sağ ventrikül çıkım yolu ile trunkus pulmonalis arasında',
    neighbors: ['Sağ ventrikül çıkış yolu (alt)', 'Trunkus pulmonalis (üst)', 'Aort kapağı (sağ)', 'Pulmoner arter çatalı (üst)'],
    functions: [
      'Sistolde açılarak kanın akciğerlere (pulmoner dolaşım) atılmasını sağlar.',
      'Diastolde kapanarak kanın sağ ventriküle geri kaçışını önler.',
      'Vücuttaki en düşük basınçlı semiluner kapaktır.',
    ],
    clinical:
      'Konjenital pulmoner stenoz sağ ventrikülde basınç yükü ve hipertrofi yapar; sıklıkla bir "ejeksiyon kliki" ile duyulur. İkinci sesin genişlemesi (splitting) pulmoner kapanışın gecikmesiyle ilişkilidir; sağ dal bloğu ve ASD bu bulgunun klasik nedenleridir.',
    aliases: ['pulmoner kapak', 'pulmonik kapak', 'valva pulmonalis', 'akciğer kapağı'],
  },
  {
    id: 'heart-aorta',
    diagramId: 'heart',
    number: 10,
    x: 558,
    y: 112,
    labelDx: 18,
    labelDy: -20,
    labelAnchor: 'start',
    nameTr: 'Aorta (Yükselen + Arkus)',
    nameLa: 'Aorta ascendens et arcus aortae',
    region: 'Kalbin üstü, mediasten',
    neighbors: ['Trunkus pulmonalis (ön-sol)', 'Vena kava superior (sağ)', 'Pulmoner arter çatalı (arka)', 'Sol ana bronş (arka-alt)'],
    functions: [
      'Sol ventrikülün ejeksiyon hacmini sistemik dolaşıma taşır.',
      'Aort kapağının hemen üzerindeki sinüsler koroner arterleri besler.',
      'Elastik duvarı sistolik basıncı tamponlar (Windkessel işlevi), diastolik basıncı sürdürür.',
    ],
    clinical:
      'Aort diseksiyonu (tip A/B) yırtılma ile ölümcül olabilir; ani, yırtıcı göğüs ağrısı ve nabız farkı yapar. Koarktasyon aort daralmasıyla üst ekstremite hipertansiyonu ve alt ekstremite pulsus parvus oluşturur. Aterosklerotik anevrizmalar aort arkasında en sık lokalizedir.',
    aliases: ['aorta', 'aort arkası', 'arcus aortae', 'yükselen aort', 'aort damarı', 'aort anevrizması'],
  },
  {
    id: 'heart-trunkus',
    diagramId: 'heart',
    number: 11,
    x: 414,
    y: 208,
    labelDx: -26,
    labelDy: -14,
    labelAnchor: 'end',
    nameTr: 'Trunkus Pulmonalis',
    nameLa: 'Truncus pulmonalis',
    region: 'Sağ ventrikül çıkışı, kalbin ön-yüzeyi',
    neighbors: ['Sağ ventrikül çıkım yolu (alt)', 'Aorta (sağ-arka)', 'Sol/sağ pulmoner arterler (çatal)', 'Ligamentum arteriosum (sol-üst)'],
    functions: [
      'Sağ ventrikülden gelen oksijenlenmemiş kanı sol ve sağ pulmoner arterlere dağıtır.',
      'Pulmoner dolaşımın ana taşıyıcı arteridir; basınç sistemik dolaşımdan düşüktür.',
      'Fetal dönemde trunkus arteriosus ile aorta arasında bağlantı (duktus arteriozus) bulunur.',
    ],
    clinical:
      'Pulmoner emboli kan pıhtısıyla trunkus pulmonalis veya dallarının tıkanmasıdır; ani dispne, plöretik ağrı ve sağ kalp yüklenmesi yapar. Persistan duktus arteriozus (PDA) doğduktan sonra kapanmazsa sol-sağ şant ve süreksiz (machinery) üfürüm oluşturur.',
    aliases: ['trunkus pulmonalis', 'pulmoner arter gövdesi', 'akciğer atardamarı', 'pulmoner trunkus'],
  },
  {
    id: 'heart-vcs',
    diagramId: 'heart',
    number: 12,
    x: 258,
    y: 88,
    labelDx: -14,
    labelDy: -28,
    labelAnchor: 'middle',
    nameTr: 'Vena Kava Süperior',
    nameLa: 'Vena cava superior',
    region: 'Üst mediasten, sağ atriyuma açılan ana toplardamar',
    neighbors: ['Sağ atriyum (alt)', 'Aort arkası (sol)', 'Trakea (arka)', 'N. phrenicus (yan yüzey)'],
    functions: [
      'Baş-boyun, üst ekstremiteler ve toraks duvarından gelen oksijenlenmemiş kanı sağ atriyuma taşır.',
      'İki ana toplardamardan biridir; vena azygos ile sağdan boşalır.',
      'İnspirasyonda negatif intratorasik basınçla venöz dönüş artar.',
    ],
    clinical:
      'SVC sendromunda (mediastinal tümör, lenfoma, tromboz) baş-boyun şişliği, siyanoz ve göğüs duvarı kollateral damarları gelişir. Santral venöz kateter ve pacemaker telleri bu damar üzerinden yerleştirilir; tromboz riski taşır.',
    aliases: ['vena kava superior', 'üst boş toplardamar', 'vcs', 'superior vena kava'],
  },
  {
    id: 'heart-vic',
    diagramId: 'heart',
    number: 13,
    x: 250,
    y: 620,
    labelDx: -22,
    labelDy: 26,
    labelAnchor: 'end',
    nameTr: 'Vena Kava İnferior',
    nameLa: 'Vena cava inferior',
    region: 'Alt karın boşluğu, sağ atriyuma açılan en geniş damar',
    neighbors: ['Sağ atriyum (üst)', 'Karaciğer (yan)', 'Aort (sol)', 'Diafragma (geçiş)'],
    functions: [
      'Alt ekstremiteler, pelvis ve karın organlarından gelen kanı sağ atriyuma taşır.',
      'Hepatik venler karaciğer süzgecinden sonra buraya boşalır.',
      'Volüm durumunun izlenmesinde santral venöz basınç referansıdır.',
    ],
    clinical:
      'İntraabdominal kitle, gebelik veya hepatomegali IVC’ye bası yaparak alt ekstremite ödemi ve varislere yol açar. Nefrotik sendrom ve sağ kalp yetmezliğinde IVC çapı genişleyerek santral venöz basıncı yansıtır.',
    aliases: ['vena kava inferior', 'alt boş toplardamar', 'vic', 'inferior vena kava'],
  },
  {
    id: 'heart-pulmoner-ven',
    diagramId: 'heart',
    number: 14,
    x: 732,
    y: 262,
    labelDx: 22,
    labelDy: -8,
    labelAnchor: 'start',
    nameTr: 'Pulmoner Venler',
    nameLa: 'Venae pulmonales',
    region: 'Akciğer hilusundan sol atriyuma (arka-yüzey)',
    neighbors: ['Sol atriyum (sol)', 'Pulmoner arter dalları (üst)', 'Sol ana bronş (arka)', 'Perikard arka yaprağı'],
    functions: [
      'Akciğerlerde oksijenlenen kanı dört ven (sağ/sol, üst/alt) ile sol atriyuma taşır.',
      'Vücutta oksijenli kan taşıyan tek toplardamar sistemidir.',
      'Sol atriyal basıncın dolaylı göstergesidir (wedge basıncı ölçümünde referans).',
    ],
    clinical:
      'Total anomalöz pulmoner ven dönüşü (TAPVR) konjenital bir anomali olup pulmoner venlerin sağ atriyuma boşalmasına yol açar; acil cerrahi gerektirir. Pulmoner ven tıkanıklığı pulmoner ödem ve hipertansiyonla seyreder.',
    aliases: ['pulmoner venler', 'akciğer toplardamarları', 'venae pulmonales', 'pulmoner ven'],
  },
  {
    id: 'heart-sa-dugumu',
    diagramId: 'heart',
    number: 15,
    x: 216,
    y: 194,
    labelDx: -34,
    labelDy: -30,
    labelAnchor: 'end',
    nameTr: 'SA Düğümü (Sinus Atriyal)',
    nameLa: 'Nodus sinuatrialis (Keith-Flack)',
    region: 'Vena kava superior ile sağ atriyum birleşimi',
    neighbors: ['Vena kava superior (üst)', 'Sağ atriyum miyokardı (alt)', 'Crista terminalis (yan)', 'Koroner sinüs (arka-alt)'],
    functions: [
      'Kalbin doğal pacemaker’i: dakikada 60-100 spontan depolarizasyon üretir.',
      'Otonom sinir sistemi ile hızlandırılır (sempatik) ve yavaşlatılır (vagal).',
      'Atriyal iletimi başlatarak AV düğümüne dalgayı iletir.',
    ],
    clinical:
      'Sick sinus sendromunda (sinüs düğümü hastalığı) bradikardi, sinüs arresti ve taşiaritmi atakları görülür; tedavisi kalıcı kalp pili ile yapılır. Vagal tonus artışı (sporcularda) fizyolojik sinüs bradikardisi yapabilir.',
    aliases: ['sa düğümü', 'sinus atriyal düğüm', 'sa node', 'sinus düğümü', 'kalp pili', 'pacemaker', 'nodus sinuatrialis'],
  },
  {
    id: 'heart-av-dugumu',
    diagramId: 'heart',
    number: 16,
    x: 372,
    y: 334,
    labelDx: 26,
    labelDy: -26,
    labelAnchor: 'start',
    nameTr: 'AV Düğümü (Atriyovenriküler)',
    nameLa: 'Nodus atrioventricularis (Aschoff-Tawara)',
    region: 'İntratriyal septumun alt bölümü, triküspit anulus yakını',
    neighbors: ['Koroner sinüs ağzı (arka)', 'Triküspit kapak (ön)', 'His demeti (alt)', 'Fossa ovalis (üst)'],
    functions: [
      'Atriyoventriküler iletimin tek normal geçit noktasıdır; atriyal dalgayı ventriküllere iletir.',
      'İletimde ~0,1 saniyelik gecikme sağlayarak atriyal sistolün ventrikül dolgusunu tamamlamasına izin verir.',
      'SA düğümü işlevini kaybederse dakikada 40-60 atımla yedek pacemaker olarak devreye girer.',
    ],
    clinical:
      'AV bloklarda iletim gecikir (1. derece), kısmen kesilir (2. derece) veya tamamen durur (3. derece); tam blokta ventriküler kaçış ritmi ve senkop gelişir. Miyokard enfarktüsü (inferior) AV düğüm beslenmesini bozarak geçici bloklara yol açabilir.',
    aliases: ['av düğümü', 'atriyoventriküler düğüm', 'av node', 'aschoff tawara', 'nodus atrioventricularis', 'kalp bloğu'],
  },
];

/* ===========================================================================
   DİYAGRAM 2 — Nefron ve Jukstaglomerüler Aparat
   =========================================================================== */

const NEPHRON_PINS: AtlasPin[] = [
  {
    id: 'nephron-afferent',
    diagramId: 'nephron',
    number: 1,
    x: 108,
    y: 140,
    labelDx: -14,
    labelDy: -24,
    labelAnchor: 'start',
    nameTr: 'Afferent Arteriol',
    nameLa: 'Arteriola afferens',
    region: 'Renal korpuskülün vasküler kutbu, kortikal bölge',
    neighbors: ['Efferent arteriol (üst-sağ)', 'Glomerül kapiller yumağı (sağ)', 'Jukstaglomerüler hücreler (duvar)', 'İnterlobüler arter dalı (kaynak)'],
    functions: [
      'Glomerüle kanı getiren arteriol; glomerüler hidrostatik basıncı belirleyen ana direnç noktasıdır.',
      'Vazokonstriksiyon/ vazodilatasyonla glomerüler filtrasyon hızını (GFR) düzenler.',
      'Jukstaglomerüler aparatın bir parçası olarak miyogen yanıta katılır.',
    ],
    clinical:
      'Diyabetik nefropatide afferent arteriol duvarında hialin birikimi (hialinize) GFR’de düşüşe yol açar. Nonsteroid antiinflamatuvar ilaçlar (NSAİİ) afferent vazokonstriksiyon yaparak renal kan akımını azaltır; volüm kaybı olan hastalarda akut böbrek hasarına zemin hazırlar.',
    aliases: ['afferent arteriol', 'giren arteriol', 'arteriola afferens'],
  },
  {
    id: 'nephron-efferent',
    diagramId: 'nephron',
    number: 2,
    x: 332,
    y: 122,
    labelDx: 12,
    labelDy: -22,
    labelAnchor: 'start',
    nameTr: 'Efferent Arteriol',
    nameLa: 'Arteriola efferens',
    region: 'Renal korpuskülün vasküler kutbu',
    neighbors: ['Afferent arteriol (alt-sol)', 'Glomerül yumağı (sol)', 'Peritübüler kapiller / vasa recta (devam)', 'Makula densa (alt)'],
    functions: [
      'Glomerülden kanı alan arteriol; filtrasyon fraksiyonının ana düzenleyicisidir.',
      'Kasılınca glomerüler onkotik basınç artar ve GFR yükselir.',
      'Proksimal tübül çevresinde peritübüler kapiller ağı oluşturur.',
    ],
    clinical:
      'ACE inhibitörleri ve ARB’ler efferent arteriyolü dilate ederek glomerüler basıncı düşürür; proteinüriyi azaltır ve kronik böbrek hastalığında ilerlemeyi yavaşlatır. Buna karşılık bilateral renal arter stenozunda bu ilaçlar GFR’yi ani düşürerek akut böbrek yetmezliği yapabilir.',
    aliases: ['efferent arteriol', 'çıkış arteriolü', 'arteriola efferens'],
  },
  {
    id: 'nephron-glomerul',
    diagramId: 'nephron',
    number: 3,
    x: 235,
    y: 212,
    labelDx: -28,
    labelDy: -34,
    labelAnchor: 'end',
    nameTr: 'Glomerül (Kapiller Yumak)',
    nameLa: 'Glomerulus renalis',
    region: 'Renal korpuskül, kortikal nefronun başlangıcı',
    neighbors: ['Bowman kapsülü (dış örtü)', 'Afferent/efferent arteriol (vasküler kutup)', 'Makula densa (yan)', 'Mezangiyal hücreler (iç destek)'],
    functions: [
      'Yüksek basınçlı kapiller yumak; günde ~180 L ultrafiltrat üretir.',
      'Filtrasyon bariyeri üç katmanlıdır: fenestre endotel, bazal membran, podositlerin slit diyaframları.',
      'Boyut ve yük seçiciliği ile proteinlerin filtrasyonunu sınırlandırır.',
    ],
    clinical:
      'Glomerülonefritlerde (akut poststreptokokkal, IgA nefropatisi, membranöz) bariyer hasarlanır; hemüri, proteinüri ve azotemi gelişir. Nefrotik sendromda masif proteinüri (>3,5 g/gün), hipoalbuminemi ve ödem tablo oluşturur. Diyabetik nefropati dünyanın en sık son dönem böbrek yetmezliği nedenidir.',
    aliases: ['glomerül', 'glomerulus', 'kapiller yumak', 'glomerulus renalis', 'böbrek yumagı'],
  },
  {
    id: 'nephron-bowman',
    diagramId: 'nephron',
    number: 4,
    x: 162,
    y: 300,
    labelDx: -30,
    labelDy: 30,
    labelAnchor: 'end',
    nameTr: 'Bowman Kapsülü',
    nameLa: 'Capsula glomeruli (Bowmani)',
    region: 'Renal korpuskülün dış örtüsü',
    neighbors: ['Glomerül (iç boşluk)', 'Proksimal tübül (devam)', 'Pariyetal epitelyum (duvar)', 'Üriner kutup (çıkış)'],
    functions: [
      'Glomerüler filtratı toplayan çift katlı epitelyal kapsüldür.',
      'Visseral yaprağı podositlerden, pariyetal yaprağı basit squamöz epitelyumdan oluşur.',
      'Filtratı proksimal kıvrıntılı tübüle iletir.',
    ],
    clinical:
      'Bowman kapsülü boşluğunda eritrosit silendirleri ve hücresel artıkların birikmesi glomerülonefritin sediment bulgusudur. Hızla ilerleyen (rapidly progressive) glomerülonefritte kapsül içi "yarımay" (kresent) oluşumu böbrek kaybının habercisidir.',
    aliases: ['bowman kapsülü', 'capsula glomeruli', 'bowman', 'glomerüler kapsül'],
  },
  {
    id: 'nephron-pct',
    diagramId: 'nephron',
    number: 5,
    x: 420,
    y: 236,
    labelDx: 0,
    labelDy: -28,
    labelAnchor: 'middle',
    nameTr: 'Proksimal Kıvrıntılı Tübül',
    nameLa: 'Pars convoluta proximalis (tubulus proximalis)',
    region: 'Kortikal piramit üstü, renal korpuskülden hemen sonra',
    neighbors: ['Bowman kapsülü (başlangıç)', 'Henle kulpu inen kol (devam)', 'Peritübüler kapiller (çevre)', 'Glomerül (üst)'],
    functions: [
      'Filtratın %65-70’ini izo-osmotik olarak geri emer: Na⁺, glukoz, amino asit, bikarbonat, üre.',
      'Na⁺/K⁺-ATPaz zengin fırçalı kenar (brush border) ile yoğun mitokondri içerir.',
      'H⁺ sekresyonu (Na⁺/H⁺ antiport) ile asit-baz dengesine katkıda bulunur.',
    ],
    clinical:
      'Diyabetes mellitusda plazma glukozu renal eşiği aşınca SGLT2 taşıyıcıları doyar; glukozüri ve osmotik diürez gelişir. SGLT2 inhibitörleri (empagliflozin) burada etki ederek diyabetik nefropatide nefroproteksiyon sağlar. Fanconi sendromunda proksimal tübülde yaygın geri emilim bozukluğu (glukozüri, aminoasidüri, fosfatüri) görülür.',
    aliases: ['proksimal tübül', 'proksimal kıvrıntılı tübül', 'pct', 'pars convoluta proximalis', 'proksimal konvolütübül'],
  },
  {
    id: 'nephron-ascend',
    diagramId: 'nephron',
    number: 6,
    x: 575,
    y: 440,
    labelDx: -26,
    labelDy: 6,
    labelAnchor: 'end',
    nameTr: 'İnen İnce Kol',
    nameLa: 'Crus descendens (tenuis)',
    region: 'Medüller piramit, Henle kulbunun inen kolu',
    neighbors: ['Proksimal tübül (üst)', 'Henle kulpu U dönüşü (alt)', 'Çıkan ince kol (paralel)', 'Vasa recta (yan)'],
    functions: [
      'Su geçirgenliği yüksek, NaCl geçirgenliği düşüktür; medüllaya inerken filtrat konsantre olur.',
      'Medüller osmotik gradyanın (300 → 1200 mOsm/kg) oluşturulmasına katkıda bulunur.',
      'Üre geri emilimi ile gradyanın sürdürülmesine yardım eder.',
    ],
    clinical:
      'ADH (vazopressin) eksikliğinde (santral diabetes insipidus) böbrek idrarı konsantre edemez; günde 10-20 L seyreltik idrar ve şiddetli poliüri gelişir. Uzun Henle kulbuna sahip juxtamedüller nefronlar yoğunluk regülasyonunun ana birimidir.',
    aliases: ['inen ince kol', 'inen kol', 'crus descendens', 'henle inen'],
  },
  {
    id: 'nephron-henle',
    diagramId: 'nephron',
    number: 7,
    x: 602,
    y: 578,
    labelDx: 0,
    labelDy: 36,
    labelAnchor: 'middle',
    nameTr: 'Henle Kulpı (U Dönüşü)',
    nameLa: 'Ansa nephroni (Henle)',
    region: 'Medüller piramidin orta bölümü',
    neighbors: ['İnen ince kol (sol)', 'Çıkan ince kol (sağ)', 'Vasa recta (dış)', 'Toplayıcı kanal (uzak)'],
    functions: [
      'Karşıt akım (countercurrent) mekanizmasının motorudur; medüller konsantrasyon gradyanını kurar.',
      'İnce kollar pasif difüzyonla, kalın çıkan kol aktif taşıma ile çalışır.',
      'İdrarın konsantrasyon kapasitesini belirleyen ana yapıdır.',
    ],
    clinical:
      'Loop diüretikler (furosemid) kalın çıkan koldaki NKCC2 taşıyıcısını bloke ederek medüller gradyanı bozar ve en güçlü diürezi sağlar. Bartter sendromunda NKCC2 genetik defekti loop diüretik etkisini taklit eder; hipokalemi ve metabolik alkaloz yapar.',
    aliases: ['henle kulpu', 'henle döngüsü', 'ansa nephroni', 'loop of henle', 'henle kulpu u dönüşü'],
  },
  {
    id: 'nephron-thick',
    diagramId: 'nephron',
    number: 8,
    x: 640,
    y: 370,
    labelDx: 26,
    labelDy: 8,
    labelAnchor: 'start',
    nameTr: 'Çıkan Kalın Kol',
    nameLa: 'Crus ascendens (crassum)',
    region: 'Medüller piramitten kortekse yükselen kol',
    neighbors: ['Çıkan ince kol (alt)', 'Distal kıvrıntılı tübül (üst)', 'Makula densa (üst-sol)', 'Vasa recta (yan)'],
    functions: [
      'Na⁺-K⁺-2Cl⁻ (NKCC2) taşıyıcısıyla aktif NaCl geri emilimi yapar; su geçirgenliği yoktur.',
      'Filtratı seyreltir (dilüsyon segmenti) ve medüller gradyanı sürdürür.',
      'Loop diüretiklerin farmakolojik hedefidir.',
    ],
    clinical:
      'Furosemid, bumetanid bu segmentteki NKCC2’yi inhibit eder; hipokalemi, hipomagnezemi ve işitme kaybı (ototoksisite) yapabilir. Bartter sendromu NKCC2 mutasyonuyla karakterizedir; kalın kol işlevi bozulur ve renal tuz kaybı gelişir.',
    aliases: ['çıkan kalın kol', 'kalın çıkan kol', 'crus ascendens', 'nkcc2', 'bartter'],
  },
  {
    id: 'nephron-dct',
    diagramId: 'nephron',
    number: 9,
    x: 480,
    y: 316,
    labelDx: 0,
    labelDy: -26,
    labelAnchor: 'middle',
    nameTr: 'Distal Kıvrıntılı Tübül',
    nameLa: 'Pars convoluta distalis (tubulus distalis)',
    region: 'Kortikal bölge, makula densanın devamı',
    neighbors: ['Çıkan kalın kol (başlangıç)', 'Makula densa (sol)', 'Toplayıcı kanal (devam)', 'Peritübüler kapiller (çevre)'],
    functions: [
      'Na⁺-Cl⁻ (NCC) taşıyıcısıyla ince ayar geri emilimi yapar; tiazid diüretiklerinin hedefidir.',
      'Paratiroid hormon (PTH) ile Ca²⁺ geri emilimini artırır.',
      'Aldosteronun etkisiyle Na⁺ geri emilimi ve K⁺ sekresyonu düzenlenir.',
    ],
    clinical:
      'Tiazid diüretikleri (hidroklorotiyazid) NCC’yi bloke eder; hipokalemi, hiperürisemi ve hiperkalsemi yapar. Gitelman sendromunda NCC genetik defekti tiazid etkisini taklit eder; hafif klinik seyirli hipokalemi ve hipomagnezemi tablo oluşturur.',
    aliases: ['distal tübül', 'distal kıvrıntılı tübül', 'dct', 'pars convoluta distalis', 'tiazid'],
  },
  {
    id: 'nephron-macula',
    diagramId: 'nephron',
    number: 10,
    x: 332,
    y: 266,
    labelDx: -24,
    labelDy: 34,
    labelAnchor: 'end',
    nameTr: 'Makula Densa',
    nameLa: 'Macula densa',
    region: 'Distal tübülün glomerüle komşu segmenti',
    neighbors: ['Glomerül (üst)', 'Jukstaglomerüler hücreler (karşılıklı)', 'Afferent arteriol (üst)', 'Distal tübül (devam)'],
    functions: [
      'Tübüldeki NaCl konsantrasyonunu algılayan özel hücre kümesidir.',
      'Tübüloglomerüler geri besleme ile GFR’yi ve afferent arteriol tonusunu düzenler.',
      'NaCl artınca vazodilatatör (adenozin) salınımıyla afferent arteriol kasılır.',
    ],
    clinical:
      'Makula densa sinyalizasyonu bozulduğunda renal oto-regülasyon kaybolur; kan basıncındaki dalgalanmalar GFR’yi doğrudan etkiler. Renin salınımını tetikleyen tübüloglomerüler mekanizma, hipovolemik hastalarda GFR’yi koruyan temel refleksin parçasıdır.',
    aliases: ['makula densa', 'macula densa', 'tübüloglomerüler geri besleme'],
  },
  {
    id: 'nephron-jg',
    diagramId: 'nephron',
    number: 11,
    x: 180,
    y: 200,
    labelDx: -28,
    labelDy: 30,
    labelAnchor: 'end',
    nameTr: 'Jukstaglomerüler Hücreler',
    nameLa: 'Cellulae iuxtaglomerulares (granüler hücreler)',
    region: 'Afferent arteriol duvarı, korpuskül yakını',
    neighbors: ['Makula densa (karşılıklı)', 'Afferent arteriol (duvar)', 'Glomerül (üst)', 'Ekstraglomerüler mezangium (ara)'],
    functions: [
      'Afferent arteriol duvarındaki düz kas benzeri hücrelerdir; renin sentezleyip salgılarlar.',
      'Renin, anjiyotensinojeni anjiyotensin I’e çevirir (RAAS başlangıcı).',
      'Basınç düşüklüğünü (baroreseptör) ve sempatik uyarıyı algılar.',
    ],
    clinical:
      'Renin salgısı arttığında (renal arter stenozu, hipovolemi) anjiyotensin II ile hipertansiyon ve aldosteronizm gelişir; buna reninoma da yol açabilir. Renin-anjiyotensin sistemi baskılayıcıları (ACE inhibitörleri) bu hücrelerin etkisini azaltarak kan basıncını düşürür.',
    aliases: ['jukstaglomerüler hücreler', 'granüler hücreler', 'jg hücreleri', 'renin', 'raas'],
  },
  {
    id: 'nephron-cd',
    diagramId: 'nephron',
    number: 12,
    x: 705,
    y: 520,
    labelDx: 26,
    labelDy: 8,
    labelAnchor: 'start',
    nameTr: 'Toplayıcı Kanal',
    nameLa: 'Ductus colligens',
    region: 'Medüller piramit, papillaya inen kanal',
    neighbors: ['Distal tübül (üst)', 'Papilla (alt)', 'Vasa recta (yan)', 'Kortikal toplayıcı kanal (üst devam)'],
    functions: [
      'ADH (vazopressin) ile akvaporin-2 (AQP2) kanallarını yerleştirerek su geri emilimini artırır.',
      'Aldosteron ile Na⁺ geri emilimi ve K⁺/H⁺ sekresyonunu düzenler.',
      'İdrarın son konsantrasyonundan sorumludur; üre döngüsüne katılır.',
    ],
    clinical:
      'SIADH’de uygunsuz ADH salınımı toplayıcı kanalda su geri emilimini artırarak dilüsyonel hiponatremi yapar. Nefrojenik diabetes insipidusta böbrekler ADH’ye yanıt vermez (V2/AQP2 defekti); seyreltik idrar ve poliüri görülür. Lityum tolayıcı kanal hücrelerini hasarlayarak nefrojenik DI’ye yol açabilir.',
    aliases: ['toplayıcı kanal', 'ductus colligens', 'collecting duct', 'toplayıcı tüp'],
  },
  {
    id: 'nephron-vasa',
    diagramId: 'nephron',
    number: 13,
    x: 545,
    y: 500,
    labelDx: -28,
    labelDy: 22,
    labelAnchor: 'end',
    nameTr: 'Vasa Recta',
    nameLa: 'Vasa recta (peritübüler kapiller)',
    region: 'Medüller piramit, Henle kulbuna paralel damarlar',
    neighbors: ['Henle kulpu (iç)', 'Toplayıcı kanal (dış)', 'Efferent arteriol devamı (kaynak)', 'Medüller interstisyum'],
    functions: [
      'Karşıt akım değişim mekanizmasıyla medüller osmotik gradyanı korur.',
      'Oksijen ve besin taşınmasıyla medüller hücreleri besler.',
      'Filtratın yoğunlaşması sırasında su ve tuz alışverişini dengeler.',
    ],
    clinical:
      'Medüller iskemide (akut tübüler nekroz, orak hücre hastalığı) vasa recta akımı bozulur; böbrek medüllasında oksijenlenme zaten sınırda olduğu için hücre ölümü hızla gelişir. NSAİİ’ler renal medüller kan akımını azaltarak bu riski artırır.',
    aliases: ['vasa recta', 'peritübüler kapiller', 'düz damarlar'],
  },
];

/* ===========================================================================
   DİYAGRAM 3 — Beyin Sapı Kesiti ve Kraniyal Sinir Çekirdekleri (Arka Görünüş)
   =========================================================================== */

const BRAINSTEM_PINS: AtlasPin[] = [
  {
    id: 'bs-mesensefalon',
    diagramId: 'brainstem',
    number: 1,
    x: 398,
    y: 118,
    labelDx: -26,
    labelDy: -34,
    labelAnchor: 'end',
    nameTr: 'Mezensefalon (Orta Beyin)',
    nameLa: 'Mesencephalon',
    region: 'Beyin sapının en üst segmenti',
    neighbors: ['Pons (alt)', 'Talamus (üst)', 'Serebral pedunküller (ön)', 'Superior/inferior kollikuluslar (arka)'],
    functions: [
      'III. ve IV. kraniyal sinirlerin çekirdekleri burada yerleşir.',
      'Superior kollikuluslar görsel refleksleri, inferior kollikuluslar işitsel refleksleri yönetir.',
      'Serebral pedunküller kortikospinal yolların inişini içerir; substantia nigra dopaminerjik sistemdir.',
    ],
    clinical:
      'Parinaud sendromunda superior kollikulus basısıyla yukarı bakış felci ve konverjans-paralizisi görülür. Unkal herniasyonda mezensefalon sıkışarak III. sinir paralizisi (fikse geniş pupil) ve bilinç kaybı gelişir — nöroşirürjik acil durumdur.',
    aliases: ['mezensefalon', 'orta beyin', 'mesencephalon', 'midbrain'],
  },
  {
    id: 'bs-pons',
    diagramId: 'brainstem',
    number: 2,
    x: 398,
    y: 268,
    labelDx: -26,
    labelDy: -18,
    labelAnchor: 'end',
    nameTr: 'Pons (Varol Köprüsü)',
    nameLa: 'Pons (Varolii)',
    region: 'Beyin sapının orta segmenti, serebellumun önünde',
    neighbors: ['Mezensefalon (üst)', 'Medulla oblongata (alt)', 'Serebellum (arka-iki yanda)', 'V., VI., VII. sinir çekirdekleri'],
    functions: [
      'V., VI. ve VII. kraniyal sinirlerin çekirdeklerini barındırır.',
      'Ponsun transvers lifleri serebellumla iletişimi sağlar.',
      'Solunum merkezlerinin (pnömotaksik merkez) bir kısmını içerir.',
    ],
    clinical:
      'Pontin infarktı (baziler arter oklüzyonu) sıklıkla "locked-in" sendromuna yol açar: hasta bilinçlidir ama yalnız göz kırpma hareketiyle iletişim kurabilir. Pontin miyelinolizisi (osmolalite düzeltmelerinde) dört ekstremitede flaks paralizi yapar.',
    aliases: ['pons', 'varol köprüsü', 'pons varolii', 'köprü'],
  },
  {
    id: 'bs-medulla',
    diagramId: 'brainstem',
    number: 3,
    x: 398,
    y: 448,
    labelDx: -26,
    labelDy: -8,
    labelAnchor: 'end',
    nameTr: 'Medulla Oblongata (Bulbus)',
    nameLa: 'Medulla oblongata (bulbus cerebri)',
    region: 'Beyin sapının en alt segmenti, omuriliğe devam eder',
    neighbors: ['Pons (üst)', 'Omurilik (alt)', 'Piramitler (ön-orta)', 'Olivler (yan)'],
    functions: [
      'IX., X., XI. ve XII. kraniyal sinirlerin çekirdeklerini içerir.',
      'Vital merkezler buradadır: solunum, kardiyovasküler kontrol, kusma refleksi.',
      'Piramitlerde kortikospinal yollar çaprazlaşır (decussatio pyramidum).',
    ],
    clinical:
      'Wallenberg sendromu (posteroinferior serebellar arter oklüzyonu) vertigo, disfaji, ipsilateral yüz ağrısı kaybı ve kontralateral vücut sıcaklık/ağrı kaybı yapar. Medüller kompresyon solunum arrestiyle ani ölüme yol açar; bu nedenle herniasyon bulguları acildir.',
    aliases: ['medulla', 'medulla oblongata', 'bulbus', 'beyin sapı', 'medulla oblongata'],
  },
  {
    id: 'bs-serebellum',
    diagramId: 'brainstem',
    number: 4,
    x: 218,
    y: 236,
    labelDx: -28,
    labelDy: -18,
    labelAnchor: 'end',
    nameTr: 'Serebellum (Beyincik)',
    nameLa: 'Cerebellum',
    region: 'Posterior kranial fossa, pons ve medullanın arkası',
    neighbors: ['Pons (ön)', 'Dördüncü ventrikül (ön-orta)', 'Mezensefalon (üst)', 'Tentorium serebelli (üst örtü)'],
    functions: [
      'Hareketlerin koordinasyonu, kas tonusu ve denge kontrolünü sağlar.',
      'Proprioseptif ve vestibüler bilgiyi işleyerek duruş stabilitesini korur.',
      'Öğrenilmiş motor kalıpların (motor öğrenme) saklanmasında rol oynar.',
    ],
    clinical:
      'Serebellar lezyonlar ipsilateral ataksi, dismetri, disdiyadokinezi ve titremeli konuşma (skandir) yapar. Alkol kullanımı serebellar dejenerasyonla yürüyüş ataksisine yol açar. Medüloblastom çocukluk çağı serebellar tümörlerinin en sık görülenidir.',
    aliases: ['serebellum', 'beyincik', 'cerebellum', 'serebellar'],
  },
  {
    id: 'bs-piramit',
    diagramId: 'brainstem',
    number: 5,
    x: 398,
    y: 540,
    labelDx: -26,
    labelDy: 12,
    labelAnchor: 'end',
    nameTr: 'Piramit (Kortikospinal Yol Çaprazı)',
    nameLa: 'Pyramis medullae oblongatae',
    region: 'Medullanın ventral yüzeyi, orta hat',
    neighbors: ['Oliv (yan)', 'Medulla çekirdekleri (arka)', 'Omurilik (alt)', 'Hipoglossal sinir çıkışları (yan)'],
    functions: [
      'Kortikospinal (piramidal) motor yolların %85-90’ı burada çaprazlaşır (decussatio pyramidum).',
      'Çaprazlanan lifler kontralateral ekstremite kaslarının ince motor kontrolünü sağlar.',
      'Kalan lifler (anterior kortikospinal trakt) daha sonra çaprazlaşır.',
    ],
    clinical:
      'Piramidal yol lezyonunda kontralateral üst motor nöron bulguları (spastisite, hiperrefleksi, Babinski pozitif) gelişir. Medüller infarkt piramitleri tutarsa bilateral motor kayıp ve "locked-in" benzeri tablo oluşabilir.',
    aliases: ['piramit', 'pyramis', 'kortikospinal yol', 'piramidal yol', 'decussatio pyramidum'],
  },
  {
    id: 'bs-n3',
    diagramId: 'brainstem',
    number: 6,
    x: 555,
    y: 138,
    labelDx: 22,
    labelDy: -14,
    labelAnchor: 'start',
    nameTr: 'N. Oculomotorius (III)',
    nameLa: 'Nervus oculomotorius',
    region: 'Mezensefalonun ventral yüzeyi, serebral pedunkül aralığı',
    neighbors: ['N. trochlearis (alt)', 'N. trigeminus (alt-yan)', 'Mezensefalon (kaynak)', 'Edinger-Westphal çekirdeği (parasempatik bileşen)'],
    functions: [
      'Gözün içi kaslarının çoğunu innerve eder: rektus medialis/inferior/superior, oblikus inferior, levator palpebrae superioris.',
      'Parasempatik lifleri (Edinger-Westphal) pupil konstriksiyonu ve akomodasyonu sağlar.',
      'Göz hareketleri ve üst göz kapağının kaldırılmasından sorumludur.',
    ],
    clinical:
      'Unkal herniasyonda (temporal lob basısı) ilk tutulan sinirdir: ipsilateral ptoz, gözün aşağı-dışa sapması ve fikse geniş pupil (parasempatik bası) görülür — acil ameliyat bulgusudur. Posterior komünikanter anevrizma III. siniri sıkıştırarak ağrılı pupil fikse paralizi yapabilir.',
    aliases: ['n oculomotorius', 'üçüncü sinir', 'okülomotor sinir', 'iii. sinir', 'göz siniri', 'edinger westphal'],
  },
  {
    id: 'bs-n4',
    diagramId: 'brainstem',
    number: 7,
    x: 566,
    y: 215,
    labelDx: 22,
    labelDy: 12,
    labelAnchor: 'start',
    nameTr: 'N. Trochlearis (IV)',
    nameLa: 'Nervus trochlearis',
    region: 'Mezensefalonun dorsal yüzeyi (arkadan çıkan tek sinir)',
    neighbors: ['N. oculomotorius (üst)', 'N. trigeminus (alt)', 'Superior kollikulus (üst-orta)', 'Beyin sapını en uzun seyreden sinir'],
    functions: [
      'M. obliquus superior’u innerve eder; gözü aşağı-içe döndürür.',
      'Başın karşı tarafa eğilmesiyle aşağı bakış hareketini (ör. merdiven inme) kolaylaştırır.',
      'Beyin sapını dorsal yüzeyden çıkan ve en ince kraniyal sinirdir.',
    ],
    clinical:
      'Kafa travmasında (özellikle çarpma) kolay hasarlanır; başın karşı tarafa eğik tutulması (kompansatuar baş pozisyonu) ve aşağı bakışta diplopi tipik bulgulardır. Diabetes mellitus ve hipertansiyonda mikrovasküler tutulum da IV. sinir paralizisi yapabilir.',
    aliases: ['n trochlearis', 'troklear sinir', 'dördüncü sinir', 'iv. sinir', 'oblikus superior'],
  },
  {
    id: 'bs-n5',
    diagramId: 'brainstem',
    number: 8,
    x: 612,
    y: 292,
    labelDx: 22,
    labelDy: -8,
    labelAnchor: 'start',
    nameTr: 'N. Trigeminus (V)',
    nameLa: 'Nervus trigeminus',
    region: 'Ponsun lateral yüzeyi, üç ana dala ayrılır',
    neighbors: ['N. abducens (alt-orta)', 'N. facialis (alt)', 'N. vestibulocochlearis (alt-yan)', 'Gasser ganglionu (V1-V2-V3)'],
    functions: [
      'Yüzün duyusunu (V1 oftalmik, V2 maksiller, V3 mandibular) taşır.',
      'Çiğneme kaslarının motor kontrolünü (V3) sağlar.',
      'Kornea refleksinin afferent kolunu oluşturur.',
    ],
    clinical:
      'Trigeminal nevraljide (tic douloureux) V2-V3 dağılımında elektrik çarpması tarzında ağrı atakları ve tetik noktalar bulunur. Kavernöz sinüs trombozu V1 dallarında uyuşukluk ve göz hareketi bozukluğuyla birlikte seyreder. Akustik nörinom (schwannoma) V. sinir basısıyla yüz uyuşukluğu yapabilir.',
    aliases: ['n trigeminus', 'trigeminal sinir', 'beşinci sinir', 'v. sinir', 'trigeminus', 'kornea refleksi'],
  },
  {
    id: 'bs-n6',
    diagramId: 'brainstem',
    number: 9,
    x: 520,
    y: 420,
    labelDx: 22,
    labelDy: 22,
    labelAnchor: 'start',
    nameTr: 'N. Abducens (VI)',
    nameLa: 'Nervus abducens',
    region: 'Pons-medulla birleşimi, piramit üstü',
    neighbors: ['N. facialis (üst)', 'N. trigeminus (üst)', 'Piramit (alt)', 'Kavernöz sinüs (seyir)'],
    functions: [
      'M. rectus lateralis’i innerve eder; gözün abduksiyonunu (dışa bakış) sağlar.',
      'En uzun intrakraniyal seyri olan kraniyal sinirdir; basıya en duyarlıdır.',
      'Gözün yatay hareketlerinde VI. sinir çekirdeği koordinasyon merkezidir.',
    ],
    clinical:
      'İntrakraniyal basınç artışı (tümör, hidrosefalus) ilk olarak VI. siniri sıkıştırır; abduksiyon kaybı ve konverjans kısıtlılığı gelişir. Diyabetik mikroanjiyopati izole abduksiyon paralizisine yol açabilir; hasta çift görmeyi yan bakışta hisseder.',
    aliases: ['n abducens', 'abdusens sinir', 'altıncı sinir', 'vi. sinir', 'rektus lateralis'],
  },
  {
    id: 'bs-n7',
    diagramId: 'brainstem',
    number: 10,
    x: 585,
    y: 372,
    labelDx: 22,
    labelDy: -14,
    labelAnchor: 'start',
    nameTr: 'N. Facialis (VII)',
    nameLa: 'Nervus facialis',
    region: 'Serebellopontin açı, pons-medulla birleşimi',
    neighbors: ['N. vestibulocochlearis (alt)', 'N. abducens (üst-orta)', 'N. trigeminus (üst)', 'Internal akustik kanal (seyir)'],
    functions: [
      'Yüz mimik kaslarının motor inervasyonunu sağlar (stapedius kası dahil).',
      'Dilin ön 2/3’ünden tat duyusunu (chorda tympani) taşır.',
      'Submandibular ve sublingual bezlerin sekresyonunu kontrol eder.',
    ],
    clinical:
      'Bell paralizisi (idiyopatik periferik fasiyal paralizi) alın dahil tüm yüz kaslarında tek taraflı güçsüzlük yapar: alın kırışıklığı kaybolur, göz kapatılamaz (lagophtalmos), ağız köşesi sarkar. Santral lezyonda alın korunur (bilateral inervasyon); bu kritik ayrım tanıda belirleyicidir.',
    aliases: ['n facialis', 'fasial sinir', 'yedinci sinir', 'vii. sinir', 'bell paralizi', 'yüz siniri', 'fasiyal sinir'],
  },
  {
    id: 'bs-n8',
    diagramId: 'brainstem',
    number: 11,
    x: 600,
    y: 342,
    labelDx: 22,
    labelDy: -8,
    labelAnchor: 'start',
    nameTr: 'N. Vestibulocochlearis (VIII)',
    nameLa: 'Nervus vestibulocochlearis (acusticus)',
    region: 'Serebellopontin açı, internal akustik kanal',
    neighbors: ['N. facialis (üst)', 'Serebellum (arka)', 'Koklear çekirdekler (medulla)', 'Vestibüler çekirdekler (pons-medulla)'],
    functions: [
      'Koklear kısım işitme duyusunu (spiral ganglion → koklear çekirdekler) taşır.',
      'Vestibüler kısım denge ve pozisyon duyusunu (utrikül, sakkül, semisirküler kanallar) iletir.',
      'Göz hareketleriyle işitme-denge koordinasyonunu (nystagmus refleksi) sağlar.',
    ],
    clinical:
      'Vestibüler schwannoma (akustik nörinom) sıklıkla bu sinirden kaynaklanır; işitme kaybı, tinnitus ve dengesizlik üçlüsüyle seyreder. Menière hastalığında endolenf basıncı artarak vertigo, işitme kaybı ve kulakta dolgunluk atakları yapar.',
    aliases: ['n vestibulocochlearis', 'vestibülokoklear sinir', 'sekizinci sinir', 'viii. sinir', 'akustik sinir', 'işitme siniri'],
  },
  {
    id: 'bs-n9',
    diagramId: 'brainstem',
    number: 12,
    x: 575,
    y: 462,
    labelDx: 22,
    labelDy: -8,
    labelAnchor: 'start',
    nameTr: 'N. Glossopharyngeus (IX)',
    nameLa: 'Nervus glossopharyngeus',
    region: 'Medullanın lateral yüzeyi, juguler foramen',
    neighbors: ['N. vagus (alt)', 'N. vestibulocochlearis (üst)', 'Oliv (ön)', 'Sinüs karoticus (periferik seyir)'],
    functions: [
      'Dilin posterior 1/3’ünün duyusunu ve tat algısını taşır.',
      'Farenks kaslarının (m. stylopharyngeus) motor kontrolünü sağlar.',
      'Sinüs karoticus baroreseptörlerinden (kan basıncı refleksi) aferent sinyalleri iletir.',
    ],
    clinical:
      'Glossopharingeal nevralji yutma, konuşma ve öksürmeyle tetiklenen şiddetli boğaz ağrısı atakları yapar. Sinüs karoticus hipersensitivitesinde boyun hareketiyle bradikardi ve senkop gelişir. Farenks refleksinin kaybı (IX-X hasarı) aspire pnömoni riskini artırır.',
    aliases: ['n glossopharyngeus', 'glossofaringeal sinir', 'dokuzuncu sinir', 'ix. sinir', 'boğaz siniri'],
  },
  {
    id: 'bs-n10',
    diagramId: 'brainstem',
    number: 13,
    x: 578,
    y: 496,
    labelDx: 22,
    labelDy: 12,
    labelAnchor: 'start',
    nameTr: 'N. Vagus (X)',
    nameLa: 'Nervus vagus',
    region: 'Medulla oblongata, juguler foramen üzerinden boyun-karın seyri',
    neighbors: ['N. glossopharyngeus (üst)', 'N. accessorius (alt)', 'Karotis kılıfı (boyun)', 'N. laringeus recurrens (dal)'],
    functions: [
      'Farenks ve larenks kaslarının motor inervasyonunu sağlar (ses telleri dahil).',
      'Kalp, akciğer, sindirim sistemi organlarına parasempatik lifler taşır (bradikardi, sekresyon, peristaltizm).',
      'Kulak cildinin bir bölümünün duyusunu alır; öksürük ve kusma reflekslerinde rol oynar.',
    ],
    clinical:
      'N. laringeus recurrens hasarında (tiroid cerrahisi, mediastinal tümör) ses kısıklığı ve boğuk ses gelişir. Vagal tonus artışı (vazovagal senkop) bradikardi ve hipotansiyonla bayılmaya yol açar. Bilateral vagus kesisi ölümcül solunum ve kalp yetmezliği yapar.',
    aliases: ['n vagus', 'vagus siniri', 'onuncu sinir', 'x. sinir', 'vagus', 'rekürren laringeal'],
  },
  {
    id: 'bs-n11',
    diagramId: 'brainstem',
    number: 14,
    x: 570,
    y: 560,
    labelDx: 22,
    labelDy: 18,
    labelAnchor: 'start',
    nameTr: 'N. Accessorius (XI)',
    nameLa: 'Nervus accessorius (spinal)',
    region: 'Medulla alt bölümü ve üst servikal omurilikten kökler',
    neighbors: ['N. vagus (üst)', 'N. hypoglossus (üst)', 'Sternokleidomastoid (dal)', 'Trapezius (dal)'],
    functions: [
      'M. sternokleidomastoid’i innerve eder; başın karşı tarafa dönmesini sağlar.',
      'M. trapezius’u innerve eder; omuz kaldırma ve skapula stabilizasyonu.',
      'Kafa içi seyri kısa olup juguler foramen üzerinden çıkar.',
    ],
    clinical:
      'Boyun cerrahilerinde (lenf nodu biyopsisi) hasarlanabilir; omuz düşmesi ve başın karşı tarafa dönmesinde güçsüzlük (Kaplan belirtisi) gelişir. Spinal aksesuar nöropatisi travma veya tekrarlayan gerilmeyle ortaya çıkabilir.',
    aliases: ['n accessorius', 'aksesuar sinir', 'onbirinci sinir', 'xi. sinir', 'trapezius', 'sternokleidomastoid'],
  },
  {
    id: 'bs-n12',
    diagramId: 'brainstem',
    number: 15,
    x: 545,
    y: 528,
    labelDx: 22,
    labelDy: -6,
    labelAnchor: 'start',
    nameTr: 'N. Hypoglossus (XII)',
    nameLa: 'Nervus hypoglossus',
    region: 'Medullanın ventral yüzeyi, piramit-oliv arası',
    neighbors: ['Piramit (ön)', 'Oliv (arka)', 'N. accessorius (alt)', 'Canalis hypoglossi (çıkış)'],
    functions: [
      'Dilin ekstrinsik ve intrinsik kaslarını innerve eder (genioglossus, hyoglossus).',
      'Dilin protrüzyonu, yutma ve konuşma (artikülasyon) hareketlerini sağlar.',
      'Ağız içi besin topağının (bolus) kontrolünde rol oynar.',
    ],
    clinical:
      'XII. sinir lezyonunda dil protrüzyonu lezyon tarafına doğru sapar (sağ taraflı lezyonda dil sağa sapar); zamanla dilde atrofi ve fibrilasyon görülür. Santral lezyonda dil lezyonun karşı tarafına sapar; bu fark lezyonun lokalizasyonunu belirler.',
    aliases: ['n hypoglossus', 'hipoglossal sinir', 'onikinci sinir', 'xii. sinir', 'dil siniri', 'hipoglossus'],
  },
];

/* ===========================================================================
   DİYAGRAM 4 — Ökaryotik Hücre Ultrastrüktürü (Histoloji)
   =========================================================================== */

const CELL_PINS: AtlasPin[] = [
  {
    id: 'cell-membrane',
    diagramId: 'cell',
    number: 1,
    x: 700,
    y: 122,
    labelDx: -22,
    labelDy: -38,
    labelAnchor: 'end',
    nameTr: 'Hücre Zarı (Fosfolipit Çift Tabaka)',
    nameLa: 'Membrana plasmatica',
    region: 'Hücrenin dış sınırı, seçici geçirgen bariyer',
    neighbors: ['Sitoplazma (iç)', 'Ekstrasellüler matriks (dış)', 'Kolesterol (gömülü)', 'Glikoproteinler (yüzey)'],
    functions: [
      'Fosfolipit çift tabaka (hidrofilik başlar dışta, hidrofobik kuyruklar içte) esnek bir bariyer oluşturur.',
      'Transmembran proteinler taşıma, reseptör ve kanal işlevlerini yerine getirir.',
      'Selektif geçirgenlik ile hücre içi dengenin (homeostaz) korunmasını sağlar.',
    ],
    clinical:
      'Kistik fibroziste CFTR klor kanalı proteininde mutasyon; salgıların koyulaşmasıyla kronik akciğer enfeksiyonu ve pankreas yetmezliği yapar. Hücre zarı hasarı (hemoliz, iskemi) hücre içi enzimlerin (LDH, CK) sızmasına ve doku hasarının laboratuvar belirteçlerine yol açar.',
    aliases: ['hücre zarı', 'plazma zarı', 'membrana plasmatica', 'fosfolipit', 'hücre membranı', 'çift tabaka'],
  },
  {
    id: 'cell-nucleus',
    diagramId: 'cell',
    number: 2,
    x: 315,
    y: 380,
    labelDx: -26,
    labelDy: 42,
    labelAnchor: 'middle',
    nameTr: 'Çekirdek (Nucleus)',
    nameLa: 'Nucleus',
    region: 'Hücre merkezi, genetik kontrol merkezi',
    neighbors: ['Çekirdekçik (iç)', 'Granüllü ER (çevre)', 'Nükleer zar (dış)', 'Kromatin (iç madde)'],
    functions: [
      'DNA’yı barındırır ve genetik bilginin korunmasından sorumludur.',
      'Transkripsiyon burada gerçekleşir; mRNA sitoplazmaya ribozomlara taşınır.',
      'Nükleer porlar ile madde alışverişi (protein, RNA) düzenlenir.',
    ],
    clinical:
      'Kanserde çekirdek boyutu ve şekli düzensizleşir; nükleer/citoplazmik oran artar (anaploidi). Lösemi ve lenfomalarda çekirdek yapısı tanısal önem taşır. Nükleer por hastalıkları (ör. nükleoporin mutasyonları) gelişimsel bozukluklara yol açar.',
    aliases: ['çekirdek', 'nucleus', 'hücre çekirdeği', 'nükleus'],
  },
  {
    id: 'cell-nucleolus',
    diagramId: 'cell',
    number: 3,
    x: 355,
    y: 285,
    labelDx: 22,
    labelDy: -14,
    labelAnchor: 'start',
    nameTr: 'Çekirdekçik (Nucleolus)',
    nameLa: 'Nucleolus',
    region: 'Çekirdek içi yoğun yapı, zarı yoktur',
    neighbors: ['Kromatin (çevre)', 'Nükleer zar (dış)', 'Ribozom RNA sentezi (işlev)', 'Çekirdek plazması (iç)'],
    functions: [
      'Ribozomal RNA (rRNA) sentezlenir ve ribozom alt birimleri burada birleştirilir.',
      'Protein sentezi kapasitesi artan hücrelerde (ör. salgı hücreleri) çekirdekçik belirginleşir.',
      'Uzun ömürlü yapıdır; bölünme sırasında kaybolup yeniden oluşur.',
    ],
    clinical:
      'Ribozomopatilerde (ör. Diamond-Blackfan anemisi) çekirdekçik işlevi bozulur; eritroid yetmezlik ve gelişimsel anomaliler görülür. Malign hücrelerde çekirdekçik sayısı ve boyutu artabilir; hızlı proliferasyonun göstergesidir.',
    aliases: ['çekirdekçik', 'nucleolus', 'çekirdek içi', 'ribozom sentezi'],
  },
  {
    id: 'cell-chromatin',
    diagramId: 'cell',
    number: 4,
    x: 262,
    y: 262,
    labelDx: -22,
    labelDy: -18,
    labelAnchor: 'end',
    nameTr: 'Kromatin (DNA + Protein)',
    nameLa: 'Chromatin',
    region: 'Çekirdek içi, DNA’nın histonlarla paketlenmiş hali',
    neighbors: ['Çekirdekçik (yan)', 'Nükleer zar (dış)', 'Histon proteinleri (paketleme)', 'Eukromatin / heterokromatin'],
    functions: [
      'DNA’nın histon proteinleriyle sarılarak paketlenmesidir; gen ekspresyonunu düzenler.',
      'Eukromatin aktif transkripsiyon bölgesi, heterokromatin yoğun ve sessiz bölgedir.',
      'Bölünme sırasında kondense olup kromozomları oluşturur.',
    ],
    clinical:
      'Barr cisimciği (inaktive X kromozomu) heterokromatinin klasik örneğidir; Turner sendromunda (45,X) görülmez. Kromatin anormallikleri lösemi, lenfoma ve genetik sendromlarla ilişkilidir; sitogenetik analizlerde (karyotip) tanısal rol oynar.',
    aliases: ['kromatin', 'chromatin', 'dna', 'kromozom', 'histon'],
  },
  {
    id: 'cell-rer',
    diagramId: 'cell',
    number: 5,
    x: 545,
    y: 258,
    labelDx: 22,
    labelDy: -18,
    labelAnchor: 'start',
    nameTr: 'Granüllü Endoplazmik Retikulum',
    nameLa: 'Reticulum endoplasmicum granulosum (rER)',
    region: 'Çekirdek çevresi, ribozom kaplı kanallar',
    neighbors: ['Çekirdek (sol)', 'Golgi aygıtı (alt)', 'Ribozomlar (yüzey)', 'Sitoplazma (dış)'],
    functions: [
      'Yüzeyindeki ribozomlarla protein sentezler; salgı proteinleri burada olgunlaşır.',
      'Proteinlerin katlanması, glikolizasyonu ve kalite kontrolü burada yapılır.',
      'Salgı hücrelerinde (pankreas, bezler) rER son derece gelişmiştir.',
    ],
    clinical:
      'ER stresi (yanlış katlanan protein birikimi) diyabet, nörodejeneratif hastalıklar (Alzheimer, Parkinson) ve alfa-1 antitripsin eksikliğinde hücre ölümüne yol açar. RER üzerinde biriken proteinler (ör. üretilen antikorlar) plazma hücrelerinde "ergastoplazma" görüntüsü oluşturur.',
    aliases: ['granüllü er', 'rer', 'ergastoplazma', 'reticulum endoplasmicum granulosum', 'endoplazmik retikulum'],
  },
  {
    id: 'cell-ser',
    diagramId: 'cell',
    number: 6,
    x: 655,
    y: 425,
    labelDx: 22,
    labelDy: 12,
    labelAnchor: 'start',
    nameTr: 'Granülsüz Endoplazmik Retikulum',
    nameLa: 'Reticulum endoplasmicum agranulare (sER)',
    region: 'Sitoplazma, ribozomsuz tübüler ağ',
    neighbors: ['Granüllü ER (yan)', 'Hücre zarı (dış)', 'Mitokondri (komşu)', 'Golgi (bağlantı)'],
    functions: [
      'Lipid ve steroid hormon sentezinde görev alır (özellikle adrenal korteks, over, testis).',
      'Detoksifikasyon (karaciğerde ilaç metabolizması, sitokrom P450) yapar.',
      'Kalsiyum depoları (kas hücresinde sarkoplazmik retikulum) olarak işlev görür.',
    ],
    clinical:
      'Karaciğerde sER aktivitesi arttığında (barbitürat, alkol) ilaç toleransı gelişir. Gilbert sendromunda glukuronil transferaz eksikliği ile bilirubin metabolizması bozulur. Kas hücresinde sarkoplazmik retikulum hasarı (malign hipertermi) kontrolsüz Ca²⁺ salınımıyla ölümcül kas kasılmasına yol açar.',
    aliases: ['granülsüz er', 'ser', 'reticulum endoplasmicum agranulare', 'sarkoplazmik retikulum', 'detoks'],
  },
  {
    id: 'cell-golgi',
    diagramId: 'cell',
    number: 7,
    x: 505,
    y: 532,
    labelDx: -26,
    labelDy: 30,
    labelAnchor: 'end',
    nameTr: 'Golgi Aygıtı',
    nameLa: 'Corpus Golgiense (apparatus Golgi)',
    region: 'Çekirdek çevresi, cis-stack (diktiosom) yapısı',
    neighbors: ['Granüllü ER (üst)', 'Lizozom (yan)', 'Veziküller (salgı)', 'Hücre zarı (dışa taşıma)'],
    functions: [
      'ER’den gelen proteinleri modifiye eder (glikolizasyon, sülfatasyon, fosforilasyon).',
      'Salgı veziküllerini paketleyip hedefine (hücre zarı, lizozom) gönderir.',
      'Lizozomal enzimleri burada etiketler (mannoz-6-fosfat).',
    ],
    clinical:
      'İ-oligosakkaridoz ve kongenital glikolizasyon bozukluklarında Golgi işlevi etkilenir; nörolojik ve multisistemik bulgular görülür. Golgi’nin polarize yapısı salgı hücrelerinde (mukus, enzim) belirgin şekilde gelişir; tümör hücrelerinde düzensizleşir.',
    aliases: ['golgi', 'golgi aygıtı', 'corpus golgiense', 'diktiosom', 'salgı paketleme'],
  },
  {
    id: 'cell-mito',
    diagramId: 'cell',
    number: 8,
    x: 185,
    y: 520,
    labelDx: -24,
    labelDy: 32,
    labelAnchor: 'end',
    nameTr: 'Mitokondri (Kristalı)',
    nameLa: 'Mitochondrium',
    region: 'Sitoplazma, enerji santrali',
    neighbors: ['Granüllü ER (yan)', 'Hücre zarı (dış)', 'Kripta (iç kıvrımlar)', 'Mitokondriyal DNA (iç)'],
    functions: [
      'Oksidatif fosforilasyonla ATP üretir (glikoliz sonrası pirüvat oksidasyonu, Krebs döngüsü).',
      'İç zar kıvrımları (krista) ile yüzey alanını artırır; solunum zinciri enzimleri burada yerleşir.',
      'Kendi DNA’sı (dairesel) ve ribozomları vardır; anneden kalıtılan organeldir.',
    ],
    clinical:
      'MELAS, Leigh sendromu ve mitokondriyal miyopatiler mitokondriyal DNA mutasyonlarıyla ortaya çıkar; kas güçsüzlüğü, laktik asidoz ve nörolojik tutulum yapar. Siyanür zehirlenmesi sitokrom c oksidazı inhibe ederek oksidatif fosforilasyonu durdurur; ölümcül doku hipoksisi gelişir.',
    aliases: ['mitokondri', 'mitochondrium', 'atp', 'enerji santrali', 'krista'],
  },
  {
    id: 'cell-lyso',
    diagramId: 'cell',
    number: 9,
    x: 255,
    y: 600,
    labelDx: -22,
    labelDy: 30,
    labelAnchor: 'end',
    nameTr: 'Lizozom',
    nameLa: 'Lysosoma',
    region: 'Sitoplazma, sindirim vezikülü',
    neighbors: ['Golgi (kaynak)', 'Fagozom (füzyon)', 'Hücre zarı (ekzositoz)', 'Peroksizom (komşu)'],
    functions: [
      'Asidik pH’ta (≈4,5-5) 40’dan fazla hidrolitik enzim içerir.',
      'Hücresel artıkları, fagosite edilen patojenleri ve eski organelleri (otofaji) sindirir.',
      'Apoptozda hücre içi yıkımın gerçekleştirilmesine katkıda bulunur.',
    ],
    clinical:
      'Tay-Sachs (GM2 gangliozidoz), Gaucher (glukoserebrozidoz) ve Pompé (glikojen depo hastalığı tip II) lizozomal enzim eksiklikleriyle ortaya çıkan depo hastalıklarıdır; sinir sistemi ve organomegali ile seyreder. Gut hastalığında ürat kristalleri lizozomları parçalayarak inflamasyonu tetikler.',
    aliases: ['lizozom', 'lysosoma', 'sindirim', 'lizozomal depo hastalığı', 'tay-sachs', 'gaucher'],
  },
  {
    id: 'cell-peroxi',
    diagramId: 'cell',
    number: 10,
    x: 125,
    y: 300,
    labelDx: -18,
    labelDy: -24,
    labelAnchor: 'end',
    nameTr: 'Peroksizom',
    nameLa: 'Peroxisoma',
    region: 'Sitoplazma, mikro gövdeler',
    neighbors: ['Granülsüz ER (yan)', 'Mitokondri (komşu)', 'Katalaz (iç enzim)', 'Hücre zarı (dış)'],
    functions: [
      'Hidrojen peroksidi (H₂O₂) üretip katalaz enzimiyle parçalar; oksidatif stresi kontrol eder.',
      'Çok uzun zincirli yağ asitlerinin (VLCFA) beta oksidasyonunu yapar.',
      'Safra asidi ve plazmalojen sentezine katkıda bulunur.',
    ],
    clinical:
      'Zellweger sendromu (peroksizom biyogenezi defekti) ağır nörolojik anomaliler, hepatomegali ve VLCFA birikimiyle ölümcül seyreder. Adrenolökodistrofide VLCFA metabolizması bozulur; adrenal yetmezlik ve demiyelinizasyon gelişir.',
    aliases: ['peroksizom', 'peroxisoma', 'katalaz', 'h2o2', 'zellweger'],
  },
  {
    id: 'cell-ribosome',
    diagramId: 'cell',
    number: 11,
    x: 420,
    y: 185,
    labelDx: -14,
    labelDy: -26,
    labelAnchor: 'end',
    nameTr: 'Ribozomlar (Serbest + Bağlı)',
    nameLa: 'Ribosoma',
    region: 'Sitoplazma ve granüllü ER yüzeyi',
    neighbors: ['Granüllü ER (bağlı)', 'mRNA (translasyon)', 'Çekirdekçik (kaynak)', 'Polizomlar (küme)'],
    functions: [
      'mRNA’yı proteine çevirir (translasyon); amino asitleri peptit bağlarıyla birleştirir.',
      'Serbest ribozomlar sitoplazmik proteinleri, bağlı ribozomlar salgı proteinlerini sentezler.',
      'Polizomlar (mRNA üzerindeki ribozom kümeleri) verimliliği artırır.',
    ],
    clinical:
      'Tetrasiklin ve aminoglikozidler bakteriyel ribozomları (30S/50S) inhibe ederek protein sentezini durdurur; mitokondriyal ribozomlara etkiyle kas ve işitme yan etkileri yapabilir. Ribozomopatilerde (Diamond-Blackfan) kemik iliği yetmezliği ve gelişimsel anomaliler görülür.',
    aliases: ['ribozom', 'ribosoma', 'translasyon', 'protein sentezi', 'polizom'],
  },
  {
    id: 'cell-centriole',
    diagramId: 'cell',
    number: 12,
    x: 250,
    y: 195,
    labelDx: -14,
    labelDy: -24,
    labelAnchor: 'end',
    nameTr: 'Sentriyol / Sitoskeleton',
    nameLa: 'Centriolum et cytoskeleton',
    region: 'Hücre merkezi (sentrozom), mikrotübül organizasyon merkezi',
    neighbors: ['Çekirdek (yan)', 'Mikrotübüler ağ (dağılım)', 'Hücre zarı (dış)', 'Mikrofilamanlar (aktin)'],
    functions: [
      'Sentriyoller mitotik iğ ipliklerini organize ederek bölünmeyi sağlar.',
      'Mikrotübüler ve mikrofilaman ağ hücre şeklini, taşınmayı ve bölünmeyi destekler.',
      'Silia ve flagella yapısının (9+2 düzen) temelini oluşturur.',
    ],
    clinical:
      'Kartagener sendromunda (primer silier diskinezi) silia hareketi bozulur; kronik sinüzit, bronşektazi ve situs inversus triosu görülür. Duchenne musküler distrofisinde distrofin eksikliğiyle aktin-miyozin çapası bozulur; kas dejenerasyonu gelişir.',
    aliases: ['sentriyol', 'centriolum', 'sitoskeleton', 'mikrotübül', 'kartagener', 'silia'],
  },
];

/* ===========================================================================
   Diyagram Tanımları
   =========================================================================== */

export const ATLAS_DIAGRAMS: AtlasDiagram[] = [
  {
    id: 'heart',
    title: 'Kalp Anatomisi (Ön Kesit)',
    subtitle: 'Odacıklar, kapaklar, büyük damarlar ve iletim sistemi',
    description:
      'Hastaya karşdan bakış düzleminde çizilmiş kalp ön kesiti. Odacıklar, kapakçıklar, büyük damarlar ve sinüs düğümleri; damar akış yönleri ve iletim yolları katmanları açılabilir.',
    viewBox: v,
    pins: HEART_PINS,
  },
  {
    id: 'nephron',
    title: 'Nefron ve Jukstaglomerüler Aparat',
    subtitle: 'Glomerül, tübüler segmentler ve renal oto-regülasyon',
    description:
      'Nefronun işlevsel anatomisi: renal korpuskül, tübüler segmentler (PCT, Henle kulpu, DCT, toplayıcı kanal) ve jukstaglomerüler aparatın hücre bileşenleri.',
    viewBox: v,
    pins: NEPHRON_PINS,
  },
  {
    id: 'brainstem',
    title: 'Beyin Sapı ve Kraniyal Sinir Çekirdekleri',
    subtitle: 'Arka görünüş: mezensefalon, pons, medulla ve sinir çıkışları',
    description:
      'Beyin sapının arka yüzey anatomisi. On iki kraniyal sinirden beyin sapından çıkanların (III-XII) çıkış noktaları ve çekirdek lokalizasyonları renk kodlu katmanlarla gösterilir.',
    viewBox: v,
    pins: BRAINSTEM_PINS,
  },
  {
    id: 'cell',
    title: 'Ökaryotik Hücre Ultrastrüktürü',
    subtitle: 'Organeller, membran detayı ve histolojik yapılar',
    description:
      'Tipik bir ökaryotik hücrenin ultrastrüktürel şeması: çekirdek, endoplazmik retikulum, Golgi, mitokondri ve hücre zarı fosfolipit çift tabaka detayı.',
    viewBox: v,
    pins: CELL_PINS,
  },
];

/* ===========================================================================
   Yardımcılar
   =========================================================================== */

export function getDiagram(id: AtlasDiagramId): AtlasDiagram {
  return ATLAS_DIAGRAMS.find((d) => d.id === id) ?? ATLAS_DIAGRAMS[0];
}

export function findPin(diagramId: AtlasDiagramId, pinId: string): AtlasPin | undefined {
  return getDiagram(diagramId).pins.find((p) => p.id === pinId);
}

export interface AtlasSearchHit {
  pin: AtlasPin;
  diagram: AtlasDiagram;
}

/**
 * Global arama için: yapı adı, Latince ad veya eş anlamlılarda arama yapar.
 * Sorgu birden fazla kelime içeriyorsa tüm kelimelerin birleşik metinde
 * geçmesi aranır (ör. "mitral kapak", "henle kulpu").
 */
export function searchAtlas(query: string, limit = 8): AtlasSearchHit[] {
  const q = query.toLocaleLowerCase('tr').trim();
  if (q.length < 2) return [];
  const terms = q.split(/\s+/);
  const hits: { hit: AtlasSearchHit; score: number }[] = [];

  for (const diagram of ATLAS_DIAGRAMS) {
    for (const pin of diagram.pins) {
      const haystack = `${pin.nameTr} ${pin.nameLa} ${pin.region} ${pin.aliases.join(' ')}`.toLocaleLowerCase('tr');
      if (terms.every((t) => haystack.includes(t))) {
        const nameLower = pin.nameTr.toLocaleLowerCase('tr');
        // Tam eşleşme en üstte, ardından adın başında geçenler
        const score = nameLower === q ? 0 : nameLower.startsWith(q) ? 1 : 2;
        hits.push({ hit: { pin, diagram }, score });
      }
    }
  }
  hits.sort((a, b) => a.score - b.score);
  return hits.slice(0, limit).map((h) => h.hit);
}

