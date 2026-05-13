import { AppProviders } from './providers';
import { AppRouter } from './router';
import { ToastContainer } from '@/widgets/toast';
import { useTheme } from '@/shared/lib/hooks';

const AppContent = () => {
  useTheme();

  return (
    <>
      <AppRouter />
      <ToastContainer />
    </>
  );
};

export const App = () => {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
};

export default App;
