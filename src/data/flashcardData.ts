/* ===========================================================================
   HipokLab — Sınav & Flashcard Veri Katmanı
   SM-2 benzeri aralıklı tekrar (spaced repetition) algoritması ve
   ders bazlı flashcard desteleri. Kartlar; kütüphanedeki "Sınav Spotu"
   kutularından otomatik + müfredata göre elle hazırlanmış içeriklerdir.
   =========================================================================== */

import type { CardProgress, CardRating, Course, Flashcard, FlashcardDeck } from '../types/hipoklab';
import { LIBRARY_RESOURCES } from './libraryData';

/* ---------------------------------------------------------------------------
   SM-2 benzeri aralıklı tekrar
--------------------------------------------------------------------------- */

const DAY_MS = 24 * 60 * 60 * 1000;

export function defaultCardProgress(): CardProgress {
  return { interval: 0, ease: 2.5, due: 0, reps: 0, lapses: 0, lastReviewed: null };
}

/**
 * Karta verilen değerlendirmeye göre bir sonraki tekrar planını üretir.
 * again: kart oturum içinde tekrar sorulur (10 dk sonra)
 * hard: aralık x1.2, kolaylık -0.15
 * good: aralık xkolaylık, kolaylık sabit
 * easy: aralık xkolaylık x1.3, kolaylık +0.15
 */
export function rateCard(progress: CardProgress, rating: CardRating): CardProgress {
  const now = Date.now();
  const p: CardProgress = { ...progress, reps: progress.reps + 1, lastReviewed: now };

  switch (rating) {
    case 'again':
      p.lapses = progress.lapses + 1;
      p.ease = Math.max(1.3, progress.ease - 0.2);
      p.interval = 0;
      p.due = now + 10 * 60 * 1000; // 10 dakika sonra
      return p;
    case 'hard':
      p.ease = Math.max(1.3, progress.ease - 0.15);
      p.interval = progress.interval === 0 ? 1 : Math.max(1, Math.round(progress.interval * 1.2));
      p.due = now + p.interval * DAY_MS;
      return p;
    case 'good':
      p.interval = progress.interval === 0 ? 2 : Math.max(1, Math.round(progress.interval * progress.ease));
      p.due = now + p.interval * DAY_MS;
      return p;
    case 'easy':
      p.ease = Math.min(2.8, progress.ease + 0.15);
      p.interval = progress.interval === 0 ? 4 : Math.max(1, Math.round(progress.interval * progress.ease * 1.3));
      p.due = now + p.interval * DAY_MS;
      return p;
    default:
      return p;
  }
}

/** Bugün tekrar edilmesi (vadesi gelmiş) gereken kartlar. */
export function getDueCardIds(cards: Flashcard[], progressMap: Record<string, CardProgress>): string[] {
  const now = Date.now();
  return cards
    .filter((c) => {
      const p = progressMap[c.id];
      return !p || p.due <= now;
    })
    .map((c) => c.id);
}

/* ---------------------------------------------------------------------------
   Otomatik kart üretimi — kütüphanedeki "Sınav Spotu" kutuları
--------------------------------------------------------------------------- */

function generateSpotCards(): Flashcard[] {
  const cards: Flashcard[] = [];
  for (const resource of LIBRARY_RESOURCES) {
    let spotIndex = 0;
    for (const block of resource.blocks) {
      if (block.type !== 'spot') continue;
      spotIndex += 1;
      cards.push({
        id: `spot-${resource.id}-${spotIndex}`,
        deckId: deckIdForCourse(resource.course),
        front: `${resource.title} — Sınav Spotu ${spotIndex}`,
        back: block.text,
        sourceResourceId: resource.id,
        tag: 'Sınav Spotu',
      });
    }
  }
  return cards;
}

function deckIdForCourse(course: Course): string {
  switch (course) {
    case 'Anatomi':
      return 'deck-anatomi';
    case 'Fizyoloji':
      return 'deck-fizyoloji';
    case 'Histoloji':
      return 'deck-histoloji';
    case 'Biyokimya':
      return 'deck-biyokimya';
    case 'Patoloji':
      return 'deck-patoloji';
    default:
      return 'deck-fizyoloji';
  }
}

/* ---------------------------------------------------------------------------
   Elle hazırlanmış kartlar
--------------------------------------------------------------------------- */

const ANATOMY_CARDS: Flashcard[] = [
  {
    id: 'an-1',
    deckId: 'deck-anatomi',
    front: 'M. levator palpebrae superioris hangi sinirle innerve edilir ve görevi nedir?',
    back: 'N. oculomotorius (III). Üst göz kapağını kaldırır; paralizisinde ptoz gelişir.',
    tag: 'Nöroanatomi',
  },
  {
    id: 'an-2',
    deckId: 'deck-anatomi',
    front: 'Foramen ovale’den hangi yapı geçer?',
    back: 'N. mandibularis (V3) — trigeminal sinirin üçüncü dalı.',
    tag: 'Kafa tabanı',
  },
  {
    id: 'an-3',
    deckId: 'deck-anatomi',
    front: 'Koroner arterlerin kaynaklandığı sinüsler hangi kapağın üzerindedir?',
    back: 'Aort kapağındaki sinüsler (sinus aortae / Valsalva). Diastolde aort kapakçıkları kapanırken koroner akım beslenir.',
    tag: 'Kardiyak anatomi',
  },
  {
    id: 'an-4',
    deckId: 'deck-anatomi',
    front: 'Periferik fasiyal paralizi ile santral fasiyal paraliziyi ayıran klinik bulgu nedir?',
    back: 'Alın kaslarının durumu. Periferik lezyonda alın tutulur (kırışıklık kaybolur); santral lezyonda alın korunur (bilateral inervasyon).',
    tag: 'Nöroanatomi',
  },
  {
    id: 'an-5',
    deckId: 'deck-anatomi',
    front: 'McBurney noktası neresidir ve klinik önemi nedir?',
    back: 'Anterior superior iliak spina ile göbek arası mesafenin dış 1/3 noktası. Apandisit palpasyonunda hassasiyet bölgesidir (Rovsing, psoas, oblik bulguları ile birlikte değerlendirilir).',
    tag: 'Karın anatomisi',
  },
  {
    id: 'an-6',
    deckId: 'deck-anatomi',
    front: 'Rotator kaf (manşet) kasları hangileridir?',
    back: 'SITS: Supraspinatus, Infraspinatus, Teres minor, Subskapularis. Supraspinatus en sık yırtılan tendondur (ilk 60° abduksiyon ağrılı).',
    tag: 'Muskuloskeletal',
  },
  {
    id: 'an-7',
    deckId: 'deck-anatomi',
    front: 'Diyaframı hangi sinirler innerve eder ve neden önemlidir?',
    back: 'N. phrenicus (C3-C5). "C3-4-5 diyaframı yaşatır"; lezyonunda ipsilateral diyafram elevasyonu ve solunum güçlüğü gelişir.',
    tag: 'Boyun anatomisi',
  },
  {
    id: 'an-8',
    deckId: 'deck-anatomi',
    front: 'Vater (ampulla) papillası nerede bulunur ve neyi boşaltır?',
    back: 'Duodenumun pars descendens’inde. Ana pankreas kanalı (Wirsung) ve koledok (ana safra kanalı) burada birleşerek duodenuma açılır; sfinkter Oddi düzenlenir.',
    tag: 'Gastrointestinal',
  },
  {
    id: 'an-9',
    deckId: 'deck-anatomi',
    front: 'N. laringeus recurrens hangi anatomik yapılarla yakın komşuluktadır ve hasarında ne olur?',
    back: 'Aort arkası (sol) ve tiroid bezi. Hasarında ses kısıklığı (hoarseness) gelişir; bilateral hasar hava yolunu tehlikeye atar.',
    tag: 'Boyun anatomisi',
  },
  {
    id: 'an-10',
    deckId: 'deck-anatomi',
    front: 'Popliteal fossa’nın sınırları ve içeriği nedir?',
    back: 'Üst-sağ: semimembranosus/semitedinosus; üst-sol: biceps femoris; alt: gastroknemius başları. İçerik: popliteal arter/ven, tibial sinir, ortak peroneal sinir.',
    tag: 'Alt ekstremite',
  },
];

const PHYSIOLOGY_CARDS: Flashcard[] = [
  {
    id: 'fi-1',
    deckId: 'deck-fizyoloji',
    front: 'Frank-Starling mekanizması nedir?',
    back: 'Diyastol sonu hacmi (preload) arttıkça sarkomerler optimal uzunluğa yaklaşır ve kasılma kuvveti artar; kalp, venöz dönüşteki artışa nöral uyarı olmadan uyum sağlar.',
    tag: 'Kardiyovasküler',
  },
  {
    id: 'fi-2',
    deckId: 'deck-fizyoloji',
    front: 'S1 ve S2 kalp sesleri hangi kapak olaylarından kaynaklanır?',
    back: 'S1: mitral + triküspid kapanması (sistol başı). S2: aort + pulmoner kapanması (diyastol başı).',
    tag: 'Kardiyovasküler',
  },
  {
    id: 'fi-3',
    deckId: 'deck-fizyoloji',
    front: 'Aksiyon potansiyelinin Faz 0’ında hangi iyon akımı baskındır?',
    back: 'Voltaj kapılı Na⁺ kanallarının açılmasıyla hızlı Na⁺ içeri akımı (depolarizasyon).',
    tag: 'Nörofizyoloji',
  },
  {
    id: 'fi-4',
    deckId: 'deck-fizyoloji',
    front: 'Kalp kası neden tetanize olamaz?',
    back: 'Plato fazı (Faz 2, Ca²⁺) uzun mutlak refrakter dönem yaratır; kasılma tamamlanmadan yeni bir uyarana yanıt verilemez.',
    tag: 'Nörofizyoloji',
  },
  {
    id: 'fi-5',
    deckId: 'deck-fizyoloji',
    front: 'GFR yaklaşık kaçtır ve nasıl ölçülür?',
    back: '≈125 mL/dk (180 L/gün). İnülin klirensi altın standarttır (filtre olur, geri emilmez/sekretilmez). PAH renal plazma akımını ölçer.',
    tag: 'Renal',
  },
  {
    id: 'fi-6',
    deckId: 'deck-fizyoloji',
    front: 'Proksimal konvolütübülde filtratın yüzde kaçı geri emilir?',
    back: '%65-70 (izo-osmotik). Na⁺, glukoz, amino asit, bikarbonat ve ürenin çoğu burada geri emilir.',
    tag: 'Renal',
  },
  {
    id: 'fi-7',
    deckId: 'deck-fizyoloji',
    front: 'ADH böbrekte hangi kanalı hücre zarına taşır?',
    back: 'Akvaporin-2 (AQP2) — tolayıcı kanalın apikal membranına V2 reseptör/cAMP-PKA yolağıyla yerleştirilir; su geri emilimi artar.',
    tag: 'Renal',
  },
  {
    id: 'fi-8',
    deckId: 'deck-fizyoloji',
    front: 'İspirasyonda S2 neden genişler (splitting)?',
    back: 'Venöz dönüş artar, sağ ventrikül ejeksiyonu uzar, P2 gecikir. A2 ile P2 arasındaki aralık açılır.',
    tag: 'Kardiyovasküler',
  },
  {
    id: 'fi-9',
    deckId: 'deck-fizyoloji',
    front: 'Oksijen hemoglobin disosiyasyon eğrisini sağa kaydıran faktörler nelerdir?',
    back: '↑CO₂, ↑H⁺ (asidoz), ↑2,3-BPG, ↑sıcaklık, ↑egzersiz. Sağ kayma = O₂’nin dokuya bırakılması kolaylaşır (Bohr etkisi).',
    tag: 'Solunum',
  },
  {
    id: 'fi-10',
    deckId: 'deck-fizyoloji',
    front: 'Pulmoner ventilasyon/perfüzyon (V/Q) oranı normalde nedir ve anlamlı sapmalar?',
    back: '≈0,8. V/Q = 0 (atelektazi, pnömoni) → şant; V/Q = ∞ (pulmoner emboli) → ölü boşluk.',
    tag: 'Solunum',
  },
  {
    id: 'fi-11',
    deckId: 'deck-fizyoloji',
    front: 'TSH-T3/T4 geri besleme ekseni nasıl çalışır?',
    back: 'Hipotalamus TRH → ön hipofiz TSH → tiroid T3/T4 salgılar. T3/T4 yükseldiğinde TRH ve TSH negatif geri beslemeyle baskılanır.',
    tag: 'Endokrin',
  },
  {
    id: 'fi-12',
    deckId: 'deck-fizyoloji',
    front: 'İnsülin hangi reseptör tipiyle sinyalizasyon yapar?',
    back: 'Tirozin kinaz reseptörü (RTK). PI3K-Akt yoluyla GLUT4 translokasyonu ve glikoz alımı artar.',
    tag: 'Endokrin',
  },
];

const BIOCHEM_CARDS: Flashcard[] = [
  {
    id: 'bi-1',
    deckId: 'deck-biyokimya',
    front: 'Kolera toksininin moleküler mekanizması nedir?',
    back: 'Gαs alt birimini ADP-ribosilleyerek GTPaz aktivitesini inhibe eder → adenilat siklaz sürekli aktif → cAMP ↑ → enterositlerde masif Cl⁻/su sekresyonu (sulu ishal).',
    tag: 'Sinyal yolları',
  },
  {
    id: 'bi-2',
    deckId: 'deck-biyokimya',
    front: 'G proteinine bağlı reseptörlerin Gs, Gi ve Gq alt tipleri ne yapar?',
    back: 'Gs: adenilat siklaz ↑ (cAMP ↑). Gi: adenilat siklaz ↓ (cAMP ↓). Gq: fosfolipaz C → IP₃ + DAG (Ca²⁺/PKC).',
    tag: 'Sinyal yolları',
  },
  {
    id: 'bi-3',
    deckId: 'deck-biyokimya',
    front: 'Rate-limiting enzim nedir, örnek verin.',
    back: 'Bir metabolik yolun hızını belirleyen, genellikle geri besleme ile inhibe edilen enzim. Ör: HMG-CoA redüktaz (kolesterol sentezi — statin hedefi).',
    tag: 'Metabolizma',
  },
  {
    id: 'bi-4',
    deckId: 'deck-biyokimya',
    front: 'Glukoneogenez nerede gerçekleşir ve substratları nelerdir?',
    back: 'Karaciğer (böbrekte kısmen). Substratlar: laktat (Cori), gliserol, glukojenik amino asitler (alanin). Piruvat kinaz ile bypass edilir.',
    tag: 'Metabolizma',
  },
  {
    id: 'bi-5',
    deckId: 'deck-biyokimya',
    front: 'Üre döngüsünün lokalizasyonu ve iki temel organik taşıyıcısı nedir?',
    back: 'Karaciğerde gerçekleşir. Karbamoil fosfat sentetaz I (mitokondri) + ornitin transkarbamilaz; argininosüksinat sentetaz + liyaz. N-aspartil-argininosüksinat ile argininoüri asidozu hatırlanır.',
    tag: 'Metabolizma',
  },
  {
    id: 'bi-6',
    deckId: 'deck-biyokimya',
    front: 'Hem sentezindeki rate-limiting enzim ve inhibe edici madde nedir?',
    back: 'ALA sentetaz. Hemin (ürün) inhibe eder. Kurşun ALA dehidrataz ve ferrokelataz enzimlerini inhibe eder (anemi + nöropati).',
    tag: 'Hematoloji',
  },
  {
    id: 'bi-7',
    deckId: 'deck-biyokimya',
    front: 'Lesch-Nyhan sendromunda hangi enzim eksiktir?',
    back: 'Hipozanin-guanin fosforiboziltransferaz (HGPRT). Purin yıkım artar, ürik asit ↑ ve nörolojik bulgular (otodestruktif davranış) görülür.',
    tag: 'Purin metabolizması',
  },
  {
    id: 'bi-8',
    deckId: 'deck-biyokimya',
    front: 'Nükleer reseptörlerle sinyal veren hormonların ortak özelliği nedir?',
    back: 'Lipofilik yapıda olup membranı geçerler; ligand bağlı transkripsiyon faktörü gibi çalışarak gen ekspresyonunu saatler içinde değiştirirler (steroidler, tiroid hormonu, D vitamini).',
    tag: 'Sinyal yolları',
  },
  {
    id: 'bi-9',
    deckId: 'deck-biyokimya',
    front: 'Vitamin B12 (kobalamin) eksikliğinin neden olduğu hematolojik ve nörolojik tablo?',
    back: 'Megaloblastik anemi (DNA sentezi bozukluğu) + posterior kolon ve periferik nöropati (metilmalonik asit ↑). Folat eksikliğinde nörolojik tutulum görülmez.',
    tag: 'Vitaminler',
  },
  {
    id: 'bi-10',
    deckId: 'deck-biyokimya',
    front: 'Birkaç ana antioksidan enzim ve kofaktörleri?',
    back: 'Süperoksit dismutaz (Cu/Zn veya Mn), katalaz (hem), glutatyon peroksidaz (selenyum). Serbest radikal hasarına karşı birinci savunma hattıdırlar.',
    tag: 'Metabolizma',
  },
];

const HISTOLOGY_CARDS: Flashcard[] = [
  {
    id: 'hi-1',
    deckId: 'deck-histoloji',
    front: 'Bazal membran hangi moleküllerden oluşur ve boyanması?',
    back: 'Tip IV kolajen, laminin, proteoglikanlar. PAS (+) boyanır; epitel ile bağ dokusu arasında seçici bariyer görevi görür.',
    tag: 'Doku temelleri',
  },
  {
    id: 'hi-2',
    deckId: 'deck-histoloji',
    front: 'Transiziyonel epitel nerede bulunur ve özellikli hücresi?',
    back: 'Üriner sistem (mesane, üreter). Yüzeysel "şemsiye hücreler" (umbrella cells) mesane dolduğunda düzleşir; gerilmeye uyum sağlar.',
    tag: 'Epitelyum',
  },
  {
    id: 'hi-3',
    deckId: 'deck-histoloji',
    front: 'Apokrin bez nedir, örnek verin.',
    back: 'Sekresyon sırasında sitoplazmanın apikal kısmı koparak salınır. Ör: koltuk altı apokrin ter bezleri, meme bezleri.',
    tag: 'Bezler',
  },
  {
    id: 'hi-4',
    deckId: 'deck-histoloji',
    front: 'Paneth hücreleri nerede bulunur ve işlevi?',
    back: 'İnce bağırsağın kriptlerinde. Lizozim ve defensin salgılayarak mukozal immün savunmaya katkıda bulunur.',
    tag: 'Gastrointestinal',
  },
  {
    id: 'hi-5',
    deckId: 'deck-histoloji',
    front: 'Karaciğerin işlevsel birimi (asini) nedir?',
    back: 'Hepatik asinus: portal triad ile santral ven arasında; kan merkeze doğru akar. Zona 1 (periportal, oksijen yüksek), zona 3 (perisentral, iskemiye en duyarlı).',
    tag: 'Karaciğer',
  },
  {
    id: 'hi-6',
    deckId: 'deck-histoloji',
    front: 'Nefronun proksimal tübül hücrelerinin ultrastrüktürel ayırt edici özelliği?',
    back: 'Apikal fırçalı kenar (mikrovilluslar), bol mitokondri ve bazolateral Na⁺/K⁺-ATPaz yoğunluğu. EM’de fırçalı kenar belirgindir.',
    tag: 'Böbrek',
  },
  {
    id: 'hi-7',
    deckId: 'deck-histoloji',
    front: 'Tiroid folikül hücreleri ne salgılar, parafoliküler (C) hücreler ne salgılar?',
    back: 'Foliküler hücreler: T3/T4 (kolloid depo). Parafiküler C hücreleri: kalsitonin (kalsiyum düşürücü).',
    tag: 'Endokrin',
  },
  {
    id: 'hi-8',
    deckId: 'deck-histoloji',
    front: 'Akciğerde gaz değişimi hangi hücre ile gerçekleşir ve tip I/II pnömosit farkı?',
    back: 'Tip I pnömositler (yassı, %95 yüzey) gaz değişimi; tip II pnömositler (kübik) surfaktan üretir ve doku yenilenmesinde kök hücre gibi davranır.',
    tag: 'Solunum',
  },
];

const PATHOLOGY_CARDS: Flashcard[] = [
  {
    id: 'pa-1',
    deckId: 'deck-patoloji',
    front: 'Akut inflamasyonun beş kardinal bulgusu?',
    back: 'Rubor (kızarıklık), calor (ısı), tumor (şişlik), dolor (ağrı), functio laesa (fonksiyon kaybı).',
    tag: 'İnflamasyon',
  },
  {
    id: 'pa-2',
    deckId: 'deck-patoloji',
    front: 'Kazeifikasyon nekrozu hangi hastalıkla ilişkilidir?',
    back: 'Tüberküloz (Mycobacterium tuberculosis). Langhans tipi dev hücreleri ve epitelyoid histiyositlerle granülom görülür.',
    tag: 'Granülomatöz',
  },
  {
    id: 'pa-3',
    deckId: 'deck-patoloji',
    front: 'Malign hücrelerin morfolojik ortak özellikleri?',
    back: 'Pleomorfizm, hiperkromatizm, artmış nükleus/sitoplazma oranı, belirgin nükleoller, artmış mitoz (atipik), kayıp diferansiyasyon.',
    tag: 'Onkoloji',
  },
  {
    id: 'pa-4',
    deckId: 'deck-patoloji',
    front: 'Düzensiz kanama nedenleri (Virchow üçlüsü)?',
    back: 'Endotelyal hasar, akım bozukluğu (staz/türbülans), hiperkoagülabilite. Venöz trombozda staz baskın; arteriyelde ateroskleroz baskındır.',
    tag: 'Tromboz',
  },
  {
    id: 'pa-5',
    deckId: 'deck-patoloji',
    front: 'Yara iyileşmesinde tip III ve tip I kolajen geçişi?',
    back: 'Erken proliferatif fazda tip III kollajen sentezlenir; remodelingde yerini kalıcı tip I kolajene bırakır. C vitamini hidroksilasyon için kofaktördür.',
    tag: 'Onarım',
  },
  {
    id: 'pa-6',
    deckId: 'deck-patoloji',
    front: 'En sık görülen tümör supresör gen ve işlevi?',
    back: 'TP53 ("guardian of the genome"). DNA hasarında hücre döngüsünü durdurur (p21 ile), onarım sağlayamazsa apoptozu tetikler. Kaybı kanser riskini artırır.',
    tag: 'Moleküler patoloji',
  },
  {
    id: 'pa-7',
    deckId: 'deck-patoloji',
    front: 'Amyloidoz nedir ve tanısı?',
    back: 'Proteinlerin beta-pleated tabaka yapısında ekstrasellüler birikimi. Kongoreda pembe, polarize ışıkta yeşil birefranjes. AL (multipl myeloma), AA (kronik inflamasyon).',
    tag: 'Depo hastalıkları',
  },
  {
    id: 'pa-8',
    deckId: 'deck-patoloji',
    front: 'Sepsis ve septik şok tanımı?',
    back: 'Enfeksiyona karşı yaşamı tehdit eden disfonksiyonel yanıt. Refrakter hipotansiyon, laktat ↑, çoklu organ yetmezliği; TNF-α/IL-1 endotelyal hasar ve DİK yapar.',
    tag: 'Sistemik yanıt',
  },
];

/* ---------------------------------------------------------------------------
   Genişletme kartları — yeni konu anlatımlarıyla birlikte eklenen
   elle hazırlanmış yüksek verimli kartlar
--------------------------------------------------------------------------- */

const EXPANSION_CARDS: Flashcard[] = [
  // Diabetes Mellitus
  {
    id: 'dx-1',
    deckId: 'deck-biyokimya',
    front: 'HbA1c neyi yansıtır, normal değeri nedir?',
    back: 'Son 2-3 aylık ortalama glisemiyi yansıtır (eritrosit ömrü ~120 gün). Normal <%5.7; diyabet tanısı ≥%6.5.',
    tag: 'Diyabet',
  },
  {
    id: 'dx-2',
    deckId: 'deck-biyokimya',
    front: 'Metforminin mekanizması ve en tehlikeli yan etkisi?',
    back: 'Karaciğerde glukoneogenezini baskılar (AMPK aktivasyonu). En tehlikeli yan etkisi laktik asidozdur; GFR <30\'da kontrendikedir.',
    tag: 'Farmakoloji',
  },
  {
    id: 'dx-3',
    deckId: 'deck-patoloji',
    front: 'Diyabetik ketoasidozun (DKA) triadı nedir?',
    back: 'Hiperglisemi (>250 mg/dL), ketonemi/ketonüri ve yüksek anyon açıklığı metabolik asidoz (pH <7.3). Tip 1\'de mutlak insülin eksikliğinin sonucudur.',
    tag: 'Acil',
  },
  {
    id: 'dx-4',
    deckId: 'deck-biyokimya',
    front: 'Hipergliseminin dört toksik yolağı?',
    back: 'Poliol (sorbitol) yolağı, protein kinaz C aktivasyonu, heksozamin yolağı ve ileri glikasyon ürünleri (AGE) — hepsi ROS artışında birleşir.',
    tag: 'Patogenez',
  },
  {
    id: 'dx-5',
    deckId: 'deck-biyokimya',
    front: 'Tip 1 ve Tip 2 diyabette C-peptid düzeyleri nasıl ayrılır?',
    back: 'Tip 1\'de beta hücre yıkımı nedeniyle C-peptid düşük/ölçülemez; Tip 2\'nin erken evresinde hiperinsülinemiye bağlı normal/yüksektir.',
    tag: 'Tanı',
  },
  // Solunum
  {
    id: 'rs-1',
    deckId: 'deck-fizyoloji',
    front: 'Oksijen-hemoglobin eğrisini sağa kaydıran faktörler?',
    back: 'Asidoz (pH düşüklüğü), hiperkapni (PCO₂ artışı), ateş, 2,3-BPG artışı — dokuya O₂ bırakımı kolaylaşır (Bohr etkisi).',
    tag: 'Gaz değişimi',
  },
  {
    id: 'rs-2',
    deckId: 'deck-fizyoloji',
    front: 'Karbonmonoksit zehirlenmesinde neden PaO₂ normal çıkabilir?',
    back: 'CO hemoglobine yüksek afiniteli bağlanır (HbCO) ve oksijen basıncını düşürmez; paletik basınç ölçümü normal kalır ama gerçek oksijen içeriği çökmüştür.',
    tag: 'Toksikoloji',
  },
  {
    id: 'rs-3',
    deckId: 'deck-fizyoloji',
    front: 'V/Q = 0 (şant) ne demektir, hangi hastalıklarda görülür?',
    back: 'Alveol ventilasyonsuz ama perfüzyonlu; kan oksijenlenmeden geçer. Pnömoni, ARDS ve atelektazide görülür; yüksek akımlı O₂ ile düzeltilemeyen hipoksemi yapar.',
    tag: 'V/Q',
  },
  {
    id: 'rs-4',
    deckId: 'deck-fizyoloji',
    front: 'Kronik KOAH hastasına neden düşük akımlı oksijen verilir?',
    back: 'Solunum sürükleyicisi hipoksidir (merkezi reseptörler CO₂\'ye duyarsızlaşmıştır). Yüksek akım hipoksik uyarıyı kaldırır → solunum depresyonu ve CO₂ narkozu.',
    tag: 'Klinik',
  },
  {
    id: 'rs-5',
    deckId: 'deck-fizyoloji',
    front: 'Surfactan eksikliği hangi tabloyu yapar, nerede üretilir?',
    back: 'Tip II pnömositlerce üretilir; eksikliği yenidoğan solunum distres sendromuna (NRDS) yol açar. Laplace yasasına göre yüzey gerilimi artar, alveoller çöker.',
    tag: 'Mekanik',
  },
  // Anemiler
  {
    id: 'an-10',
    deckId: 'deck-patoloji',
    front: 'Demir eksikliği ile talasemi minör en hızlı nasıl ayrılır?',
    back: 'Ferritin (DEA düşük, talasemi normal), RDW (DEA yüksek, talasemi normal) ve HbA2 (talasemi minörde >%3.5).',
    tag: 'Hematoloji',
  },
  {
    id: 'an-11',
    deckId: 'deck-patoloji',
    front: 'Hemolitik aneminin dört laboratuvar imzası?',
    back: 'LDH artışı, indirekt bilirubin artışı, retikülositoz ve düşük haptoglobin.',
    tag: 'Hematoloji',
  },
  {
    id: 'an-12',
    deckId: 'deck-patoloji',
    front: 'G6PD eksikliğinde hemolizi tetikleyen durumlar?',
    back: 'Oksidatif stres: fava fasulyesi (favizm), primaquine, kefalosporinler, enfeksiyonlar. Yaymada bite (ısırık) hücreleri ve Heinz cisimcikleri görülür.',
    tag: 'Enzim defekti',
  },
  {
    id: 'an-13',
    deckId: 'deck-patoloji',
    front: 'B12 eksikliğinde folat verilirse ne olur?',
    back: 'Anemi düzelir ancak nörolojik hasar (subakut kombine dejenerasyon) ilerler. Bu yüzden makrositer anemide önce B12 ölçülür.',
    tag: 'Tuzak',
  },
  {
    id: 'an-14',
    deckId: 'deck-patoloji',
    front: 'Megaloblastik aneminin periferik yayma bulguları?',
    back: 'Oval makrositler, hipersegmente nötrofil (≥5 lob), anizositoz; kemik iliğinde nükleer-sitoplazmik uyumsuzluk.',
    tag: 'Morpholoji',
  },
  // Karaciğer
  {
    id: 'lv-1',
    deckId: 'deck-histoloji',
    front: 'Gilbert sendromunun patofizyolojisi ve prognozu?',
    back: 'UGT enzim aktivitesinde hafif azalma (~%30); açlık/stresle indirekt bilirubin yükselir (%2-5 mg/dL). İyi huyludur, tedavi gerektirmez.',
    tag: 'Sarılık',
  },
  {
    id: 'lv-2',
    deckId: 'deck-histoloji',
    front: 'Obstrüktif sarılıkta idrar ve dışkı rengi nasıldır?',
    back: 'İdrar koyulaşır (direkt bilirubin böbrekten atılır), dışkı açık/kil rengi olur (akolik) — bağırsaklara bilirubin ulaşamaz.',
    tag: 'Sarılık',
  },
  {
    id: 'lv-3',
    deckId: 'deck-histoloji',
    front: 'AST/ALT oranı >2 hangi durumu düşündürür?',
    back: 'Alkolik karaciğer hastalığı (mitokondriyal hasar nedeniyle AST baskın). GGT artışıyla birlikte tanı desteklenir.',
    tag: 'KFT',
  },
  {
    id: 'lv-4',
    deckId: 'deck-histoloji',
    front: 'Portal triadın üç bileşeni?',
    back: 'Portal ven dalı (besin zengini kan, %75), hepatik arter dalı (oksijen, %25) ve safra kanalı.',
    tag: 'Histoloji',
  },
  {
    id: 'lv-5',
    deckId: 'deck-histoloji',
    front: 'Dubin-Johnson ve Rotor sendromlarının ortak ve farklı yönleri?',
    back: 'Her ikisi de direkt hiperbilirubinemi yapar; Dubin-Johnson\'da MRP2 taşıyıcı defekti ve siyah karaciğer, Rotor\'da hepatik geri alım defekti vardır.',
    tag: 'Sarılık',
  },
  // Kas-İskelet
  {
    id: 'ms-1',
    deckId: 'deck-anatomi',
    front: 'Rotator manşet kasları ve akronimi?',
    back: 'Supraspinatus, İnfraspinatus, Teres minor, Subskapularis (SITS). En sık yırtılan supraspinatus; abduksiyonun ilk 15°\'sini başlatır.',
    tag: 'Omuz',
  },
  {
    id: 'ms-2',
    deckId: 'deck-anatomi',
    front: 'ACL yırtığının klasik bulguları?',
    back: 'Ani "pop" sesi, hızlı hemartroz (4 saat içinde), pozitif Lachman ve anterior drawer testi. Menisküs yırtığıyla birlikteliği sıktır (%75).',
    tag: 'Diz',
  },
  {
    id: 'ms-3',
    deckId: 'deck-anatomi',
    front: 'Omuz çıkıklarının en sık tipi ve riskli yapılar?',
    back: '%95 anterior çıkık (abduksiyon + dış rotasyon). Aksiller sinir ve sirkumfleks humeral arter hasarı sık eşlik eder; redüksiyon sonrası nörovasküler muayene şarttır.',
    tag: 'Travma',
  },
  {
    id: 'ms-4',
    deckId: 'deck-anatomi',
    front: 'Kas kasılmasında Ca²⁺\'nın rolü?',
    back: 'Sarkoplazmik retikulumdan salınan Ca²⁺ troponin C\'ye bağlanır; tropomiyozin miyozin bağlanma bölgelerini açar → cross-bridge döngüsü başlar.',
    tag: 'Fizyoloji',
  },
  {
    id: 'ms-5',
    deckId: 'deck-anatomi',
    front: 'Tip I ve Tip II kas liflerinin farkı?',
    back: 'Tip I: yavaş, oksidatif, yorulmaz (postüral kaslar). Tip II: hızlı, glikolitik, çabuk yorulur (güç hareketleri).',
    tag: 'Fizyoloji',
  },
  // Vitamin/Enzim
  {
    id: 've-1',
    deckId: 'deck-biyokimya',
    front: 'Tiamin eksikliğinin üç klinik tablosu?',
    back: 'Islak beriberi (yüksek çıkışlı kalp yetmezliği), kuru beriberi (periferik nöropati), Wernicke-Korsakoff (oftalmopleji + ataksi + konfüzyon / amnezi).',
    tag: 'Vitaminler',
  },
  {
    id: 've-2',
    deckId: 'deck-biyokimya',
    front: 'Pelagranın üç D\'si?',
    back: 'Dermatit (güneş duyarlılığı), Diyare, Demans — niasin (B3) eksikliği; mısırla beslenen popülasyonlarda klasiktir.',
    tag: 'Vitaminler',
  },
  {
    id: 've-3',
    deckId: 'deck-biyokimya',
    front: 'Kompetitif ve non-kompetitif inhibitörlerin Km/Vmax etkileri?',
    back: 'Kompetitif: Km artar, Vmax değişmez. Non-kompetitif: Vmax düşer, Km değişmez.',
    tag: 'Kinetik',
  },
  {
    id: 've-4',
    deckId: 'deck-biyokimya',
    front: 'K vitamini hangi faktörler için gerekli, eksiklikte ne olur?',
    back: 'II, VII, IX, X ve C, S proteinleri. Eksiklikte PT uzar, kanama diatezi gelişir (yenidoğanda hemorajik hastalık).',
    tag: 'Vitaminler',
  },
  {
    id: 've-5',
    deckId: 'deck-biyokimya',
    front: 'Organofosfat zehirlenmesinde antidotlar?',
    back: 'Pralidoksim (esterazı reaktive eder) + atropin (muskarinik etkileri bloke eder).',
    tag: 'Toksikoloji',
  },
];

/* ---------------------------------------------------------------------------
   Desteler
--------------------------------------------------------------------------- */

const SPOT_CARDS = generateSpotCards();

export const FLASHCARD_DECKS: FlashcardDeck[] = [
  {
    id: 'deck-anatomi',
    title: 'Anatomi',
    description: 'Klinik anatomi, nöroanatomi ve yüzey anatomisi kartları',
    course: 'Anatomi',
    committee: 'Tüm Kurullar',
    color: 'azure',
    cards: [...ANATOMY_CARDS, ...EXPANSION_CARDS.filter((c) => c.deckId === 'deck-anatomi'),
      ...SPOT_CARDS.filter((c) => c.deckId === 'deck-anatomi')],
  },
  {
    id: 'deck-fizyoloji',
    title: 'Fizyoloji',
    description: 'Kardiyovasküler, renal, solunum ve endokrin fizyoloji',
    course: 'Fizyoloji',
    committee: 'Tüm Kurullar',
    color: 'teal',
    cards: [...PHYSIOLOGY_CARDS, ...EXPANSION_CARDS.filter((c) => c.deckId === 'deck-fizyoloji'),
      ...SPOT_CARDS.filter((c) => c.deckId === 'deck-fizyoloji')],
  },
  {
    id: 'deck-biyokimya',
    title: 'Biyokimya',
    description: 'Metabolizma, sinyal yolları ve moleküler tıp temelleri',
    course: 'Biyokimya',
    committee: 'Tüm Kurullar',
    color: 'violet',
    cards: [...BIOCHEM_CARDS, ...EXPANSION_CARDS.filter((c) => c.deckId === 'deck-biyokimya'),
      ...SPOT_CARDS.filter((c) => c.deckId === 'deck-biyokimya')],
  },
  {
    id: 'deck-histoloji',
    title: 'Histoloji',
    description: 'Doku tipleri, ultrastrüktür ve mikroskobik tanı',
    course: 'Histoloji',
    committee: 'Tüm Kurullar',
    color: 'gold',
    cards: [...HISTOLOGY_CARDS, ...EXPANSION_CARDS.filter((c) => c.deckId === 'deck-histoloji'),
      ...SPOT_CARDS.filter((c) => c.deckId === 'deck-histoloji')],
  },
  {
    id: 'deck-patoloji',
    title: 'Patoloji',
    description: 'Hücresel hasar, inflamasyon, tümörler ve sistemik patoloji',
    course: 'Patoloji',
    committee: 'Tüm Kurullar',
    color: 'danger',
    cards: [...PATHOLOGY_CARDS, ...EXPANSION_CARDS.filter((c) => c.deckId === 'deck-patoloji'),
      ...SPOT_CARDS.filter((c) => c.deckId === 'deck-patoloji')],
  },
];

export function getAllCards(): Flashcard[] {
  return FLASHCARD_DECKS.flatMap((d) => d.cards);
}

export function getDeckCards(deckId: string): Flashcard[] {
  return FLASHCARD_DECKS.find((d) => d.id === deckId)?.cards ?? [];
}

/** Destedeki öğrenme durumu özeti. */
export function deckStats(deckId: string, progressMap: Record<string, CardProgress>) {
  const cards = getDeckCards(deckId);
  const now = Date.now();
  let newCount = 0;
  let learning = 0;
  let mastered = 0;
  let due = 0;
  for (const card of cards) {
    const p = progressMap[card.id];
    if (!p || p.reps === 0) {
      newCount += 1;
    } else if (p.interval >= 21) {
      mastered += 1;
    } else {
      learning += 1;
    }
    if (!p || p.due <= now) due += 1;
  }
  return { total: cards.length, newCount, learning, mastered, due };
}
