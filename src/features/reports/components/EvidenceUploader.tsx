import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, FontSize, FontWeight, Shadows, Spacing } from '../../../shared/constants/theme';

const IMAGE_PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.8,
};

const IMAGE_SOURCES = [
  {
    key: 'camera' as const,
    icon: 'camera' as keyof typeof Ionicons.glyphMap,
    title: 'Tomar Foto',
    subtitle: 'Usar la cámara',
    errorMessage: 'No se pudo abrir la cámara en este dispositivo.',
  },
  {
    key: 'gallery' as const,
    icon: 'images' as keyof typeof Ionicons.glyphMap,
    title: 'Galería',
    subtitle: 'Subir imagen',
    errorMessage: 'No se pudo abrir la galería de fotos.',
  },
] as const;

type ImageSource = typeof IMAGE_SOURCES[number]['key'];

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
  async function pickImageFromSource(source: ImageSource) {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const sourceConfig = IMAGE_SOURCES.find((s) => s.key === source)!;

    try {
      const launchFn =
        source === 'camera'
          ? ImagePicker.launchCameraAsync
          : ImagePicker.launchImageLibraryAsync;

      const result = await launchFn(IMAGE_PICKER_OPTIONS);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onChangeImage(result.assets[0].uri);
      }
    } catch (err) {
      console.error(`Error al obtener imagen desde ${source}:`, err);
      Alert.alert('Error', sourceConfig.errorMessage);
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
          {IMAGE_SOURCES.map((source) => (
            <TouchableOpacity
              key={source.key}
              style={styles.uploadCard}
              onPress={() => pickImageFromSource(source.key)}
              activeOpacity={0.7}
            >
              <View style={styles.iconCircle}>
                <Ionicons name={source.icon} size={24} color={Colors.primary} />
              </View>
              <Text style={styles.uploadTitle}>{source.title}</Text>
              <Text style={styles.uploadSubtitle}>{source.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const ICON_CIRCLE_SIZE = 44;
const PREVIEW_IMAGE_HEIGHT = 200;

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
    height: PREVIEW_IMAGE_HEIGHT,
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
    width: ICON_CIRCLE_SIZE,
    height: ICON_CIRCLE_SIZE,
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
