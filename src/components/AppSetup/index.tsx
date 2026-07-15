import { StrictMode, type PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ModelProvider, type ModelProviderProps } from 'react-redux-use-model';
import { BrowserRouter } from 'react-router-dom';
import { I18nProvider } from '@/components/I18nProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { persistor, store } from '@/store';

export const AppSetup = ({ children }: PropsWithChildren) => (
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ModelProvider store={store as unknown as ModelProviderProps['store']}>
          <I18nProvider>
            <ThemeProvider>
              <BrowserRouter>{children}</BrowserRouter>
            </ThemeProvider>
          </I18nProvider>
        </ModelProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
