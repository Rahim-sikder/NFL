import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import Icon from '../../components/ui/Icon';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const { width: screenWidth } = Dimensions.get('window');

export default function DepositTaxCertificateScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [downloading, setDownloading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      
      // Get the asset URI
      const assetUri = require('../../../assets/tin.jpg');
      
      // Create a file name with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `deposit-tax-certificate-${timestamp}.jpg`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      // Copy the asset to documents directory
      await FileSystem.copyAsync({
        from: assetUri,
        to: fileUri,
      });
      
      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'image/jpeg',
          dialogTitle: 'Save Deposit Tax Certificate',
        });
      } else {
        Alert.alert('Success', `Deposit tax certificate saved to: ${fileUri}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download deposit tax certificate. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primaryNavy2, paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon icon="ArrowLeft" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#fff' }]}>
          Deposit Tax Certificate
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Certificate Info Card */}
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <View style={styles.infoHeader}>
            <Icon icon="FileText" size={24} color={colors.primaryNavy2} />
            <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>
              Deposit Tax Certificate
            </Text>
          </View>
          <Text style={[styles.infoDescription, { color: colors.textSecondary }]}>
            This is your official tax certificate for deposit accounts, showing tax deductions and interest earned for tax filing purposes.
          </Text>
        </View>

        {/* Certificate Image */}
        <View style={[styles.certificateCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            Certificate Document
          </Text>
          
          <View style={styles.imageContainer}>
            {imageLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primaryNavy2} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                  Loading certificate...
                </Text>
              </View>
            )}
            
            <Image
              source={require('../../../assets/tin.jpg')}
              style={styles.certificateImage}
              contentFit="contain"
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
            />
          </View>
        </View>

        {/* Download Section */}
        <View style={[styles.downloadCard, { backgroundColor: colors.card }]}>
          <View style={styles.downloadHeader}>
            <Icon icon="Download" size={24} color={colors.primaryNavy2} />
            <Text style={[styles.downloadTitle, { color: colors.textPrimary }]}>
              Download Certificate
            </Text>
          </View>
          
          <Text style={[styles.downloadDescription, { color: colors.textSecondary }]}>
            Download a copy of your deposit tax certificate for your records or tax filing purposes.
          </Text>
          
          <TouchableOpacity
            style={[
              styles.downloadButton,
              { 
                backgroundColor: colors.primaryNavy2,
                opacity: downloading ? 0.7 : 1
              }
            ]}
            onPress={handleDownload}
            disabled={downloading}
          >
            {downloading ? (
              <>
                <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={styles.downloadButtonText}>Downloading...</Text>
              </>
            ) : (
              <>
                <Icon icon="Download" size={20} color="#ffffff" />
                <Text style={styles.downloadButtonText}>Download Certificate</Text>
              </>
            )}
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  infoDescription: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  certificateCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    minHeight: 300,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    marginTop: 8,
  },
  certificateImage: {
    width: '100%',
    height: 400,
    borderRadius: 8,
  },
  downloadCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  downloadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  downloadTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginLeft: 12,
  },
  downloadDescription: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  downloadButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
});