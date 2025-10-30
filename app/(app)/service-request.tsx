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
import Icon from '../components/ui/Icon';

interface ServiceCategory {
  title: string;
  description: string;
  icon: string;
  route: string;
}

export default function ServiceRequestScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const serviceCategories: ServiceCategory[] = [
    {
      title: 'Loan Services',
      description: 'NOC, Certificates, and loan-related services',
      icon: 'CreditCard',
      route: '/loan-services'
    },
    {
      title: 'Deposit Services',
      description: 'Balance confirmation and deposit account services',
      icon: 'Briefcase',
      route: '/deposit-services'
    },
    {
      title: 'Other Services',
      description: 'Change personal information and complaints',
      icon: 'Settings',
      route: '/other-services'
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: '#0f5aa6' }]}>
        <View style={[styles.headerContent, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon icon="ArrowLeft" size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Services</Text>
            <Text style={styles.headerSubtitle}>Choose from our services</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Available Services Section */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Available Services
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Select a service to get started
          </Text>
        </View>

        {/* Service Categories */}
        <View style={styles.servicesContainer}>
          {serviceCategories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.serviceCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push(category.route as any)}
            >
              <View style={styles.serviceCardContent}>
                <View style={[styles.iconContainer, { backgroundColor: '#e3f2fd' }]}>
                  <Icon icon={category.icon} size={24} color="#0f5aa6" />
                </View>
                <View style={styles.serviceTextContainer}>
                  <Text style={[styles.serviceTitle, { color: colors.textPrimary }]}>
                    {category.title}
                  </Text>
                  <Text style={[styles.serviceDescription, { color: colors.textSecondary }]}>
                    {category.description}
                  </Text>
                </View>
                <Icon icon="ChevronRight" size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Need Help Section */}
        <View style={[styles.helpSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.helpContent}>
            <View style={[styles.helpIconContainer, { backgroundColor: '#e3f2fd' }]}>
              <Icon icon="Info" size={20} color="#0f5aa6" />
            </View>
            <View style={styles.helpTextContainer}>
              <Text style={[styles.helpTitle, { color: '#0f5aa6' }]}>
                Need Help?
              </Text>
              <Text style={[styles.helpDescription, { color: colors.textSecondary }]}>
                Our customer service team is available 24/7 to assist you with any questions about our services.
              </Text>
            </View>
          </View>
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
    paddingBottom: 16,
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
  headerTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'left',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    textAlign: 'left',
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  sectionContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
  },
  servicesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  serviceCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
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
  helpSection: {
    margin: 16,
    marginTop: 24,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  helpContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  helpIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  helpTextContainer: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  helpDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});