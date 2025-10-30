import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme/ThemeProvider';
import { auth } from '../../lib/auth';
import Icon from '../components/ui/Icon';

interface RecentAction {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  route: string;
}

export default function RecentActionsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [recentActions, setRecentActions] = useState<RecentAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRecentActions();
  }, []);

  const loadRecentActions = async () => {
    try {
      setLoading(true);
      const actions = await auth.getRecentActions(20); // Get all recent actions
      setRecentActions(actions);
    } catch (error) {
      console.error('Error loading recent actions:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecentActions();
    setRefreshing(false);
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const actionTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - actionTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  };

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleActionPress = (action: RecentAction) => {
    // Add to recent actions and navigate
    auth.addRecentAction({
      title: `Viewed ${action.title}`,
      subtitle: action.subtitle,
      route: action.route,
    });
    router.push(action.route as any);
  };

  const getActionIcon = (title: string): string => {
    if (title.toLowerCase().includes('deposit')) return 'PiggyBank';
    if (title.toLowerCase().includes('loan')) return 'Banknote';
    if (title.toLowerCase().includes('emi')) return 'Calculator';
    if (title.toLowerCase().includes('interest')) return 'TrendingUp';
    if (title.toLowerCase().includes('statement')) return 'ReceiptText';
    if (title.toLowerCase().includes('certificate')) return 'FileBadge2';
    if (title.toLowerCase().includes('payment')) return 'CreditCard';
    return 'Clock';
  };

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: colors.primaryNavy2, borderBottomColor: colors.border }]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Icon icon="ArrowLeft" size="md" color="#ffffff" />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: '#ffffff' }]}>Recent Actions</Text>
      <View style={styles.headerSpacer} />
    </View>
  );

  const renderActionItem = (action: RecentAction, index: number) => (
    <TouchableOpacity
      key={action.id}
      style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => handleActionPress(action)}
    >
      <View style={styles.actionContent}>
        <View style={styles.actionLeft}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primaryNavy2 + '15' }]}>
            <Icon icon={getActionIcon(action.title)} size="sm" color={colors.primaryNavy2} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
              {action.title}
            </Text>
            <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
              {action.subtitle}
            </Text>
            <Text style={[styles.actionDate, { color: colors.textSecondary }]}>
              {formatDate(action.timestamp)}
            </Text>
          </View>
        </View>
        <View style={styles.actionRight}>
          <Text style={[styles.actionTime, { color: colors.textSecondary }]}>
            {formatTimeAgo(action.timestamp)}
          </Text>
          <Icon icon="ChevronRight" size="sm" color={colors.textSecondary} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primaryNavy2} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading recent actions...</Text>
        </View>
      );
    }

    if (recentActions.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Icon icon="Clock" size="lg" color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Recent Actions</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Your recent activities will appear here</Text>
        </View>
      );
    }

    return (
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primaryNavy2]}
            tintColor={colors.primaryNavy2}
          />
        }
      >
        <View style={styles.actionsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            All Recent Actions ({recentActions.length})
          </Text>
          {recentActions.map((action, index) => renderActionItem(action, index))}
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginTop: 8,
    textAlign: 'center',
  },
  actionsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 16,
  },
  actionCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 2,
  },
  actionDate: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
  },
  actionRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  actionTime: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 4,
  },
});