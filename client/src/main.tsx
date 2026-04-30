import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext'; // Import the provider here

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Wrap App with AuthProvider so the context is available everywhere */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)