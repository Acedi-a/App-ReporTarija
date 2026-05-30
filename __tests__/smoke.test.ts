jest.mock('@insforge/sdk', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getCurrentUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    },
    database: {
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            limit: jest.fn(() => Promise.resolve({ data: null, error: null })),
          })),
        })),
      })),
    },
  })),
}));

import { InsforgeClient } from '@/src/lib/insforge';
import * as authService from '@/src/features/auth/services/authService';

describe('Prueba de Humo (Smoke Test) - Core del Sistema', () => {
  it('debe inicializar el Singleton de InsforgeClient correctamente', () => {
    const instance1 = InsforgeClient.getInstance();
    const instance2 = InsforgeClient.getInstance();
    
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).toBe(instance2);
  });

  it('debe responder al flujo de login demo sin crasear', async () => {
    const user = await authService.loginDemo();
    expect(user).toBeDefined();
    expect(user.email).toBe('ciudadana@reportatarija.bo');
    expect(user.role).toBe('CITIZEN');
  });
});
