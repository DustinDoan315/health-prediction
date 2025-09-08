import {
    Spacing,
    Typography,
} from '@/constants';
import {
    BorderRadius,
    Colors,
} from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';


interface ConfidenceBadgeProps {
  confidence: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high';
  onPress?: () => void;
  showDetails?: boolean;
}

export function ConfidenceBadge({
  confidence,
  riskLevel,
  onPress,
  showDetails = false,
}: ConfidenceBadgeProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'low':
        return colors.healthGood;
      case 'medium':
        return colors.healthWatch;
      case 'high':
        return colors.healthAttention;
      default:
        return colors.healthNeutral;
    }
  };

  const getRiskLabel = () => {
    switch (riskLevel) {
      case 'low':
        return 'Low risk';
      case 'medium':
        return 'Medium risk';
      case 'high':
        return 'High risk';
      default:
        return 'Unknown risk';
    }
  };

  const getConfidenceLabel = () => {
    if (confidence >= 80) return 'High confidence';
    if (confidence >= 60) return 'Medium confidence';
    return 'Low confidence';
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.container,
        { borderColor: getRiskColor() },
        onPress && styles.pressable,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={[styles.riskLabel, { color: getRiskColor() }]}>
            {getRiskLabel()}
          </Text>
          <Text style={[styles.confidenceText, { color: colors.textSecondary }]}>
            {confidence}% confidence
          </Text>
        </View>
        
        {showDetails && (
          <View style={styles.details}>
            <Text style={[styles.confidenceLabel, { color: colors.textSecondary }]}>
              {getConfidenceLabel()}
            </Text>
            <Text style={[styles.disclaimer, { color: colors.textSecondary }]}>
              AI assistance only — not medical advice
            </Text>
          </View>
        )}
      </View>
      
      {onPress && (
        <View style={styles.expandIcon}>
          <Text style={[styles.expandText, { color: colors.textSecondary }]}>
            {showDetails ? '−' : '+'}
          </Text>
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  pressable: {
    // Additional styles for pressable badges
  },
  content: {
    flex: 1,
  },
  mainInfo: {
    marginBottom: Spacing.xs,
  },
  riskLabel: {
    ...Typography.body,
    fontWeight: '700',
    marginBottom: 2,
  },
  confidenceText: {
    ...Typography.meta,
    fontWeight: '500',
  },
  details: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  confidenceLabel: {
    ...Typography.caption,
    marginBottom: Spacing.xs,
  },
  disclaimer: {
    ...Typography.caption,
    fontStyle: 'italic',
  },
  expandIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  expandText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
