import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import { pickImageOrDoc, FileMeta } from '../../../lib/file';

interface NomineeDetailsStepProps {
  formData: any;
  currentStepData: any;
  onNext?: (data: any) => void;
}

interface FileUploadProps {
  label: string;
  value: FileMeta | null;
  onChange: (file: FileMeta | null) => void;
  accept: 'image' | 'document';
  required?: boolean;
  error?: string;
}

const relationOptions = [
  'Father',
  'Mother',
  'Spouse',
  'Son',
  'Daughter',
  'Brother',
  'Sister',
  'Other'
];

function FileUpload({ label, value, onChange, accept, required = false, error }: FileUploadProps) {
  const handlePickFile = async () => {
    try {
      const file = await pickImageOrDoc(accept);
      onChange(file);
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to pick file. Please try again.');
    }
  };

  const handleRemoveFile = () => {
    onChange(null);
  };

  return (
    <View style={styles.fileUploadContainer}>
      <Text style={styles.fileLabel}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      
      {value ? (
        <View style={styles.filePreview}>
          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>{value.name}</Text>
            <Text style={styles.fileSize}>{value.size}</Text>
          </View>
          <TouchableOpacity onPress={handleRemoveFile} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={handlePickFile} style={[styles.uploadButton, error && styles.uploadButtonError]}>
          <Text style={styles.uploadButtonText}>Choose File</Text>
        </TouchableOpacity>
      )}
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

export default function NomineeDetailsStep({ formData, currentStepData, onNext }: NomineeDetailsStepProps) {
  const { control, watch, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'nominees'
  });

  const nominees = watch('nominees') || [];
  
  const calculateTotalPercentage = (): number => {
    return nominees.reduce((total: number, nominee: any) => {
      return total + (parseFloat(nominee?.percentage) || 0);
    }, 0);
  };

  const addNominee = () => {
    append({
      name: '',
      idDoc: null,
      relation: '',
      photo: null,
      percentage: '',
      signature: null
    });
  };

  const removeNominee = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      Alert.alert('Error', 'At least one nominee is required.');
    }
  };

  const totalPercentage = calculateTotalPercentage();
  const isPercentageValid = totalPercentage === 100;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Nominee Details</Text>
        <Text style={styles.subtitle}>Add at least one nominee. Total percentage must equal 100%.</Text>
      </View>

      <View style={styles.percentageIndicator}>
        <Text style={styles.percentageLabel}>Total Percentage:</Text>
        <Text style={[
          styles.percentageValue,
          isPercentageValid ? styles.percentageValid : styles.percentageInvalid
        ]}>
          {totalPercentage.toFixed(1)}%
        </Text>
      </View>

      {fields.map((field, index) => (
        <View key={field.id} style={styles.nomineeCard}>
          <View style={styles.nomineeHeader}>
            <Text style={styles.nomineeTitle}>Nominee {index + 1}</Text>
            {fields.length > 1 && (
              <TouchableOpacity 
                onPress={() => removeNominee(index)}
                style={styles.removeNomineeButton}
              >
                <Text style={styles.removeNomineeText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Full Name <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              name={`nominees.${index}.name`}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.textInput,
                    errors.nominees?.[index]?.name && styles.inputError
                  ]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value || ''}
                  placeholder="Enter nominee's full name"
                />
              )}
            />
            {errors.nominees?.[index]?.name && (
              <Text style={styles.errorText}>
                {errors.nominees[index].name.message as string}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Relation <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              name={`nominees.${index}.relation`}
              render={({ field: { onChange, value } }) => (
                <View style={[
                  styles.pickerContainer,
                  errors.nominees?.[index]?.relation && styles.inputError
                ]}>
                  <Picker
                    selectedValue={value || ''}
                    onValueChange={onChange}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select relation" value="" />
                    {relationOptions.map((relation) => (
                      <Picker.Item 
                        key={relation} 
                        label={relation} 
                        value={relation} 
                      />
                    ))}
                  </Picker>
                </View>
              )}
            />
            {errors.nominees?.[index]?.relation && (
              <Text style={styles.errorText}>
                {errors.nominees[index].relation.message as string}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Percentage <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              name={`nominees.${index}.percentage`}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.textInput,
                    errors.nominees?.[index]?.percentage && styles.inputError
                  ]}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9.]/g, '');
                    onChange(numericValue);
                  }}
                  value={value || ''}
                  placeholder="Enter percentage (e.g., 50)"
                  keyboardType="numeric"
                />
              )}
            />
            {errors.nominees?.[index]?.percentage && (
              <Text style={styles.errorText}>
                {errors.nominees[index].percentage.message as string}
              </Text>
            )}
          </View>

          <View style={styles.fileRow}>
            <View style={styles.fileColumn}>
              <Controller
                control={control}
                name={`nominees.${index}.idDoc`}
                render={({ field: { onChange, value } }) => (
                  <FileUpload
                    label="ID Document"
                    value={value}
                    onChange={onChange}
                    accept="document"
                    required
                    error={errors.nominees?.[index]?.idDoc?.message as string}
                  />
                )}
              />
            </View>
            
            <View style={styles.fileColumn}>
              <Controller
                control={control}
                name={`nominees.${index}.photo`}
                render={({ field: { onChange, value } }) => (
                  <FileUpload
                    label="Photo"
                    value={value}
                    onChange={onChange}
                    accept="image"
                    required
                    error={errors.nominees?.[index]?.photo?.message as string}
                  />
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name={`nominees.${index}.signature`}
            render={({ field: { onChange, value } }) => (
              <FileUpload
                label="Signature"
                value={value}
                onChange={onChange}
                accept="image"
                required
                error={errors.nominees?.[index]?.signature?.message as string}
              />
            )}
          />
        </View>
      ))}

      <TouchableOpacity onPress={addNominee} style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Another Nominee</Text>
      </TouchableOpacity>

      {/* Next Button before percentage warning */}
      <View style={styles.nextButtonContainer}>
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={() => {
            if (onNext) {
              onNext({});
            }
          }}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {!isPercentageValid && totalPercentage > 0 && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            ⚠️ Total percentage must equal 100%. Current total: {totalPercentage.toFixed(1)}%
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  percentageIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  percentageLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  percentageValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  percentageValid: {
    color: '#28a745',
  },
  percentageInvalid: {
    color: '#dc3545',
  },
  nomineeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nomineeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nomineeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  removeNomineeButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeNomineeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  required: {
    color: '#dc3545',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  fileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  fileColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  fileUploadContainer: {
    marginBottom: 12,
  },
  fileLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#007bff',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
  },
  uploadButtonError: {
    borderColor: '#dc3545',
    backgroundColor: '#fff5f5',
  },
  uploadButtonText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  removeButton: {
    backgroundColor: '#dc3545',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  warningContainer: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  warningText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
  },
  nextButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#f28a1b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 80,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});