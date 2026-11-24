/* ===========================================================================
   SVG Diyagram 3 — Beyin Sapı Kesiti ve Kraniyal Sinir Çekirdekleri (Arka Görünüş)
   =========================================================================== */

interface DiagramProps {
  showFlow: boolean;
}

/** Kraniyal sinir kökü çizimi (iki lifli çizgi + ganglion şişkinliği). */
function nerveRoot(d: string, ganglionX: number, ganglionY: number, mirror = false) {
  return (
    <g>
      <path d={d} stroke="#cfa46a" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d={d} stroke="#f0d9ae" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.55" />
      <ellipse cx={ganglionX} cy={ganglionY} rx="13" ry="10" fill="#d9b884" stroke="#a3825a" strokeWidth="2" transform={mirror ? `rotate(10 ${ganglionX} ${ganglionY})` : `rotate(-10 ${ganglionX} ${ganglionY})`} />
    </g>
  );
}

export function BrainstemDiagram({ showFlow }: DiagramProps) {
  return (
    <g>
      <defs>
        <radialGradient id="bg-bg" cx="50%" cy="45%" r="62%">
          <stop offset="0%" stopColor="#1a2434" />
          <stop offset="100%" stopColor="#0b111e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bg-stem" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c9a583" />
          <stop offset="50%" stopColor="#e0be99" />
          <stop offset="100%" stopColor="#c9a583" />
        </linearGradient>
        <linearGradient id="bg-pons" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#cfa986" />
          <stop offset="50%" stopColor="#e8c8a2" />
          <stop offset="100%" stopColor="#cfa986" />
        </linearGradient>
        <radialGradient id="bg-cb" cx="45%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#b98f6e" />
          <stop offset="100%" stopColor="#8f6a50" />
        </radialGradient>
        <radialGradient id="bg-motor" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#e06a5a" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#c25042" stopOpacity="0.85" />
        </radialGradient>
        <radialGradient id="bg-sensory" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#5a92d8" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#4471b0" stopOpacity="0.85" />
        </radialGradient>
        <radialGradient id="bg-para" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#5cbf8a" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#42916a" stopOpacity="0.85" />
        </radialGradient>
      </defs>

      <ellipse cx="410" cy="380" rx="470" ry="430" fill="url(#bg-bg)" />

      {/* --- Serebellum hemisferleri --- */}
      <g>
        {/* Sol hemisfer */}
        <path
          d="M 322 140 C 240 118 148 148 118 226 C 88 306 128 382 214 398 C 272 408 316 380 328 322 Z"
          fill="url(#bg-cb)"
          stroke="#7c5a42"
          strokeWidth="3"
        />
        {/* Sağ hemisfer */}
        <path
          d="M 478 140 C 560 118 652 148 682 226 C 712 306 672 382 586 398 C 528 408 484 380 472 322 Z"
          fill="url(#bg-cb)"
          stroke="#7c5a42"
          strokeWidth="3"
        />
        {/* Folia (yaprakcık) çizgileri */}
        <g stroke="#7c5a42" strokeWidth="2" fill="none" opacity="0.55">
          <path d="M 150 190 C 200 176 258 172 306 182" />
          <path d="M 132 236 C 186 222 250 218 312 228" />
          <path d="M 128 282 C 182 270 248 266 318 274" />
          <path d="M 138 328 C 190 318 252 314 318 320" />
          <path d="M 670 190 C 620 176 562 172 514 182" />
          <path d="M 688 236 C 634 222 570 218 508 228" />
          <path d="M 692 282 C 638 270 572 266 502 274" />
          <path d="M 682 328 C 630 318 568 314 502 320" />
        </g>
        {/* Vermis */}
        <path d="M 328 150 C 352 132 448 132 472 150 C 486 186 484 232 470 262 C 440 276 360 276 330 262 C 316 232 314 186 328 150 Z" fill="#a8805f" stroke="#7c5a42" strokeWidth="2.5" />
        <g stroke="#7c5a42" strokeWidth="1.8" fill="none" opacity="0.5">
          <path d="M 344 172 C 380 162 420 162 456 172" />
          <path d="M 338 204 C 378 194 422 194 462 204" />
          <path d="M 338 236 C 378 228 422 228 462 236" />
        </g>
      </g>

      {/* --- Beyin sapı gövdesi --- */}
      {/* Mezensefalon */}
      <path d="M 348 96 C 340 66 460 66 452 96 C 458 140 458 190 450 224 C 420 238 380 238 350 224 C 342 190 342 140 348 96 Z" fill="url(#bg-stem)" stroke="#9a7554" strokeWidth="3" />
      {/* Serebral pedunküller */}
      <ellipse cx="352" cy="102" rx="26" ry="34" fill="#b98f6e" stroke="#9a7554" strokeWidth="2.5" transform="rotate(-14 352 102)" />
      <ellipse cx="448" cy="102" rx="26" ry="34" fill="#b98f6e" stroke="#9a7554" strokeWidth="2.5" transform="rotate(14 448 102)" />
      {/* Superior kollikuluslar */}
      <ellipse cx="374" cy="152" rx="22" ry="17" fill="#c9a583" stroke="#9a7554" strokeWidth="2" />
      <ellipse cx="426" cy="152" rx="22" ry="17" fill="#c9a583" stroke="#9a7554" strokeWidth="2" />
      {/* Inferior kollikuluslar */}
      <ellipse cx="376" cy="196" rx="19" ry="15" fill="#b98f6e" stroke="#9a7554" strokeWidth="2" />
      <ellipse cx="424" cy="196" rx="19" ry="15" fill="#b98f6e" stroke="#9a7554" strokeWidth="2" />

      {/* Pons (transvers liflerle şişkin bölüm) */}
      <path d="M 316 232 C 306 258 306 322 318 368 C 356 390 444 390 482 368 C 494 322 494 258 484 232 C 448 216 352 216 316 232 Z" fill="url(#bg-pons)" stroke="#9a7554" strokeWidth="3" />
      <g stroke="#a3825a" strokeWidth="1.8" fill="none" opacity="0.5">
        <path d="M 322 258 C 372 246 428 246 478 258" />
        <path d="M 318 292 C 370 280 430 280 482 292" />
        <path d="M 320 326 C 370 316 430 316 480 326" />
      </g>

      {/* Medulla oblongata */}
      <path d="M 336 372 C 330 420 332 500 344 566 C 356 592 444 592 456 566 C 468 500 470 420 464 372 C 432 356 368 356 336 372 Z" fill="url(#bg-stem)" stroke="#9a7554" strokeWidth="3" />
      {/* Piramitler */}
      <ellipse cx="378" cy="500" rx="17" ry="72" fill="#c9a583" stroke="#9a7554" strokeWidth="2" />
      <ellipse cx="422" cy="500" rx="17" ry="72" fill="#c9a583" stroke="#9a7554" strokeWidth="2" />
      {/* Olivler */}
      <ellipse cx="352" cy="470" rx="13" ry="34" fill="#b98f6e" stroke="#9a7554" strokeWidth="2" />
      <ellipse cx="448" cy="470" rx="13" ry="34" fill="#b98f6e" stroke="#9a7554" strokeWidth="2" />

      {/* Omurilik devamı */}
      <path d="M 356 580 C 352 630 356 680 362 726 C 380 742 420 742 438 726 C 444 680 448 630 444 580 Z" fill="url(#bg-stem)" stroke="#9a7554" strokeWidth="3" />

      {/* --- Çekirdekler (yarı saydam renk kodlu) --- */}
      {/* Motor çekirdekler (kırmızı) */}
      <ellipse cx="398" cy="158" rx="14" ry="22" fill="url(#bg-motor)" stroke="#a33e32" strokeWidth="1.6" />
      <ellipse cx="398" cy="192" rx="11" ry="17" fill="url(#bg-motor)" stroke="#a33e32" strokeWidth="1.6" />
      <ellipse cx="424" cy="300" rx="16" ry="30" fill="url(#bg-motor)" stroke="#a33e32" strokeWidth="1.6" />
      <ellipse cx="396" cy="382" rx="12" ry="18" fill="url(#bg-motor)" stroke="#a33e32" strokeWidth="1.6" />
      {/* Fasiyal genu (VI çekirdeği etrafında kancalanmış motor çekirdek) */}
      <path d="M 432 348 C 444 342 448 356 438 362 C 424 370 410 366 406 380" stroke="#c25042" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.9" />
      <ellipse cx="430" cy="452" rx="12" ry="20" fill="url(#bg-motor)" stroke="#a33e32" strokeWidth="1.6" />
      <ellipse cx="398" cy="512" rx="13" ry="20" fill="url(#bg-motor)" stroke="#a33e32" strokeWidth="1.6" />
      {/* Duyusal çekirdekler (mavi) */}
      <ellipse cx="452" cy="300" rx="13" ry="32" fill="url(#bg-sensory)" stroke="#2f5a92" strokeWidth="1.6" />
      <ellipse cx="456" cy="352" rx="12" ry="18" fill="url(#bg-sensory)" stroke="#2f5a92" strokeWidth="1.6" />
      <ellipse cx="452" cy="452" rx="11" ry="22" fill="url(#bg-sensory)" stroke="#2f5a92" strokeWidth="1.6" />
      <ellipse cx="452" cy="492" rx="10" ry="18" fill="url(#bg-sensory)" stroke="#2f5a92" strokeWidth="1.6" />
      {/* Parasempatik çekirdekler (yeşil) */}
      <ellipse cx="384" cy="132" rx="10" ry="14" fill="url(#bg-para)" stroke="#2f7d55" strokeWidth="1.6" />
      <ellipse cx="424" cy="268" rx="10" ry="14" fill="url(#bg-para)" stroke="#2f7d55" strokeWidth="1.6" />

      {/* --- Kraniyal sinir kökleri (sağ taraf — etiketli) --- */}
      {nerveRoot('M 452 152 C 496 140 532 132 566 130', 520, 134)}
      {nerveRoot('M 452 214 C 500 212 542 210 580 212', 534, 211)}
      {nerveRoot('M 486 292 C 536 288 582 286 626 288', 578, 287)}
      {nerveRoot('M 442 398 C 472 412 502 422 534 428', 492, 414)}
      {nerveRoot('M 468 368 C 512 364 556 362 598 364', 552, 363)}
      {nerveRoot('M 470 344 C 512 336 556 332 612 336', 562, 334)}
      {nerveRoot('M 458 452 C 502 452 544 454 588 458', 542, 454)}
      {nerveRoot('M 458 486 C 502 488 546 492 590 498', 544, 493)}
      {/* XI — iki kök (spinal + kranial) */}
      {nerveRoot('M 452 528 C 500 538 542 550 582 562', 536, 552)}
      {nerveRoot('M 442 592 C 480 588 512 576 534 566', 508, 578)}
      {nerveRoot('M 436 522 C 476 522 516 524 556 530', 512, 525)}

      {/* --- Sol taraf simetrik kökler (etiketsiz) --- */}
      <g opacity="0.85">
        {nerveRoot('M 348 152 C 304 140 268 132 234 130', 280, 134, true)}
        {nerveRoot('M 348 214 C 300 212 258 210 220 212', 266, 211, true)}
        {nerveRoot('M 314 292 C 264 288 218 286 174 288', 222, 287, true)}
        {nerveRoot('M 358 398 C 328 412 298 422 266 428', 308, 414, true)}
        {nerveRoot('M 332 368 C 288 364 244 362 202 364', 248, 363, true)}
        {nerveRoot('M 330 344 C 288 336 244 332 188 336', 238, 334, true)}
        {nerveRoot('M 342 452 C 298 452 256 454 212 458', 258, 454, true)}
        {nerveRoot('M 342 486 C 298 488 254 492 210 498', 256, 493, true)}
        {nerveRoot('M 348 528 C 300 538 258 550 218 562', 264, 552, true)}
        {nerveRoot('M 358 592 C 320 588 288 576 266 566', 292, 578, true)}
        {nerveRoot('M 364 522 C 324 522 284 524 244 530', 288, 525, true)}
      </g>

      {/* --- Akış / iletim yolları katmanı --- */}
      {showFlow ? (
        <g>
          {/* Kortikospinal iniş */}
          <g stroke="#f5c96a" strokeWidth="3.5" strokeDasharray="8 6" fill="none" strokeLinecap="round" markerEnd="url(#bg-arrow)">
            <path d="M 388 90 C 384 180 382 300 380 420" />
            <path d="M 412 90 C 416 180 418 300 420 420" />
          </g>
          {/* Piramidal çapraz */}
          <path d="M 380 560 C 392 574 408 574 420 560" stroke="#f5c96a" strokeWidth="4" strokeDasharray="8 6" fill="none" strokeLinecap="round" />
          {/* Serebello-talamik yol */}
          <path d="M 300 220 C 340 240 380 260 420 268" stroke="#7cc3f0" strokeWidth="3.5" strokeDasharray="8 6" fill="none" strokeLinecap="round" opacity="0.85" />
          {/* Sinir iletim yönü */}
          <g stroke="#cfa46a" strokeWidth="3" fill="none" strokeLinecap="round" markerEnd="url(#bg-arrow-b)">
            <path d="M 500 136 L 528 132" />
            <path d="M 560 288 L 588 288" />
            <path d="M 520 420 L 542 424" />
            <path d="M 520 492 L 548 496" />
          </g>
        </g>
      ) : null}

      <defs>
        <marker id="bg-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#f5c96a" />
        </marker>
        <marker id="bg-arrow-b" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#cfa46a" />
        </marker>
      </defs>
    </g>
  );
}
