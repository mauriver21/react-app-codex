import i18n from 'i18next';
import { useEffect, type PropsWithChildren } from 'react';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import { useSelector } from 'react-redux';
import { DEFAULT_LANGUAGE } from '@/constants/constants';
import { resources } from '@/i18n/translations';
import type { RootState } from '@/interfaces/RootState';

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  });
}

export const I18nProvider = ({ children }: PropsWithChildren) => {
  const language = useSelector((state: RootState) => state.appState.language);

  useEffect(() => {
    void i18n.changeLanguage(language);
    document.documentElement.lang = language;
    document.title = i18n.t('appName');
  }, [language]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
