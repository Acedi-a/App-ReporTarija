// ============================================================
// EvidenceUploader - Cargador de evidencias fotográficas
// Integra la cámara y la galería de imágenes del dispositivo
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '../../../shared/constants/theme';

interface EvidenceUploaderProps {
  imageUri: string | null;
  onChangeImage: (uri: string | null) => void;
}

export function EvidenceUploader({ imageUri, onChangeImage }: EvidenceUploaderProps) {
  async function requestPermissions(): Promise<boolean> {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || galleryStatus !== 'granted') {
      Alert.alert(
        'Permisos necesarios',
        'Necesitamos permisos para acceder a tu cámara y galería para poder adjuntar evidencias.'
      );
      return false;
    }
    return true;
  }

  async function handleTakePhoto() {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onChangeImage(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Error al tomar foto:', err);
      Alert.alert('Error', 'No se pudo abrir la cámara en este dispositivo.');
    }
  }

  async function handlePickImage() {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onChangeImage(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Error al seleccionar imagen:', err);
      Alert.alert('Error', 'No se pudo abrir la galería de fotos.');
    }
  }

  function handleRemovePhoto() {
    onChangeImage(null);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Evidencia Fotográfica (Opcional)</Text>

      {imageUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={handleRemovePhoto}
            activeOpacity={0.8}
          >
            <Ionicons name="trash" size={16} color={Colors.textInverse} />
            <Text style={styles.removeButtonText}>Quitar evidencia</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.uploadCard} onPress={handleTakePhoto} activeOpacity={0.7}>
            <View style={styles.iconCircle}>
              <Ionicons name="camera" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.uploadTitle}>Tomar Foto</Text>
            <Text style={styles.uploadSubtitle}>Usar la cámara</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadCard} onPress={handlePickImage} activeOpacity={0.7}>
            <View style={styles.iconCircle}>
              <Ionicons name="images" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.uploadTitle}>Galería</Text>
            <Text style={styles.uploadSubtitle}>Subir imagen</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  previewContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    padding: Spacing.sm,
    ...Shadows.sm,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
    resizeMode: 'cover',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.error,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  removeButtonText: {
    color: Colors.textInverse,
    fontWeight: FontWeight.semibold,
    fontSize: FontSize.xs,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  uploadCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: `${Colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  uploadTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  uploadSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
