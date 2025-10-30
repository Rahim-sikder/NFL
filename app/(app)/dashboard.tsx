import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { auth } from '../../lib/auth';
import Icon from '../components/ui/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchBar from '../components/ui/SearchBar';
import LanguageToggle from '../components/ui/LanguageToggle';
import MarqueeText from '../components/layout/MarqueeText';

interface RecentAction {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  route: string;
}

interface AccountService {
  title: string;
  icon: string;
  route: string;
}

interface Tool {
  title: string;
  icon: string;
  route: string;
}

const loanServices: AccountService[] = [
  { title: 'Repayment Schedule', icon: 'Calendar', route: '/loan/repayment' },
  { title: 'Account Statement', icon: 'ReceiptText', route: '/loan/statement' },
  { title: 'Tax Certificate', icon: 'FileBadge2', route: '/loan/tax-certificate' },
  { title: 'Overdue Count', icon: 'Info', route: '/loan/overdue' },
];

const depositServices: AccountService[] = [
  { title: 'Account Statement', icon: 'ReceiptText', route: '/deposit/statement' },
  { title: 'Tax Certificate', icon: 'FileBadge2', route: '/deposit/tax-certificate' },
  { title: 'Encashment Request', icon: 'Banknote', route: '/deposit/encash' },
];

const { width } = Dimensions.get('window');

const carouselImages = [
  require('../../assets/img1.jpg'),
  require('../../assets/img2.jpg'),
  require('../../assets/img3.jpg'),
];

// Helper function to format timestamp
const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const actionTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - actionTime.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days}d ago`;
  }
};

export default function Dashboard() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMoreServices, setShowMoreServices] = useState(false);
  const carouselRef = useRef<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % carouselImages.length
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Fetch current user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await auth.getCurrentUserId();
        if (userId) {
          setCurrentUser(userId);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);



  const handleRecentActionPress = (action: RecentAction) => {
    // Add to recent actions and navigate
    auth.addRecentAction({
      title: `Viewed ${action.title}`,
      subtitle: action.subtitle,
      route: action.route,
    });
    router.push(action.route as any);
  };

  const handleServicePress = (service: AccountService) => {
    // Add to recent actions and navigate
    auth.addRecentAction({
      title: `Accessed ${service.title}`,
      subtitle: 'Account Service',
      route: service.route,
    });
    router.push(service.route as any);
  };

  const handleToolPress = (tool: Tool) => {
    // Add to recent actions and navigate
    auth.addRecentAction({
      title: `Used ${tool.title}`,
      subtitle: 'Tool',
      route: tool.route,
    });
    router.push(tool.route as any);
  };

  const handleProfilePress = () => {
    router.push('/profile' as any);
  };

  const handleServiceRequest = () => {
    router.push('/service-request');
  };

  const handleCashIn = () => {
    router.push('/cash-in');
  };

  const toggleMoreServices = () => {
    setShowMoreServices(!showMoreServices);
  };

  const handleLogoutPress = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await auth.logout();
            router.replace('/(public)');
          },
        },
      ]
    );
  };

  const handleSeeMore = () => {
    // Show expanded menu with Company Overview, News & Events, EMI Calculator
    Alert.alert(
      'More Services',
      'Choose a service',
      [
        { text: 'Company Overview', onPress: () => router.push('/company-overview') },
        { text: 'News & Events', onPress: () => router.push('/news-events') },
        { text: 'EMI Calculator', onPress: () => router.push('/emi') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };



  return (
    <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top }]}>
      {/* Logout Alert */}
      {/* Sticky Header */}
      <View 
        style={[
          styles.header,
          {
            backgroundColor: '#ffffff',
            paddingTop: insets.top + 16,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.headerContent}>
          {/* Left: User Profile Section */}
          <View style={styles.userSection}>
            <View style={[styles.userAvatar, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
                <Icon icon="User" size={20} color="#000000" />
              </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: '#000000' }]}>
              {currentUser || 'User'}
            </Text>
            <Text style={[styles.welcomeText, { color: '#00000080' }]}>
              Welcome to Your Dashboard
            </Text>
            </View>
          </View>
          
          {/* Right: Language Toggle */}
          <LanguageToggle />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollContent}
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingBottom: insets.bottom + 80 } // Space for bottom nav
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <SearchBar 
            placeholder="Search services..."
            onSearch={(query) => {
              // Handle search functionality here
              console.log('Search query:', query);
            }}
          />
        </View>

        {/* Section 1: Advertisement Carousel */}
        <View style={styles.section}>
          <View style={styles.carouselContainer}>
            <Image
              source={carouselImages[currentImageIndex]}
              style={styles.carouselImage}
              resizeMode="contain"
            />
            <View style={styles.carouselIndicators}>
              {carouselImages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    {
                      backgroundColor: index === currentImageIndex 
                        ? colors.primaryNavy2 
                        : colors.textSecondary + '40'
                    }
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        {/* All Services Section */}
        <View style={styles.section}>
          <View style={styles.allServicesHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              All Services
            </Text>
            <TouchableOpacity onPress={toggleMoreServices} style={styles.seeMoreButton}>
              <Text style={[styles.seeMoreText, { color: colors.primaryNavy2 }]}>
                See More
              </Text>
              <Icon 
                icon={showMoreServices ? "ChevronUp" : "ChevronDown"} 
                size={16} 
                color={colors.primaryNavy2} 
              />
            </TouchableOpacity>
          </View>

          {/* Row 1: Account Services */}
          <View style={styles.servicesRow}>
            <TouchableOpacity
              style={[styles.serviceCard, { backgroundColor: colors.card }]}
              onPress={() => {
                auth.addRecentAction({
                  title: 'Viewed Deposit Details',
                  subtitle: 'Account Management',
                  route: '/accounts',
                });
                router.push('/accounts?tab=deposits');
              }}
            >
              <Icon icon="FileText" size={24} color={colors.textSecondary} />
              <Text style={[styles.serviceCardTitle, { color: colors.textPrimary }]}>
                Deposit Details
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.serviceCard, { backgroundColor: colors.card }]}
              onPress={() => {
                auth.addRecentAction({
                  title: 'Viewed Loan Details',
                  subtitle: 'Account Management',
                  route: '/accounts',
                });
                router.push('/accounts?tab=loans');
              }}
            >
              <Icon icon="FileText" size={24} color={colors.textSecondary} />
              <Text style={[styles.serviceCardTitle, { color: colors.textPrimary }]}>
                Loans Details
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.serviceCard, styles.cashInCard]}
              onPress={handleCashIn}
            >
              <Icon icon="CreditCard" size={24} color="#FFFFFF" />
              <Text style={[styles.serviceCardTitle, { color: '#FFFFFF' }]}>
                Cash In
              </Text>
            </TouchableOpacity>
          </View>

          {/* Row 2: Main Services */}
          <View style={styles.servicesRow}>
            <TouchableOpacity
              style={[styles.serviceCard, { backgroundColor: colors.card }]}
              onPress={() => {
                auth.addRecentAction({
                  title: 'Started Deposit Application',
                  subtitle: 'Open Deposit Form',
                  route: '/open-deposit',
                });
                router.push('/open-deposit');
              }}
            >
              <Icon icon="Briefcase" size={24} color={colors.textSecondary} />
              <Text style={[styles.serviceCardTitle, { color: colors.textPrimary }]}>
                Open Deposit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.serviceCard, { backgroundColor: colors.card }]}
              onPress={() => router.push('/apply-loan')}
            >
              <Icon icon="Briefcase" size={24} color={colors.textSecondary} />
              <Text style={[styles.serviceCardTitle, { color: colors.textPrimary }]}>
                Apply for Loan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.serviceCard, { backgroundColor: colors.card }]}
              onPress={handleServiceRequest}
            >
              <Icon icon="Settings" size={24} color={colors.textSecondary} />
              <Text style={[styles.serviceCardTitle, { color: colors.textPrimary }]}>
                Service Requests
              </Text>
            </TouchableOpacity>
          </View>

          {/* Row 3: Expandable Services */}
          {showMoreServices && (
            <View style={styles.servicesRow}>
              <TouchableOpacity
                style={[styles.serviceCard, { backgroundColor: colors.card }]}
                onPress={() => router.push('/company-overview')}
              >
                <Icon icon="Building" size={24} color={colors.textSecondary} />
                <Text style={[styles.serviceCardTitle, { color: colors.textPrimary }]}>
                  Company Overview
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.serviceCard, { backgroundColor: colors.card }]}
                onPress={() => router.push('/news-events')}
              >
                <Icon icon="Calendar" size={24} color={colors.textSecondary} />
                <Text style={[styles.serviceCardTitle, { color: colors.textPrimary }]}>
                  News & Events
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.serviceCard, { backgroundColor: colors.card }]}
                onPress={() => router.push('/emi')}
              >
                <Icon icon="Calculator" size={24} color={colors.textSecondary} />
                <Text style={[styles.serviceCardTitle, { color: colors.textPrimary }]}>
                  EMI Calculator
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Running Text Above Footer */}
        <MarqueeText 
          text="National Finance Ltd. offers complete array of industry-leading products and services in Retail Finance, SME Finance, Corporate Finance, Corporate Advisory Services, Savings & Deposits. Key focus areas are home finance, auto finance, cluster-based small, medium entrepreneur finance, women entrepreneur finance, green finance, sustainable finance and corporate finance related to manufacturing, export, agricultural, infrastructure, green projects, technology and innovation. We are passionate about constant improvement and innovation."
          speed={30}
          backgroundColor="transparent"
          textColor="#0f5aa6"
          height={40}
        />

      </ScrollView>
    </View>
  );
}

const handleSeeMore = () => {
  // Show expanded menu with Company Overview, News & Events, EMI Calculator
  Alert.alert(
    'More Services',
    'Choose a service',
    [
      { text: 'Company Overview', onPress: () => router.push('/company-overview') },
      { text: 'News & Events', onPress: () => router.push('/news-events') },
      { text: 'EMI Calculator', onPress: () => router.push('/emi') },
      { text: 'Cancel', style: 'cancel' }
    ]
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginBottom: 2,
  },
  welcomeText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchSection: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  carouselContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  carouselImage: {
    width: '100%',
    height: 180,
  },
  carouselIndicators: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  // All Services Section Styles
  allServicesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeMoreText: {
    fontSize: 14,
    fontWeight: '500',
  },
  servicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  serviceCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  serviceCardTitle: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
  cashInCard: {
    backgroundColor: '#1976D2',
  },
  expandableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  expandableTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
  expandableContent: {
    paddingLeft: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  serviceTitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    marginLeft: 12,
  },
  accountButton: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#ec9c00',
    width: '50%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  companyInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  companyInfoButton: {
    width: '30%',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  companyInfoText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 12,
  },
  directorCarouselContainer: {
    height: 85,
    marginVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    overflow: 'hidden',
  },
  directorCarousel: {
    flex: 1,
  },
  directorCarouselContent: {
    alignItems: 'center',
  },
  directorCard: {
    width: Dimensions.get('window').width * 0.85 - 54,
    height: 85,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    marginHorizontal: 8,
    borderRadius: 8,
  },
  directorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  directorInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 4,
  },
  directorTitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 10,
    marginBottom: 2,
  },
  directorName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    marginBottom: 4,
  },
  directorComment: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    lineHeight: 12,
    flexWrap: 'wrap',
    textAlign: 'left',
    numberOfLines: 0,
  },
  footerContainer: {
    marginTop: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  servicesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  servicesButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});