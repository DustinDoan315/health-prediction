import { Colors, Spacing, Typography } from '@/constants';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


interface OptimizedCardProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function OptimizedCard({ title, subtitle, children }: OptimizedCardProps) {
  const handlePress = () => {
    console.log('Card pressed:', title);
  };

  const cardStyle = {
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: 12,
    margin: Spacing.md,
  };

  return (
    <View style={[styles.container, cardStyle]} onTouchEnd={handlePress}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    ...Typography.h3,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.md,
  },
});
