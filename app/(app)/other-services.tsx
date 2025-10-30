import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import Icon from '../components/ui/Icon';

const otherServices = [
  'Change Address',
  'Change Mobile No',
  'Change Email Address'
];

export default function OtherServicesScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedService, setSelectedService] = useState('');
  const [newValue, setNewValue] = useState('');

  // Mock current values - in real app, these would come from user data
  const currentValues = {
    'Change Address': "123 Main Street, Apartment 4B, Dhaka 1000, Bangladesh",
    'Change Mobile No': "+880 1712-345678",
    'Change Email Address': "john.doe@example.com"
  };

  const validateInput = (service: string, value: string) => {
    switch (service) {
      case 'Change Address':
        return value.trim().length > 10;
      case 'Change Mobile No':
        const mobileRegex = /^(\+880|880|0)?1[3-9]\d{8}$/;
        return mobileRegex.test(value.replace(/[\s-]/g, ''));
      case 'Change Email Address':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      default:
        return false;
    }
  };

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    setNewValue(''); // Reset new value when switching services
  };

  const handleSubmit = () => {
    if (!selectedService) {
      Alert.alert('Error', 'Please select a service first');
      return;
    }

    if (!newValue.trim()) {
      Alert.alert('Error', 'Please enter a new value');
      return;
    }

    if (!validateInput(selectedService, newValue)) {
      Alert.alert('Error', 'Please enter a valid value');
      return;
    }

    if (newValue.trim() === currentValues[selectedService as keyof typeof currentValues]) {
      Alert.alert('Error', 'New value cannot be the same as current value');
      return;
    }

    Alert.alert(
      'Confirm Change',
      `Are you sure you want to change your ${selectedService.toLowerCase()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            console.log('Service change request:', {
              service: selectedService,
              currentValue: currentValues[selectedService as keyof typeof currentValues],
              newValue: newValue.trim(),
            });
            Alert.alert('Success', `${selectedService} change request submitted successfully`, [
              { 
                text: 'OK', 
                onPress: () => {
                  setSelectedService('');
                  setNewValue('');
                }
              }
            ]);
          }
        }
      ]
    );
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
            <Text style={styles.headerTitle}>Other Services</Text>
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
        {/* Service Selection */}
        <View style={styles.section}>
          <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
            Available Services
          </Text>
          <Text style={[styles.fieldSubtitle, { color: colors.textSecondary }]}>
            Select the service you need:
          </Text>
        </View>

        {/* Service Options */}
        <View style={styles.servicesContainer}>
          {otherServices.map((service, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.serviceOption,
                { 
                  backgroundColor: colors.card,
                  borderColor: selectedService === service ? '#0f5aa6' : colors.border
                }
              ]}
              onPress={() => handleServiceSelect(service)}
            >
              <Text style={[styles.serviceText, { color: colors.textPrimary }]}>
                {service}
              </Text>
              {selectedService === service && (
                <Icon icon="Check" size={20} color="#0f5aa6" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Form Section - Show when service is selected */}
        {selectedService && (
          <View style={styles.formSection}>
            {/* Current Value */}
            <View style={styles.section}>
              <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
                Current {selectedService.replace('Change ', '')}
              </Text>
              <View style={[styles.readonlyField, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.readonlyText, { color: colors.textSecondary }]}>
                  {currentValues[selectedService as keyof typeof currentValues]}
                </Text>
              </View>
            </View>

            {/* New Value */}
            <View style={styles.section}>
              <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
                New {selectedService.replace('Change ', '')} *
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  selectedService === 'Change Address' && styles.multilineInput,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }
                ]}
                value={newValue}
                onChangeText={setNewValue}
                placeholder={`Enter your new ${selectedService.replace('Change ', '').toLowerCase()}`}
                placeholderTextColor={colors.textSecondary}
                multiline={selectedService === 'Change Address'}
                numberOfLines={selectedService === 'Change Address' ? 3 : 1}
                textAlignVertical={selectedService === 'Change Address' ? 'top' : 'center'}
                keyboardType={
                  selectedService === 'Change Mobile No' ? 'phone-pad' : 
                  selectedService === 'Change Email Address' ? 'email-address' : 'default'
                }
                autoCapitalize={selectedService === 'Change Email Address' ? 'none' : 'sentences'}
                autoCorrect={selectedService !== 'Change Email Address'}
              />
              {newValue && !validateInput(selectedService, newValue) && (
                <Text style={[styles.errorText, { color: '#ff4444' }]}>
                  Please enter a valid {selectedService.replace('Change ', '').toLowerCase()}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton, 
            { 
              backgroundColor: (selectedService && newValue && validateInput(selectedService, newValue)) ? '#0f5aa6' : colors.textSecondary,
              opacity: (selectedService && newValue && validateInput(selectedService, newValue)) ? 1 : 0.5
            }
          ]}
          onPress={handleSubmit}
          disabled={!selectedService || !newValue || !validateInput(selectedService, newValue)}
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
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  fieldSubtitle: {
    fontSize: 14,
  },
  servicesContainer: {
    gap: 8,
    marginBottom: 16,
  },
  serviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  serviceText: {
    fontSize: 16,
    flex: 1,
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
  formSection: {
    marginTop: 16,
  },
  readonlyField: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 48,
    justifyContent: 'center',
  },
  readonlyText: {
    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 80,
    paddingTop: 12,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});