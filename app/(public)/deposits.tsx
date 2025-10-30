import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable, Linking, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme/ThemeProvider';
import { Icon } from '../components/ui/Icon';

// Image mapping for static imports
const imageMap = {
  'term.jpg': require('../../assets/term.jpg'),
  'Double_Triple.jpg': require('../../assets/Double_Triple.jpg'),
  'EarnF.jpg': require('../../assets/EarnF.jpg'),
  'MDS.jpg': require('../../assets/MDS.jpg'),
  'MSS.jpg': require('../../assets/MSS.jpg'),
  'monthly_quarterly.jpg': require('../../assets/monthly_quarterly.jpg'),
};

interface SubProduct {
  title: string;
  icon: string;
  url: string;
  description?: string;
  image?: string; // For section-wise image
}

interface DepositCategory {
  title: string;
  icon: string;
  image?: string; // For section-wise image
  subProducts: SubProduct[];
}

const depositCategories: DepositCategory[] = [
  {
    title: 'Regular Deposit',
    icon: 'Wallet',
    image: 'regular-deposit-image.jpg',
    subProducts: [
      {
        title: 'Term Deposit',
        icon: 'Clock',
        url: 'https://www.nfl.com.bd/individual/depositproduct/26/2',
        description: 'Minimum Deposit: Tk. 10,000\nMinimum Tenure: 3 Months\nMode of Interest Payment: At maturity',
        image: 'term.jpg'
      },
      {
        title: 'Double Money Deposit',
        icon: 'TrendingUp',
        url: 'https://www.nfl.com.bd/individual/depositproduct/33/2',
        description: 'Minimum Deposit: 1,00,000\nMode of Interest Payment: At Maturity\nTenure: 5 Years',
        image: 'Double_Triple.jpg'
      },
      {
        title: 'Triple Money Deposit',
        icon: 'Target',
        url: 'https://www.nfl.com.bd/individual/depositproduct/33/2',
        description: 'Minimum Deposit: 1,00,000\nMode of Interest Payment: At Maturity\nTenure: 10 Years',
        image: 'Double_Triple.jpg'
      },
      {
        title: 'Earn First Deposit Scheme (EFDS)',
        icon: 'DollarSign',
        url: 'https://www.nfl.com.bd/individual/depositproduct/27/2',
        description: 'Minimum Deposit: 1,00,000\nMinimum Tenure: 12 Months\nMode of Interest Payment: Upfront (Yearly Basis)',
        image: 'EarnF.jpg'
      }
    ]
  },
  {
    title: 'Money Builder',
    icon: 'Building2',
    image: 'money-builder-image.jpg',
    subProducts: [
      {
        title: 'MDS (Monthly Deposit Scheme)',
        icon: 'Calendar',
        url: 'https://www.nfl.com.bd/individual/depositproduct/31/2',
        description: 'Minimum Deposit: 1,000\nMinimum Tenure: 1 Year\nMode of Interest Payment: At maturity',
        image: 'MDS.jpg'
      },
      {
        title: 'MSS (Millionaire Savings Scheme)',
        icon: 'Award',
        url: 'https://www.nfl.com.bd/individual/depositproduct/32/2',
        description: 'Minimum Tenure: 2 Years\nMode of Interest Payment: At maturity',
        image: 'MSS.jpg'
      }
    ]
  },
  {
    title: 'Periodic Earner Scheme (PES)',
    icon: 'CalendarClock',
    image: 'pes-image.jpg',
    subProducts: [
      {
        title: 'Monthly Earner Scheme',
        icon: 'Calendar',
        url: 'https://www.nfl.com.bd/individual/depositproduct/30/2',
        description: 'Minimum Deposit: 50,000\nMinimum Tenure: 12 Months\nMode of Interest Payment: Monthly',
        image: 'monthly_quarterly.jpg'
      },
      {
        title: 'Quarterly Earner Scheme',
        icon: 'CalendarDays',
        url: 'https://www.nfl.com.bd/individual/depositproduct/30/2',
        description: 'Minimum Deposit: 50,000\nMinimum Tenure: 12 Months\nMode of Interest Payment: Quarterly',
        image: 'monthly_quarterly.jpg'
      }
    ]
  }
];

export default function DepositProducts() {
  const { colors } = useTheme();
  const router = useRouter();
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [expandedSubProducts, setExpandedSubProducts] = useState<Set<string>>(new Set());

  const toggleCategoryExpanded = (categoryIndex: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryIndex)) {
      newExpanded.delete(categoryIndex);
    } else {
      newExpanded.add(categoryIndex);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSubProductExpanded = (categoryIndex: number, subProductIndex: number) => {
    const key = `${categoryIndex}-${subProductIndex}`;
    const newExpanded = new Set(expandedSubProducts);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedSubProducts(newExpanded);
  };

  const handleReadMore = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };

  const renderSubProduct = (subProduct: SubProduct, categoryIndex: number, subProductIndex: number) => {
    const key = `${categoryIndex}-${subProductIndex}`;
    const isExpanded = expandedSubProducts.has(key);
    const hasDescription = subProduct.description !== undefined;
    
    return (
      <View key={subProductIndex} style={[styles.subProductCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.subProductContent}>
          {/* Product Image */}
          <View style={styles.productImageContainer}>
            <Image 
              source={imageMap[subProduct.image as keyof typeof imageMap]}
              style={styles.productImage}
              resizeMode="cover"
            />
          </View>
          
          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={[styles.subProductTitle, { color: colors.textPrimary }]}>
              {subProduct.title}
            </Text>
            
            {hasDescription && (
              <Text style={[styles.subProductDescription, { color: colors.textSecondary }]}>
                {subProduct.description}
              </Text>
            )}
            
            {/* See More Link */}
            <TouchableOpacity 
              style={styles.seeMoreLink}
              onPress={() => handleReadMore(subProduct.url)}
            >
              <Text style={[styles.seeMoreLinkText, { color: colors.primaryNavy2 }]}>
                See More
              </Text>
              <Icon 
                icon="ExternalLink" 
                size={14} 
                color={colors.primaryNavy2} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderDepositCategory = (category: DepositCategory, categoryIndex: number) => {
    const isExpanded = expandedCategories.has(categoryIndex);
    
    return (
      <View key={categoryIndex} style={[styles.categoryCard, { backgroundColor: colors.card, shadowColor: colors.textPrimary }]}>
        <Pressable
          style={styles.categoryHeader}
          onPress={() => toggleCategoryExpanded(categoryIndex)}
          android_ripple={{ color: colors.border }}
        >
          {/* Category Image placeholder */}
          <View style={[styles.categoryImagePlaceholder, { backgroundColor: colors.border }]}>
            <Icon 
              icon={category.icon} 
              size={24} 
              color={colors.primaryNavy2} 
            />
          </View>
          
          <View style={styles.categoryInfo}>
             <Text style={[styles.categoryTitle, { color: colors.textPrimary }]}>
               {category.title}
             </Text>
           </View>
          
          <Icon 
            icon={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size="sm" 
            color={colors.textSecondary} 
          />
        </Pressable>
        
        {isExpanded && (
           <View style={styles.subProductsContainer}>
             {category.subProducts.map((subProduct, subIndex) => 
               renderSubProduct(subProduct, categoryIndex, subIndex)
             )}
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
          Deposit Products
        </Text>
        
        {/* Deposit Categories */}
        <View style={styles.depositContainer}>
          {depositCategories.map(renderDepositCategory)}
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
  depositContainer: {
    flex: 1,
  },
  // Category styles
  categoryCard: {
    borderRadius: 10,
    marginVertical: 6,
    marginHorizontal: 20,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryHeader: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 2,
  },
  imageLabel: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  // Sub-products container
  subProductsContainer: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  // Sub-product styles
  subProductCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subProductContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  productImageContainer: {
    marginRight: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
  },
  subProductTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  subProductDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 12,
  },
  seeMoreLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  seeMoreLinkText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
    textDecorationLine: 'underline',
  },
  imagePlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  imagePlaceholderText: {
    fontSize: 10,
    color: '#6c757d',
    textAlign: 'center',
  },
  expandedContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  readMoreButton: {
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  // See More button
  seeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    marginHorizontal: 20,
  },
  seeMoreText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    marginRight: 6,
    textDecorationLine: 'underline',
  },
  // Apply button
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