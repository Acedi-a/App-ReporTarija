// ============================================================
// HomeScreen - Pantalla de inicio del ciudadano
// Muestra saludo, stats, botón nuevo reporte y reportes recientes
// ============================================================

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/shared/hooks/useAuth';
import { Button } from '@/src/shared/components/ui/Button';
import { LoadingState } from '@/src/shared/components/ui/LoadingState';
import { HomeHeader } from '@/src/features/home/components/HomeHeader';
import { CitizenStatsCard } from '@/src/features/home/components/CitizenStatsCard';
import { RecentReportsList } from '@/src/features/home/components/RecentReportsList';
import { useHomeData } from '@/src/features/home/hooks/useHomeData';
import type { Report } from '@/src/shared/types';
import {
  Colors,
  FontSize,
  FontWeight,
  Spacing,
  BorderRadius,
  Shadows,
} from '@/src/shared/constants/theme';

export default function HomeScreen() {
  const { user, isDemo } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    recentReports,
    stats,
    totalReports,
    isLoading,
    isRefreshing,
    refresh,
  } = useHomeData(user?.id);

  function handleNewReport() {
    router.push('/(tabs)/create');
  }

  function handleReportPress(report: Report) {
    router.push({ pathname: '/report/[id]', params: { id: report.id } });
  }

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <LoadingState message="Cargando tu actividad..." />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refresh}
          tintColor={Colors.primary}
          colors={[Colors.primary]}
        />
      }
    >
      <View style={styles.content}>
        {/* Header */}
        <HomeHeader
          userName={user?.full_name || 'Ciudadano'}
          isDemo={isDemo}
        />

        {/* Botón Nuevo Reporte */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroIconContainer}>
              <Ionicons name="megaphone" size={28} color={Colors.textInverse} />
            </View>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>¿Ves un problema?</Text>
              <Text style={styles.heroDescription}>
                Reporta baches, alumbrado dañado, basura y más
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.heroButton}
            onPress={handleNewReport}
            activeOpacity={0.9}
          >
            <Ionicons name="add" size={18} color="#0D9488" />
            <Text style={styles.heroButtonText}>Nuevo reporte</Text>
          </TouchableOpacity>
        </View>

        {/* Accesos rápidos de categoría */}
        <View style={styles.categoriesRow}>
          <TouchableOpacity
            style={styles.categoryBtn}
            onPress={() => router.push({ pathname: '/(tabs)/create', params: { categoryId: '1' } })}
            activeOpacity={0.7}
          >
            <View style={[styles.categoryIconCircle, { backgroundColor: '#E6F4FE' }]}>
              <Ionicons name="warning-outline" size={24} color="#2563EB" />
            </View>
            <Text style={styles.categoryBtnText}>Baches</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryBtn}
            onPress={() => router.push({ pathname: '/(tabs)/create', params: { categoryId: '2' } })}
            activeOpacity={0.7}
          >
            <View style={[styles.categoryIconCircle, { backgroundColor: '#FFFBEB' }]}>
              <Ionicons name="bulb-outline" size={24} color="#D97706" />
            </View>
            <Text style={styles.categoryBtnText}>Alumbrado</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryBtn}
            onPress={() => router.push({ pathname: '/(tabs)/create', params: { categoryId: '3' } })}
            activeOpacity={0.7}
          >
            <View style={[styles.categoryIconCircle, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="trash-outline" size={24} color="#059669" />
            </View>
            <Text style={styles.categoryBtnText}>Basura</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryBtn}
            onPress={() => router.push({ pathname: '/(tabs)/create', params: { categoryId: '6' } })}
            activeOpacity={0.7}
          >
            <View style={[styles.categoryIconCircle, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="construct-outline" size={24} color="#4F46E5" />
            </View>
            <Text style={styles.categoryBtnText}>Obra pública</Text>
          </TouchableOpacity>
        </View>

        {/* Estadísticas */}
        <CitizenStatsCard
          stats={stats}
          onVerTodos={() => router.push('/(tabs)/reports')}
        />

        {/* Reportes recientes */}
        <RecentReportsList
          reports={recentReports}
          onReportPress={handleReportPress}
          onVerTodos={() => router.push('/(tabs)/reports')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing['4xl'],
  },
  content: {
    paddingHorizontal: Spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroCard: {
    backgroundColor: '#0D9488',
    borderRadius: 24,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  heroIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTextContainer: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: FontWeight.bold,
    color: Colors.textInverse,
  },
  heroDescription: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
    lineHeight: 18,
  },
  heroButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md - 2,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  heroButtonText: {
    color: '#0D9488',
    fontWeight: FontWeight.bold,
    fontSize: FontSize.sm,
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryBtn: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  categoryIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBtnText: {
    fontSize: 11,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
});
