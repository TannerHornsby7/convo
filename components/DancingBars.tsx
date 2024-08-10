import React from 'react';
import { View, XStack } from 'tamagui';

const DancingBars: React.FC = () => {
  return (
    <View className="loading" h={25} w={25}>
      <XStack className="bars">
        <View className='bar'/>
        <View className='bar'/>
        <View className='bar'/>
      </XStack>
    </View>
  );
};

export default DancingBars;