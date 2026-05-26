// ============================================================
// MapPreview - Visualizador de mapa estático y dirección
// Muestra dirección, barrio, coordenadas GPS y simulador de mapa
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '../../../shared/constants/theme';

interface MapPreviewProps {
  latitude: number | null;
  longitude: number | null;
  address?: string | null;
  neighborhood?: string | null;
}

export function MapPreview({ latitude, longitude, address, neighborhood }: MapPreviewProps) {
  const lat = latitude || -21.5355;
  const lng = longitude || -64.7296;

  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>Ubicación de la anomalía</Text>
      <View style={styles.locationInfo}>
        <View style={styles.infoRow}>
          <Ionicons name="map" size={18} color={Colors.textSecondary} />
          <Text style={styles.infoText}>
            <Text style={styles.infoBold}>Dirección: </Text>
            {address || 'Ingresada manualmente'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location" size={18} color={Colors.textSecondary} />
          <Text style={styles.infoText}>
            <Text style={styles.infoBold}>Barrio / Zona: </Text>
            {neighborhood || 'Sin especificar'}
          </Text>
        </View>
        {latitude && longitude && (
          <View style={styles.infoRow}>
            <Ionicons name="pin" size={18} color={Colors.textSecondary} />
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>GPS: </Text>
              {latitude}, {longitude}
            </Text>
          </View>
        )}
      </View>

      {/* Mapa de Tarija Simulador */}
      <View style={styles.mapMock}>
        <Image
          source={{
            uri: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${lng},${lat})/${lng},${lat},15,0/400x150@2x?access_token=mock`,
          }}
          style={styles.mapImage}
        />
        {/* Fallback visual si el URL static map no funciona o no hay API token real */}
        <View style={styles.mapOverlay}>
          <Ionicons name="navigate-circle" size={24} color={Colors.primary} />
          <Text style={styles.mapOverlayText}>Tarija, Bolivia</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  locationInfo: {
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  infoText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  infoBold: {
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  mapMock: {
    height: 140,
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.5,
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  mapOverlayText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    ...Shadows.sm,
  },
});
