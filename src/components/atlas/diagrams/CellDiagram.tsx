/* ===========================================================================
   SVG Diyagram 4 — Ökaryotik Hücre Ultrastrüktürü (Histoloji)
   =========================================================================== */

import type { ReactNode } from 'react';

interface DiagramProps {
  showFlow: boolean;
}

/** Fosfolipit çift tabaka şeridi (yakın plan detay). */
function phospholipidStrip() {
  const heads: ReactNode[] = [];
  const tails: ReactNode[] = [];
  for (let i = 0; i < 14; i += 1) {
    const x = 578 + i * 15.5;
    heads.push(<circle key={`h${i}`} cx={x} cy={86} r="6" fill="#7fb8c9" stroke="#4c8497" strokeWidth="1.4" />);
    heads.push(<circle key={`h2-${i}`} cx={x} cy={140} r="6" fill="#7fb8c9" stroke="#4c8497" strokeWidth="1.4" />);
    tails.push(
      <path key={`t${i}`} d={`M ${x - 2.5} 93 L ${x - 3.5} 112 M ${x + 2.5} 93 L ${x + 3.5} 112`} stroke="#4c8497" strokeWidth="1.6" strokeLinecap="round" />,
    );
    tails.push(
      <path key={`t2-${i}`} d={`M ${x - 2.5} 133 L ${x - 3.5} 114 M ${x + 2.5} 133 L ${x + 3.5} 114`} stroke="#4c8497" strokeWidth="1.6" strokeLinecap="round" />,
    );
  }
  return { heads, tails };
}

export function CellDiagram({ showFlow }: DiagramProps) {
  const lipids = phospholipidStrip();

  return (
    <g>
      <defs>
        <radialGradient id="cl-bg" cx="50%" cy="45%" r="62%">
          <stop offset="0%" stopColor="#1a2434" />
          <stop offset="100%" stopColor="#0b111e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cl-cyto" cx="45%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#3d4c66" />
          <stop offset="100%" stopColor="#2a364c" />
        </radialGradient>
        <radialGradient id="cl-nucleus" cx="38%" cy="34%" r="80%">
          <stop offset="0%" stopColor="#5f7396" />
          <stop offset="100%" stopColor="#3c4c6b" />
        </radialGradient>
        <radialGradient id="cl-nucleolus" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#33415c" />
          <stop offset="100%" stopColor="#232e44" />
        </radialGradient>
        <linearGradient id="cl-mito" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d98a6a" />
          <stop offset="100%" stopColor="#b0624c" />
        </linearGradient>
        <linearGradient id="cl-er" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a06a" />
          <stop offset="100%" stopColor="#a37f4e" />
        </linearGradient>
        <linearGradient id="cl-golgi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8fc4a8" />
          <stop offset="100%" stopColor="#5f9a7c" />
        </linearGradient>
        <linearGradient id="cl-membrane" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#79b4c4" />
          <stop offset="100%" stopColor="#56899b" />
        </linearGradient>
      </defs>

      <ellipse cx="410" cy="380" rx="470" ry="430" fill="url(#cl-bg)" />

      {/* --- Hücre gövdesi (sitoplazma) --- */}
      <path
        d="M 92 340 C 88 210 190 120 330 108 C 500 94 660 130 718 236 C 772 334 762 480 700 578 C 630 688 470 716 320 692 C 178 670 98 520 92 340 Z"
        fill="url(#cl-cyto)"
        stroke="#4c5f7e"
        strokeWidth="10"
      />
      {/* Hücre zarı çift çizgi */}
      <path
        d="M 92 340 C 88 210 190 120 330 108 C 500 94 660 130 718 236 C 772 334 762 480 700 578 C 630 688 470 716 320 692 C 178 670 98 520 92 340 Z"
        fill="none"
        stroke="url(#cl-membrane)"
        strokeWidth="5"
      />
      {/* Zar fosfolipit başları (kontur boyunca noktalı doku) */}
      <path
        d="M 92 340 C 88 210 190 120 330 108 C 500 94 660 130 718 236 C 772 334 762 480 700 578 C 630 688 470 716 320 692 C 178 670 98 520 92 340 Z"
        fill="none"
        stroke="#a8d2dd"
        strokeWidth="9"
        strokeDasharray="2 12"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* --- Çekirdek --- */}
      <circle cx="315" cy="320" r="132" fill="url(#cl-nucleus)" stroke="#6c83a8" strokeWidth="6" />
      <circle cx="315" cy="320" r="118" fill="none" stroke="#8ba2c4" strokeWidth="2" opacity="0.5" />
      {/* Nükleer porlar */}
      <g fill="#2c3a56" stroke="#94aacb" strokeWidth="1.4">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <rect
              key={deg}
              x={315 + 124 * Math.cos(rad) - 7}
              y={320 + 124 * Math.sin(rad) - 5}
              width="14"
              height="10"
              rx="3"
              transform={`rotate(${deg} ${315 + 124 * Math.cos(rad)} ${320 + 124 * Math.sin(rad)})`}
            />
          );
        })}
      </g>
      {/* Kromatin iplikleri */}
      <g stroke="#8ba2c4" strokeWidth="3" fill="none" opacity="0.55">
        <path d="M 240 260 C 270 240 310 248 332 272" />
        <path d="M 232 320 C 260 300 300 304 322 328" />
        <path d="M 252 386 C 282 366 320 372 342 396" />
        <path d="M 380 262 C 402 288 404 322 388 350" />
        <path d="M 226 246 C 244 226 272 216 298 222" />
        <path d="M 356 400 C 380 388 402 362 406 334" />
      </g>
      {/* Çekirdekçik */}
      <circle cx="355" cy="285" r="42" fill="url(#cl-nucleolus)" stroke="#5f7396" strokeWidth="3.5" />
      <g fill="#7487ab" opacity="0.7">
        <circle cx="342" cy="272" r="4" />
        <circle cx="368" cy="292" r="5" />
        <circle cx="350" cy="302" r="3.5" />
        <circle cx="372" cy="268" r="3" />
      </g>

      {/* --- Granüllü ER (ribozomlu kıvrımlı lameller) --- */}
      <g>
        {[
          'M 452 196 C 500 178 556 176 606 190',
          'M 448 226 C 498 208 556 206 610 222',
          'M 448 258 C 498 240 558 238 614 254',
          'M 452 292 C 500 274 560 272 616 288',
        ].map((d, i) => (
          <g key={i}>
            <path d={d} stroke="url(#cl-er)" strokeWidth="17" fill="none" strokeLinecap="round" />
            <path d={d} stroke="#ecd9b2" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.5" />
          </g>
        ))}
        {/* Ribozom noktaları */}
        <g fill="#6b4f2e">
          {[
            [462, 182], [488, 174], [518, 170], [550, 170], [582, 174], [608, 182],
            [458, 212], [486, 204], [516, 200], [548, 200], [580, 204], [610, 212],
            [458, 244], [486, 236], [516, 232], [548, 232], [580, 236], [612, 244],
            [462, 278], [490, 270], [520, 266], [552, 266], [584, 270], [614, 278],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4.2" />
          ))}
        </g>
      </g>

      {/* --- Granülsüz ER (tübüler ağ) --- */}
      <g stroke="url(#cl-er)" strokeWidth="15" fill="none" strokeLinecap="round">
        <path d="M 618 372 C 658 356 704 362 724 392 C 744 422 726 456 692 462" />
        <path d="M 612 404 C 648 392 688 398 704 422 C 720 446 704 474 674 478" />
        <path d="M 630 436 C 660 428 690 432 702 452" />
        <path d="M 660 344 C 692 336 726 342 742 366" />
      </g>
      <g stroke="#ecd9b2" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.45">
        <path d="M 618 372 C 658 356 704 362 724 392" />
        <path d="M 612 404 C 648 392 688 398 704 422" />
      </g>

      {/* --- Golgi aygıtı (yığın kıvrımlar + veziküller) --- */}
      <g>
        {[
          'M 442 496 C 480 480 524 480 560 494',
          'M 446 518 C 484 502 528 502 564 516',
          'M 450 540 C 488 524 532 524 568 538',
          'M 454 562 C 492 546 536 546 572 560',
          'M 458 584 C 496 568 540 568 576 582',
        ].map((d, i) => (
          <path key={i} d={d} stroke="url(#cl-golgi)" strokeWidth="14" fill="none" strokeLinecap="round" />
        ))}
        <circle cx="592" cy="512" r="9" fill="#8fc4a8" stroke="#5f9a7c" strokeWidth="2" />
        <circle cx="600" cy="548" r="7" fill="#8fc4a8" stroke="#5f9a7c" strokeWidth="2" />
        <circle cx="586" cy="586" r="8" fill="#8fc4a8" stroke="#5f9a7c" strokeWidth="2" />
        <circle cx="430" cy="532" r="7" fill="#8fc4a8" stroke="#5f9a7c" strokeWidth="2" />
      </g>

      {/* --- Mitokondri (kristalı) --- */}
      {/* Sol-alt mitokondri */}
      <g transform="rotate(-18 185 520)">
        <ellipse cx="185" cy="520" rx="66" ry="40" fill="url(#cl-mito)" stroke="#8c4636" strokeWidth="3.5" />
        <ellipse cx="185" cy="520" rx="56" ry="31" fill="#c97a5e" stroke="#a35c44" strokeWidth="1.6" />
        <path d="M 142 520 L 152 502 L 162 538 L 172 502 L 182 538 L 192 502 L 202 538 L 212 502 L 222 538 L 232 512" stroke="#8c4636" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </g>
      {/* Üst-sağ mitokondri */}
      <g transform="rotate(16 620 172)">
        <ellipse cx="620" cy="172" rx="58" ry="34" fill="url(#cl-mito)" stroke="#8c4636" strokeWidth="3.5" />
        <ellipse cx="620" cy="172" rx="48" ry="25" fill="#c97a5e" stroke="#a35c44" strokeWidth="1.6" />
        <path d="M 584 172 L 592 158 L 600 186 L 608 158 L 616 186 L 624 158 L 632 186 L 640 158 L 648 182 L 654 168" stroke="#8c4636" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      {/* Alt-sağ mitokondri */}
      <g transform="rotate(-8 648 620)">
        <ellipse cx="648" cy="620" rx="58" ry="34" fill="url(#cl-mito)" stroke="#8c4636" strokeWidth="3.5" />
        <ellipse cx="648" cy="620" rx="48" ry="25" fill="#c97a5e" stroke="#a35c44" strokeWidth="1.6" />
        <path d="M 612 620 L 620 606 L 628 634 L 636 606 L 644 634 L 652 606 L 660 634 L 668 606 L 676 630 L 682 616" stroke="#8c4636" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>

      {/* --- Lizozom --- */}
      <circle cx="255" cy="600" r="36" fill="#b08cb4" stroke="#7c5f82" strokeWidth="3.5" />
      <g fill="#7c5f82" opacity="0.75">
        <circle cx="243" cy="588" r="3.4" />
        <circle cx="266" cy="596" r="4" />
        <circle cx="250" cy="612" r="3" />
        <circle cx="268" cy="616" r="2.6" />
        <circle cx="238" cy="604" r="2.4" />
      </g>

      {/* --- Peroksizom (kristalli) --- */}
      <circle cx="125" cy="300" r="32" fill="#d8b26a" stroke="#a3823e" strokeWidth="3.5" />
      <rect x="112" y="288" width="24" height="24" rx="3" fill="#f0e2bc" stroke="#a3823e" strokeWidth="2" transform="rotate(18 124 300)" />
      <path d="M 112 300 L 136 300 M 124 288 L 124 312" stroke="#a3823e" strokeWidth="1.6" opacity="0.7" transform="rotate(18 124 300)" />

      {/* --- Serbest ribozomlar --- */}
      <g fill="#6b4f2e">
        {[
          [340, 160], [368, 148], [396, 168], [420, 150], [216, 176], [186, 214],
          [150, 252], [130, 356], [148, 420], [172, 458], [212, 480], [272, 512],
          [322, 552], [362, 596], [412, 622], [468, 636], [520, 612], [556, 578],
          [600, 520], [636, 480], [688, 336], [652, 300], [612, 320], [560, 340],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4.2" />
        ))}
      </g>

      {/* --- Sitoskeleton (ince lifler) --- */}
      <g stroke="#6c83a8" strokeWidth="1.8" fill="none" opacity="0.4">
        <path d="M 130 380 C 220 350 330 330 440 320 C 550 312 650 320 720 348" />
        <path d="M 180 160 C 240 230 300 320 340 430 C 370 520 390 600 400 670" />
        <path d="M 700 220 C 640 290 560 360 470 430 C 390 492 300 560 240 620" />
        <path d="M 120 280 C 220 300 340 320 460 350 C 580 380 680 420 730 470" />
      </g>

      {/* --- Sentriyol çifti --- */}
      <g transform="rotate(24 250 195)">
        <rect x="228" y="182" width="20" height="26" rx="4" fill="#8ba2c4" stroke="#5f7396" strokeWidth="2" />
        <rect x="252" y="182" width="20" height="26" rx="4" fill="#8ba2c4" stroke="#5f7396" strokeWidth="2" />
        <g stroke="#5f7396" strokeWidth="1.3" opacity="0.8">
          <path d="M 233 182 L 233 208 M 238 182 L 238 208 M 243 182 L 243 208" />
          <path d="M 257 182 L 257 208 M 262 182 L 262 208 M 267 182 L 267 208" />
        </g>
      </g>

      {/* --- Fosfolipit çift tabaka yakın plan detayı --- */}
      <g>
        <rect x="558" y="62" width="238" height="96" rx="14" fill="#25334c" stroke="#4c8497" strokeWidth="2.5" />
        {lipids.heads}
        {lipids.tails}
        {/* Kolesterol gömme detayı */}
        <rect x="676" y="96" width="9" height="30" rx="3" fill="#d8b26a" stroke="#a3823e" strokeWidth="1.2" transform="rotate(8 680 110)" />
        <rect x="622" y="96" width="9" height="30" rx="3" fill="#d8b26a" stroke="#a3823e" strokeWidth="1.2" transform="rotate(-6 626 110)" />
        <text x="677" y="180" fill="#9ec4d2" fontSize="15" fontWeight="600" textAnchor="middle" opacity="0.95">
          Fosfolipit Çift Tabaka (yakın plan)
        </text>
      </g>

      {/* --- Akış katmanı: salgı yolu --- */}
      {showFlow ? (
        <g>
          <g stroke="#f0c98c" strokeWidth="3.5" strokeDasharray="7 6" fill="none" strokeLinecap="round" markerEnd="url(#cl-arrow)">
            {/* Çekirdek → rER → Golgi → zar (salgı yolu) */}
            <path d="M 420 300 C 442 280 452 262 462 246" />
            <path d="M 620 300 C 612 330 592 380 570 430 C 552 470 532 492 512 504" />
            <path d="M 586 528 C 612 548 630 566 642 584" />
            <path d="M 660 486 C 686 462 706 432 716 398" />
            {/* ATP akışı: mitokondri → sitoplazma */}
            <path d="M 236 512 C 268 502 296 488 318 470" stroke="#7cc3f0" strokeDasharray="5 5" />
          </g>
          <text x="500" y="446" fill="#f0c98c" fontSize="15" fontWeight="600" textAnchor="middle" opacity="0.9">Salgı Yolu</text>
          <text x="262" y="486" fill="#7cc3f0" fontSize="13.5" fontWeight="600" textAnchor="middle" opacity="0.9">ATP</text>
        </g>
      ) : null}

      <defs>
        <marker id="cl-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#f0c98c" />
        </marker>
      </defs>
    </g>
  );
}
