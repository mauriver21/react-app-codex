import { createRoot } from 'react-dom/client';
import { App } from './App';
import { AppSetup } from '@/components/AppSetup';
import './index.css';

const enableMocking = async () => {
  if (!import.meta.env.DEV) return;
  const { worker } = await import('@/mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
};

void enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <AppSetup>
      <App />
    </AppSetup>,
  );
});
