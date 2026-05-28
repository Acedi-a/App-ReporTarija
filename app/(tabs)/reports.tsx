// ============================================================
// MyReportsScreen - Listado y filtrado de reportes del ciudadano
// Muestra todos los reportes propios organizados por pestañas de estado
// ============================================================

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/shared/hooks/useAuth';
import { getMyReports } from '@/src/features/reports/services/reportService';
import type { Report } from '@/src/shared/types';
import { ReportCard } from '@/src/features/reports/components/ReportCard';
import { ScreenContainer } from '@/src/shared/components/ui/ScreenContainer';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/src/shared/constants/theme';
import { Ionicons } from '@expo/vector-icons';

type FilterTab = 'TODOS' | 'PENDIENTES' | 'PROCESO' | 'RESUELTOS' | 'RECHAZADOS';

export default function MyReportsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>('TODOS');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReports = useCallback(async (isSilent = false) => {
    if (!user?.id) return;
    if (!isSilent) setLoading(true);

    try {
      const data = await getMyReports(user.id);
      setReports(data);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  // Aplicar filtros locales cuando cambian los reportes o la pestaña activa
  useEffect(() => {
    if (activeTab === 'TODOS') {
      setFilteredReports(reports);
    } else if (activeTab === 'PENDIENTES') {
      setFilteredReports(reports.filter((r) => r.status === 'PENDIENTE'));
    } else if (activeTab === 'PROCESO') {
      setFilteredReports(
        reports.filter(
          (r) =>
            r.status === 'EN_REVISION' ||
            r.status === 'ASIGNADO' ||
            r.status === 'EN_PROCESO'
        )
      );
    } else if (activeTab === 'RESUELTOS') {
      setFilteredReports(reports.filter((r) => r.status === 'RESUELTO'));
    } else if (activeTab === 'RECHAZADOS') {
      setFilteredReports(reports.filter((r) => r.status === 'RECHAZADO'));
    }
  }, [reports, activeTab]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadReports(true);
  }, [loadReports]);

  function handleReportPress(report: Report) {
    router.push({ pathname: '/report/[id]', params: { id: report.id } });
  }

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'TODOS', label: 'Todos' },
    { key: 'PENDIENTES', label: 'Pendientes' },
    { key: 'PROCESO', label: 'En proceso' },
    { key: 'RESUELTOS', label: 'Resueltos' },
    { key: 'RECHAZADOS', label: 'Rechazados' },
  ];

  return (
    <ScreenContainer scrollable={false}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Mis Reportes</Text>
        <Text style={styles.subtitle}>
          Monitorea el progreso de tus reportes enviados a la Alcaldía.
        </Text>

        {/* Pestañas de Filtro Horizontal */}
        <View style={styles.tabsWrapper}>
          <FlatList
            data={tabs}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContainer}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => {
              const isActive = activeTab === item.key;
              return (
                <TouchableOpacity
                  style={[styles.tab, isActive && styles.tabActive]}
                  onPress={() => setActiveTab(item.key)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Lista de Reportes */}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loaderText}>Cargando reportes...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredReports}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
            renderItem={({ item }) => (
              <ReportCard report={item} onPress={handleReportPress} />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={48} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>Sin reportes</Text>
                <Text style={styles.emptySubtitle}>
                  No tienes reportes en esta categoría por el momento.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.md,
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  tabsWrapper: {
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  tabsContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  tab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.borderLight,
    marginRight: Spacing.xs,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.textInverse,
    fontWeight: FontWeight.bold,
  },
  listContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl * 2,
    gap: Spacing.sm,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  loaderText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
    gap: Spacing.xs,
  },
  emptyTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    maxWidth: '80%',
  },
});
