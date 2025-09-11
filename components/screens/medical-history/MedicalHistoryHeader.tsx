import {
  BorderRadius,
  Colors,
  Elevation,
  Spacing,
  Typography,
} from '@/constants';
import { useAppSelector } from '@/hooks';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';


type FilterType = 'all' | 'low' | 'medium' | 'high';

interface MedicalHistoryHeaderProps {
  totalPredictions: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onAddPrediction: () => void;
}

export const MedicalHistoryHeader = memo(function MedicalHistoryHeader({
  totalPredictions,
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  onAddPrediction,
}: MedicalHistoryHeaderProps) {
  const { isDark } = useAppSelector(state => state.theme);
  const colors = Colors[isDark ? 'dark' : 'light'];

  const renderFilterButton = useCallback((filter: FilterType, label: string) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterButton,
        {
          backgroundColor: selectedFilter === filter ? colors.primary : colors.surface,
          borderColor: colors.primary,
        }
      ]}
      onPress={() => onFilterChange(filter)}
    >
      <Text
        style={[
          styles.filterButtonText,
          {
            color: selectedFilter === filter ? colors.surface : colors.primary,
          }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  ), [selectedFilter, colors, onFilterChange]);

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.headerGradient}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Health History</Text>
            <Text style={styles.headerSubtitle}>
              {totalPredictions} assessments completed
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.surface }]}
            onPress={onAddPrediction}
          >
            <Text style={[styles.addButtonText, { color: colors.primary }]}>
              +
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={[styles.searchInputContainer, { backgroundColor: colors.surface }]}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search recommendations..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={onSearchChange}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => onSearchChange('')}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {renderFilterButton('all', 'All')}
          {renderFilterButton('low', 'Low Risk')}
          {renderFilterButton('medium', 'Medium Risk')}
          {renderFilterButton('high', 'High Risk')}
        </ScrollView>
      </View>
    </LinearGradient>
  );
});

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 62,
    marginBottom: Spacing.lg,
  },
  header: {
    marginHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    ...Typography.h1,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  addButton: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...Elevation.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: '700',
  },
  searchContainer: {
    marginBottom: Spacing.lg,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    ...Elevation.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: Spacing.md,
    opacity: 0.7,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    paddingVertical: 0,
    fontWeight: '500',
  },
  clearIcon: {
    fontSize: 18,
    opacity: 0.7,
    padding: Spacing.sm,
  },
  filtersContainer: {
    marginBottom: Spacing.md,
  },
  filtersContent: {
    paddingRight: Spacing.lg,
  },
  filterButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    marginRight: Spacing.md,
  },
  filterButtonText: {
    ...Typography.caption,
    fontWeight: '700',
    fontSize: 13,
  },
});
