// ============================================================
// Validaciones con Zod - ReporTarija
// Esquemas de validación para formularios
// ============================================================

import { z } from 'zod';

/** Longitud mínima de la descripción de un reporte (Replace Magic Number) */
export const MIN_REPORT_DESCRIPTION_LENGTH = 20;

/** Longitud mínima de la contraseña */
export const MIN_PASSWORD_LENGTH = 6;

// ============================================================
// Esquemas de autenticación
// ============================================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es obligatorio')
    .email('Ingresa un correo válido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'El nombre completo es obligatorio')
      .min(3, 'El nombre debe tener al menos 3 caracteres'),
    email: z
      .string()
      .min(1, 'El correo es obligatorio')
      .email('Ingresa un correo válido'),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 7,
        'El teléfono debe tener al menos 7 dígitos'
      ),
    password: z
      .string()
      .min(1, 'La contraseña es obligatoria')
      .min(MIN_PASSWORD_LENGTH, `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`),
    confirmPassword: z
      .string()
      .min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// ============================================================
// Esquema de crear reporte (para uso futuro)
// ============================================================

export const createReportSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio')
    .min(5, 'El título debe tener al menos 5 caracteres'),
  description: z
    .string()
    .min(1, 'La descripción es obligatoria')
    .min(
      MIN_REPORT_DESCRIPTION_LENGTH,
      `La descripción debe tener al menos ${MIN_REPORT_DESCRIPTION_LENGTH} caracteres`
    ),
  category_id: z
    .number()
    .min(1, 'Selecciona una categoría'),
  address: z.string().optional(),
  neighborhood: z.string().optional(),
});

export type CreateReportFormData = z.infer<typeof createReportSchema>;
