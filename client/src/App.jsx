// ============================================================
// App.jsx — Root Application Component
// ============================================================

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              background: 'var(--toast-bg, #fff)',
              color: 'var(--toast-color, #1e293b)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
              padding: '14px 20px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
