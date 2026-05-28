// ============================================================
// CreateReportScreen - Registro de nuevo reporte urbano
// Integra formulario, ubicación GPS y evidencias fotográficas
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/src/shared/hooks/useAuth';
import { createReportSchema, type CreateReportFormData, MIN_REPORT_DESCRIPTION_LENGTH } from '@/src/lib/validations';
import { createReport } from '@/src/features/reports/services/reportService';
import { uploadEvidence } from '@/src/features/evidence/services/evidenceService';
import { Button } from '@/src/shared/components/ui/Button';
import { Input } from '@/src/shared/components/ui/Input';
import { ScreenContainer } from '@/src/shared/components/ui/ScreenContainer';
import { CategorySelector } from '@/src/features/reports/components/CategorySelector';
import { LocationPicker } from '@/src/features/reports/components/LocationPicker';
import { EvidenceUploader } from '@/src/features/reports/components/EvidenceUploader';
import { Colors, FontSize, FontWeight, Spacing } from '@/src/shared/constants/theme';

export default function CreateReportScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ categoryId?: string }>();
  const [submitting, setSubmitting] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateReportFormData>({
    resolver: zodResolver(createReportSchema),
    defaultValues: {
      title: '',
      description: '',
      category_id: undefined,
      address: '',
      neighborhood: '',
    },
  });

  const watchDescription = watch('description', '');
  const watchTitle = watch('title', '');
  const watchCategory = watch('category_id');

  const isFormInvalid =
    watchTitle.length < 5 ||
    watchDescription.length < MIN_REPORT_DESCRIPTION_LENGTH ||
    !watchCategory;

  useEffect(() => {
    if (params.categoryId) {
      const catId = parseInt(params.categoryId, 10);
      if (!isNaN(catId)) {
        setValue('category_id', catId, { shouldValidate: true });
      }
    }
  }, [params.categoryId, setValue]);

  function handleLocationChange(
    lat: number | null,
    lng: number | null,
    addr: string,
    neigh: string
  ) {
    setLatitude(lat);
    setLongitude(lng);
    setValue('address', addr, { shouldValidate: true });
    setValue('neighborhood', neigh, { shouldValidate: true });
  }

  async function onSubmit(data: CreateReportFormData) {
    if (!user?.id) {
      Alert.alert('Error', 'Debes iniciar sesión para registrar un reporte.');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Crear el reporte en la base de datos
      const report = await createReport(user.id, {
        title: data.title,
        description: data.description,
        category_id: data.category_id,
        latitude: latitude,
        longitude: longitude,
        address: data.address || null,
        neighborhood: data.neighborhood || null,
      });

      // 2. Si hay evidencia fotográfica, subirla
      if (imageUri) {
        try {
          await uploadEvidence(report.id, imageUri, user.id);
        } catch (imgError) {
          console.error('Error al subir la evidencia fotográfica:', imgError);
          Alert.alert(
            'Reporte registrado',
            'Tu reporte fue registrado con éxito, pero hubo un inconveniente al cargar la foto de evidencia.'
          );
          setSubmitting(false);
          reset();
          setImageUri(null);
          router.push('/(tabs)/reports');
          return;
        }
      }

      Alert.alert('¡Excelente!', 'Tu reporte ha sido registrado con éxito.');
      reset();
      setImageUri(null);
      setLatitude(null);
      setLongitude(null);
      router.push('/(tabs)/reports');
    } catch (error: any) {
      console.error('Error al enviar reporte:', error);
      Alert.alert('Error', error.message || 'Ocurrió un error al enviar el reporte.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScreenContainer scrollable={true}>
      <Text style={styles.title}>Registrar Reporte Ciudadano</Text>
      <Text style={styles.subtitle}>
        Ayuda a mejorar Tarija describiendo la anomalía y adjuntando la ubicación.
      </Text>

      {/* Formulario */}
      <View style={styles.formContainer}>
        {/* Título */}
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Título del reporte *"
              placeholder="Ej: Bache profundo peligroso"
              value={value}
              onChangeText={onChange}
              error={errors.title?.message}
            />
          )}
        />

        {/* Descripción */}
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => {
            const charCount = value ? value.length : 0;
            const isValid = charCount >= MIN_REPORT_DESCRIPTION_LENGTH;
            return (
              <View>
                <Input
                  label="Descripción *"
                  placeholder="Describe la situación en detalle (mínimo 20 caracteres)"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={4}
                  error={errors.description?.message}
                  containerStyle={{ marginBottom: 4 }}
                />
                <View style={styles.charCounterContainer}>
                  <Text
                    style={[
                      styles.charCounterText,
                      isValid ? styles.charCounterValid : styles.charCounterInvalid,
                    ]}
                  >
                    {charCount} / {MIN_REPORT_DESCRIPTION_LENGTH} caracteres mínimos
                  </Text>
                  {isValid ? (
                    <Text style={styles.charCounterValidText}>✓ Válido</Text>
                  ) : (
                    <Text style={styles.charCounterInvalidText}>
                      Faltan {MIN_REPORT_DESCRIPTION_LENGTH - charCount}
                    </Text>
                  )}
                </View>
              </View>
            );
          }}
        />

        {/* Selector de Categoría */}
        <Controller
          control={control}
          name="category_id"
          render={({ field: { onChange, value } }) => (
            <CategorySelector
              selectedCategoryId={value || null}
              onSelectCategory={onChange}
              error={errors.category_id?.message}
            />
          )}
        />

        {/* Selector de Ubicación */}
        <Controller
          control={control}
          name="address"
          render={({ field: { value: addrVal } }) => (
            <Controller
              control={control}
              name="neighborhood"
              render={({ field: { value: neighVal } }) => (
                <LocationPicker
                  latitude={latitude}
                  longitude={longitude}
                  address={addrVal || ''}
                  neighborhood={neighVal || ''}
                  onChangeLocation={handleLocationChange}
                  error={errors.address?.message}
                />
              )}
            />
          )}
        />

        {/* Cargador de Evidencias */}
        <EvidenceUploader imageUri={imageUri} onChangeImage={setImageUri} />

        {/* Botón de Envío */}
        <Button
          title={submitting ? 'Enviando reporte...' : 'Registrar Reporte'}
          onPress={handleSubmit(onSubmit)}
          loading={submitting}
          disabled={isFormInvalid}
          style={styles.submitButton}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  formContainer: {
    gap: Spacing.sm,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  charCounterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -8,
    marginBottom: Spacing.md,
    paddingHorizontal: 4,
  },
  charCounterText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  charCounterValid: {
    color: Colors.success,
  },
  charCounterInvalid: {
    color: Colors.textMuted,
  },
  charCounterValidText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.success,
  },
  charCounterInvalidText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
