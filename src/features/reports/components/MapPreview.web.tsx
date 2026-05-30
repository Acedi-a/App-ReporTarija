import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, FontSize, FontWeight, Shadows, Spacing } from '../../../shared/constants/theme';

interface MapPreviewProps {
  latitude: number | null;
  longitude: number | null;
  address?: string | null;
  neighborhood?: string | null;
}

export function MapPreview({ latitude, longitude, address, neighborhood }: MapPreviewProps) {
  const lat = latitude || -21.5355;
  const lng = longitude || -64.7296;

  const handleOpenInGoogleMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(googleMapsUrl).catch((err) => {
      console.error('No se pudo abrir el mapa externo:', err);
    });
  };

  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.003}%2C${lat - 0.003}%2C${lng + 0.003}%2C${lat + 0.003}&layer=mapnik&marker=${lat}%2C${lng}`;

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
      </View>

      <View style={styles.mapContainer}>
        <iframe
          src={osmEmbedUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          title="Mapa de ubicación"
        />

        <TouchableOpacity
          style={styles.mapOverlay}
          activeOpacity={0.85}
          onPress={handleOpenInGoogleMaps}
        >
          <View style={styles.googleMapsBadge}>
            <Ionicons name="open-outline" size={12} color={Colors.primary} />
            <Text style={styles.googleMapsBadgeText}>Abrir en Google Maps</Text>
          </View>
        </TouchableOpacity>
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
  mapContainer: {
    height: 160,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: Spacing.xs,
    right: Spacing.xs,
    cursor: 'pointer',
  } as any,
  googleMapsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  googleMapsBadgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
});
