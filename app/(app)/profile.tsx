import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme/ThemeProvider';
import Icon from '../components/ui/Icon';

interface ProfileData {
  name: string;
  customerId: string;
  phone: string;
  nid: string;
  address: string;
  fatherName: string;
  motherName: string;
  spouseName: string;
  profileImage: string | null;
}



export default function ProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  // Mock current profile data
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'John Doe',
    customerId: '1022500000204',
    phone: '+880 1712-345678',
    nid: '1234567890123',
    address: 'House 123, Road 45, Dhanmondi, Dhaka-1205',
    fatherName: 'Mohammad Rahman',
    motherName: 'Fatima Begum',
    spouseName: 'Sarah Ahmed',
    profileImage: null,
  });







  const renderField = (label: string, field: keyof ProfileData, icon: string) => {
    const value = profileData[field] as string;

    return (
      <View style={[styles.fieldContainer, { borderColor: colors.border }]}>
        <View style={styles.fieldHeader}>
          <View style={styles.fieldLabelContainer}>
            <Icon icon={icon} size={20} color={colors.textSecondary} />
            <Text style={[styles.fieldLabel, { color: colors.text }]}>{label}</Text>
          </View>
        </View>

        <View>
          <Text style={[styles.fieldValue, { color: colors.text }]}>{value}</Text>
        </View>
      </View>
    );
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
             <Text style={styles.headerTitle}>Profile</Text>
             <Text style={styles.headerSubtitle}>Manage your account information</Text>
           </View>
           
           {/* Gear Icon with Dropdown */}
           <View style={styles.gearContainer}>
             <TouchableOpacity
               style={styles.gearButton}
               onPress={() => setShowDropdown(!showDropdown)}
               activeOpacity={0.7}
             >
               <Icon icon="Settings" size={24} color="#FFFFFF" />
             </TouchableOpacity>
             
             {/* Dropdown Menu */}
             {showDropdown && (
               <View style={styles.dropdown}>
                 <TouchableOpacity
                   style={styles.dropdownItem}
                   onPress={() => {
                     console.log('Change Picture button pressed');
                     setShowDropdown(false);
                     console.log('Navigating to change-picture');
                     router.push('/(app)/change-picture');
                   }}
                   activeOpacity={0.7}
                 >
                   <Icon icon="Camera" size={20} color="#6B7280" />
                   <Text style={styles.dropdownText}>Change Picture</Text>
                 </TouchableOpacity>
                 
                 <TouchableOpacity
                   style={styles.dropdownItem}
                   onPress={() => {
                     console.log('Change Password button pressed');
                     setShowDropdown(false);
                     console.log('Navigating to change-password');
                     router.push('/(app)/change-password');
                   }}
                   activeOpacity={0.7}
                 >
                   <Icon icon="Lock" size={20} color="#6B7280" />
                   <Text style={styles.dropdownText}>Change Password</Text>
                 </TouchableOpacity>
               </View>
             )}
           </View>

        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {profileData.profileImage ? (
              <Image source={{ uri: profileData.profileImage }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary + '20' }]}>
                <Icon icon="User" size={40} color={colors.primary} />
              </View>
            )}
          </View>
          <Text style={[styles.profileName, { color: colors.text }]}>{profileData.name}</Text>
          <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>Customer ID: {profileData.customerId}</Text>
        </View>





         {/* Profile Fields */}
         <View style={styles.fieldsContainer}>
           <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
          
          {renderField('Full Name', 'name', 'User')}
           {renderField('Customer ID', 'customerId', 'CreditCard')}
           {renderField('Phone Number', 'phone', 'Phone')}
           {renderField('National ID', 'nid', 'CreditCard')}
           {renderField('Address', 'address', 'MapPin')}
          
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Family Information</Text>
          
          {renderField("Father's Name", 'fatherName', 'User')}
          {renderField("Mother's Name", 'motherName', 'User')}
          {renderField("Spouse's Name", 'spouseName', 'Heart')}
        </View>

        {/* Help Section */}
        <View style={[styles.helpCard, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
          <Icon icon="Info" size={20} color={colors.primary} />
          <View style={styles.helpContent}>
            <Text style={[styles.helpTitle, { color: colors.primary }]}>Profile Information</Text>
            <Text style={[styles.helpText, { color: colors.textSecondary }]}>
              Your profile information is displayed here for reference. To update any information, please contact NFL IT division or visit a branch office.
            </Text>
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
   headerSubtitle: {
     fontFamily: 'Poppins_400Regular',
     fontSize: 14,
     color: '#FFFFFF80',
   },
   headerEditButton: {
     padding: 8,
     borderRadius: 8,
     backgroundColor: 'rgba(255, 255, 255, 0.1)',
   },
   lockIcon: {
     marginLeft: 8,
     paddingHorizontal: 6,
     paddingVertical: 2,
     borderRadius: 4,
   },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
  },
  alertCard: {
    margin: 20,
    marginBottom: 0,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  alertContent: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  alertText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  fieldsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    marginBottom: 16,
  },
  fieldContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    marginLeft: 8,
  },

  fieldValue: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },


  helpCard: {
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  helpContent: {
    flex: 1,
    marginLeft: 12,
  },
  helpTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  helpText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  gearContainer: {
    position: 'relative',
  },
  gearButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dropdown: {
    position: 'absolute',
    top: 45,
    right: 0,
    minWidth: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 9999,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
    zIndex: 10000,
  },
  dropdownText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    marginLeft: 12,
    color: '#374151',
  },
});