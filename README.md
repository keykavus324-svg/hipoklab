# HipokLab — Akademik Çalışma Kokpiti

**Canlı site:** https://keykavus324-svg.github.io/hipoklab/

Tıp ve sağlık bilimleri öğrencileri için komite odaklı, yüksek kontrastlı bir çalışma platformu.

**Faz 1 kapsamı:** Çekirdek mimari, tasarım sistemi (koyu/açık mod), Akademik Kontrol Paneli,
Komite Odaklı Kütüphane ve Split-View Çalışma Masası (belge + kişisel not defteri).

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
