import type { AppLanguage } from '@/interfaces/AppLanguage';
import type { ThemeMode } from '@/interfaces/ThemeMode';
import type { ThemeName } from '@/interfaces/ThemeName';

export interface AppState {
  themeName: ThemeName;
  themeMode: ThemeMode;
  language: AppLanguage;
}
