// ============================================================
// HomeMapTab (Native) - Vista de mapa con react-native-maps
// Refactorizaciones aplicadas:
//   - Extract Component: MapReportPreviewCard (CO-H01)
//   - Decompose Conditional: getStatusConfig reemplaza if/else (OA-H01)
//   - Eliminación de estilos duplicados (~50 líneas)
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import type { Report } from '../../../shared/types';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '../../../shared/constants/theme';
import { getStatusConfig } from '../../../shared/constants/reportStatus';
import { MapReportPreviewCard } from './MapReportPreviewCard';

/** Coordenadas por defecto de Tarija, Bolivia */
const TARIJA_DEFAULT_COORDS = {
  latitude: -21.5355,
  longitude: -64.7296,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

interface HomeMapTabProps {
  reports: Report[];
}

/** Filtra reportes que tengan coordenadas válidas */
function filterGeolocatedReports(reports: Report[]): Report[] {
  return reports.filter(
    (report) => report.latitude !== null && report.longitude !== null
  );
}

export function HomeMapTab({ reports }: HomeMapTabProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const reportsWithCoords = filterGeolocatedReports(reports);

  return (
    <View style={styles.container}>
      <Text style={styles.mapInfo}>
        Mostrando {reportsWithCoords.length} reportes geolocalizados en Tarija
      </Text>

      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          initialRegion={TARIJA_DEFAULT_COORDS}
          onPress={() => setSelectedReport(null)}
        >
          {reportsWithCoords.map((report) => {
            // Refactorización: Decompose Conditional (OA-H01)
            // Antes: cadena de if/else con colores hardcodeados
            // Ahora: usa getStatusConfig() que ya existe
            const statusConfig = getStatusConfig(report.status);

            return (
              <Marker
                key={report.id}
                coordinate={{
                  latitude: Number(report.latitude),
                  longitude: Number(report.longitude),
                }}
                title={report.title}
                description={report.neighborhood || undefined}
                pinColor={statusConfig.color}
                onPress={(e) => {
                  e.stopPropagation();
                  setSelectedReport(report);
                }}
              />
            );
          })}
        </MapView>
      </View>

      {selectedReport && <MapReportPreviewCard report={selectedReport} />}
    </View>
  );
}

const MAP_HEIGHT = 320;

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
    height: MAP_HEIGHT,
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
});
