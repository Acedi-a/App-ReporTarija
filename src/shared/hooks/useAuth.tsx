import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as authService from '../../features/auth/services/authService';
import type { User } from '../../shared/types';


interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isDemo: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, phone: string | undefined, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginDemo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

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
    } catch (error) {
      console.log('No se encontró sesión activa o hubo un error al verificar:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const login = useCallback(async (email: string, password: string) => {
    const loggedUser = await authService.login({ email, password });
    setUser(loggedUser);
    setIsDemo(false);
  }, []);

  const register = useCallback(async (
    fullName: string,
    email: string,
    phone: string | undefined,
    password: string,
  ) => {
    const newUser = await authService.register({ fullName, email, phone, password });
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

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
