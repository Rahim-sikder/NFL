import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import Icon from '../ui/Icon';

interface TabItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

const tabs: TabItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: 'Home',
    route: '/dashboard',
  },
  {
    id: 'accounts',
    label: 'Accounts',
    icon: 'Folder',
    route: '/accounts',
  },
  {
    id: 'payments',
    label: 'Services',
    icon: 'PaymentIcon',
    route: '/services',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'User',
    route: '/profile',
  },
];

export default function BottomNav() {
  const { colors } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const handleTabPress = (tab: TabItem) => {
    if (pathname !== tab.route) {
      router.push(tab.route as any);
    }
  };

  const isActiveTab = (route: string) => {
    if (route === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(route);
  };

  return (
    <View 
      style={[
        styles.container,
        {
          backgroundColor: '#0f5aa6',
          borderTopColor: colors.border,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => {
          const isActive = isActiveTab(tab.route);
          
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => handleTabPress(tab)}
              activeOpacity={0.7}
            >
              <Icon 
                icon={tab.icon} 
                size={24} 
                color={isActive ? '#ffffff' : '#ffffff80'} 
              />
              <Text 
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? '#ffffff' : '#ffffff80',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingTop: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});

export { BottomNav };