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
| Kontrol Paneli (günlük ilerleme, komite çubukları, high-yield spot, kaldığın yerden devam) | ✅ Aktif |
| Akademik Kütüphane (dönem → kurul → ders → tür filtreleri + anlık arama) | ✅ Aktif |
| Split-View Okuyucu (içindekiler, yazı boyutu, klinik kutular, tablolar) | ✅ Aktif |
| Kişisel Not Defteri (localStorage otomatik kayıt, önizleme, .md indirme) | ✅ Aktif |
| Yeni Kaynak Ekle / JSON Yedekle-İçe Aktar | ✅ Aktif |
| Görsel Atlas (4 SVG diyagram, inceleme / kendini test et / hoca sunum modları) | ✅ Aktif |
| Pomodoro (25/5) + Ctrl/Cmd+K Global Arama Paleti (anatomik yapı arama dahil) | ✅ Aktif |
| Sınav & Flashcard · Klinik Vakalar | 🕓 Yakında |

## Kısayollar

- `Ctrl/⌘ + K` — Global arama paleti
- `Esc` — Okuyucu / palet / modal kapat
