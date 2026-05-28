// ============================================================
// ReportDetailScreen - Visualización a detalle de un reporte
// Muestra datos, evidencia de foto, ubicación e historial de seguimiento
// ============================================================

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getReportById } from '@/src/features/reports/services/reportService';
import { getTrackingByReportId } from '@/src/features/tracking/services/trackingService';
import { getEvidencesByReportId } from '@/src/features/evidence/services/evidenceService';
import type { Report, TrackingEntry, Evidence } from '@/src/shared/types';
import { ReportDetailCard } from '@/src/features/reports/components/ReportDetailCard';
import { EvidenceViewer } from '@/src/features/reports/components/EvidenceViewer';
// eslint-disable-next-line import/no-unresolved
import { MapPreview } from '@/src/features/reports/components/MapPreview';
import { TrackingTimeline } from '@/src/features/tracking/components/TrackingTimeline';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '@/src/shared/constants/theme';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [report, setReport] = useState<Report | null>(null);
  const [tracking, setTracking] = useState<TrackingEntry[]>([]);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (isSilent = false) => {
    if (!id) return;
    if (!isSilent) setLoading(true);
    setError(null);

    try {
      const [reportData, trackingData, evidenceData] = await Promise.all([
        getReportById(id),
        getTrackingByReportId(id),
        getEvidencesByReportId(id),
      ]);

      setReport(reportData);
      setTracking(trackingData);
      setEvidences(evidenceData);
    } catch (err: any) {
      console.error('Error al cargar detalle de reporte:', err);
      setError('No se pudieron obtener los datos de este reporte.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadData(true);
  }, [loadData]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loaderText}>Cargando detalle del reporte...</Text>
      </View>
    );
  }

  if (error || !report) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
        <Text style={styles.errorText}>{error || 'El reporte no existe'}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Volver atrás</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Header Fijo */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIconButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Detalle de Reporte</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Card Principal Detallada */}
        <ReportDetailCard report={report} />

        {/* Evidencia Fotográfica */}
        <EvidenceViewer evidences={evidences} />

        {/* Ubicación y Mapa */}
        <MapPreview
          latitude={report.latitude ? Number(report.latitude) : null}
          longitude={report.longitude ? Number(report.longitude) : null}
          address={report.address}
          neighborhood={report.neighborhood}
        />

        {/* Línea de Tiempo de Seguimiento */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Historial de Seguimiento</Text>
          <View style={styles.timelineWrapper}>
            <TrackingTimeline entries={tracking} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    paddingTop: Platform.OS === 'android' ? 36 : 8,
  },
  backIconButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    gap: Spacing.md,
    paddingBottom: Spacing.xl * 2,
  },
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
  timelineWrapper: {
    marginTop: Spacing.xs,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.background,
  },
  loaderText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  backBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  backBtnText: {
    color: Colors.textInverse,
    fontWeight: FontWeight.bold,
  },
});
