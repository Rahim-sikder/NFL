import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import Icon from '../components/ui/Icon';

interface NewsItem {
  id: string;
  title: string;
  date: string;
  image: any;
  content: string;
}

const newsData: NewsItem[] = [
  {
    id: '1',
    title: 'National Finance Limited held 23rd AGM',
    date: '17th August, 2025',
    image: require('../../assets/n1.jpg'),
    content: 'The 23rd Annual General Meeting (AGM) of National Finance Limited was held on August 17, 2025 at a local hotel. All the shareholders of the company were present. Foreign shareholders were virtually present. Chairman of the Company, Fahima Mannan presided over the meeting and among the directors Abu Shamsul Kabir, Dr. Fariha Nazah Kabir, Dr. Nabiha S. Kabir, Independent Director Yaweer Saeed and Managing Director of the company Irteza Ahmed Khan were present. The event was conducted by Company Secretary Abu Zakir Ahmed.',
  },
  {
    id: '2',
    title: 'National Finance and Tropical Homes Sign MoU for Loan Services',
    date: '13th May, 2025',
    image: require('../../assets/n2.jpg'),
    content: 'National Finance and Tropical Homes Limited have entered into a strategic partnership through the signing of a Memorandum of Understanding (MoU) on May 13, 2025. The collaboration aims to provide special loan facilities and priority services to customers investing in Tropical Homes\' real estate projects.\n\nAs part of the agreement, clients purchasing properties from Tropical Homes will now enjoy preferential loan rates and expedited service from National Finance, making the home financing process smoother and more accessible. Attending the signing ceremony on behalf of National Finance were Mr. Irteza Ahmed Khan, Managing Director; Mr. Emon Ahmed Khan, Vice President and Head of Branch; Mr. Md. Motahar Hossen, Manager – Home Loan; and Mr. Goutam Chandra Ghosh, Assistant Manager – Business.\n\nRepresenting Tropical Homes Limited were Mr. M Hoque Faishal, Director – Sales & Marketing (CRD, CSD & Land Acquisition); Mr. Mohammad Rakib Hossain, General Manager – Sales; and Mr. Md. Masum Reza, Deputy Manager – Sales. Leaders from both organizations expressed confidence that this partnership will create new opportunities for homebuyers by easing access to tailored financial solutions and enhancing the overall customer experience.',
  },
];

export default function NewsEventsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleCardPress = async () => {
    const url = 'https://www.nfl.com.bd/home/news/2025';
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };

  const renderNewsCard = (item: NewsItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.newsCard, { backgroundColor: colors.card }]}
      onPress={handleCardPress}
      activeOpacity={0.7}
    >
      <Image source={item.image} style={styles.newsImage} />
      <View style={styles.newsContent}>
        <Text style={[styles.newsTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        <Text style={[styles.newsDate, { color: colors.textSecondary }]}>
          {item.date}
        </Text>
        <Text style={[styles.newsText, { color: colors.text }]} numberOfLines={4}>
          {item.content}
        </Text>
        <View style={styles.readMoreContainer}>
          <Text style={[styles.readMoreText, { color: colors.primary }]}>
            Read More
          </Text>
          <Icon icon="ExternalLink" size={16} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primaryNavy2 }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={() => router.push('/dashboard')}
            activeOpacity={0.7}
          >
            <Icon icon="ArrowLeft" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              News & Events
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollContent} 
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingBottom: insets.bottom + 80 } // Space for bottom nav
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.pageTitle, { color: colors.text }]}>
          Latest News & Updates
        </Text>
        <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
          Stay informed about National Finance Limited's latest developments and partnerships
        </Text>
        
        {newsData.map(renderNewsCard)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    paddingTop: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBackButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  pageTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    marginBottom: 8,
    textAlign: 'center',
  },
  pageSubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  newsCard: {
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  newsImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  newsContent: {
    padding: 20,
  },
  newsTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    marginBottom: 8,
    lineHeight: 28,
  },
  newsDate: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    marginBottom: 12,
  },
  newsText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  readMoreText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    marginRight: 6,
  },
});