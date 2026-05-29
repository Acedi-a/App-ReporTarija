import { createClient } from '@insforge/sdk';

export class InsforgeClient {
  private static instance: ReturnType<typeof createClient> | null = null;

  private constructor() {}

  public static getInstance(): ReturnType<typeof createClient> {
    if (!InsforgeClient.instance) {
      const insforgeUrl = process.env.EXPO_PUBLIC_INSFORGE_URL || '';
      const insforgeAnonKey = process.env.EXPO_PUBLIC_INSFORGE_ANON_KEY || '';

      if (!insforgeUrl) {
        console.warn('⚠️ EXPO_PUBLIC_INSFORGE_URL no está definida');
      }

      InsforgeClient.instance = createClient({
        baseUrl: insforgeUrl,
        anonKey: insforgeAnonKey,
      });
    }

    return InsforgeClient.instance;
  }
}

export const insforge = InsforgeClient.getInstance();
export default insforge;
