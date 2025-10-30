import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme/ThemeProvider';
import Icon from '../components/ui/Icon';

export default function CompanyOverviewScreen() {
  const router = useRouter();
  const { colors } = useTheme();

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
              Company Overview
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollContent} 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.companyName, { color: colors.primary }]}>
            National Finance Ltd. (NFL)
          </Text>
          
          <Text style={[styles.paragraph, { color: colors.text }]}>
            National Finance Ltd. (NFL) is a licensed multi-product Finance Company of Bangladesh Bank successfully operating from the year 2002. The founder Chairman of NFL was the National Professor Late Mr. Kabir Chowdhury- an eminent academician, writer, cultural and social activist. Mr. Md. Abdul Mannan Bhuiyan– a prominent and successful business person, entrepreneur, and industrialist in Bangladesh is one of the founder and Chairman of the company. NFL's Board of Directors comprising of prominent and visionary business leaders and professionals. Its shareholding comprises with High Net Worth individual and institutional sponsors from USA and Bangladesh who are well established in their respective professions with high level of business acumen and relevant experience. The diverse composition and exposure of the Board enable key strengths in terms of Operational Process, Internal Control, Regulatory Compliance, Corporate Governance and to bring international best practices into the company.
          </Text>

          <Text style={[styles.paragraph, { color: colors.text }]}>
            National Finance Ltd. offers complete array of industry-leading products and services in Retail Finance, SME Finance, Corporate Finance, Corporate Advisory Services, Savings & Deposits. Key focus areas are home finance, auto finance, cluster-based small, medium entrepreneur finance, women entrepreneur finance, green finance, sustainable finance and corporate finance related to manufacturing, export, agricultural, infrastructure, green projects, technology and innovation. We are passionate about constant improvement and innovation.
          </Text>

          <Text style={[styles.paragraph, { color: colors.text }]}>
            National Finance Ltd looks beyond deposits, balance sheets, financial status and assets to help clients achieve their financial and personal goals. NFL actively scout out promising business ventures in Bangladesh and help them come to fruition. Since the commencement of the organization to till today, it has a great track-record of financing up-and-coming Bangladeshi entrepreneurs and ventures.
          </Text>

          <Text style={[styles.paragraph, { color: colors.text }]}>
            National Finance Ltd envisions to be the leading financial institution by being a strong catalyst in creating a solid future for its customers, employees, communities and shareholders through quality, commitment, accountability, innovation and inclusion.
          </Text>
        </View>
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
  card: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  companyName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  paragraph: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
    textAlign: 'justify',
  },
});