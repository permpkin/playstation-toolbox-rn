/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet
} from 'react-native';
import { Text } from 'react-native-ui-lib';

const ToolboxScreen = ({ route, navigation }: any) => {

  const { device } = route.params;
  
  // navigation.setParams({
  //   device: { /**/ },
  // });

  return (
    <SafeAreaView style={Style.safe}>
      <ScrollView style={Style.scroll} contentInsetAdjustmentBehavior="automatic">
        <Text>Toolbox</Text>
        <Text>{JSON.stringify(device)}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const Style = StyleSheet.create({
  safe: {
    flexGrow: 1
  },
  scroll: {
  }
});

export default ToolboxScreen;
