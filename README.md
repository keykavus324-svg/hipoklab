# HipokLab — Akademik Çalışma Kokpiti

**Canlı site:** https://keykavus324-svg.github.io/hipoklab/

Tıp ve sağlık bilimleri öğrencileri için komite odaklı, yüksek kontrastlı bir çalışma platformu.

**Kapsam:** Kişisel çalışma planı (sınav geri sayımı + günlük görevler + haftalık plan), Akademik
Kütüphane, Split-View Çalışma Masası, Görsel Atlas, SM-2 flashcard sistemi ve Klinik Vakalar.

## İçerik

- **14 uzun format konu anlatımı** (5 kurul programına göre düzenlenmiş; spot kutuları, karşılaştırma tabloları ve klinik korelasyonlarla)
- **79 flashcard** (5 ders destesi + notlardaki 35 "Sınav Spotu"ndan otomatik üretilen kartlar; SM-2 aralıklı tekrar)
- **6 interaktif klinik vaka** (anamnezden tedaviye adım adım karar verme)
- **56 anatomik/histolojik yapı** (4 SVG diyagram üzerinde incelenebilir)

## Teknolojiler

React 18 · Vite · TypeScript · Tailwind CSS · lucide-react

## Geliştirme

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build (sıfır hata)
npm run preview
```

## Modüller

| Modül | Durum |
| --- | --- |
| Kişisel Çalışma Planı (kurulum sihirbazı, sınav geri sayımı, günlük görevler, haftalık otomatik plan) | ✅ Aktif |
| Kontrol Paneli (geri sayım, hazırlık yüzdesi, çalışma ısı haritası + seri, komite çubukları, high-yield spot) | ✅ Aktif |
| Akademik Kütüphane (dönem → kurul → ders → tür filtreleri + anlık arama, favoriler, sıralama) | ✅ Aktif |
| Split-View Okuyucu (içindekiler, yazı boyutu, klinik kutular, tablolar) | ✅ Aktif |
| Kişisel Not Defteri (localStorage otomatik kayıt, önizleme, .md indirme) | ✅ Aktif |
| Yeni Kaynak Ekle / JSON Yedekle-İçe Aktar | ✅ Aktif |
| Görsel Atlas (4 SVG diyagram, inceleme / kendini test et / hoca sunum modları) | ✅ Aktif |
| Sınav & Flashcard (SM-2 aralıklı tekrar, 5 ders destesi + spot kartlar, oturum özeti) | ✅ Aktif |
| Klinik Vakalar (6 interaktif senaryo, anamnezden tedaviye adım adım karar verme) | ✅ Aktif |
| Pomodoro (25/5) + Ctrl/Cmd+K Global Arama Paleti (yapı, deste ve vaka arama dahil) | ✅ Aktif |

## Kısayollar

- `Ctrl/⌘ + K` — Global arama paleti
- `Esc` — Okuyucu / palet / modal kapat
