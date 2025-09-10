import {
    BorderRadius,
    Colors,
} from '@/constants/Colors';
import {
    Spacing,
    Typography,
} from '@/constants';
import {
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { useAppSelector } from '@/hooks';

interface DataSourceRowProps {
  name: string;
  description: string;
  icon: string;
  isConnected: boolean;
  lastSync?: string;
  dataTypes: string[];
  onToggle: (enabled: boolean) => void;
  onPress?: () => void;
  isToggleable?: boolean;
}

export function DataSourceRow({
  name,
  description,
  icon,
  isConnected,
  lastSync,
  dataTypes,
  onToggle,
  onPress,
  isToggleable = true,
}: DataSourceRowProps) {
  const { isDark } = useAppSelector((state) => state.theme);
  const colors = Colors[isDark ? 'dark' : 'light'];

  const handleToggle = (value: boolean) => {
    if (isToggleable) {
      onToggle(value);
    }
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.container,
        { backgroundColor: colors.surface },
        onPress && styles.pressable,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {name}
            </Text>
            <View style={styles.statusContainer}>
              {isConnected ? (
                <View style={[styles.statusDot, { backgroundColor: colors.healthGood }]} />
              ) : (
                <View style={[styles.statusDot, { backgroundColor: colors.healthNeutral }]} />
              )}
            </View>
          </View>
          
          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
            {description}
          </Text>
          
          {lastSync && (
            <Text style={[styles.lastSync, { color: colors.textSecondary }]}>
              Last sync: {lastSync}
            </Text>
          )}
        </View>
        
        {isToggleable && (
          <Switch
            value={isConnected}
            onValueChange={handleToggle}
            trackColor={{ false: colors.background, true: colors.primary }}
            thumbColor={colors.surface}
            disabled={!isToggleable}
          />
        )}
      </View>
      
      {dataTypes.length > 0 && (
        <View style={styles.dataTypesContainer}>
          <Text style={[styles.dataTypesLabel, { color: colors.textSecondary }]}>
            Data types:
          </Text>
          <View style={styles.dataTypesList}>
            {dataTypes.map((type, index) => (
              <View
                key={index}
                style={[styles.dataTypeChip, { backgroundColor: colors.background }]}
              >
                <Text style={[styles.dataTypeText, { color: colors.textSecondary }]}>
                  {type}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  pressable: {
    // Additional styles for pressable rows
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    marginRight: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  name: {
    ...Typography.body,
    fontWeight: '600',
    flex: 1,
  },
  statusContainer: {
    marginLeft: Spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  description: {
    ...Typography.meta,
    marginBottom: Spacing.xs,
    lineHeight: Typography.meta.lineHeight,
  },
  lastSync: {
    ...Typography.caption,
    fontStyle: 'italic',
  },
  dataTypesContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  dataTypesLabel: {
    ...Typography.caption,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  dataTypesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  dataTypeChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  dataTypeText: {
    ...Typography.caption,
    fontWeight: '500',
  },
});
