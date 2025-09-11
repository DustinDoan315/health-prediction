import { Colors } from '@/constants/Colors';
import { useAppSelector } from '@/hooks';
import { DefaultTheme, ThemeProvider as RNThemeProvider } from '@react-navigation/native';


const CustomTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.primary,
    background: Colors.light.background,
    card: Colors.light.surface,
    text: Colors.light.text,
    border: '#E5E7EB',
    notification: Colors.light.error,
  },
};

const CustomDarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.dark.primary,
    background: Colors.dark.background,
    card: Colors.dark.surface,
    text: Colors.dark.text,
    border: '#374151',
    notification: Colors.dark.error,
  },
};

interface ThemeProviderProps {
  readonly children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { isDark, isLoading } = useAppSelector((state) => state.theme);
  
  if (isLoading) {
    return (
      <RNThemeProvider value={CustomTheme}>
        {children}
      </RNThemeProvider>
    );
  }
  
  return (
    <RNThemeProvider value={isDark ? CustomDarkTheme : CustomTheme}>
      {children}
    </RNThemeProvider>
  );
}
