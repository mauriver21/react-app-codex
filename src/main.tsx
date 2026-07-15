import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ModelProvider, type ModelProviderProps } from 'react-redux-use-model';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { I18nProvider } from '@/components/I18nProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { persistor, store } from '@/store';
import './index.css';

async function enableMocking() {
  if (!import.meta.env.DEV) return;
  const { worker } = await import('@/mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

void enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ModelProvider store={store as unknown as ModelProviderProps['store']}>
            <I18nProvider>
              <ThemeProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </ThemeProvider>
            </I18nProvider>
          </ModelProvider>
        </PersistGate>
      </Provider>
    </StrictMode>,
  );
});
