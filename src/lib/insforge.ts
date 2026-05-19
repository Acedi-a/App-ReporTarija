// ============================================================
// Cliente InsForge - Conexión con el Backend
// ============================================================

import { createClient } from '@insforge/sdk';

const insforgeUrl = process.env.EXPO_PUBLIC_INSFORGE_URL || '';
const insforgeAnonKey = process.env.EXPO_PUBLIC_INSFORGE_ANON_KEY || '';

if (!insforgeUrl) {
  console.warn('⚠️ EXPO_PUBLIC_INSFORGE_URL no está definida');
}

export const insforge = createClient({
  baseUrl: insforgeUrl,
  anonKey: insforgeAnonKey,
});

export default insforge;
