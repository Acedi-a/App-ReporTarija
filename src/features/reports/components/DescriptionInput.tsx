import { MIN_REPORT_DESCRIPTION_LENGTH } from '@/src/lib/validations';
import { Input } from '@/src/shared/components/ui/Input';
import { Colors, FontSize, FontWeight, Spacing } from '@/src/shared/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { CreateReportFormData } from '@/src/lib/validations';

interface DescriptionInputProps {
  control: Control<CreateReportFormData>;
  errors: FieldErrors<CreateReportFormData>;
}

export function DescriptionInput({ control, errors }: DescriptionInputProps) {
  return (
    <Controller
      control={control}
      name="description"
      render={({ field: { onChange, value } }) => {
        const charCount = value ? value.length : 0;
        const isDescriptionValid = charCount >= MIN_REPORT_DESCRIPTION_LENGTH;
        const remainingChars = MIN_REPORT_DESCRIPTION_LENGTH - charCount;
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
                  isDescriptionValid ? styles.charCounterValid : styles.charCounterInvalid,
                ]}
              >
                {charCount} / {MIN_REPORT_DESCRIPTION_LENGTH} caracteres mínimos
              </Text>
              {isDescriptionValid ? (
                <Text style={styles.charCounterValidText}>✓ Válido</Text>
              ) : (
                <Text style={styles.charCounterInvalidText}>
                  Faltan {remainingChars}
                </Text>
              )}
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
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
