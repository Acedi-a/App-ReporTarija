// ============================================================
// RegisterForm - Formulario de registro de ciudadano
// Usa React Hook Form + Zod para validación
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';
import { registerSchema, type RegisterFormData } from '../../../lib/validations';
import { Colors, FontSize, FontWeight, Spacing } from '../../../shared/constants/theme';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  onGoToLogin: () => void;
}

export function RegisterForm({ onSubmit, onGoToLogin }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function handleRegister(data: RegisterFormData) {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await onSubmit(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrarse';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
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
        name="fullName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Nombre completo"
            placeholder="Ej: María García López"
            icon="person-outline"
            autoCapitalize="words"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.fullName?.message}
          />
        )}
      />

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
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Teléfono (opcional)"
            placeholder="Ej: 76543210"
            icon="call-outline"
            keyboardType="phone-pad"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.phone?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            icon="lock-closed-outline"
            isPassword
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Confirmar contraseña"
            placeholder="Repite tu contraseña"
            icon="shield-checkmark-outline"
            isPassword
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.confirmPassword?.message}
          />
        )}
      />

      <Button
        title="Crear cuenta"
        onPress={handleSubmit(handleRegister)}
        loading={isLoading}
        style={styles.registerButton}
      />

      <TouchableOpacity onPress={onGoToLogin} style={styles.loginLink}>
        <Text style={styles.loginText}>
          ¿Ya tienes cuenta?{' '}
          <Text style={styles.loginTextBold}>Inicia sesión</Text>
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
  registerButton: {
    marginTop: Spacing.sm,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: Spacing['2xl'],
    paddingVertical: Spacing.sm,
  },
  loginText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  loginTextBold: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
});
