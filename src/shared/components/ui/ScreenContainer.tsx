// ============================================================
// ScreenContainer - Layout base para pantallas
// Envuelve contenido con SafeArea + ScrollView + padding
// ============================================================

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../../constants/theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  padded?: boolean;
  backgroundColor?: string;
}

export function ScreenContainer({
  children,
  scrollable = true,
  style,
  contentStyle,
  padded = true,
  backgroundColor = Colors.background,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor,
    paddingTop: insets.top,
  };

  const innerStyle: ViewStyle = {
    flex: 1,
    ...(padded && {
      paddingHorizontal: Spacing.xl,
    }),
    ...contentStyle,
  };

  const content = scrollable ? (
    <ScrollView
      style={innerStyle}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[innerStyle, styles.staticContent]}>{children}</View>
  );

  return (
    <KeyboardAvoidingView
      style={[containerStyle, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {content}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing['3xl'],
  },
  staticContent: {
    flex: 1,
  },
});
