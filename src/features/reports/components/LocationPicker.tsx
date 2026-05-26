// ============================================================
// LocationPicker - Selector de Ubicación
// Permite obtener coordenadas GPS y detallar dirección/barrio
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../../shared/components/ui/Input';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '../../../shared/constants/theme';

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  address: string;
  neighborhood: string;
  onChangeLocation: (
    lat: number | null,
    lng: number | null,
    address: string,
    neighborhood: string
  ) => void;
  error?: string;
}

export function LocationPicker({
  latitude,
  longitude,
  address,
  neighborhood,
  onChangeLocation,
  error,
}: LocationPickerProps) {
  const [loading, setLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'success' | 'error'>('idle');

  async function handleGetLocation() {
    setLoading(true);
    setGpsStatus('idle');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permiso de ubicación denegado. Por favor, escribe la dirección de forma manual.');
        setGpsStatus('error');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const lat = location.coords.latitude;
      const lng = location.coords.longitude;

      // Obtener dirección aproximada (Reverse Geocoding)
      let approxAddress = address;
      try {
        const [geocode] = await Location.reverseGeocodeAsync({
          latitude: lat,
          longitude: lng,
        });

        if (geocode) {
          const street = geocode.street || '';
          const number = geocode.streetNumber ? ` ${geocode.streetNumber}` : '';
          approxAddress = street ? `${street}${number}` : approxAddress;
        }
      } catch (err) {
        console.log('Error en reverse geocode, se usará la dirección manual:', err);
      }

      onChangeLocation(lat, lng, approxAddress, neighborhood);
      setGpsStatus('success');
    } catch (err) {
      console.error('Error al obtener ubicación:', err);
      alert('No se pudo obtener la ubicación GPS actual. Ingresa la dirección manualmente.');
      setGpsStatus('error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ubicación del Reporte</Text>

      {/* Botón GPS */}
      <TouchableOpacity
        style={[
          styles.gpsButton,
          gpsStatus === 'success' && styles.gpsButtonSuccess,
          gpsStatus === 'error' && styles.gpsButtonError,
        ]}
        onPress={handleGetLocation}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Ionicons
            name={gpsStatus === 'success' ? 'location' : 'location-outline'}
            size={20}
            color={gpsStatus === 'success' ? Colors.success : Colors.primary}
          />
        )}
        <Text
          style={[
            styles.gpsButtonText,
            gpsStatus === 'success' && styles.gpsButtonTextSuccess,
          ]}
        >
          {loading
            ? 'Obteniendo coordenadas GPS...'
            : gpsStatus === 'success'
            ? 'Ubicación GPS capturada con éxito'
            : 'Obtener mi ubicación GPS actual'}
        </Text>
      </TouchableOpacity>

      {/* Badges de Coordenadas */}
      {latitude && longitude && (
        <View style={styles.coordContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Lat: {latitude.toFixed(6)}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Lng: {longitude.toFixed(6)}</Text>
          </View>
        </View>
      )}

      {/* Campos Manuales */}
      <View style={styles.inputsRow}>
        <Input
          label="Dirección aproximada (Calle y Nro.) *"
          value={address}
          onChangeText={(val) => onChangeLocation(latitude, longitude, val, neighborhood)}
          placeholder="Ej: Av. Las Américas y C. Virginio Lema"
          error={error}
        />
        <Input
          label="Barrio / Zona *"
          value={neighborhood}
          onChangeText={(val) => onChangeLocation(latitude, longitude, address, val)}
          placeholder="Ej: Barrio Senac"
        />
      </View>
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
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  gpsButtonSuccess: {
    borderColor: Colors.success,
    backgroundColor: `${Colors.success}10`,
  },
  gpsButtonError: {
    borderColor: Colors.error,
    backgroundColor: `${Colors.error}10`,
  },
  gpsButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  gpsButtonTextSuccess: {
    color: Colors.success,
  },
  coordContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  badge: {
    backgroundColor: Colors.borderLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  inputsRow: {
    gap: Spacing.xs,
  },
});
