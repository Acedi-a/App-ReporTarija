import { EvidenceViewer } from '@/src/features/reports/components/EvidenceViewer';
import { MapPreview } from '@/src/features/reports/components/MapPreview';
import { ReportDetailCard } from '@/src/features/reports/components/ReportDetailCard';
import { useReportDetail } from '@/src/features/reports/hooks/useReportDetail';
import { TrackingTimeline } from '@/src/features/tracking/components/TrackingTimeline';
import { BorderRadius, Colors, FontSize, FontWeight, Shadows, Spacing } from '@/src/shared/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const HEADER_BACK_ICON_SIZE = 24;
const ERROR_ICON_SIZE = 48;
const HEADER_ASPECT_W = 40;

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    report,
    tracking,
    evidences,
    loading,
    refreshing,
    error,
    handleRefresh,
  } = useReportDetail(id);

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
        <Ionicons name="alert-circle-outline" size={ERROR_ICON_SIZE} color={Colors.error} />
        <Text style={styles.errorText}>{error || 'El reporte no existe'}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Volver atrás</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIconButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={HEADER_BACK_ICON_SIZE} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Detalle de Reporte</Text>
        <View style={{ width: HEADER_ASPECT_W }} />
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
        <ReportDetailCard report={report} />

        <EvidenceViewer evidences={evidences} />

        <MapPreview
          latitude={report.latitude ? Number(report.latitude) : null}
          longitude={report.longitude ? Number(report.longitude) : null}
          address={report.address}
          neighborhood={report.neighborhood}
        />

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
    width: HEADER_ASPECT_W,
    height: HEADER_ASPECT_W,
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
