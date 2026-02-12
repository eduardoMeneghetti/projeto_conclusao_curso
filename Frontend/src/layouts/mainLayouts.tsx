import React from 'react';
import { View } from 'react-native';
import { GlobalButton } from '../components/GlobalButton';


export const MainLayout = ({ children }: any) => {
  return (
    <View style={{ flex: 1 }}>
      {children}
      <GlobalButton />
    </View>
  );
};
