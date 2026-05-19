// ============================================================
// LoginForm - Formulario de inicio de sesión
// Usa React Hook Form + Zod para validación
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';
import { loginSchema, type LoginFormData } from '../../../lib/validations';
import { Colors, FontSize, FontWeight, Spacing } from '../../../shared/constants/theme';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  onDemoAccess: () => Promise<void>;
  onGoToRegister: () => void;
}

export function LoginForm({ onSubmit, onDemoAccess, onGoToRegister }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function handleLogin(data: LoginFormData) {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await onSubmit(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDemoAccess() {
    setIsDemoLoading(true);
    setErrorMessage(null);
    try {
      await onDemoAccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al acceder en modo demo';
      setErrorMessage(message);
    } finally {
      setIsDemoLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {errorMessage && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Correo electrónico"
            placeholder="tu@correo.com"
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Contraseña"
            placeholder="Tu contraseña"
            icon="lock-closed-outline"
            isPassword
            autoComplete="password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password?.message}
          />
        )}
      />

      <Button
        title="Iniciar sesión"
        onPress={handleSubmit(handleLogin)}
        loading={isLoading}
        disabled={isDemoLoading}
        style={styles.loginButton}
      />

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>o</Text>
        <View style={styles.dividerLine} />
      </View>

      <Button
        title="Acceso Demo"
        onPress={handleDemoAccess}
        variant="outline"
        loading={isDemoLoading}
        disabled={isLoading}
      />

      <TouchableOpacity onPress={onGoToRegister} style={styles.registerLink}>
        <Text style={styles.registerText}>
          ¿No tienes cuenta?{' '}
          <Text style={styles.registerTextBold}>Regístrate</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  errorBanner: {
    backgroundColor: Colors.errorLight,
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  loginButton: {
    marginTop: Spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    marginHorizontal: Spacing.md,
  },
  registerLink: {
    alignItems: 'center',
    marginTop: Spacing['2xl'],
    paddingVertical: Spacing.sm,
  },
  registerText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  registerTextBold: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
});
