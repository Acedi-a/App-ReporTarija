import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Report } from '../../../shared/types';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '../../../shared/constants/theme';
import { MapReportPreviewCard } from './MapReportPreviewCard';

const TARIJA_DEFAULT_LAT = -21.5355;
const TARIJA_DEFAULT_LNG = -64.7296;
const MAP_BBOX_OFFSET = 0.005;
const MAP_HEIGHT = 320;

interface HomeMapTabProps {
  reports: Report[];
}

function filterGeolocatedReports(reports: Report[]): Report[] {
  return reports.filter(
    (report) => report.latitude !== null && report.longitude !== null
  );
}

function buildOsmEmbedUrl(latitude: number, longitude: number): string {
  const west = longitude - MAP_BBOX_OFFSET;
  const south = latitude - MAP_BBOX_OFFSET;
  const east = longitude + MAP_BBOX_OFFSET;
  const north = latitude + MAP_BBOX_OFFSET;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${west}%2C${south}%2C${east}%2C${north}&layer=mapnik&marker=${latitude}%2C${longitude}`;
}

export function HomeMapTab({ reports }: HomeMapTabProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const reportsWithCoords = filterGeolocatedReports(reports);

  const activeLat = selectedReport ? Number(selectedReport.latitude) : TARIJA_DEFAULT_LAT;
  const activeLng = selectedReport ? Number(selectedReport.longitude) : TARIJA_DEFAULT_LNG;
  const osmEmbedUrl = buildOsmEmbedUrl(activeLat, activeLng);

  return (
    <View style={styles.container}>
      <Text style={styles.mapInfo}>
        Mostrando {reportsWithCoords.length} reportes geolocalizados en Tarija (Toca un reporte para centrar el mapa)
      </Text>

      {reportsWithCoords.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        >
          {reportsWithCoords.map((report) => {
            const isSelected = selectedReport?.id === report.id;
            return (
              <TouchableOpacity
                key={report.id}
                style={[styles.reportChip, isSelected && styles.reportChipSelected]}
                onPress={() => setSelectedReport(report)}
              >
                <Ionicons
                  name="location"
                  size={14}
                  color={isSelected ? Colors.surface : Colors.primary}
                />
                <Text
                  style={[styles.reportChipText, isSelected && styles.reportChipTextSelected]}
                  numberOfLines={1}
                >
                  {report.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <View style={styles.mapWrapper}>
        <iframe
          src={osmEmbedUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Mapa de reportes"
        />
      </View>

      {selectedReport && <MapReportPreviewCard report={selectedReport} />}
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
  listContainer: {
    gap: Spacing.xs,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  reportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 6,
  },
  reportChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  reportChipText: {
    fontSize: FontSize.xs,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
    maxWidth: 150,
  },
  reportChipTextSelected: {
    color: Colors.surface,
    fontWeight: FontWeight.bold,
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
});
