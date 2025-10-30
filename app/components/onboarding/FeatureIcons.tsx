import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FeatureIcon: React.FC<{ children: React.ReactNode; caption: string }> = ({ children, caption }) => {
  return (
    <View style={styles.featureItem}>
      <View style={styles.iconContainer}>
        {children}
      </View>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
};

const OpenAccountIcon: React.FC = () => (
  <View style={{
    width: 60,
    height: 60,
    backgroundColor: '#1976D2',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <View style={{
      width: 30,
      height: 30,
      backgroundColor: '#fff',
      borderRadius: 4,
    }} />
  </View>
);

const OpenDPSIcon: React.FC = () => (
  <View style={{
    width: 60,
    height: 60,
    backgroundColor: '#FF9800',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <View style={{
      width: 30,
      height: 30,
      backgroundColor: '#fff',
      borderRadius: 15,
    }} />
  </View>
);

const ApplyLoanIcon: React.FC = () => (
  <View style={{
    width: 60,
    height: 60,
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <View style={{
      width: 30,
      height: 20,
      backgroundColor: '#fff',
      borderRadius: 2,
    }} />
  </View>
);

export const FeatureIcons: React.FC = () => {
  return (
    <View style={styles.container}>
      <FeatureIcon caption="Easy to open account">
        <OpenAccountIcon />
      </FeatureIcon>
      
      <FeatureIcon caption="Open DPS from anywhere">
        <OpenDPSIcon />
      </FeatureIcon>
      
      <FeatureIcon caption="Apply for loans from anywhere">
        <ApplyLoanIcon />
      </FeatureIcon>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  iconContainer: {
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
});