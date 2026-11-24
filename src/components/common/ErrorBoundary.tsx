import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Uygulama geneli hata sınırı.
 * Beklenmedik bir çalışma zamanı hatasında sayfayı boş bırakmak yerine
 * kullanıcı dostu bir kurtarma ekranı gösterir.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }): void {
    // Hata ayıklama için konsola iz bırak
    console.error('HipokLab yakalanmamış hata:', error, info?.componentStack ?? '');
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleResetState = (): void => {
    try {
      Object.keys(window.localStorage)
        .filter((k) => k.startsWith('hipoklab:'))
        .forEach((k) => window.localStorage.removeItem(k));
    } catch {
      // depolama erişilemezse sessizce geç
    }
    window.location.reload();
  };

  render(): ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-base px-6 text-fg">
        <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8 text-center shadow-float">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-danger/40 bg-danger/12 text-danger">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
          </div>
          <h1 className="mt-5 text-lg font-semibold tracking-tight">Beklenmedik bir hata oluştu</h1>
          <p className="mt-2 text-sm leading-relaxed text-sub">
            Çalışma alanınız güvende; kayıtlarınız tarayıcınızda saklanmaya devam ediyor.
            Sayfayı yenilemeyi deneyin — sorun sürerse durumu sıfırlayıp temiz bir başlangıç yapabilirsiniz.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleReload}
              className="rounded-xl bg-accent px-5 py-2.5 text-[13px] font-semibold text-[#04211d] transition hover:brightness-110"
            >
              Sayfayı Yenile
            </button>
            <button
              type="button"
              onClick={this.handleResetState}
              className="rounded-xl border border-line bg-surface2 px-5 py-2.5 text-[13px] font-medium text-sub transition hover:border-danger/40 hover:text-danger"
            >
              Çalışma Alanını Sıfırla
            </button>
          </div>
          <p className="mt-5 text-[10px] text-faint">
            Hata özeti: {error.message || 'bilinmeyen hata'}
          </p>
        </div>
      </div>
    );
  }
}
