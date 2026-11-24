import { Maximize2, Minus, Plus, RotateCcw } from 'lucide-react';
import { PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState } from 'react';
import { ATLAS_LAYERS, AtlasDiagram, AtlasPin } from '../../data/atlasData';
import { BrainstemDiagram } from './diagrams/BrainstemDiagram';
import { CellDiagram } from './diagrams/CellDiagram';
import { HeartDiagram } from './diagrams/HeartDiagram';
import { NephronDiagram } from './diagrams/NephronDiagram';

export interface QuizFeedback {
  status: 'idle' | 'correct' | 'wrong' | 'reveal';
  wrongPinId?: string;
  correctPinId?: string;
}

interface AnatomySvgCanvasProps {
  diagram: AtlasDiagram;
  selectedPinId: string | null;
  onSelectPin: (pin: AtlasPin) => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  showFlow: boolean;
  onToggleFlow: () => void;
  quizActive: boolean;
  quizFeedback: QuizFeedback | null;
  highContrast?: boolean;
}

const VIEW_W = 820;
const VIEW_H = 760;
const MIN_ZOOM = 0.55;
const MAX_ZOOM = 3;

/**
 * Etkileşimli SVG anatomi sahnesi:
 * - Tekerlek / butonlarla yakınlaştırma-uzaklaştırma
 * - Sürükleme ile kaydırma ve tek tıkla sıfırlama
 * - Katman kontrolü (isim etiketleri, akış yolları)
 * - Numaralı, tıklanabilir anatomik pinler
 */
export function AnatomySvgCanvas({
  diagram,
  selectedPinId,
  onSelectPin,
  showLabels,
  onToggleLabels,
  showFlow,
  onToggleFlow,
  quizActive,
  quizFeedback,
  highContrast = false,
}: AnatomySvgCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  // Diyagram değişince sahneyi sıfırla
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [diagram.id]);

  const zoomAt = useCallback((factor: number) => {
    setZoom((prev) => {
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev * factor));
      // Merkeze göre yakınlaştırma: pan merkez noktasını korur
      setPan((p) => {
        const cx = VIEW_W / 2;
        const cy = VIEW_H / 2;
        const ratio = next / prev;
        return { x: cx - (cx - p.x) * ratio, y: cy - (cy - p.y) * ratio };
      });
      return next;
    });
  }, []);

  // Tekerlek ile yakınlaştırma (sayfanın kaymasını engelle)
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12);
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // --- Sürükleme (pan) ---
  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    setDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging || !dragStartRef.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = VIEW_W / rect.width;
    const scaleY = VIEW_H / rect.height;
    const start = dragStartRef.current;
    setPan({
      x: start.panX + (e.clientX - start.x) * scaleX,
      y: start.panY + (e.clientY - start.y) * scaleY,
    });
  };
  const onPointerUp = () => {
    setDragging(false);
    dragStartRef.current = null;
  };

  const renderScene = () => {
    switch (diagram.id) {
      case 'heart':
        return <HeartDiagram showFlow={showFlow} />;
      case 'nephron':
        return <NephronDiagram showFlow={showFlow} />;
      case 'brainstem':
        return <BrainstemDiagram showFlow={showFlow} />;
      case 'cell':
        return <CellDiagram showFlow={showFlow} />;
      default:
        return null;
    }
  };

  return (
    <div className={`relative h-full w-full overflow-hidden rounded-2xl border border-line ${highContrast ? 'bg-[#060a12]' : 'bg-surface2/40'}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        className={`h-full w-full touch-none select-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        role="img"
        aria-label={`${diagram.title} — etkileşimli anatomi diyagramı`}
      >
        {/* Sahne dönüşümü (zoom + pan) */}
        <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
          {renderScene()}

          {/* İsim etiketleri katmanı */}
          {showLabels && !quizActive ? (
            <g>
              {diagram.pins.map((pin) => (
                <text
                  key={`label-${pin.id}`}
                  x={pin.x + pin.labelDx}
                  y={pin.y + pin.labelDy}
                  textAnchor={pin.labelAnchor}
                  fill={highContrast ? '#f8fafc' : '#dbe4f0'}
                  fontSize="15.5"
                  fontWeight="600"
                  stroke="#0b111e"
                  strokeWidth="3.5"
                  paintOrder="stroke"
                  strokeLinejoin="round"
                  style={{ pointerEvents: 'none' }}
                >
                  {pin.nameTr}
                </text>
              ))}
            </g>
          ) : null}

          {/* Pinler */}
          <g>
            {diagram.pins.map((pin) => {
              const isSelected = pin.id === selectedPinId;
              const isHovered = pin.id === hoveredPinId;
              const isWrong = quizFeedback?.status === 'wrong' && quizFeedback.wrongPinId === pin.id;
              const isRevealed =
                (quizFeedback?.status === 'wrong' || quizFeedback?.status === 'reveal') &&
                quizFeedback.correctPinId === pin.id;

              let fill = '#14B8A6';
              let stroke = '#0b111e';
              if (isWrong) {
                fill = '#ef4444';
              } else if (isRevealed) {
                fill = '#f59e0b';
              } else if (isSelected) {
                fill = '#38BDF8';
              }

              return (
                <g
                  key={pin.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredPinId(pin.id)}
                  onMouseLeave={() => setHoveredPinId((h) => (h === pin.id ? null : h))}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPin(pin);
                  }}
                  role="button"
                  aria-label={`${pin.number}. ${pin.nameTr}`}
                >
                  {/* Seçili / geri bildirim halkası */}
                  {isSelected || isRevealed || isWrong ? (
                    <circle
                      cx={pin.x}
                      cy={pin.y}
                      r={22}
                      fill="none"
                      stroke={isWrong ? '#ef4444' : isRevealed ? '#f59e0b' : '#38BDF8'}
                      strokeWidth="3"
                      opacity="0.85"
                    >
                      {isSelected ? (
                        <animate attributeName="r" values="20;24;20" dur="1.8s" repeatCount="indefinite" />
                      ) : null}
                    </circle>
                  ) : null}
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r={isHovered ? 16.5 : 14}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth="2.5"
                    style={{ transition: 'r 0.15s ease' }}
                  />
                  <text
                    x={pin.x}
                    y={pin.y + 4.5}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="700"
                    fill="#04211d"
                    style={{ pointerEvents: 'none' }}
                  >
                    {isWrong ? '✕' : pin.number}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {/* --- Sahne kontrol paneli --- */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2">
        {/* Zoom kontrolleri */}
        <div className="flex items-center gap-1 rounded-xl border border-line bg-surface/90 p-1.5 shadow-float backdrop-blur">
          <button
            type="button"
            onClick={() => zoomAt(1 / 1.25)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sub transition hover:bg-surface2 hover:text-fg"
            aria-label="Uzaklaştır"
            title="Uzaklaştır (-)"
          >
            <Minus size={15} />
          </button>
          <span className="w-12 text-center text-[11px] font-medium tabular-nums text-faint">
            %{Math.round(zoom * 100)}
          </span>
          <button
            type="button"
            onClick={() => zoomAt(1.25)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sub transition hover:bg-surface2 hover:text-fg"
            aria-label="Yakınlaştır"
            title="Yakınlaştır (+)"
          >
            <Plus size={15} />
          </button>
          <div className="mx-0.5 h-5 w-px bg-line" />
          <button
            type="button"
            onClick={resetView}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sub transition hover:bg-surface2 hover:text-fg"
            aria-label="Görünümü sıfırla"
            title="Sıfırla (R)"
          >
            <RotateCcw size={14} />
          </button>
          <button
            type="button"
            onClick={resetView}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sub transition hover:bg-surface2 hover:text-fg"
            aria-label="Tam sığdır"
            title="Tam sığdır"
          >
            <Maximize2 size={14} />
          </button>
        </div>

        {/* Katman kontrolleri */}
        <div className="flex flex-col gap-1.5 rounded-xl border border-line bg-surface/90 p-2.5 shadow-float backdrop-blur">
          <p className="px-1 text-[9px] font-semibold uppercase tracking-wider text-faint">Katmanlar</p>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1 text-[11px] font-medium text-sub transition hover:bg-surface2 hover:text-fg">
            <input
              type="checkbox"
              checked={showLabels}
              onChange={onToggleLabels}
              className="h-3.5 w-3.5 accent-[#14B8A6]"
            />
            {ATLAS_LAYERS.labels.label}
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1 text-[11px] font-medium text-sub transition hover:bg-surface2 hover:text-fg">
            <input
              type="checkbox"
              checked={showFlow}
              onChange={onToggleFlow}
              className="h-3.5 w-3.5 accent-[#38BDF8]"
            />
            {ATLAS_LAYERS.flow.label}
          </label>
        </div>
      </div>

      {/* İpucu rozeti */}
      <div className="absolute right-4 top-4 rounded-lg border border-line bg-surface/80 px-2.5 py-1.5 text-[10px] text-faint backdrop-blur">
        Tekerlek: yakınlaştır · Sürükle: kaydır · Pinlere tıkla
      </div>
    </div>
  );
}
