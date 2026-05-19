// ============================================================
// Root Layout - Layout principal de la aplicación
// Envuelve toda la app con AuthProvider
// Redirige según estado de autenticación
// ============================================================

import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '@/src/shared/hooks/useAuth';
import { LoadingState } from '@/src/shared/components/ui/LoadingState';
import { View } from 'react-native';
import { Colors } from '@/src/shared/constants/theme';

/**
 * Componente interno que maneja la redirección basada en auth.
 * Debe estar dentro del AuthProvider para usar useAuth.
 */
function RootNavigator() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // No autenticado y fuera del grupo auth → ir a login
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Autenticado pero en grupo auth → ir a tabs
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <LoadingState message="Iniciando ReporTarija..." />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="report/[id]"
          options={{
            headerShown: true,
            title: 'Detalle del Reporte',
            headerTintColor: Colors.primary,
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
