
import { CitizenStatsCard } from '@/src/features/home/components/CitizenStatsCard';
import { HeroNewReportCard } from '@/src/features/home/components/HeroNewReportCard';
import { HomeHeader } from '@/src/features/home/components/HomeHeader';
import { HomeMapTab } from '@/src/features/home/components/HomeMapTab';
import { QuickCategoryRow } from '@/src/features/home/components/QuickCategoryRow';
import { RecentReportsList } from '@/src/features/home/components/RecentReportsList';
import type { ViewMode } from '@/src/features/home/components/ViewModeSelector';
import { ViewModeSelector } from '@/src/features/home/components/ViewModeSelector';
import { useHomeData } from '@/src/features/home/hooks/useHomeData';
import { LoadingState } from '@/src/shared/components/ui/LoadingState';
import { Colors, Spacing } from '@/src/shared/constants/theme';
import { useAuth } from '@/src/shared/hooks/useAuth';
import type { Report } from '@/src/shared/types';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user, isDemo } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    recentReports,
    stats,
    isLoading,
    isRefreshing,
    refresh,
  } = useHomeData(user?.id);

  const [viewMode, setViewMode] = useState<ViewMode>('list');

  function handleNewReport() {
    router.push('/(tabs)/create');
  }

  function handleCategoryPress(categoryId: string) {
    router.push({ pathname: '/(tabs)/create', params: { categoryId } });
  }

  function handleReportPress(report: Report) {
    router.push({ pathname: '/report/[id]', params: { id: report.id } });
  }

  function navigateToAllReports() {
    router.push('/(tabs)/reports');
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
        <HomeHeader userName={user?.full_name || 'Ciudadano'} isDemo={isDemo} />
        <HeroNewReportCard onNewReport={handleNewReport} />
        <QuickCategoryRow onCategoryPress={handleCategoryPress} />
        <CitizenStatsCard stats={stats} onVerTodos={navigateToAllReports} />
        <ViewModeSelector viewMode={viewMode} onViewModeChange={setViewMode} />

        {viewMode === 'list' ? (
          <RecentReportsList
            reports={recentReports}
            onReportPress={handleReportPress}
            onVerTodos={navigateToAllReports}
          />
        ) : (
          <HomeMapTab reports={recentReports} />
        )}
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
});
