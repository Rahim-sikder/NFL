import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import Icon from '../components/ui/Icon';

const depositServices = [
  'Balance Confirmations',
  'NOC for A/C Close',
  'Encashment Request'
];

const demoDepositAccounts = [
  { id: '1', accountNumber: 'FD001234567890', productName: 'Periodic Earner Scheme (PES)' },
  { id: '2', accountNumber: 'FD001234567891', productName: 'Earn First Deposit Scheme (EFDS)' },
  { id: '3', accountNumber: 'FD001234567892', productName: 'Monthly Deposit Scheme (MDS)' }
];

export default function DepositServicesScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [remarks, setRemarks] = useState('');
  const [selectedDepositAccount, setSelectedDepositAccount] = useState<string>('');

  const toggleService = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
    
    // Reset selected deposit account if Encashment Request is deselected
    if (service === 'Encashment Request' && selectedServices.includes(service)) {
      setSelectedDepositAccount('');
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Selected services:', selectedServices);
    console.log('Remarks:', remarks);
    
    // If Encashment Request is selected and account is chosen, navigate to encashment page
    if (selectedServices.includes('Encashment Request') && selectedDepositAccount) {
      router.push('/deposit/encash');
    } else {
      // Handle other services submission
      console.log('Submitting other services...');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: '#0f5aa6', paddingTop: insets.top + 16 }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon icon="ArrowLeft" size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Deposit Services</Text>
            <Text style={styles.headerSubtitle}>Fill out the form below</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + 100 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Services Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Deposit Services
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Select the services you need
          </Text>
        </View>

        {/* Service Options */}
        <View style={styles.servicesContainer}>
          {depositServices.map((service, index) => (
            <View key={index}>
              <TouchableOpacity
                style={[
                  styles.serviceOption,
                  { 
                    backgroundColor: colors.card,
                    borderColor: selectedServices.includes(service) ? '#0f5aa6' : colors.border
                  }
                ]}
                onPress={() => toggleService(service)}
              >
                <View style={[
                  styles.checkbox,
                  { 
                    backgroundColor: selectedServices.includes(service) ? '#0f5aa6' : 'transparent',
                    borderColor: selectedServices.includes(service) ? '#0f5aa6' : colors.border
                  }
                ]}>
                  {selectedServices.includes(service) && (
                    <Icon icon="Check" size={16} color="#ffffff" />
                  )}
                </View>
                <Text style={[styles.serviceText, { color: colors.textPrimary }]}>
                  {service}
                </Text>
              </TouchableOpacity>
              
              {/* Dropdown for Encashment Request */}
              {service === 'Encashment Request' && selectedServices.includes(service) && (
                <View style={[styles.dropdownContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.dropdownLabel, { color: colors.textPrimary }]}>
                    Select Deposit Account:
                  </Text>
                  {demoDepositAccounts.map((account) => (
                    <TouchableOpacity
                      key={account.id}
                      style={[
                        styles.dropdownOption,
                        { 
                          backgroundColor: selectedDepositAccount === account.id ? '#0f5aa6' : 'transparent',
                          borderColor: colors.border
                        }
                      ]}
                      onPress={() => setSelectedDepositAccount(account.id)}
                    >
                      <View style={[
                        styles.radioButton,
                        { 
                          backgroundColor: selectedDepositAccount === account.id ? '#0f5aa6' : 'transparent',
                          borderColor: selectedDepositAccount === account.id ? '#0f5aa6' : colors.border
                        }
                      ]}>
                        {selectedDepositAccount === account.id && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <View style={styles.accountInfo}>
                        <Text style={[
                          styles.accountNumber, 
                          { color: selectedDepositAccount === account.id ? '#ffffff' : colors.textPrimary }
                        ]}>
                          {account.accountNumber}
                        </Text>
                        <Text style={[
                          styles.productName, 
                          { color: selectedDepositAccount === account.id ? '#ffffff' : colors.textSecondary }
                        ]}>
                          {account.productName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Remarks Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Remarks
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Enter any additional remarks...
          </Text>
        </View>

        <View style={[styles.remarksContainer, { backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.remarksInput, { color: colors.textPrimary }]}
            placeholder="Enter any additional remarks..."
            placeholderTextColor={colors.textSecondary}
            value={remarks}
            onChangeText={setRemarks}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: '#0f5aa6' }]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit Request</Text>
        </TouchableOpacity>
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
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
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
    gap: 8,
    marginBottom: 16,
  },
  serviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceText: {
    fontSize: 16,
    flex: 1,
  },
  remarksContainer: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  remarksInput: {
    fontSize: 16,
    minHeight: 60,
  },
  submitButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  dropdownContainer: {
    marginTop: 8,
    marginLeft: 36,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  accountInfo: {
    flex: 1,
  },
  accountNumber: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  productName: {
    fontSize: 12,
  },
});