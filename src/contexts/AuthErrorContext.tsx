'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthErrorContextType {
  showError: boolean;
  setShowError: (show: boolean) => void;
}

const AuthErrorContext = createContext<AuthErrorContextType | undefined>(undefined);

export function AuthErrorProvider({ children }: { children: React.ReactNode }) {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // Listen for 401 auth errors from axios interceptors
    const handleAuthError = () => {
      setShowError(true);
    };

    window.addEventListener('auth-error', handleAuthError);

    return () => {
      window.removeEventListener('auth-error', handleAuthError);
    };
  }, []);

  return (
    <AuthErrorContext.Provider value={{ showError, setShowError }}>
      {children}
    </AuthErrorContext.Provider>
  );
}

export function useAuthError() {
  const context = useContext(AuthErrorContext);
  if (context === undefined) {
    throw new Error('useAuthError must be used within an AuthErrorProvider');
  }
  return context;
}