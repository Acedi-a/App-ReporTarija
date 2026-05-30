import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
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
    if (!latitude || !longitude) return;

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    const nativeUrl = Platform.select({
      ios: `maps://app?saddr=&daddr=${latitude},${longitude}`,
      android: `google.navigation:q=${latitude},${longitude}`,
      default: googleMapsUrl,
    });

    Linking.canOpenURL(nativeUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(nativeUrl);
        } else {
          Linking.openURL(googleMapsUrl);
        }
      })
      .catch((err) => {
        console.error('No se pudo abrir el mapa externo:', err);
        Linking.openURL(googleMapsUrl);
      });
  };

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

      <TouchableOpacity
        style={styles.mapContainer}
        activeOpacity={0.85}
        onPress={handleOpenInGoogleMaps}
      >
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <Marker
            coordinate={{ latitude: lat, longitude: lng }}
            pinColor={Colors.primary}
          />
        </MapView>
        <View style={styles.mapOverlay}>
          <View style={styles.googleMapsBadge}>
            <Ionicons name="open-outline" size={12} color={Colors.primary} />
            <Text style={styles.googleMapsBadgeText}>Abrir en Google Maps</Text>
          </View>
        </View>
      </TouchableOpacity>
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
  map: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: Spacing.xs,
    right: Spacing.xs,
  },
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
