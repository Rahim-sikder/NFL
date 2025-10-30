import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Platform,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';

import FeatureCard from '../components/ui/FeatureCard';
import { useTheme } from '../theme/ThemeProvider';
import { useResponsive } from '../hooks/useResponsive';
import { auth } from '../../lib/auth';

// Constants
const TILES_PER_ROW = 3; // Changed to 3 columns for 2x3 layout

interface TileData {
  id: string;
  title: string;
  iconName: string;
  tint: 'orange' | 'blue' | 'green';
}

const tiles: TileData[] = [
  {
    id: '1',
    title: 'Asset Products',
    iconName: 'Briefcase',
    tint: 'orange',
  },
  {
    id: '2',
    title: 'Deposit Products',
    iconName: 'Banknote',
    tint: 'blue',
  },
  {
    id: '3',
    title: 'Rate Chart',
    iconName: 'BarChart3',
    tint: 'green',
  },
  {
    id: '4',
    title: 'EMI Calculator',
    iconName: 'Calculator',
    tint: 'orange',
  },
  {
    id: '5',
    title: 'About Us',
    iconName: 'Info',
    tint: 'blue',
  },
  {
    id: '6',
    title: 'Contact Us',
    iconName: 'Phone',
    tint: 'green',
  },
];



export default function Dashboard() {
  const { colors, space } = useTheme();
  const { contentPadding, gutterBetweenCards } = useResponsive();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // Login form state
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // MarketingBar height for proper padding
  const MARKETING_BAR_HEIGHT = 56;
  
  const handleTilePress = (title: string) => {
    console.log(`Pressed: ${title}`);
    
    // Navigate to appropriate screen
    switch (title) {
      case 'Asset Products':
        router.push('/assets');
        break;
      case 'Deposit Products':
        router.push('/deposits');
        break;
      case 'Rate Chart':
        Linking.openURL('https://www.nfl.com.bd/downloads/Rate_Chart_26052025.pdf');
        break;
      case 'EMI Calculator':
        router.push('/emi');
        break;
      case 'About Us':
        Linking.openURL('https://www.nfl.com.bd/aboutus/ataglance');
        break;
      case 'Contact Us':
        Linking.openURL('https://www.nfl.com.bd/home/contactus');
        break;
      default:
        console.log('Unknown tile pressed:', title);
    }
  };

  const handleLogin = async () => {
    console.log('Login pressed');
    
    // Basic validation
    if (!userId.trim()) {
      Alert.alert('Error', 'Please enter your User ID');
      return;
    }
    
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
    
    try {
      const result = await auth.login(userId.trim(), password);
      
      if (result.ok) {
        // Login successful - navigate to dashboard
        router.replace('/(app)/dashboard');
      } else {
        // Login failed - show error
        Alert.alert('Login Failed', result.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    }
  };

  const handleSignUp = () => {
    router.push('/register');
  };
  
  const renderTile = ({ item }: { item: TileData }) => (
    <View style={[styles.itemContainer, { margin: gutterBetweenCards / 2 }]}>
      <FeatureCard
        title={item.title}
        iconName={item.iconName}
        tint={item.tint}
        onPress={() => handleTilePress(item.title)}
      />
    </View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: MARKETING_BAR_HEIGHT + insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.loginTitle, { color: colors.textPrimary }]}>Log in</Text>
          </View>
          <View style={styles.languageToggleRight}>
            <TouchableOpacity style={[styles.toggleButton, styles.activeToggle]}>
              <Text style={styles.toggleTextActive}>বাং</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toggleButton, styles.inactiveToggle]}>
              <Text style={styles.toggleTextInactive}>Eng</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Form */}
        <View style={[styles.formCard, { backgroundColor: colors.card }]}>
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>User ID</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.border, 
                color: colors.textPrimary,
                backgroundColor: colors.surface 
              }]}
              placeholder="Type your User ID"
              placeholderTextColor={colors.textSecondary}
              value={userId}
              onChangeText={setUserId}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, { 
                  borderColor: colors.border, 
                  color: colors.textPrimary,
                  backgroundColor: colors.surface 
                }]}
                placeholder="Type your password"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, { backgroundColor: colors.primary }]}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.signupLink}
            onPress={handleSignUp}
          >
            <Text style={[styles.signupText, { color: '#FF6B35' }]}>
              New Registration
            </Text>
          </TouchableOpacity>
        </View>

        {/* Feature Cards Grid */}
        <View style={styles.featureGrid}>
          {tiles.map((item, index) => (
            <View key={item.id} style={[styles.featureCard, { margin: gutterBetweenCards / 2 }]}>
              <FeatureCard
                title={item.title}
                iconName={item.iconName}
                tint={item.tint}
                onPress={() => handleTilePress(item.title)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 8, // Reduced from 20 to 8 for much tighter spacing
    paddingTop: 13, // Added 5px more space between header and login content (was 8, now 13)
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    marginBottom: 32, // Increased spacing above login form (was 24, now 32 for +8px gap)
    marginTop: 10, // Increased from 5px to 10px to push the "Log in" text down 5px more
    position: 'relative',
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins_600SemiBold',
  },
  formCard: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 12,
    marginBottom: 32, // Optimized spacing below login form
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    fontFamily: 'Poppins_500Medium',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingRight: 50,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  loginButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  signupLink: {
    alignSelf: 'center',
  },
  signupText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around', // Changed from space-between to space-around for better distribution
    width: '100%',
    maxWidth: 400,
  },
  featureCard: {
    width: '30%', // Adjusted to 30% for better spacing in 3 columns
    marginBottom: 16, // Increased margin for better visual separation
    marginHorizontal: 2, // Added horizontal margin for consistent spacing
  },
  languageToggleRight: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    padding: 2,
    position: 'absolute',
    right: 0,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeToggle: {
    backgroundColor: '#1E40AF',
  },
  inactiveToggle: {
    backgroundColor: 'transparent',
  },
  toggleTextActive: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  toggleTextInactive: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Poppins_500Medium',
  },
});