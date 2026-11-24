/* ===========================================================================
   SVG Diyagram 1 — Kalp Anatomisi (Ön Kesit)
   Görüntü düzlemi: hastaya karşdan bakış (hastanın sağ = görüntünün solu).
   =========================================================================== */

interface DiagramProps {
  showFlow: boolean;
}

export function HeartDiagram({ showFlow }: DiagramProps) {
  return (
    <g>
      <defs>
        <radialGradient id="hg-bg" cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#1c2537" />
          <stop offset="100%" stopColor="#0b111e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hg-muscle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a8402f" />
          <stop offset="55%" stopColor="#8c2f24" />
          <stop offset="100%" stopColor="#6b211a" />
        </linearGradient>
        <radialGradient id="hg-cavity-red" cx="42%" cy="38%" r="75%">
          <stop offset="0%" stopColor="#5e2b2b" />
          <stop offset="100%" stopColor="#3b1b20" />
        </radialGradient>
        <radialGradient id="hg-cavity-blue" cx="42%" cy="38%" r="75%">
          <stop offset="0%" stopColor="#33415e" />
          <stop offset="100%" stopColor="#232c44" />
        </radialGradient>
        <linearGradient id="hg-vessel-blue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4e6b96" />
          <stop offset="100%" stopColor="#33476b" />
        </linearGradient>
        <linearGradient id="hg-vessel-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c25b4a" />
          <stop offset="100%" stopColor="#93402f" />
        </linearGradient>
        <linearGradient id="hg-valve" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3e9d8" />
          <stop offset="100%" stopColor="#cdbfa6" />
        </linearGradient>
      </defs>

      {/* Arka plan parıltısı */}
      <ellipse cx="410" cy="380" rx="470" ry="430" fill="url(#hg-bg)" />

      {/* --- Kalp kası gövdesi --- */}
      <path
        d="M 242 138 C 176 162 150 252 162 352 C 172 452 216 552 302 628 C 368 686 472 710 548 676 C 616 646 652 570 642 490 C 634 424 626 384 618 330 C 610 264 588 204 544 166 C 494 124 322 112 242 138 Z"
        fill="url(#hg-muscle)"
        stroke="#5c1c15"
        strokeWidth="3"
      />
      {/* Miyokard yüzey gölgelendirmesi */}
      <path
        d="M 242 138 C 176 162 150 252 162 352 C 172 452 216 552 302 628 C 368 686 472 710 548 676 C 616 646 652 570 642 490 C 634 424 626 384 618 330 C 610 264 588 204 544 166 C 494 124 322 112 242 138 Z"
        fill="none"
        stroke="#c96a52"
        strokeWidth="1.5"
        strokeOpacity="0.35"
      />

      {/* Koroner arter yüzey detayları */}
      <path d="M 300 392 C 330 430 372 470 428 500" stroke="#d97b62" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M 428 500 C 470 528 520 560 566 588" stroke="#d97b62" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M 355 178 C 420 196 486 214 552 232" stroke="#d97b62" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M 300 392 C 262 430 236 476 224 528" stroke="#d97b62" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6" />

      {/* --- Odacıklar (kesit yüzeyleri) --- */}
      {/* Sağ atriyum */}
      <path
        d="M 232 172 C 198 195 186 258 194 318 C 200 366 232 392 282 392 C 330 392 356 366 358 322 C 360 268 348 210 316 180 C 296 161 258 155 232 172 Z"
        fill="url(#hg-cavity-blue)"
        stroke="#5b7398"
        strokeWidth="2.5"
      />
      {/* Sağ atriyum aurikula */}
      <path d="M 320 172 C 352 150 386 152 398 172 C 408 190 396 212 372 220 C 350 227 330 212 322 194 Z" fill="#3c4c6e" stroke="#5b7398" strokeWidth="2" />

      {/* Sağ ventrikül */}
      <path
        d="M 248 372 C 216 400 212 470 232 528 C 252 586 300 622 356 618 C 412 614 438 572 432 512 C 426 452 402 396 360 372 C 322 350 278 348 248 372 Z"
        fill="url(#hg-cavity-blue)"
        stroke="#5b7398"
        strokeWidth="2.5"
      />

      {/* Sol atriyum */}
      <path
        d="M 486 168 C 452 190 442 246 452 300 C 462 352 500 380 552 378 C 606 376 638 342 638 288 C 638 232 618 182 578 162 C 546 146 508 152 486 168 Z"
        fill="url(#hg-cavity-red)"
        stroke="#b06a55"
        strokeWidth="2.5"
      />

      {/* Sol ventrikül */}
      <path
        d="M 474 372 C 446 402 442 474 462 534 C 482 594 528 632 582 624 C 628 616 648 570 640 508 C 632 446 606 396 560 372 C 522 352 498 350 474 372 Z"
        fill="url(#hg-cavity-red)"
        stroke="#b06a55"
        strokeWidth="2.5"
      />

      {/* İnterventriküler septum */}
      <path
        d="M 443 358 C 458 392 462 470 452 542 C 447 582 438 610 428 630"
        stroke="#7c2b1f"
        strokeWidth="30"
        fill="none"
        strokeLinecap="round"
        opacity="0.95"
      />
      <path
        d="M 443 358 C 458 392 462 470 452 542 C 447 582 438 610 428 630"
        stroke="#a54b36"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* --- Büyük damarlar --- */}
      {/* Vena kava superior */}
      <path d="M 258 130 L 258 30" stroke="url(#hg-vessel-blue)" strokeWidth="58" strokeLinecap="round" />
      <path d="M 258 130 L 258 30" stroke="#6c86ad" strokeWidth="2" strokeOpacity="0.4" fill="none" />

      {/* Vena kava inferior */}
      <path d="M 274 388 C 268 470 254 560 240 700" stroke="url(#hg-vessel-blue)" strokeWidth="60" strokeLinecap="round" fill="none" />

      {/* Aorta: yükselen + arkus */}
      <path
        d="M 508 322 C 500 250 512 180 548 138 C 582 96 648 92 674 132 C 698 168 692 212 674 244"
        stroke="url(#hg-vessel-red)"
        strokeWidth="64"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 508 322 C 500 250 512 180 548 138 C 582 96 648 92 674 132 C 698 168 692 212 674 244"
        stroke="#d98d72"
        strokeWidth="2.5"
        strokeOpacity="0.35"
        fill="none"
      />
      {/* Brakiyosefalik / karotis dalları */}
      <path d="M 596 96 C 592 60 586 36 578 14" stroke="url(#hg-vessel-red)" strokeWidth="24" strokeLinecap="round" fill="none" />
      <path d="M 652 104 C 662 72 668 48 670 26" stroke="url(#hg-vessel-red)" strokeWidth="22" strokeLinecap="round" fill="none" />

      {/* Trunkus pulmonalis */}
      <path d="M 392 318 C 384 250 398 188 432 152" stroke="url(#hg-vessel-blue)" strokeWidth="50" strokeLinecap="round" fill="none" />
      {/* Pulmoner arter çatalı */}
      <path d="M 432 152 C 388 168 316 182 150 192" stroke="url(#hg-vessel-blue)" strokeWidth="40" strokeLinecap="round" fill="none" />
      <path d="M 442 148 C 520 158 622 168 782 176" stroke="url(#hg-vessel-blue)" strokeWidth="38" strokeLinecap="round" fill="none" />

      {/* Pulmoner venler */}
      <path d="M 820 232 C 742 238 692 252 652 272" stroke="url(#hg-vessel-red)" strokeWidth="36" strokeLinecap="round" fill="none" />
      <path d="M 820 330 C 748 322 702 312 658 302" stroke="url(#hg-vessel-red)" strokeWidth="34" strokeLinecap="round" fill="none" />

      {/* --- Kapaklar (yaprakçıklar) --- */}
      {/* Triküspid */}
      <path d="M 300 358 Q 336 398 374 356" stroke="url(#hg-valve)" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M 306 352 Q 338 374 370 350" stroke="#a3947b" strokeWidth="2" fill="none" opacity="0.7" />
      {/* Mitral */}
      <path d="M 490 356 Q 528 400 566 354" stroke="url(#hg-valve)" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M 496 350 Q 528 376 560 348" stroke="#a3947b" strokeWidth="2" fill="none" opacity="0.7" />
      {/* Pulmoner kapak */}
      <path d="M 370 282 Q 398 314 428 280" stroke="url(#hg-valve)" strokeWidth="7" fill="none" strokeLinecap="round" />
      {/* Aort kapağı */}
      <path d="M 482 280 Q 510 314 540 278" stroke="url(#hg-valve)" strokeWidth="7" fill="none" strokeLinecap="round" />
      {/* Semiluner kese detayları */}
      <path d="M 370 282 Q 382 270 398 272" stroke="#cdbfa6" strokeWidth="3" fill="none" opacity="0.8" />
      <path d="M 540 278 Q 528 266 510 268" stroke="#cdbfa6" strokeWidth="3" fill="none" opacity="0.8" />

      {/* --- Akış yönleri / iletim yolları katmanı --- */}
      {showFlow ? (
        <g>
          {/* Oksijenlenmemiş akış (mavi) */}
          <g stroke="#7cc3f0" strokeWidth="4" fill="none" strokeLinecap="round" markerEnd="url(#hg-arrow-blue)">
            <path d="M 258 100 L 258 150" />
            <path d="M 272 300 L 272 348" />
            <path d="M 300 420 L 348 420" />
            <path d="M 392 320 L 392 250" />
            <path d="M 300 186 L 180 192" />
          </g>
          {/* Oksijenli akış (kırmızı) */}
          <g stroke="#f0a28c" strokeWidth="4" fill="none" strokeLinecap="round" markerEnd="url(#hg-arrow-red)">
            <path d="M 750 262 L 640 276" />
            <path d="M 750 312 L 646 300" />
            <path d="M 520 300 L 520 348" />
            <path d="M 520 420 L 548 420" />
            <path d="M 520 320 L 520 262" />
          </g>
          {/* İletim sistemi (sarı kesik çizgiler) */}
          <g stroke="#f5c96a" strokeWidth="3.5" strokeDasharray="7 6" fill="none" strokeLinecap="round">
            <path d="M 216 194 Q 280 250 368 334" />
            <path d="M 368 334 L 424 372" />
            <path d="M 424 372 Q 436 500 444 612" />
            <path d="M 424 372 Q 396 480 384 592" />
          </g>
          <circle cx="216" cy="194" r="8" fill="#f5c96a" />
          <circle cx="368" cy="334" r="8" fill="#f5c96a" />
        </g>
      ) : null}

      {/* Ok işaretçileri (defs — katman açıkken kullanılır) */}
      <defs>
        <marker id="hg-arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#7cc3f0" />
        </marker>
        <marker id="hg-arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#f0a28c" />
        </marker>
      </defs>
    </g>
  );
}
