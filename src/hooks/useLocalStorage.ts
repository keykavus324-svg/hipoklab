import { useCallback, useEffect, useState } from 'react';

/**
 * localStorage ile senkron çalışan React state kancası.
 * Değer JSON olarak serileştirilir; depolama erişilemezse sessizce bellek içi kalır.
 * `normalize` verilirse, depolamadan okunan değer kaynak sürümden geliyorsa
 * (eksik alanlar içeren eski bir kalıcı durum gibi) bu işlevle sürüme uygun
 * biçimde dönüştürülür — aksi halde uygulama çökebilir.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  normalize?: (raw: unknown) => T,
) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return initialValue;
      const parsed = JSON.parse(raw) as unknown;
      return normalize ? normalize(parsed) : (parsed as T);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Kota dolu veya gizli mod — sessizce yoksay
    }
  }, [key, value]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => (typeof next === 'function' ? (next as (p: T) => T)(prev) : next));
    },
    [],
  );

  return [value, set] as const;
}

/** Verilen öneki taşıyan tüm localStorage anahtarlarını okur (JSON yedekleme için). */
export function readPrefixedStorage<T>(prefix: string): Record<string, T> {
  const result: Record<string, T> = {};
  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        try {
          result[key.slice(prefix.length)] = JSON.parse(window.localStorage.getItem(key) ?? '""') as T;
        } catch {
          // bozuk kayıt — yoksay
        }
      }
    }
  } catch {
    // erişim yok
  }
  return result;
}

/** JSON yedekten gelen not haritasını localStorage'a geri yazar. */
export function writePrefixedStorage<T>(prefix: string, data: Record<string, T>): void {
  try {
    Object.entries(data).forEach(([suffix, val]) => {
      window.localStorage.setItem(prefix + suffix, JSON.stringify(val));
    });
  } catch {
    // yoksay
  }
}
