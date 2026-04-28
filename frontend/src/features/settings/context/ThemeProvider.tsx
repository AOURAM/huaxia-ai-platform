import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

export type AppearanceMode = 'light' | 'night';

interface ThemeContextValue {
  appearance: AppearanceMode;
  isNightMode: boolean;
  setAppearance: (appearance: AppearanceMode) => void;
  toggleAppearance: () => void;
}

const THEME_STORAGE_KEY = 'huaxia-appearance';

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredAppearance(): AppearanceMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const storedAppearance = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedAppearance === 'night' || storedAppearance === 'light') {
    return storedAppearance;
  }

  return 'light';
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [appearance, setAppearanceState] = useState<AppearanceMode>(readStoredAppearance);

  const setAppearance = (nextAppearance: AppearanceMode) => {
    setAppearanceState(nextAppearance);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextAppearance);
    }
  };

  const toggleAppearance = () => {
    setAppearance(appearance === 'night' ? 'light' : 'night');
  };

  useEffect(() => {
    const root = document.documentElement;

    root.dataset.theme = appearance;
    root.style.colorScheme = appearance === 'night' ? 'dark' : 'light';
  }, [appearance]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      appearance,
      isNightMode: appearance === 'night',
      setAppearance,
      toggleAppearance,
    }),
    [appearance],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return context;
}