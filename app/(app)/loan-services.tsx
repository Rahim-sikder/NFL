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

const loanServices = [
  'NOC for A/C Close',
  'No Overdue Certificate',
  'Present Classification Status',
  'Balance Confirmations'
];

export default function LoanServicesScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [remarks, setRemarks] = useState('');

  const toggleService = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Selected services:', selectedServices);
    console.log('Remarks:', remarks);
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
            <Text style={styles.headerTitle}>Loan Services</Text>
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
          { paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Services Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Loan Services
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Select the services you need
          </Text>
        </View>

        {/* Service Options */}
        <View style={styles.servicesContainer}>
          {loanServices.map((service, index) => (
            <TouchableOpacity
              key={index}
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
});