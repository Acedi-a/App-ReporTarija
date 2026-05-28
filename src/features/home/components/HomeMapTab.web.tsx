import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

  const activeLat = selectedReport ? Number(selectedReport.latitude) : -21.5355;
  const activeLng = selectedReport ? Number(selectedReport.longitude) : -64.7296;

  // OpenStreetMap embed URL
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${activeLng - 0.005}%2C${activeLat - 0.005}%2C${activeLng + 0.005}%2C${activeLat + 0.005}&layer=mapnik&marker=${activeLat}%2C${activeLng}`;

  return (
    <View style={styles.container}>
      <Text style={styles.mapInfo}>
        Mostrando {reportsWithCoords.length} reportes geolocalizados en Tarija (Toca un reporte para centrar el mapa)
      </Text>

      {/* Lista horizontal de reportes geolocalizados */}
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
                style={[
                  styles.reportChip,
                  isSelected && styles.reportChipSelected,
                ]}
                onPress={() => setSelectedReport(report)}
              >
                <Ionicons
                  name="location"
                  size={14}
                  color={isSelected ? Colors.surface : Colors.primary}
                />
                <Text
                  style={[
                    styles.reportChipText,
                    isSelected && styles.reportChipTextSelected,
                  ]}
                  numberOfLines={1}
                >
                  {report.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Contenedor del Mapa (Iframe OpenStreetMap en web) */}
      <View style={styles.mapWrapper}>
        <iframe
          src={osmEmbedUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          title="Mapa de reportes"
        />
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
    height: 320,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: Colors.border,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    ...Shadows.sm,
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
