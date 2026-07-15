import i18n from 'i18next';
import { useEffect, type PropsWithChildren } from 'react';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import { useSelector } from 'react-redux';
import { resources } from '@/i18n/translations';
import type { RootState } from '@/store';

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  });
}

export function I18nProvider({ children }: PropsWithChildren) {
  const language = useSelector((state: RootState) => state.appState.language);

  useEffect(() => {
    void i18n.changeLanguage(language);
    document.documentElement.lang = language;
    document.title = i18n.t('appName');
  }, [language]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
