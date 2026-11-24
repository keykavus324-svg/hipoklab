/* ===========================================================================
   SVG Diyagram 2 — Nefron ve Jukstaglomerüler Aparat
   =========================================================================== */

interface DiagramProps {
  showFlow: boolean;
}

export function NephronDiagram({ showFlow }: DiagramProps) {
  return (
    <g>
      <defs>
        <radialGradient id="ng-bg" cx="50%" cy="45%" r="62%">
          <stop offset="0%" stopColor="#1a2434" />
          <stop offset="100%" stopColor="#0b111e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ng-tubule" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8b878" />
          <stop offset="100%" stopColor="#c2904f" />
        </linearGradient>
        <linearGradient id="ng-tubule-thin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d9b483" />
          <stop offset="100%" stopColor="#b98f5c" />
        </linearGradient>
        <linearGradient id="ng-artery" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c25b4a" />
          <stop offset="100%" stopColor="#a04536" />
        </linearGradient>
        <linearGradient id="ng-artery-out" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b2685c" />
          <stop offset="100%" stopColor="#8d4f45" />
        </linearGradient>
        <radialGradient id="ng-capsule" cx="35%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#415573" />
          <stop offset="100%" stopColor="#2b3a54" />
        </radialGradient>
        <radialGradient id="ng-glom" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#d9705c" />
          <stop offset="100%" stopColor="#a34a3c" />
        </radialGradient>
      </defs>

      <ellipse cx="410" cy="380" rx="470" ry="430" fill="url(#ng-bg)" />

      {/* --- Bowman kapsülü --- */}
      <path
        d="M 150 200 C 130 148 168 108 222 110 C 282 112 318 158 314 216 C 312 252 296 282 268 300"
        stroke="url(#ng-capsule)"
        strokeWidth="26"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 150 200 C 130 148 168 108 222 110 C 282 112 318 158 314 216 C 312 252 296 282 268 300"
        stroke="#6b82a8"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M 172 316 C 148 310 146 262 152 232"
        stroke="url(#ng-capsule)"
        strokeWidth="24"
        fill="none"
        strokeLinecap="round"
      />

      {/* --- Glomerül yumağı --- */}
      <g fill="url(#ng-glom)" stroke="#8c3a2e" strokeWidth="2">
        <circle cx="216" cy="188" r="24" />
        <circle cx="252" cy="176" r="22" />
        <circle cx="266" cy="212" r="24" />
        <circle cx="232" cy="228" r="23" />
        <circle cx="196" cy="222" r="21" />
        <circle cx="200" cy="158" r="19" />
        <circle cx="252" cy="244" r="18" />
        <circle cx="284" cy="180" r="16" />
      </g>
      {/* Glomerül kapiller ince konturlar */}
      <g stroke="#e68f77" strokeWidth="1.4" fill="none" opacity="0.65">
        <path d="M 196 190 C 214 170 238 168 254 182" />
        <path d="M 212 214 C 230 198 252 196 268 208" />
        <path d="M 222 232 C 240 220 258 220 272 232" />
      </g>

      {/* --- Afferent arteriol --- */}
      <path d="M 24 118 C 76 124 132 142 186 172" stroke="url(#ng-artery)" strokeWidth="36" strokeLinecap="round" fill="none" />
      <path d="M 24 118 C 76 124 132 142 186 172" stroke="#e08b74" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.4" />

      {/* --- Efferent arteriol (daha dar) --- */}
      <path d="M 278 152 C 316 122 360 96 412 76" stroke="url(#ng-artery-out)" strokeWidth="24" strokeLinecap="round" fill="none" />
      <path d="M 278 152 C 316 122 360 96 412 76" stroke="#d69484" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />

      {/* --- Jukstaglomerüler hücreler (afferent duvarında) --- */}
      <g fill="#e8c07c" stroke="#a37c42" strokeWidth="1.6">
        <circle cx="172" cy="192" r="9" />
        <circle cx="188" cy="200" r="9" />
        <circle cx="182" cy="216" r="8" />
        <circle cx="198" cy="212" r="8" />
      </g>

      {/* --- Makula densa (distal tübül hücre dizisi) --- */}
      <g fill="#8fc4a8" stroke="#4f7d62" strokeWidth="1.6">
        <circle cx="316" cy="258" r="8" />
        <circle cx="330" cy="262" r="8" />
        <circle cx="344" cy="265" r="8" />
        <circle cx="358" cy="268" r="8" />
      </g>

      {/* --- Proksimal kıvrıntılı tübül (kalın, kıvrımlı) --- */}
      <path
        d="M 292 268 C 330 244 372 268 366 296 C 360 324 312 330 312 358 C 312 386 356 392 372 418 C 388 444 356 462 372 486"
        stroke="url(#ng-tubule)"
        strokeWidth="30"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 292 268 C 330 244 372 268 366 296 C 360 324 312 330 312 358 C 312 386 356 392 372 418 C 388 444 356 462 372 486"
        stroke="#f3d9ae"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M 372 486 C 388 510 372 534 396 552 C 420 570 452 566 468 588 C 484 610 462 632 484 652"
        stroke="url(#ng-tubule)"
        strokeWidth="30"
        fill="none"
        strokeLinecap="round"
      />
      {/* PCT sağa devam ederek inen kola bağlanır */}
      <path
        d="M 484 652 C 512 672 556 668 574 640"
        stroke="url(#ng-tubule)"
        strokeWidth="30"
        fill="none"
        strokeLinecap="round"
      />

      {/* --- İnen ince kol (ince) --- */}
      <path d="M 574 640 C 584 600 580 540 578 470 C 576 410 576 372 578 336" stroke="url(#ng-tubule-thin)" strokeWidth="16" fill="none" strokeLinecap="round" />

      {/* --- Henle kulpu U dönüşü --- */}
      <path
        d="M 578 336 C 574 380 578 440 580 500 C 582 552 588 596 612 606 C 638 616 656 588 652 548"
        stroke="url(#ng-tubule-thin)"
        strokeWidth="18"
        fill="none"
        strokeLinecap="round"
      />
      {/* U dönüşü kalınlaşma (çıkan kol başlangıcı) */}
      <path d="M 652 548 C 650 512 652 480 654 452" stroke="url(#ng-tubule)" strokeWidth="28" fill="none" strokeLinecap="round" />

      {/* --- Çıkan kalın kol --- */}
      <path d="M 654 452 C 656 412 656 372 652 336 C 648 300 640 278 628 262" stroke="url(#ng-tubule)" strokeWidth="30" fill="none" strokeLinecap="round" />

      {/* --- Distal kıvrıntılı tübül (makula densaya giden kıvrımlar) --- */}
      <path
        d="M 628 262 C 596 240 556 262 560 288 C 564 314 610 320 606 346 C 602 372 552 376 546 356 C 540 336 574 322 592 314 C 520 306 448 296 386 280 C 372 276 360 272 350 268"
        stroke="url(#ng-tubule)"
        strokeWidth="26"
        fill="none"
        strokeLinecap="round"
      />

      {/* --- DCT → toplayıcı kanal bağlantısı --- */}
      <path
        d="M 352 270 C 396 300 520 322 640 336 C 676 342 696 352 700 380"
        stroke="url(#ng-tubule)"
        strokeWidth="26"
        fill="none"
        strokeLinecap="round"
      />

      {/* --- Toplayıcı kanal (düz, kalın) --- */}
      <path d="M 700 380 C 704 470 706 560 710 690" stroke="url(#ng-tubule)" strokeWidth="34" fill="none" strokeLinecap="round" />
      <path d="M 700 380 C 704 470 706 560 710 690" stroke="#f3d9ae" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.3" />
      {/* Papilla ucu */}
      <path d="M 710 690 C 706 706 700 716 692 724" stroke="#b98f5c" strokeWidth="30" fill="none" strokeLinecap="round" />

      {/* --- Vasa recta (paralel U damarlar) --- */}
      <path d="M 536 380 C 534 470 538 540 556 578 C 572 612 604 614 618 584 C 630 558 630 520 630 486" stroke="#a35548" strokeWidth="13" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M 556 380 C 554 452 558 508 574 542" stroke="#8c463a" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.6" />

      {/* Peritübüler kapiller ağ detayı */}
      <g stroke="#a35548" strokeWidth="6" fill="none" opacity="0.45" strokeLinecap="round">
        <path d="M 320 210 C 360 196 400 190 440 194" />
        <path d="M 330 330 C 300 350 280 380 272 412" />
        <path d="M 420 620 C 450 640 480 652 512 660" />
      </g>

      {/* --- Akış yönü katmanı --- */}
      {showFlow ? (
        <g>
          <g stroke="#f0c98c" strokeWidth="3.5" fill="none" strokeLinecap="round" markerEnd="url(#ng-arrow)">
            {/* Filtrasyon */}
            <path d="M 168 210 L 210 216" strokeDasharray="6 5" />
            {/* Tubul akış */}
            <path d="M 306 262 L 330 252" />
            <path d="M 342 372 L 336 394" />
            <path d="M 392 520 L 386 546" />
            <path d="M 576 560 L 578 520" />
            <path d="M 652 500 L 653 470" />
            <path d="M 636 320 L 630 296" />
            <path d="M 520 318 L 480 314" />
            <path d="M 704 560 L 707 520" />
          </g>
          <g stroke="#e2927c" strokeWidth="3.5" fill="none" strokeLinecap="round" markerEnd="url(#ng-arrow-red)">
            <path d="M 80 130 L 130 148" />
            <path d="M 330 108 L 366 96" />
            <path d="M 560 560 L 566 530" />
          </g>
          <text x="212" y="242" fill="#f0c98c" fontSize="15" fontWeight="600" textAnchor="middle" opacity="0.9">Filtrasyon</text>
        </g>
      ) : null}

      <defs>
        <marker id="ng-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#f0c98c" />
        </marker>
        <marker id="ng-arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#e2927c" />
        </marker>
      </defs>
    </g>
  );
}
