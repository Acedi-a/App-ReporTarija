// ============================================================
// LoginScreen - Pantalla de inicio de sesión
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/src/shared/components/ui/ScreenContainer';
import { LoginForm } from '@/src/features/auth/components/LoginForm';
import { useAuth } from '@/src/shared/hooks/useAuth';
import { Colors, FontSize, FontWeight, Spacing } from '@/src/shared/constants/theme';
import type { LoginFormData } from '@/src/lib/validations';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loginDemo } = useAuth();

  async function handleLogin(data: LoginFormData) {
    await login(data.email, data.password);
  }

  async function handleDemoAccess() {
    await loginDemo();
  }

  function handleGoToRegister() {
    router.push('/(auth)/register');
  }

  return (
    <ScreenContainer>
      <View style={styles.content}>
        {/* Logo / Branding */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="shield-checkmark" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.appName}>ReporTarija</Text>
          <Text style={styles.subtitle}>App Ciudadana de Reportes Urbanos</Text>
          <Text style={styles.description}>
            Reporta problemas en tu ciudad y dale seguimiento desde tu celular
          </Text>
        </View>

        {/* Formulario */}
        <LoginForm
          onSubmit={handleLogin}
          onDemoAccess={handleDemoAccess}
          onGoToRegister={handleGoToRegister}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: Spacing['4xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['4xl'],
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: 22,
    backgroundColor: Colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  appName: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    lineHeight: 20,
  },
});
