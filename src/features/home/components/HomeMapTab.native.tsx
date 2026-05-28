import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import type { Report } from '../../../shared/types';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '../../../shared/constants/theme';
import { ReportStatusBadge } from '../../reports/components/ReportStatusBadge';

interface HomeMapTabProps {
  reports: Report[];
}

export function HomeMapTab({ reports }: HomeMapTabProps) {
  const router = useRouter();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Filtrar reportes que tengan lat y lng válidos
  const reportsWithCoords = reports.filter(
    (r) => r.latitude !== null && r.longitude !== null
  );

  return (
    <View style={styles.container}>
      <Text style={styles.mapInfo}>
        Mostrando {reportsWithCoords.length} reportes geolocalizados en Tarija
      </Text>

      {/* Contenedor del Mapa Real */}
      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -21.5355,
            longitude: -64.7296,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }}
          onPress={() => setSelectedReport(null)}
        >
          {reportsWithCoords.map((report) => {
            const lat = Number(report.latitude);
            const lng = Number(report.longitude);

            // Asignar color de pin según estado
            let pinColor: string = Colors.primary;
            if (report.status === 'RESUELTO') pinColor = Colors.success;
            else if (report.status === 'EN_PROCESO') pinColor = '#3B82F6';
            else if (report.status === 'PENDIENTE') pinColor = '#F59E0B';

            return (
              <Marker
                key={report.id}
                coordinate={{ latitude: lat, longitude: lng }}
                title={report.title}
                description={report.neighborhood || undefined}
                pinColor={pinColor}
                onPress={(e) => {
                  e.stopPropagation();
                  setSelectedReport(report);
                }}
              />
            );
          })}
        </MapView>
      </View>

      {/* Tarjeta inferior de reporte seleccionado */}
      {selectedReport && (
        <TouchableOpacity
          style={styles.previewCard}
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: '/report/[id]',
              params: { id: selectedReport.id },
            })
          }
        >
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {selectedReport.title}
              </Text>
              <Text style={styles.cardAddress} numberOfLines={1}>
                📍 {selectedReport.neighborhood || 'Barrio no especificado'},{' '}
                {selectedReport.address || 'Sin dirección'}
              </Text>
            </View>
            <ReportStatusBadge status={selectedReport.status} />
          </View>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {selectedReport.description}
          </Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardFooterText}>Toca para ver detalle completo</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
    gap: Spacing.sm,
  },
  mapInfo: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
    paddingHorizontal: 4,
  },
  mapWrapper: {
    height: 320,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: Colors.border,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    ...Shadows.sm,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  previewCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    ...Shadows.md,
    marginTop: Spacing.xs,
    gap: Spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  cardAddress: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  cardDescription: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
  },
  cardFooterText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
});
