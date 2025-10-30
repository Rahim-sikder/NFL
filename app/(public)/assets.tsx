import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme/ThemeProvider';
import { Icon } from '../components/ui/Icon';

interface MenuItem {
  title: string;
  icon: string;
  url: string;
  description: string;
}

const menuItems: MenuItem[] = [
  {
    title: 'Home Loan',
    icon: 'Home',
    url: 'https://www.nfl.com.bd/individual/loanproduct/26/2',
    description: 'National Finance Ltd. is a full-fledged Non-Banking Financial Institution (NBFI), provides home loan for- 1. Purchasing Apartment/Residential house/Commercial Space 2. Construction of Building/Apartment 3. Renovation of Apartment/Building'
  },
  {
    title: 'Auto Loan',
    icon: 'Car',
    url: 'https://www.nfl.com.bd/individual/loanproduct/36/2',
    description: 'National Finance Ltd., a full-fledged Non-Banking Financial Institution (NBFI), provides Auto Loan to purchase brand new/reconditioned vehicles to the individuals.'
  },
  {
    title: 'Personal Loan',
    icon: 'User',
    url: 'https://www.nfl.com.bd/individual/loanproduct/28/2',
    description: 'National Finance Ltd., a full-fledged Non-Banking Financial Institution (NBFI), provides Personal Loan for different personal needs of a client.'
  }
];

export default function AssetProducts() {
  const { colors } = useTheme();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const handleReadMore = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };

  const renderMenuItem = (item: MenuItem, index: number) => {
    const isExpanded = expandedItems.has(index);
    
    return (
      <View key={index} style={[styles.menuCard, { backgroundColor: colors.card, shadowColor: colors.textPrimary }]}>
        <Pressable
          style={styles.menuHeader}
          onPress={() => toggleExpanded(index)}
          android_ripple={{ color: colors.border }}
        >
          <Icon 
            icon={item.icon} 
            size="sm" 
            color={colors.primaryNavy2} 
          />
          <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>
            {item.title}
          </Text>
          <Icon 
            icon={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size="sm" 
            color={colors.textSecondary} 
          />
        </Pressable>
        
        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
              {item.description}
            </Text>
            <TouchableOpacity 
              style={styles.readMoreButton}
              onPress={() => handleReadMore(item.url)}
            >
              <Text style={[styles.readMoreText, { color: colors.primaryNavy2 }]}>
                Read More
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Page Title */}
        <Text style={[styles.pageTitle, { color: colors.primaryNavy2 }]}>
          Asset Products
        </Text>
        
        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map(renderMenuItem)}
        </View>
        
        {/* Apply Now Button */}
        <View style={styles.applyButtonContainer}>
          <TouchableOpacity 
            style={[styles.applyButton, { backgroundColor: colors.primaryNavy2 }]}
            onPress={() => router.push('/')}
          >
            <Text style={[styles.applyButtonText, { color: '#FFFFFF' }]}>
              Apply Now
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  pageTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    marginVertical: 16,
    marginHorizontal: 20,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 80, // Space for footer CTA
  },
  menuCard: {
    borderRadius: 10,
    marginVertical: 6,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuLabel: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    flex: 1,
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  readMoreButton: {
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  applyButtonContainer: {
    marginTop: 30,
    marginHorizontal: 35,
    marginBottom: 10,
  },
  applyButton: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
});