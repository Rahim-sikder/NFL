import React from 'react';
import { View } from 'react-native';

export const FinanceIcon: React.FC = () => {
  return (
    <View style={{ 
      alignItems: 'center', 
      justifyContent: 'center',
      width: 200,
      height: 200,
      backgroundColor: '#1976D2',
      borderRadius: 100,
    }}>
      <View style={{
        width: 80,
        height: 80,
        backgroundColor: '#fff',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={{
          width: 40,
          height: 40,
          backgroundColor: '#1976D2',
          borderRadius: 8,
        }} />
      </View>
    </View>
  );
};

export const SecurityIcon: React.FC = () => {
  return (
    <View style={{ 
      alignItems: 'center', 
      justifyContent: 'center',
      width: 200,
      height: 200,
      backgroundColor: '#4CAF50',
      borderRadius: 100,
    }}>
      <View style={{
        width: 80,
        height: 80,
        backgroundColor: '#fff',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={{
          width: 40,
          height: 50,
          backgroundColor: '#4CAF50',
          borderRadius: 20,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }} />
      </View>
    </View>
  );
};