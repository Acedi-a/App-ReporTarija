// ============================================================
// RegisterScreen - Pantalla de registro de ciudadano
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/src/shared/components/ui/ScreenContainer';
import { RegisterForm } from '@/src/features/auth/components/RegisterForm';
import { useAuth } from '@/src/shared/hooks/useAuth';
import { Colors, FontSize, FontWeight, Spacing } from '@/src/shared/constants/theme';
import type { RegisterFormData } from '@/src/lib/validations';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  async function handleRegister(data: RegisterFormData) {
    await register(data.fullName, data.email, data.phone, data.password);
  }

  function handleGoToLogin() {
    router.back();
  }

  return (
    <ScreenContainer>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="person-add" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>
            Regístrate para reportar problemas en tu ciudad
          </Text>
        </View>

        {/* Formulario */}
        <RegisterForm
          onSubmit={handleRegister}
          onGoToLogin={handleGoToLogin}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingVertical: Spacing['3xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: Colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.xl,
  },
});
