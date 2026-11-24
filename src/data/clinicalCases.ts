/* ===========================================================================
   HipokLab — Klinik Vaka Veri Katmanı
   Adım adım ilerleyen, çoktan seçmeli sorular ve geri bildirim içeren
   klinik senaryolar (anamnez → muayene → tetkik → tanı → tedavi → tartışma).
   =========================================================================== */

import type { ClinicalCase } from '../types/hipoklab';

export const CLINICAL_CASES: ClinicalCase[] = [
  /* ========================================================================
     VAKA 1 — Akut Miyokard Enfarktüsü
     ======================================================================== */
  {
    id: 'case-ami',
    title: 'Göğüs Ağrısı ile Başvuran 58 Yaşında Erkek',
    specialty: 'Kardiyoloji / Acil Tıp',
    difficulty: 'Orta',
    committee: '3. Kurul — Kardiyovasküler ve Solunum Sistemleri',
    minutes: 12,
    summary:
      'Ani başlayan, baskı tarzında göğüs ağrısı ve soğuk terleme ile acile başvuran bir hastada akut koroner sendromun tanınması ve ilk yaklaşım.',
    tags: ['Göğüs ağrısı', 'EKG', 'STEMI', 'Tromboliz'],
    steps: [
      {
        id: 'ami-1',
        kind: 'anamnesis',
        title: 'Hikaye (Anamnez)',
        paragraphs: [
          '58 yaşında erkek hasta, 45 dakika önce istirahatte başlayan ve giderek şiddetlenen, baskı tarzında (sanki göğsüne taş oturmuş) substernal ağrı şikayetiyle acil servise başvurdu. Ağrı sol omuza ve çeneye yayılıyor; eforla tetiklenmemiş olup istirahatte başlamıştır.',
          'Hastanın eşi; hastanın soğuk terlediğini, bulantısının olduğunu ve "ölüm korkusu" tarif ettiğini belirtiyor. Öksürük, hemoptiz, plevritik ağrı ve bacak ödemi yok.',
          'Geçmişte 12 yıldır hipertansiyon ve hiperlipidemi mevcut; 20 yıldır günde 1 paket sigara içiyor. Babası 52 yaşında kalp krizinden kaybedilmiş.',
        ],
      },
      {
        id: 'ami-2',
        kind: 'examination',
        title: 'Fizik Muayene',
        table: {
          caption: 'Acil servis ilk değerlendirme bulguları',
          headers: ['Parametre', 'Bulgu'],
          rows: [
            ['Tansiyon', '150/90 mmHg (sağ kolda), sol kolda 138/85 mmHg'],
            ['Nabız', '96/dk, düzenli, dolgunluğu normal'],
            ['Solunum', '22/dk, oksijen saturasyonu %96 (oda havası)'],
            ['Genel durum', 'Anksiyöz, soğuk ve nemli deri, diyaforis'],
            ['Kalp muayenesi', 'S1 normal, S2 normal; üfürüm, gallop veya ral yok'],
            ['Akciğer muayenesi', 'Bilateral oskültasyon temiz; akut ödem bulgusu yok'],
            ['Ekstremiteler', 'Periferik nabızlar eşit; periferik ödem yok'],
            ['Diğer', 'Juguler ven distansiyonu yok, karaciğer kenarı normal'],
          ],
        },
      },
      {
        id: 'ami-3',
        kind: 'labs',
        title: 'İlk Tetkikler ve EKG',
        table: {
          caption: 'Acil tetkikler',
          headers: ['Tetkik', 'Sonuç', 'Referans'],
          rows: [
            ['EKG (ilk 10 dk içinde)', 'V2-V5 derivasyonlarında 2 mm ST elevasyonu; DII, DIII, aVF’de ST depresyonu', '—'],
            ['Troponin I (başvuru)', '0,42 ng/mL (yüksek)', '<0,04 ng/mL'],
            ['CK-MB', '38 U/L (yüksek)', '<25 U/L'],
            ['Hemogram', 'Hb 15 g/dL, LKT 11.000/µL, trombosit 245.000/µL', '—'],
            ['Biyokimya', 'Kreatinin 1,0 mg/dL, K⁺ 4,2 mEq/L, glukoz 148 mg/dL', '—'],
            ['Akciğer grafisi', 'Kardiromegalinin kesin bulgusu yok, plevral efüzyon yok', '—'],
          ],
        },
        paragraphs: [
          'EKG yorumu kritik öneme sahiptir: ST elevasyonu komşu iki derivasyonda (≥1 mm, V2-V3’te erkek ≥2 mm) ve uyumsuz (reciprokal) ST depresyonları varlığı akut transmural iskemiye işaret eder.',
        ],
      },
      {
        id: 'ami-4',
        kind: 'question',
        title: 'Ayırıcı Tanı ve Karar',
        questions: [
          {
            id: 'ami-q1',
            prompt: 'Bu hastada en olası tanı nedir?',
            options: [
              'Akut perikardit',
              'Anterior ST elevasyonlu miyokard enfarktüsü (STEMI)',
              'Stabil anina pektoris',
              'Pulmoner emboli',
            ],
            correctIndex: 1,
            explanation:
              'İstirahatte başlayan baskı tarzında ağrı + diyaforis + komşu iki derivasyonda ST elevasyonu + pozitif troponin = STEMI. Anterior tutulum (V2-V5) sol ön inen arter (LAD) tıkanıklığını düşündürür.',
          },
          {
            id: 'ami-q2',
            prompt: 'İlk 30 dakika içinde öncelikli yaklaşım hangisidir?',
            options: [
              'Önce troponin tekrarı beklenmeli',
              'Efor testi ile stabilite değerlendirilmeli',
              'Anjiyografik reperfüzyon (PCI) için acil kardiyoloji konsültasyonu; kapı-balon süresi <90 dk',
              'Yalnız semptomatik tedavi verilip gözlem',
            ],
            correctIndex: 2,
            explanation:
              'STEMI acil reperfüzyon gerektirir. Primer PCI mümkünse kapı-balon süresi ≤90 dakika; PCI gecikecekse (≥120 dk) kapı-iğne süresi ≤30 dakika ile trombolitik tedavi düşünülür. Troponin yükselişi için bekleme, tedaviyi geciktirir.',
          },
        ],
      },
      {
        id: 'ami-5',
        kind: 'diagnosis',
        title: 'Tanı',
        highlights: [
          {
            label: 'Tanı',
            text: 'Akut anterior STEMI (sol ön inen arter oklüzyonuna bağlı) — Killip sınıf I (akciğer ödemi yok).',
          },
          {
            label: 'Patofizyoloji',
            text: 'Aterosklerotik plak rüptürü üzerine trombüs oluşumu koroner akımı tamamen tıkar; 20-40 dakikada transmural miyokard nekrozu başlar. "Zaman miyokard demektir."',
          },
        ],
        paragraphs: [
          'EKG’deki anterior lokalizasyon ve V2-V5 tutulumu, LAD oklüzyonunu işaret eder. Reciprokal değişiklikler (inferior derivasyonlarda ST depresiyonu) tanıyı güçlendirir.',
        ],
      },
      {
        id: 'ami-6',
        kind: 'treatment',
        title: 'Tedavi İlkeleri',
        highlights: [
          {
            label: 'Akut dönem (MONA + reperfüzyon)',
            text: 'Morfin (ağrı), oksijen (yalnız hipoksemi varsa), nitrogliserin (dikkat: sağ ventrikül infarktında kontrendike), aspirin 300 mg çiğnenmiş + P2Y12 inhibitörü (klopidogrel/tikagrelor) + antikoagülasyon (heparin).',
          },
          {
            label: 'Reperfüzyon',
            text: 'Primer perkütan koroner girişim (PCI) altın standarttır. Gecikme >120 dk ise trombolitik (tenekteplaz) uygulanır ve sonra koroner anjiyografi planlanır.',
          },
          {
            label: 'İkincil koruma',
            text: 'Beta bloker, ACE inhibitörü, yüksek doz statin, sigara bırakma, kardiyak rehabilitasyon ve diyet değişikliği mortaliteyi belirgin azaltır.',
          },
        ],
      },
      {
        id: 'ami-7',
        kind: 'discussion',
        title: 'Tartışma ve İnciler',
        paragraphs: [
          'Sağ ventrikül infarktında (inferior STEMI + sağ ventrikül tutulumu) nitrogliserin ve diüretikler kontrendikedir; preload korunmalıdır. Triküspid basıncı düşerse hastanın durumu kötüleşir.',
          'Kapı-balon süresi (door-to-balloon) sağlık sistemlerinin kalite göstergesidir. Her 30 dakikalık gecikme mortaliteyi yaklaşık %7,5 artırır.',
        ],
      },
    ],
    pearls: [
      'STEMI = komşu iki derivasyonda ST elevasyonu + klinik tablo; troponin yükselmesini beklemeden reperfüzyon kararı verilir.',
      'Nitrogliserin sağ ventrikül infarktında ve fosfodiesteraz inhibitörü (sildenafil) kullanan hastalarda kontrendikedir.',
      'Anterior MI sonrası en korkulan komplikasyonlar: ventriküler aritmi, kardiyojenik şok, sol ventrikül anevrizması ve rüptür.',
    ],
  },

  /* ========================================================================
     VAKA 2 — Diabetik Ketoasidoz
     ======================================================================== */
  {
    id: 'case-dka',
    title: 'Bilinç Bulanıklığı ve Kusma ile Gelen 19 Yaşında Kız',
    specialty: 'Endokrinoloji / Acil Tıp',
    difficulty: 'Orta',
    committee: '5. Kurul — Endokrin, Üreme ve Bağışıklık',
    minutes: 10,
    summary:
      'Tip 1 diyabetli genç hastada diabetik ketoasidozun (DKA) tanınması, sıvı-elektrolit tedavisi ve insülin uygulamasının temel ilkeleri.',
    tags: ['Ketoasidoz', 'Insülin', 'Metabolik asidoz', 'Acil'],
    steps: [
      {
        id: 'dka-1',
        kind: 'anamnesis',
        title: 'Hikaye (Anamnez)',
        paragraphs: [
          '19 yaşında kadın hasta; 3 gündür giderek artan halsizlik, bulantı-kusma ve karın ağrısı tarif ediyor. Bugünden itibaren uykuya meyil ve aile tarafından "kendinde olmama" hali fark edilmiş.',
          'Hastanın 8 yaşında tip 1 diyabet tanısı almış; insülin pompa kullanıyor. Son iki haftadır üst solunum yolu enfeksiyonu geçirdiği ve insülin dozlarını düzensiz uyguladığı belirtiliyor.',
          'İştahsızlık nedeniyle su ve gıda alımı azalmış; son 24 saatte yarım litre civarında su içebilmiş. Poliüri ve polidipsi yakınması belirgin.',
        ],
      },
      {
        id: 'dka-2',
        kind: 'examination',
        title: 'Fizik Muayene',
        table: {
          caption: 'Muayene bulguları',
          headers: ['Parametre', 'Bulgu'],
          rows: [
            ['Tansiyon', '95/60 mmHg (ortostatik düşüş mevcut)'],
            ['Nabız', '118/dk, zayıf dolgunluk'],
            ['Solunum', '28/dk, derin ve gürültülü (Kussmaul solunumu)'],
            ['Ateş', '37,2 °C'],
            ['Genel durum', 'Uykuya meyilli (somnolent), dehidrate'],
            ['Nefes kokusu', 'Meyvemsi (aseton) koku'],
            ['Mukozalar', 'Kuru, göz küreleri çökmüş, deri turgoru azalmış'],
            ['Batın', 'Yaygın hafif hassasiyet, defans ve rebound yok'],
            ['Nörolojik', 'GKS 12/15 (E4 V3 M5), fokal defisit yok, ense sertliği yok'],
          ],
        },
      },
      {
        id: 'dka-3',
        kind: 'labs',
        title: 'Tetkikler',
        table: {
          caption: 'Laboratuvar sonuçları',
          headers: ['Tetkik', 'Sonuç', 'Yorum'],
          rows: [
            ['Kan glukozu', '486 mg/dL', 'Belirgin hiperglisemi'],
            ['Arter kan gazı (pH)', '7,18', 'Ağır metabolik asidoz (normal: 7,35-7,45)'],
            ['HCO₃⁻', '8 mEq/L', 'Tampon tükenmesi (normal: 22-26)'],
            ['Baz açığı', '−22 mEq/L', 'Ağır asidoz'],
            ['Keton (beta-hidroksibutirat)', '6,8 mmol/L (yüksek)', 'Ketoz belirgin'],
            ['K⁺', '5,6 mEq/L', 'Hücre dışı kayma (total vücut K⁺ az!)'],
            ['Na⁺', '128 mEq/L', 'Dilüsyonel hiponatremi'],
            ['Üre/Kreatinin', '38/1,4 mg/dL', 'Prerenal azotemi (dehidratasyon)'],
            ['Lökosit', '15.500/µL', 'Stres lökositozu olabilir'],
          ],
        },
        paragraphs: [
          'DKA üçlüsü: hiperglisemi (>250 mg/dL), ketoz ve metabolik asidoz (pH <7,3 ve/veya HCO₃⁻ <18). K⁺ düzeyi yüksek görünse de insülin ve sıvı tedavisiyle hızla düşeceğinden proaktif potasyum desteği şarttır.',
        ],
      },
      {
        id: 'dka-4',
        kind: 'question',
        title: 'Tedavi Kararları',
        questions: [
          {
            id: 'dka-q1',
            prompt: 'İlk saatte en uygun sıvı yaklaşımı nedir?',
            options: [
              '%5 dekstrozlu sıvı ile başla',
              'İzotonik sodyum klorür (%0,9 NaCl) ile hızlı volüm resüsitasyonu (15-20 mL/kg/saat)',
              'Hipotonik sıvı (%0,45 NaCl) ile başla',
              'Ağızdan su verilmesi yeterlidir',
            ],
            correctIndex: 1,
            explanation:
              'DKA’da ortalama 5-7 L sıvı açığı vardır. İzotonik NaCl ile başlayan resüsitasyon perfüzyonu düzeltir ve glukozu kontrollü düşürür. Hipotonik sıvı ilk saatte santral ponzinsüler miyelinoliz riski taşır.',
          },
          {
            id: 'dka-q2',
            prompt: 'Potasyum 5,6 mEq/L iken insülin tedavisine başlarken ne yapılmalıdır?',
            options: [
              'K⁺ yüksek olduğu için potasyum eklenmemeli',
              'İnsülin geciktirilmeli, önce K⁺ düşürülmeli',
              'K⁺ ≥5,0 ise potasyumsuz sıvı; K⁺ düştükçe (≤5,3) tedaviye K⁺ eklenmeli (20-40 mEq/L)',
              'Bol potasyum infüzyonu hemen başlatılmalı',
            ],
            correctIndex: 2,
            explanation:
              'DKA’da total vücut potasyumu azalmıştır; yüksek serum K⁺ hücre dışı kaymadan kaynaklanır. İnsülin K⁺’u hücre içine sokar, asidoz düzelir; tedaviye devam edilirse yaşamı tehdit eden hipokalemi gelişebilir. K⁺ <3,3 ise insülin geciktirilir.',
          },
          {
            id: 'dka-q3',
            prompt: 'Glukoz 200 mg/dL’nin altına indiğinde ne yapılmalıdır?',
            options: [
              'İnsülin tamamen kesilir',
              '%5 dekstroz içeren sıvıya geçilir ve düşük doz insüline devam edilir',
              'Sıvı tedavisi durdurulur',
              'Ketonlar normale dönene kadar hiperglisemiye izin verilir',
            ],
            correctIndex: 1,
            explanation:
              'Amaç keton ve asidozun düzeltilmesidir. Glukoz 200 mg/dL civarında dextroz eklenerek insülin infüzyonuna devam edilir (ketoasidoz kapanışa kadar); erken kesilme rebound ketoz yapar.',
          },
        ],
      },
      {
        id: 'dka-5',
        kind: 'diagnosis',
        title: 'Tanı',
        highlights: [
          {
            label: 'Tanı',
            text: 'Tip 1 diyabete bağlı orta-ağır diabetik ketoasidoz (pH 7,18) ve prerenal dehidratasyon.',
          },
          {
            label: 'Tetikleyici',
            text: 'Üst solunum yolu enfeksiyonu + düzensiz insülin kullanımı. DKA’da her zaman tetikleyici enfeksiyon, iskemi, iatröjen nedenler (kortikosteroid) araştırılmalıdır.',
          },
        ],
      },
      {
        id: 'dka-6',
        kind: 'treatment',
        title: 'Tedavi',
        highlights: [
          {
            label: 'Sıvı',
            text: 'İlk saatte 1-1,5 L izotonik NaCl; ardından kayıp ve sodyuma göre %0,45 veya %0,9 NaCl ile devam.',
          },
          {
            label: 'İnsülin',
            text: 'Sürekli IV infüzyon (0,1 U/kg/saat) veya bolus + infüzyon. Glukoz düşüş hızı saatte 50-75 mg/dL ile sınırlandırılır.',
          },
          {
            label: 'Potasyum',
            text: 'Her 2 saatte K⁺ izlenir. K⁺ <3,3 → insülin durdurulur + K⁺ replasmanı; 3,3-5,3 → 20-40 mEq/L K⁺ eklenir.',
          },
          {
            label: 'Bikarbonat',
            text: 'Yalnız pH <6,9 ise (ciddi asidoz, kardiyotoksisite) dikkatli eklenir; rutin kullanım önerilmez.',
          },
        ],
      },
      {
        id: 'dka-7',
        kind: 'discussion',
        title: 'Tartışma ve İnciler',
        paragraphs: [
          'Serebral ödem en korkulan komplikasyondur (çocukluk çağında daha sık); glukozun çok hızlı düşmesiyle ilişkilidir. Hasta baş ağrısı, bradikardi veya bilinç değişikliği gösterirse hipertonik salin uygulanır.',
          'DKA’da karın ağrısı ve lökositoz “akut batın” taklidi yapabilir; asidoz düzeldiğinde semptomlar geriler.',
        ],
      },
    ],
    pearls: [
      'DKA’da serum K⁺ yanıltıcıdır: yüksek görünür ama total vücut potasyumu azdır — insülinle birlikte proaktif K⁺ desteği verilir.',
      'Kussmaul solunumu = asidozu telafi için derin ve hızlı solunum; meyvemsi nefes kokusu aseton kaynaklıdır.',
      'Tedavinin hedefi glukoz değil, ketoasidozun kapanışıdır (HCO₃⁻ ≥18, pH >7,3, keton negatif).',
    ],
  },

  /* ========================================================================
     VAKA 3 — Nefrotik Sendrom
     ======================================================================== */
  {
    id: 'case-nephrotic',
    title: 'Göz Kapaklarında Şişlik ve Kilo Artışı ile Gelen 26 Yaşında Kadın',
    specialty: 'Nefroloji',
    difficulty: 'Orta',
    committee: '4. Kurul — Gastrointestinal ve Üriner Sistemler',
    minutes: 11,
    summary:
      'Masif proteinüri, ödem ve hipoalbuminemi ile seyreden nefrotik sendromun ayırıcı tanısı ve membranöz nefropati korelasyonu.',
    tags: ['Proteinüri', 'Ödem', 'Böbrek', 'Albumin'],
    steps: [
      {
        id: 'neph-1',
        kind: 'anamnesis',
        title: 'Hikaye (Anamnez)',
        paragraphs: [
          '26 yaşında kadın hasta, 3 haftadır sabahları göz kapaklarında şişlik ve giderek artan bacak ödemi tarif ediyor. Ayakkabıları dar gelmeye başlamış; son iki haftada 5 kg almış.',
          'İdrarında köpürme (proteinüri) fark etmiş. Sistolik diyare veya gastrointestinal kanama öyküsü yok; ailede böbrek hastalığı bilinmiyor.',
          'Düzenli ilaç kullanmıyor, gebelik testi negatif. Son bir yılda tekrarlayan idrar yolu enfeksiyonu, ateşli hastalık veya boğaz enfeksiyonu öyküsü yok.',
        ],
      },
      {
        id: 'neph-2',
        kind: 'examination',
        title: 'Fizik Muayene',
        table: {
          caption: 'Muayene bulguları',
          headers: ['Parametre', 'Bulgu'],
          rows: [
            ['Tansiyon', '138/88 mmHg'],
            ['Nabız', '84/dk, düzenli'],
            ['Kilo', 'Öyküye göre 3 haftada +5 kg'],
            ['Ödem', 'Pretibiyal ve periorbital ödem (2+); baskı ile pitting'],
            ['Akciğer', 'Bazallerde azalmış havalanma, hafif ral (effüzyon?)'],
            ['Batın', 'Asit saptanıyor (fluktuasyon + matite kayması pozitif)'],
            ['Deri', 'Soluk, kuruluk; eritema nodozum veya vaskülit bulgusu yok'],
            ['Diğer', 'Juguler venler normal, perikard sürtünmesi yok'],
          ],
        },
      },
      {
        id: 'neph-3',
        kind: 'labs',
        title: 'Tetkikler',
        table: {
          caption: 'İdrar ve kan tetkikleri',
          headers: ['Tetkik', 'Sonuç', 'Yorum'],
          rows: [
            ['İdrar tahlili', 'Protein 4+, kan 1+, lökosit esteraz negatif, nitrit negatif', 'Masif proteinüri'],
            ['24 saatlik idrar proteini', '5,8 g/gün (>3,5 g/gün)', 'Nefrotik aralık proteinüri'],
            ['Serum albümin', '2,1 g/dL (düşük)', 'Hipoalbuminemi'],
            ['Lipidler', 'Total kolesterol 310 mg/dL, LDL 210 mg/dL', 'Nefrotik hiperlipidemi'],
            ['Kreatinin', '0,9 mg/dL (normal)', 'GFR korunmuş'],
            ['Kan şekeri', '92 mg/dL', 'Normal'],
            ['ANA / Anti-dsDNA', 'Negatif / negatif', 'Sistemik lupus olasılığı azaldı'],
            ['Hepatit B/C, HIV', 'Negatif', 'Sekonder nedenler dışlandı'],
            ['C3 / C4', 'Normal', 'Kompleman tüketimi yok'],
          ],
        },
        paragraphs: [
          'Nefrotik sendrom dörtlüsü: >3,5 g/gün proteinüri, hipoalbuminemi (<3 g/dL), ödem ve hiperlipidemi/lipidüri. Normal GFR ve negatif serolojiler birincil glomerüler hastalık olasılığını artırır.',
        ],
      },
      {
        id: 'neph-4',
        kind: 'question',
        title: 'Ayırıcı Tanı',
        questions: [
          {
            id: 'neph-q1',
            prompt: 'Erişkinde nefrotik sendromun en sık nedeni nedir?',
            options: [
              'Minimal değişiklik hastalığı',
              'Membranöz nefropati',
              'Fokal segmental glomerüloskleroz (FSGS)',
              'Poststreptokokkal glomerülonefrit',
            ],
            correctIndex: 1,
            explanation:
              'Erişkinde (özellikle 30-60 yaş) membranöz nefropati en sık nefrotik sendrom nedenidir; çocukta minimal değişiklik hastalığı baskındır. Poststreptokokkal glomerülonefrit nefritik (hemüri, hipertansiyon, azalmış GFR) tablo yapar.',
          },
          {
            id: 'neph-q2',
            prompt: 'Bu hastada bir sonraki adım hangisidir?',
            options: [
              'Doğrudan kortikosteroid başlanmalı',
              'Böbrek biyopsisi ile histopatolojik tanı doğrulanmalı',
              'Yalnız diyet ve takip yeterli',
              'Hemen diyaliz planlanmalı',
            ],
            correctIndex: 1,
            explanation:
              'Erişkinde açıklanamayan nefrotik sendromda böbrek biyopsisi endikedir; tedavi patolojiye göre (membranöz nefropatide immünosupresyon veya ritüksimab, altta yatan kanser/hepatit arama) planlanır.',
          },
        ],
      },
      {
        id: 'neph-5',
        kind: 'diagnosis',
        title: 'Tanı',
        highlights: [
          {
            label: 'Ön tanı',
            text: 'Nefrotik sendrom — büyük olasılıkla membranöz nefropati (klinik ve demografik profil, normal kompleman ve negatif serolojilerle uyumlu).',
          },
          {
            label: 'Mekanizma',
            text: 'Podosit/slit diyafram hasarı (PLA2R antikorları, membranöz nefropatide %70-80) glomerüler bariyerin yük seçiciliğini bozar; albuminüri, onkotik basınç düşüşü ve ödem zinciri başlar.',
          },
        ],
      },
      {
        id: 'neph-6',
        kind: 'treatment',
        title: 'Tedavi İlkeleri',
        highlights: [
          {
            label: 'Destek tedavisi',
            text: 'Tuz kısıtlaması (<3 g/gün), diüretikler (ödem için), ACE inhibitörü veya ARB (proteinüriyi azaltır, intraglomerüler basıncı düşürür), statin (nefrotik hiperlipidemi).',
          },
          {
            label: 'Spesifik tedavi',
            text: 'Membranöz nefropatide risk skoruna göre ritüksimab veya siklosporin; sekonder neden varsa altta yatan hastalık tedavi edilir (ör. hepatit B tedavisi, tümör çıkarımı).',
          },
          {
            label: 'Komplikasyon önleme',
            text: 'Tromboz riski (antitrombin kaybı) yüksek; volüm ve ürenerji durumuna göre antikoagülasyon değerlendirilir. Enfeksiyon riski (immünoglobulin kaybı) nedeniyle pnömokok aşısı önerilir.',
          },
        ],
      },
      {
        id: 'neph-7',
        kind: 'discussion',
        title: 'Tartışma ve İnciler',
        paragraphs: [
          'Nefrotik sendromda ödem patofizyolojisi yalnızca onkotik basınç kaybı değildir: tuz-su retansiyonu da temel rol oynar (ENaC aktivasyonu, "dolgu edilmiş" hipoalbüminemi).',
          'Lipidüri (idrarda "yağ cisimcikleri", oval yağ cisimcikleri) uzun süreli nefrotik sendromda lipid nefropatisine katkıda bulunabilir.',
        ],
      },
    ],
    pearls: [
      'Erişkin nefrotik sendromunda ilk akla membranöz nefropati; çocukta minimal değişiklik hastalığı gelir.',
      'Membranöz nefropatide PLA2R antikoru (%70-80) tanı ve nüks takibinde kullanılır; erişkinde altta yatan malignite araştırılmalıdır.',
      'Nefrotik sendrom + normal kompleman + negatif ANA → birincil glomerüler hastalık olasılığı yüksek.',
    ],
  },

  /* ========================================================================
     VAKA 4 — İskemik İnme
     ======================================================================== */
  {
    id: 'case-stroke',
    title: 'Ani Konuşma Güçlüğü ve Kol Güçsüzlüğü Olan 71 Yaşında Erkek',
    specialty: 'Nöroloji / İnme Ünitesi',
    difficulty: 'Zor',
    committee: '2. Kurul — Duyu Sistemleri ve Nörobilim',
    minutes: 12,
    summary:
      'Ani başlayan fokal nörolojik defisitle başvuran hastada iskemik inmenin tanınması, zaman penceresi ve reperfüzyon tedavisi kararları.',
    tags: ['İnme', 'tPA', 'NIHSS', 'Nöroloji'],
    steps: [
      {
        id: 'str-1',
        kind: 'anamnesis',
        title: 'Hikaye (Anamnez)',
        paragraphs: [
          '71 yaşında erkek hasta, 50 dakika önce kahvaltı sırasında aniden sağ kolunu kaldıramama ve konuşmasının bozulması (afazi) nedeniyle ailesi tarafından acile getirildi. Son bilinen iyi zaman: 08:30.',
          'Görgü tanıklarına göre semptomlar saniyeler içinde başlamış ve düzelmemiş. Baş ağrısı, kusma, nöbet veya bilinç kaybı olmamış.',
          'Geçmişinde atriyal fibrilasyon (warfarin kullanıyor ama son 3 gündür aksatmış), hipertansiyon ve hiperlipidemi mevcut. İnme öyküsü yok.',
        ],
      },
      {
        id: 'str-2',
        kind: 'examination',
        title: 'Nörolojik Muayene',
        table: {
          caption: 'Muayene ve NIHSS benzeri değerlendirme',
          headers: ['Bölüm', 'Bulgu'],
          rows: [
            ['Bilinç', 'Uyanık, yönlendirilmiş; GKS 15/15'],
            ['Konuşma (afazi)', 'Motor afazi: konuşması tutuk, anlama görece korunmuş; tekrarlama bozuk'],
            ['Sağ kol kuvveti', 'Proksimal 2/5, distal 1/5 (plejiye yakın)'],
            ['Sağ bacak kuvveti', '3/5 (hafif parezi)'],
            ['Yüz', 'Sağ alt yüz asimetrik, dil sola deviye (sağ hipoglossal tutulum?) — aslında dil sapması santral patern'],
            ['Duyu', 'Sağ tarafında hafif duyusal azalma'],
            ['Göz hareketleri', 'Sapma: gözlere sol tarafa doğru tonik sapma'],
            ['Refleksler', 'Sağda patellar ve akilles hiperrefleksi, sağ Babinski pozitif'],
            ['Diğer', 'Ense sertliği yok, ateş normal, glukoz 110 mg/dL'],
          ],
        },
        paragraphs: [
          'Ani başlangıç + fokal defisit + negatif ense sertliği/ateş tablosu inmeyi düşündürür. Semptomların sol orta serebral arter (OSA) alanını işaret ettiği görülmektedir: sağ kol > bacak tutulumu ve afazi.',
        ],
      },
      {
        id: 'str-3',
        kind: 'labs',
        title: 'Görüntüleme ve Tetkikler',
        table: {
          caption: 'Acil tetkikler',
          headers: ['Tetkik', 'Sonuç'],
          rows: [
            ['Beyin BT (non-kontrast)', 'Kanama yok; erken iskemik belirgin değişiklik yok (ASPECTS 10)'],
            ['BT anjiyografi', 'Sol orta serebral arter (M1 segmentinde) oklüzyon'],
            ['Diffüzyon MR (istenirse)', 'Sol MCA alanında akut iskemik restriksiyon alanı'],
            ['INR (warfarin kullanımı)', '3,1 (terapötik aralığın üst sınırı)'],
            ['EKG', 'Atriyal fibrilasyon, hızlı ventriküler yanıt'],
            ['Ekokardiyografi', 'Sol atriyum genişlemesi, trombus görünmedi'],
            ['Laboratuvar', 'Kreatinin 1,1 mg/dL, glukoz 110 mg/dL, hemogram normal'],
          ],
        },
      },
      {
        id: 'str-4',
        kind: 'question',
        title: 'Tedavi Kararları',
        questions: [
          {
            id: 'str-q1',
            prompt: 'İntravenöz tromboliz (alteplaz) için en önemli kontrendikasyon bu hastada hangisidir?',
            options: [
              'Yaşının 71 olması',
              'INR >1,7 (antikoagülasyon etkisi)',
              'Afazi varlığı',
              'Hastanın aç olması',
            ],
            correctIndex: 1,
            explanation:
              'Aktif antikoagülasyon (INR >1,7 veya DOAC son 48 saat) IV tromboliz için kontrendikedir; intraserebral kanama riski belirgin artar. Yaş, mutlak kontrendikasyon değildir.',
          },
          {
            id: 'str-q2',
            prompt: 'IV tromboliz yapılamayan bu hastada sonraki en uygun seçenek nedir?',
            options: [
              'Yalnız aspirin başlanıp gözlem',
              'Mekanik trombektomi değerlendirmesi (M1 oklüzyonu, büyük damar tıkanıklığı)',
              'Tromboliz yine de denenmeli',
              'Heparin bolusu verilip 24 saat beklenmeli',
            ],
            correctIndex: 1,
            explanation:
              'Büyük damar (M1) oklüzyonunda mekanik trombektomi, semptom başlangıcından itibaren 24 saate kadar seçilmiş hastalarda (görüntüleme kılavuzluğunda) endikedir; en iyi sonuç ilk 6 saatte alınır.',
          },
        ],
      },
      {
        id: 'str-5',
        kind: 'diagnosis',
        title: 'Tanı',
        highlights: [
          {
            label: 'Tanı',
            text: 'Akut iskemik inme — sol orta serebral arter (M1) oklüzyonu, kardiyoembolik kökenli (kontrolsüz atriyal fibrilasyon).',
          },
          {
            label: 'Mekanizma',
            text: 'Atriyal fibrilasyonda sol atriyumda (özellikle atriyal apendikste) oluşan trombusun embolizasyonuyla MCA tıkanır; dil ve yüz alt kısmı (Broca alanı) ile kol motor korteksini besleyen dallar iskemiye girer.',
          },
        ],
      },
      {
        id: 'str-6',
        kind: 'treatment',
        title: 'Tedavi İlkeleri',
        highlights: [
          {
            label: 'Akut dönem',
            text: 'Hava yolu, solunum, dolaşım stabilizasyonu; glukoz ve vücut ısısı kontrolü; nöroloji ve nöroradyoloji konsültasyonu ile trombektomi kararı.',
          },
          {
            label: 'İkincil koruma',
            text: 'Antikoagülasyon (DOAC tercih edilir, örn. apixaban) atriyal fibrilasyonda inme nüksünü %60-70 azaltır; aspirin tek başına yetersizdir.',
          },
          {
            label: 'Rehabilitasyon',
            text: 'Erken ve multidisipliner fizik tedavi, konuşma terapisi (afazi) ve yutma rehabilitasyonu; 24-48 saatte mobilizasyon.',
          },
        ],
      },
      {
        id: 'str-7',
        kind: 'discussion',
        title: 'Tartışma ve İnciler',
        paragraphs: [
          '“Zaman beyindir”: her dakikada yaklaşık 1,9 milyon nöron kaybedilir. Hasta-doğru zaman-window (4,5 saat IV tPA, 24 saat trombektomi seçilmiş olguda) yaklaşımı mortaliteyi ve sakatlığı belirgin azaltır.',
          'OSA (sol MCA) inmesinde afazi ve sağ kol baskın defisit tipiktir; sağ hemisfer inmelerinde hemineglect (sol tarafı ihmal) ve anosognozi ön plandadır.',
        ],
      },
    ],
    pearls: [
      'IV trombolizde mutlak kontrendikasyonlar: aktif kanama, son 3 ayda inme/beyin cerrahisi, INR >1,7, kanama diatezi, ciddi kontrolsüz hipertansiyon (>185/110).',
      'Büyük damar oklüzyonunda (M1, baziler) trombektomi, IV tromboliz kontrendike olsa bile tek başına düşünülebilir.',
      'Atriyal fibrilasyonlu hastada antikoagülasyon uyumu inme profilaksisinin temelidir; CHA₂DS₂-VASc skoru tedavi kararını destekler.',
    ],
  },

  /* ========================================================================
     VAKA 5 — Akut Apandisit
     ======================================================================== */
  {
    id: 'case-appendix',
    title: 'Sağ Alt Batın Ağrısı ile Gelen 22 Yaşında Erkek',
    specialty: 'Genel Cerrahi / Acil',
    difficulty: 'Kolay',
    committee: '4. Kurul — Gastrointestinal ve Üriner Sistemler',
    minutes: 8,
    summary:
      'Klasik migrasyonlu ağrı öyküsü ve fizik muayene bulgularıyla akut apandisitin tanınması ve cerrahi yaklaşımı.',
    tags: ['Akut batın', 'Apandisit', 'Cerrahi', 'Alvarado'],
    steps: [
      {
        id: 'app-1',
        kind: 'anamnesis',
        title: 'Hikaye (Anamnez)',
        paragraphs: [
          '22 yaşında erkek hasta, 14 saat önce göbek çevresinde başlayıp son 6 saatte sağ alt batına yerleşen ağrı şikayetiyle başvurdu. Ağrı sürekli ve giderek artıyor; hareketle ve öksürükle çoğalıyor.',
          'İştahsızlık (anoreksi) belirgin; iki kez sarı-safra içerikli kusmuş. Son normal defekasyonu 1 gün önce; ishal yok. İdrar yanması veya dizüri tariflemiyor.',
          'Geçirilmiş batın ameliyatı, benzer ağrı atağı veya kronik hastalığı yok.',
        ],
      },
      {
        id: 'app-2',
        kind: 'examination',
        title: 'Fizik Muayene',
        table: {
          caption: 'Muayene bulguları',
          headers: ['Parametre', 'Bulgu'],
          rows: [
            ['Tansiyon', '125/75 mmHg'],
            ['Nabız', '96/dk'],
            ['Ateş', '37,9 °C'],
            ['Gözlem', 'Ağrılı yüz ifadesi, sağ bacağını çekerek uzanıyor'],
            ['Batın', 'Sağ alt kadranda lokalize hassasiyet; McBurney noktasında belirgin'],
            ['Özel testler', 'Rovsing pozitif (sol alt kadrana basınca sağda ağrı), psoas testi pozitif, oblik test hafif pozitif'],
            ['Defans/Rebound', 'Hafif defans mevcut, rebound pozitif'],
            ['Dijital rektal muayene', 'Sağ yan duvarda hassasiyet'],
            ['Diğer', 'Herni yok, testis muayenesi normal'],
          ],
        },
      },
      {
        id: 'app-3',
        kind: 'labs',
        title: 'Tetkikler',
        table: {
          caption: 'Laboratuvar ve görüntüleme',
          headers: ['Tetkik', 'Sonuç'],
          rows: [
            ['Lökosit', '13.800/µL (nötrofil baskın, %82)'],
            ['CRP', '48 mg/L (yüksek)'],
            ['İdrar tahlili', 'Lökosit esteraz negatif, nitrit negatif, eritrosit negatif (renal kolik dışlandı)'],
            ['Beta-hCG', 'Negatif (gebelik dışlandı — kadın hastada zorunlu)'],
            ['BT abdomen (kontrastlı)', 'Apendiks çapı 11 mm (≥6 mm patolojik), duvar kalınlaşması, periapendiküler yağ planlarında stranding; serbest sıvı yok'],
          ],
        },
        paragraphs: [
          'Alvarado (MANTRELS) skoru bu hastada yüksektir: Migrasyonlu ağrı (1) + Anoreksi (1) + Nausea/Kusma (1) + Sağ alt kadranda hassasiyet (2) + Ateş (1) + Lökositoz (2) + Kayma (nötrofili) (1) = 9/10 → yüksek olasılıklı apandisit.',
        ],
      },
      {
        id: 'app-4',
        kind: 'question',
        title: 'Yaklaşım',
        questions: [
          {
            id: 'app-q1',
            prompt: 'Bu hastada en uygun tedavi nedir?',
            options: [
              'Antibiyotik tedavisi ile gözlem (ameliyatsız)',
              'Laparoskopik apendektomi + perioperatif antibiyotik',
              'Ağrı kesici verilip 24 saat sonra tekrar değerlendirilmeli',
              'Kolonoskopi ile değerlendirme',
            ],
            correctIndex: 1,
            explanation:
              'Tanısı klinik ve görüntüleme ile konulmuş akut apandisit tedavisi cerrahidir (laparoskopik apendektomi standart). Perioperatif profilaktik antibiyotik verilir (ör. sefazolin + metronidazol).',
          },
          {
            id: 'app-q2',
            prompt: 'Tedavi ertelenirse en sık ciddi komplikasyon nedir?',
            options: [
              'Apandiks perforasyonu ve periapendiküler apse/peritonit',
              'İntususepsiyon',
              'Gastrik perforasyon',
              'Pankreatit',
            ],
            correctIndex: 0,
            explanation:
              'Tıkanma sürerse apandiks gangrene/perfore olur; dışkı peritonite veya periapendiküler apseye yol açar. Perforasyon riski semptom başlangıcından 36-72 saat sonra belirgin artar.',
          },
        ],
      },
      {
        id: 'app-5',
        kind: 'diagnosis',
        title: 'Tanı',
        highlights: [
          {
            label: 'Tanı',
            text: 'Akut apandisit (BT ile doğrulanmış, perforasyon bulgusu olmayan evre).',
          },
          {
            label: 'Klasik öykü',
            text: 'Viseral ağrı (göbek çevresi, T10 dermatom) → somatik ağrı (sağ alt kadran) migrasyonu apandisitin imzasıdır; pariyetal periton irritasyonu ağrıyı lokalize eder.',
          },
        ],
      },
      {
        id: 'app-6',
        kind: 'treatment',
        title: 'Tedavi',
        highlights: [
          {
            label: 'Cerrahi',
            text: 'Laparoskopik apendektomi. Komplike olgularda (apse, peritonit) kaynak kontrolü + yıkama/drenaj, gerekirse aralıklı apendektomi.',
          },
          {
            label: 'Antibiyotik',
            text: 'Profilaksi için tek doz perioperatif antibiyotik; perforasyon/peritonit varsa 4-7 gün süreli tedavi (anaerobik kapsama metronidazol).',
          },
          {
            label: 'Alternatif yaklaşım',
            text: 'Komplike olmayan apandisitlerde seçilmiş hastalarda (%20-30 nüks riski ile) yalnız antibiyotik tedavisi tartışmalıdır; cerrahi standarttır.',
          },
        ],
      },
      {
        id: 'app-7',
        kind: 'discussion',
        title: 'Tartışma ve İnciler',
        paragraphs: [
          'Fertil çağındaki kadınlarda ayırıcı tanıda over torsiyonu, ektopik gebelik, rüptüre over kisti ve pelvik inflamatuar hastalık akla gelmelidir; ultrasonografi ilk basamak görüntülemedir.',
          'Yaşlılarda ve gebelerde atipik seyir ve perforasyon riski yüksektir; gebelerde apendiks yukarıda (uterus basısıyla) lokalize olabilir.',
        ],
      },
    ],
    pearls: [
      'Göbek çevresinden sağ alt kadrana migrasyon = apandisit klasik öyküsü (viseral → somatik ağrı).',
      'Alvarado skoru ≥7 yüksek olasılıklı apandisiti destekler; BT ve USG tanısal doğruluğu artırır.',
      'Erken apendektomi perforasyon, apse ve uzamış yatış süresini önler; perforasyon mortalitesi özellikle yaşlılarda artar.',
    ],
  },

  /* ========================================================================
     VAKA 6 — Toplum Kökenli Pnömoni
     ======================================================================== */
  {
    id: 'case-pneumonia',
    title: 'Ateş, Öksürük ve Nefes Darlığı ile Gelen 64 Yaşında Kadın',
    specialty: 'Göğüs Hastalıkları / Enfeksiyon',
    difficulty: 'Kolay',
    committee: '3. Kurul — Kardiyovasküler ve Solunum Sistemleri',
    minutes: 9,
    summary:
      'Toplum kökenli pnömoninin (TKP) klinik tanısı, şiddet skorlaması (CURB-65) ve antibiyotik tedavi ilkeleri.',
    tags: ['Pnömoni', 'Antibiyotik', 'CURB-65', 'Akciğer'],
    steps: [
      {
        id: 'pne-1',
        kind: 'anamnesis',
        title: 'Hikaye (Anamnez)',
        paragraphs: [
          '64 yaşında kadın hasta, 3 gündür artan halsizlik, titreme ile gelen ateş (39 °C), sarı-yeşil balgam çıkarmalı öksürük ve eforla nefes darlığı tarif ediyor.',
          'Balgamda kan çizgileri olmamış; plevritik yan ağrısı sağ tarafta mevcut. Hasta son iki günde evde yatağa bağımlı hale gelmiş, iştahsız.',
          'Diyabet ve KOAH öyküsü var; sigara içmiyor. Son bir ayda hastane yatışı veya antibiyotik kullanımı olmamış.',
        ],
      },
      {
        id: 'pne-2',
        kind: 'examination',
        title: 'Fizik Muayene',
        table: {
          caption: 'Muayene bulguları',
          headers: ['Parametre', 'Bulgu'],
          rows: [
            ['Tansiyon', '105/65 mmHg'],
            ['Nabız', '108/dk'],
            ['Solunum', '26/dk, SpO₂ %91 (oda havası)'],
            ['Ateş', '39,1 °C'],
            ['Sağ akciğer bazali', 'Hırıltı, bronşiyal solunum sesi, egofoni (ses iletiminde artış)'],
            ['Perküsyon', 'Sağ alt lobda matite'],
            ['Kalp', 'Taşikardik, üfürüm yok'],
            ['Diğer', 'Bilinç açık (GKS 15), ekstremitelerde siyanoz yok, deri turgoru hafif azalmış'],
          ],
        },
      },
      {
        id: 'pne-3',
        kind: 'labs',
        title: 'Tetkikler',
        table: {
          caption: 'Tetkikler',
          headers: ['Tetkik', 'Sonuç'],
          rows: [
            ['Akciğer grafisi (PA)', 'Sağ alt lobda havalanma kaybı, hava bronkogramı, plevral hat kaybı — konsolidasyon'],
            ['Lökosit', '17.200/µL (nötrofil %88, bant formu artışı)'],
            ['CRP', '142 mg/L (belirgin yüksek)'],
            ['Prokalsitonin', '1,8 ng/mL (bakteriyel enfeksiyonu destekler)'],
            ['Balgam kültürü + boyama', 'Gram pozitif koklar (diplokok), kültür bekleniyor'],
            ['Kan kültürü (2 set)', 'Alındı'],
            ['Biyokimya', 'Kreatinin 1,3 mg/dL, glukoz 178 mg/dL (stres hiperglisemisi)'],
            ['Arter kan gazı', 'pH 7,44, PaCO₂ 31 mmHg, PaO₂ 62 mmHg (hipoksemi)'],
          ],
        },
      },
      {
        id: 'pne-4',
        kind: 'question',
        title: 'Değerlendirme',
        questions: [
          {
            id: 'pne-q1',
            prompt: 'CURB-65 skoru hangi parametrelerden oluşur?',
            options: [
              'Bilinç bulanıklığı, üre >19 mg/dL (BUN >7 mmol/L), solunum ≥30/dk, tansiyon <90/60, yaş ≥65',
              'Öksürük, balgam, ral, ateş, lökositoz',
              'Yaş, sigara, KOAH, diyabet, ateş',
              'CRP, prokalsitonin, laktat, oksijen, radyografi',
            ],
            correctIndex: 0,
            explanation:
              'CURB-65: Confusion (bilinç bulanıklığı), Urea (üre >19 mg/dL), Respiratory rate ≥30, Blood pressure (sistolik <90 veya diyastolik ≤60), Age ≥65. Her kriter 1 puan; ≥3 puan ağır pnömoni ve yatış endikasyonu.',
          },
          {
            id: 'pne-q2',
            prompt: 'Bu hasta için uygun tedavi yeri ve başlangıç tedavisi?',
            options: [
              'Evde oral amoksisilin yeterli',
              'Servis yatışı + parenteral amoksisilin/klavulanat veya solunum yolu kinolonu; oksijen desteği',
              'Yoğun bakım şart',
              'Yalnız antipiretik takip',
            ],
            correctIndex: 1,
            explanation:
              'Hastada hipoksemi, taşikardi, hafif hipotansiyon ve diyabet komorbiditesi var; CURB-65 ≥2 puan. Servis yatışı, oksijen, parenteral antibiyotik (beta-laktam + makrolid veya solunum kinolonu) ve kültür sonrası hedefe yönelik tedavi uygundur.',
          },
        ],
      },
      {
        id: 'pne-5',
        kind: 'diagnosis',
        title: 'Tanı',
        highlights: [
          {
            label: 'Tanı',
            text: 'Sağ alt lob toplum kökenli pnömoni (büyük olasılıkla Streptococcus pneumoniae), orta-ağır şiddet, komorbiditeli hasta.',
          },
          {
            label: 'Tipik patojen',
            text: 'TKP’de en sık etken S. pneumoniae’dur; ani başlangıç, titreme, rust renkli balgam ve lobar konsolidasyon klasik tablosudur.',
          },
        ],
      },
      {
        id: 'pne-6',
        kind: 'treatment',
        title: 'Tedavi İlkeleri',
        highlights: [
          {
            label: 'Antibiyotik',
            text: 'Yatışlı hasta: beta-laktam (amoksisilin/klavulanat veya seftriakson) + makrolid (azitromisin) veya solunum yolu kinolonu (levofloksasin). Kültür sonuçlarına göre hedefe daraltılır; genel süre 5-7 gündür.',
          },
          {
            label: 'Destek',
            text: 'Kontrollü oksijen (SpO₂ %94-98), hidrasyon, antipiretik (parasetamol), gerekse bronkodilatör ve fizyoterapi. Diabetes mellitusda glukoz kontrolü sağlanır.',
          },
          {
            label: 'Profilaksi',
            text: 'Pnömokok ve influenza aşısı ile nüksler azaltılır; sigara içimi varsa bırakma danışmanlığı verilir.',
          },
        ],
      },
      {
        id: 'pne-7',
        kind: 'discussion',
        title: 'Tartışma ve İnciler',
        paragraphs: [
          'Plevral efüzyon gelişirse (parapnömonik efüzyon) drenaj endikasyonları: pH <7,2, glukoz <60 mg/dL, pozitif gram boyama, pürülan drenaj (ampiyem).',
          'KOAH ve diyabet pnömoni şiddetini ve komplikasyon riskini artırır; yatak yeri kararında CURB-65 + klinik muhakeme birlikte kullanılır.',
        ],
      },
    ],
    pearls: [
      'TKP’de en sık etken S. pneumoniae; lobar konsolidasyon + titreme + rust balgam klasik üçlüsüdür.',
      'CURB-65 ≥3 veya klinik instabilite → yoğun bakım değerlendirmesi; 2 → servis yatışı.',
      'Parapnömonik efüzyonda pH <7,2 veya pürülan materyal drenaj endikasyonudur.',
    ],
  },
];

export function getCaseById(id: string): ClinicalCase | undefined {
  return CLINICAL_CASES.find((c) => c.id === id);
}
