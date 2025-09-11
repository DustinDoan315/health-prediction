import {
    BorderRadius,
    Colors,
    Elevation,
    Spacing,
    Typography
} from '@/constants';
import {
    EDUCATION_ARTICLES,
    EducationArticle,
    getFeaturedArticles,
    getTipsByCategory,
    HEALTH_TIPS,
    HealthTip
} from '@/content/EducationContent';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';

import {
    Alert,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';


const CATEGORIES = [
  { key: 'all', label: 'All', icon: '🌟' },
  { key: 'nutrition', label: 'Nutrition', icon: '🥗' },
  { key: 'exercise', label: 'Exercise', icon: '🏃' },
  { key: 'mental-health', label: 'Mental Health', icon: '🧠' },
  { key: 'prevention', label: 'Prevention', icon: '🛡️' },
  { key: 'general', label: 'General', icon: '💡' },
] as const;

const TipCard = ({ tip, onPress }: { tip: HealthTip; onPress: () => void }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getDifficultyColor = (difficulty: HealthTip['difficulty']) => {
    switch (difficulty) {
      case 'easy': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.tipCard, { backgroundColor: colors.surface }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.tipHeader}>
        <Text style={styles.tipIcon}>{tip.icon}</Text>
        <View style={styles.tipInfo}>
          <Text style={[styles.tipTitle, { color: colors.text }]}>
            {tip.title}
          </Text>
          <Text style={[styles.tipDescription, { color: colors.textSecondary }]}>
            {tip.description}
          </Text>
        </View>
      </View>
      
      <View style={styles.tipFooter}>
        <View style={[
          styles.difficultyBadge,
          { backgroundColor: getDifficultyColor(tip.difficulty) }
        ]}>
          <Text style={styles.difficultyText}>
            {tip.difficulty.charAt(0).toUpperCase() + tip.difficulty.slice(1)}
          </Text>
        </View>
        {tip.actionable && (
          <Text style={styles.actionableText}>✓ Actionable</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const ArticleCard = ({ article, onPress }: { article: EducationArticle; onPress: () => void }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getCategoryColor = (category: EducationArticle['category']) => {
    switch (category) {
      case 'nutrition': return '#10B981';
      case 'exercise': return '#3B82F6';
      case 'mental-health': return '#8B5CF6';
      case 'prevention': return '#F59E0B';
      case 'general': return '#6B7280';
      default: return '#6B7280';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.articleCard, { backgroundColor: colors.surface }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.articleHeader}>
        <View style={[
          styles.categoryBadge,
          { backgroundColor: getCategoryColor(article.category) }
        ]}>
          <Text style={styles.categoryText}>
            {article.category.replace('-', ' ').toUpperCase()}
          </Text>
        </View>
        {article.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>⭐ Featured</Text>
          </View>
        )}
      </View>

      <Text style={[styles.articleTitle, { color: colors.text }]}>
        {article.title}
      </Text>
      <Text style={[styles.articleSubtitle, { color: colors.textSecondary }]}>
        {article.subtitle}
      </Text>

      <View style={styles.articleFooter}>
        <View style={styles.articleMeta}>
          <Text style={[styles.readTime, { color: colors.textSecondary }]}>
            📖 {article.readTime} min read
          </Text>
          <Text style={[styles.author, { color: colors.textSecondary }]}>
            By {article.author}
          </Text>
        </View>
        <Text style={styles.arrowText}>→</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function EducationScreen() {
  const [activeTab, setActiveTab] = useState<'tips' | 'articles'>('tips');
  const [selectedCategory, setSelectedCategory] = useState<'all' | HealthTip['category']>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const filteredTips = selectedCategory === 'all' 
    ? HEALTH_TIPS 
    : getTipsByCategory(selectedCategory);

  const featuredArticles = getFeaturedArticles();

  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  const handleTipPress = useCallback((tip: HealthTip) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      tip.title,
      tip.description,
      [{ text: 'OK' }]
    );
  }, []);

  const handleArticlePress = useCallback((article: EducationArticle) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Article Preview',
      `This would open the full article: "${article.title}"\n\n${article.content.substring(0, 200)}...`,
      [{ text: 'OK' }]
    );
  }, []);

  const handleCategorySelect = useCallback((category: typeof CATEGORIES[0]['key']) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category);
  }, []);

  return (
    <LinearGradient
      colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refreshData}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Health Education
            </Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.tabSelector}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                {
                  backgroundColor: activeTab === 'tips' ? colors.primary : colors.surface,
                  borderColor: activeTab === 'tips' ? colors.primary : colors.border,
                },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveTab('tips');
              }}
            >
              <Text style={styles.tabIcon}>💡</Text>
              <Text style={[
                styles.tabLabel,
                { color: activeTab === 'tips' ? colors.surface : colors.text }
              ]}>
                Health Tips
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                {
                  backgroundColor: activeTab === 'articles' ? colors.primary : colors.surface,
                  borderColor: activeTab === 'articles' ? colors.primary : colors.border,
                },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveTab('articles');
              }}
            >
              <Text style={styles.tabIcon}>📚</Text>
              <Text style={[
                styles.tabLabel,
                { color: activeTab === 'articles' ? colors.surface : colors.text }
              ]}>
                Articles
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'tips' && (
            <>
              <View style={styles.categoriesSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Categories
                </Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesScrollContent}
                >
                  {CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category.key}
                      style={[
                        styles.categoryButton,
                        {
                          backgroundColor: selectedCategory === category.key ? colors.primary : colors.surface,
                          borderColor: selectedCategory === category.key ? colors.primary : colors.border,
                        },
                      ]}
                      onPress={() => handleCategorySelect(category.key)}
                    >
                      <Text style={styles.categoryIcon}>{category.icon}</Text>
                      <Text style={[
                        styles.categoryLabel,
                        { color: selectedCategory === category.key ? colors.surface : colors.text }
                      ]}>
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.tipsSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Health Tips ({filteredTips.length})
                </Text>
                
                {filteredTips.map((tip) => (
                  <TipCard
                    key={tip.id}
                    tip={tip}
                    onPress={() => handleTipPress(tip)}
                  />
                ))}
              </View>
            </>
          )}

          {activeTab === 'articles' && (
            <View style={styles.articlesSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Featured Articles
              </Text>
              
              {featuredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onPress={() => handleArticlePress(article)}
                />
              ))}

              <View style={styles.allArticlesSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  All Articles
                </Text>
                
                {EDUCATION_ARTICLES.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onPress={() => handleArticlePress(article)}
                  />
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#3B82F6',
    fontWeight: '600',
  },
  headerTitle: {
    ...Typography.h1,
    fontWeight: '700',
    textAlign: 'center',
  },
  placeholder: {
    width: 44,
  },
  tabSelector: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: Spacing.xs,
  },
  tabLabel: {
    ...Typography.body,
    fontWeight: '600',
    textAlign: 'center',
  },
  categoriesSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  categoriesScrollContent: {
    paddingHorizontal: Spacing.sm,
  },
  categoryButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    marginHorizontal: Spacing.sm,
    minWidth: 80,
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: Spacing.xs,
  },
  categoryLabel: {
    ...Typography.caption,
    fontWeight: '600',
    textAlign: 'center',
  },
  tipsSection: {
    marginBottom: Spacing.xl,
  },
  tipCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Elevation.card,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
    marginTop: Spacing.xs,
  },
  tipInfo: {
    flex: 1,
  },
  tipTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  tipDescription: {
    ...Typography.caption,
    lineHeight: Typography.caption.lineHeight,
  },
  tipFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  difficultyText: {
    ...Typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 10,
  },
  actionableText: {
    ...Typography.caption,
    color: '#10B981',
    fontWeight: '600',
  },
  articlesSection: {
    marginBottom: Spacing.xl,
  },
  allArticlesSection: {
    marginTop: Spacing.xl,
  },
  articleCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Elevation.card,
  },
  articleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    ...Typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 10,
  },
  featuredBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#F59E0B',
  },
  featuredText: {
    ...Typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 10,
  },
  articleTitle: {
    ...Typography.h3,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  articleSubtitle: {
    ...Typography.body,
    lineHeight: Typography.body.lineHeight,
    marginBottom: Spacing.md,
  },
  articleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  articleMeta: {
    flex: 1,
  },
  readTime: {
    ...Typography.caption,
    marginBottom: Spacing.xs,
  },
  author: {
    ...Typography.caption,
  },
  arrowText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
});
