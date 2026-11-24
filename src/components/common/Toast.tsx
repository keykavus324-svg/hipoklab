import { CheckCircle2, Info, X } from 'lucide-react';

export type ToastTone = 'success' | 'info' | 'warning';

export interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastStackProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

const toneStyles: Record<ToastTone, string> = {
  success: 'border-accent/40 text-fg',
  info: 'border-azure/40 text-fg',
  warning: 'border-gold/40 text-fg',
};

const toneIcons: Record<ToastTone, typeof Info> = {
  success: CheckCircle2,
  info: Info,
  warning: Info,
};

export function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  if (toasts.length === 0) return null;
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[70] flex w-80 flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = toneIcons[toast.tone];
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-surface px-4 py-3 shadow-float animate-slide-up ${toneStyles[toast.tone]}`}
          >
            <Icon size={17} className="mt-0.5 shrink-0 text-accent" />
            <p className="flex-1 text-sm leading-relaxed text-sub">{toast.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="rounded p-0.5 text-faint transition hover:text-fg"
              aria-label="Bildirimi kapat"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
