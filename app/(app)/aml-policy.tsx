import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import Icon from '../components/ui/Icon';

export default function AMLPolicyScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // For web, we'll use a direct link to the PDF
      const pdfUrl = '/assets/aml_pc.pdf';
      
      if (Platform.OS === 'web') {
        // Create a temporary link element and trigger download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'NFL_AML_Policy.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        Alert.alert('Success', 'AML Policy document has been downloaded successfully.');
      } else {
        // For mobile, open the PDF in browser
        await Linking.openURL(pdfUrl);
      }
    } catch (error) {
      console.error('Download failed:', error);
      Alert.alert('Error', 'Failed to download the document. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleViewPDF = async () => {
    try {
      const pdfUrl = '/assets/aml_pc.pdf';
      await Linking.openURL(pdfUrl);
    } catch (error) {
      console.error('Failed to open PDF:', error);
      Alert.alert('Error', 'Failed to open the document. Please try again.');
    }
  };

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
              AML Policy
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
        <View style={styles.contentContainer}>
          {/* Page Title */}
          <Text style={[styles.pageTitle, { color: colors.text }]}>
            Anti-Money Laundering Policy
          </Text>
          <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
            National Finance Limited's comprehensive AML policy document
          </Text>

          {/* PDF Info Card */}
          <View style={[styles.pdfInfoCard, { backgroundColor: colors.card }]}>
            <View style={styles.pdfIconContainer}>
              <Icon icon="FileText" size={48} color={colors.primary} />
            </View>
            <View style={styles.pdfInfo}>
              <Text style={[styles.pdfTitle, { color: colors.text }]}>
                AML Policy Document
              </Text>
              <Text style={[styles.pdfDescription, { color: colors.textSecondary }]}>
                Complete Anti-Money Laundering policy and procedures for National Finance Limited
              </Text>
              <Text style={[styles.pdfSize, { color: colors.textSecondary }]}>
                PDF Document • Updated 2025
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.viewButton, { backgroundColor: colors.primary }]}
              onPress={handleViewPDF}
              activeOpacity={0.8}
            >
              <Icon icon="Eye" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>
                View Document
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.downloadButton, { backgroundColor: colors.success || '#28a745' }]}
              onPress={handleDownloadPDF}
              disabled={isDownloading}
              activeOpacity={0.8}
            >
              <Icon icon={isDownloading ? "Loader2" : "Download"} size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>
                {isDownloading ? 'Downloading...' : 'Download PDF'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Information Section */}
          <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              About AML Policy
            </Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Our Anti-Money Laundering (AML) policy outlines the comprehensive framework and procedures that National Finance Limited follows to prevent money laundering and terrorist financing activities.
            </Text>
            
            <View style={styles.infoList}>
              <View style={styles.infoListItem}>
                <Icon icon="CheckCircle" size={16} color={colors.success || '#28a745'} />
                <Text style={[styles.infoListText, { color: colors.text }]}>
                  Customer Due Diligence procedures
                </Text>
              </View>
              <View style={styles.infoListItem}>
                <Icon icon="CheckCircle" size={16} color={colors.success || '#28a745'} />
                <Text style={[styles.infoListText, { color: colors.text }]}>
                  Transaction monitoring guidelines
                </Text>
              </View>
              <View style={styles.infoListItem}>
                <Icon icon="CheckCircle" size={16} color={colors.success || '#28a745'} />
                <Text style={[styles.infoListText, { color: colors.text }]}>
                  Suspicious activity reporting
                </Text>
              </View>
              <View style={styles.infoListItem}>
                <Icon icon="CheckCircle" size={16} color={colors.success || '#28a745'} />
                <Text style={[styles.infoListText, { color: colors.text }]}>
                  Staff training requirements
                </Text>
              </View>
            </View>
          </View>

          {/* Contact Section */}
          <View style={[styles.contactSection, { backgroundColor: colors.card }]}>
            <Text style={[styles.contactTitle, { color: colors.text }]}>
              Need Assistance?
            </Text>
            <Text style={[styles.contactText, { color: colors.textSecondary }]}>
              If you have any questions about our AML policy or need assistance accessing the document, please contact our compliance team.
            </Text>
            <TouchableOpacity
              style={[styles.contactButton, { borderColor: colors.primary }]}
              onPress={() => Linking.openURL('https://www.nfl.com.bd/home/contactus')}
              activeOpacity={0.7}
            >
              <Icon icon="Phone" size={18} color={colors.primary} />
              <Text style={[styles.contactButtonText, { color: colors.primary }]}>
                Contact Support
              </Text>
            </TouchableOpacity>
          </View>
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
  contentContainer: {
    flex: 1,
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
    marginBottom: 32,
    lineHeight: 24,
  },
  pdfInfoCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pdfIconContainer: {
    marginRight: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  pdfInfo: {
    flex: 1,
  },
  pdfTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  pdfDescription: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  pdfSize: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  viewButton: {
    // Primary color applied via backgroundColor prop
  },
  downloadButton: {
    // Success color applied via backgroundColor prop
  },
  actionButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  infoSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  infoTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    marginBottom: 12,
  },
  infoText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
  infoList: {
    gap: 12,
  },
  infoListItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoListText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  contactSection: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  contactTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    marginBottom: 8,
  },
  contactText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
  },
  contactButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    marginLeft: 8,
  },
});