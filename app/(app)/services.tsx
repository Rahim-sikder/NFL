import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { auth } from '../../lib/auth';
import Icon from '../components/ui/Icon';

interface ServiceItem {
  title: string;
  icon: string;
  route: string;
  description: string;
  onPress: () => void;
}

export default function ServicesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const handleCashIn = () => {
    router.push('/cash-in');
  };

  const handleServiceRequest = () => {
    router.push('/service-request');
  };

  const services: ServiceItem[] = [
    {
      title: 'Deposit Details',
      icon: 'FileText',
      route: '/accounts?tab=deposits',
      description: 'View your deposit account details and information',
      onPress: () => {
        auth.addRecentAction({
          title: 'Viewed Deposit Details',
          subtitle: 'Account Management',
          route: '/accounts',
        });
        router.push('/accounts?tab=deposits');
      }
    },
    {
      title: 'Loans Details',
      icon: 'FileText',
      route: '/accounts?tab=loans',
      description: 'Access your loan account details and information',
      onPress: () => {
        auth.addRecentAction({
          title: 'Viewed Loan Details',
          subtitle: 'Account Management',
          route: '/accounts',
        });
        router.push('/accounts?tab=loans');
      }
    },
    {
      title: 'Cash In',
      icon: 'CreditCard',
      route: '/cash-in',
      description: 'Make deposits and cash-in transactions',
      onPress: handleCashIn
    },
    {
      title: 'Open Deposit',
      icon: 'Briefcase',
      route: '/open-deposit',
      description: 'Start a new deposit account application',
      onPress: () => {
        auth.addRecentAction({
          title: 'Started Deposit Application',
          subtitle: 'Open Deposit Form',
          route: '/open-deposit',
        });
        router.push('/open-deposit');
      }
    },
    {
      title: 'Apply for Loan',
      icon: 'Briefcase',
      route: '/apply-loan',
      description: 'Submit a new loan application',
      onPress: () => router.push('/apply-loan')
    },
    {
      title: 'Service Requests',
      icon: 'Settings',
      route: '/service-request',
      description: 'Access customer service and support requests',
      onPress: handleServiceRequest
    },
    {
      title: 'Company Overview',
      icon: 'Building',
      route: '/company-overview',
      description: 'Learn about our company and services',
      onPress: () => router.push('/company-overview')
    },
    {
      title: 'News & Events',
      icon: 'Calendar',
      route: '/news-events',
      description: 'Stay updated with latest news and events',
      onPress: () => router.push('/news-events')
    },
    {
      title: 'EMI Calculator',
      icon: 'Calculator',
      route: '/emi',
      description: 'Calculate your loan EMI and payment schedules',
      onPress: () => router.push('/emi')
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon icon="ArrowLeft" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Services
          </Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.servicesContainer}>
          {services.map((service, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.serviceItem, 
                { backgroundColor: colors.card },
                service.title === 'Cash In' && styles.cashInItem
              ]}
              onPress={service.onPress}
            >
              <View style={styles.serviceContent}>
                <View style={[
                  styles.iconContainer,
                  service.title === 'Cash In' && styles.cashInIcon
                ]}>
                  <Icon 
                    icon={service.icon} 
                    size={24} 
                    color={service.title === 'Cash In' ? '#FFFFFF' : colors.primary} 
                  />
                </View>
                <View style={styles.serviceTextContainer}>
                  <Text style={[
                    styles.serviceTitle, 
                    { color: service.title === 'Cash In' ? '#FFFFFF' : colors.textPrimary }
                  ]}>
                    {service.title}
                  </Text>
                  <Text style={[
                    styles.serviceDescription, 
                    { color: service.title === 'Cash In' ? '#FFFFFF' : colors.textSecondary }
                  ]}>
                    {service.description}
                  </Text>
                </View>
                <Icon 
                  icon="ChevronRight" 
                  size={20} 
                  color={service.title === 'Cash In' ? '#FFFFFF' : colors.textSecondary} 
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  servicesContainer: {
    padding: 16,
    gap: 12,
  },
  serviceItem: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cashInItem: {
    backgroundColor: '#0f5aa6',
  },
  serviceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cashInIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  serviceTextContainer: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});