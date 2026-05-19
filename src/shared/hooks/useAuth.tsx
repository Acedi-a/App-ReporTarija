// ============================================================
// useAuth - Context y Hook de autenticación
// Provee estado de autenticación global a toda la app
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../../shared/types';
import * as authService from '../../features/auth/services/authService';

// ============================================================
// Tipos del contexto
// ============================================================

interface AuthContextType {
  /** Usuario autenticado actual (null si no hay sesión) */
  user: User | null;
  /** Si está cargando el estado inicial de auth */
  isLoading: boolean;
  /** Si el usuario es demo (no tiene sesión real en InsForge Auth) */
  isDemo: boolean;
  /** Iniciar sesión con email y contraseña */
  login: (email: string, password: string) => Promise<void>;
  /** Registrar un nuevo ciudadano */
  register: (fullName: string, email: string, phone: string | undefined, password: string) => Promise<void>;
  /** Cerrar sesión */
  logout: () => Promise<void>;
  /** Acceso rápido con usuario demo */
  loginDemo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================
// Provider
// ============================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  // Verificar sesión al montar
  useEffect(() => {
    checkCurrentUser();
  }, []);

  async function checkCurrentUser() {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsDemo(false);
      }
    } catch {
      // Sin sesión activa
    } finally {
      setIsLoading(false);
    }
  }

  const login = useCallback(async (email: string, password: string) => {
    const loggedUser = await authService.login(email, password);
    setUser(loggedUser);
    setIsDemo(false);
  }, []);

  const register = useCallback(async (
    fullName: string,
    email: string,
    phone: string | undefined,
    password: string,
  ) => {
    const newUser = await authService.register(fullName, email, phone, password);
    setUser(newUser);
    setIsDemo(false);
  }, []);

  const logout = useCallback(async () => {
    if (!isDemo) {
      await authService.logout();
    }
    setUser(null);
    setIsDemo(false);
  }, [isDemo]);

  const loginDemo = useCallback(async () => {
    const demoUser = await authService.loginDemo();
    setUser(demoUser);
    setIsDemo(true);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isDemo,
    login,
    register,
    logout,
    loginDemo,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================
// Hook
// ============================================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
