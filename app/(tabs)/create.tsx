import { CategorySelector } from '@/src/features/reports/components/CategorySelector';
import { DescriptionInput } from '@/src/features/reports/components/DescriptionInput';
import { EvidenceUploader } from '@/src/features/reports/components/EvidenceUploader';
import { LocationPicker } from '@/src/features/reports/components/LocationPicker';
import { useCreateReportForm } from '@/src/features/reports/hooks/useCreateReportForm';
import { Button } from '@/src/shared/components/ui/Button';
import { Input } from '@/src/shared/components/ui/Input';
import { ScreenContainer } from '@/src/shared/components/ui/ScreenContainer';
import { Colors, FontSize, FontWeight, Spacing } from '@/src/shared/constants/theme';
import React from 'react';
import { Controller } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

export default function CreateReportScreen() {
  const {
    control,
    errors,
    handleSubmit,
    onSubmit,
    submitting,
    isFormInvalid,
    imageUri,
    setImageUri,
    coordinates,
    watchAddress,
    watchNeighborhood,
    handleLocationChange,
  } = useCreateReportForm();

  return (
    <ScreenContainer scrollable={true}>
      <Text style={styles.title}>Registrar Reporte Ciudadano</Text>
      <Text style={styles.subtitle}>
        Ayuda a mejorar Tarija describiendo la anomalía y adjuntando la ubicación.
      </Text>

      <View style={styles.formContainer}>
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

        <DescriptionInput control={control} errors={errors} />

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

        <LocationPicker
          latitude={coordinates.latitude}
          longitude={coordinates.longitude}
          address={watchAddress || ''}
          neighborhood={watchNeighborhood || ''}
          onChangeLocation={handleLocationChange}
          error={errors.address?.message}
        />

        <EvidenceUploader imageUri={imageUri} onChangeImage={setImageUri} />

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
});
