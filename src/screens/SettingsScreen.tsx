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

const SettingsScreen = () => {

  return (
    <SafeAreaView style={Style.safe}>
      <ScrollView style={Style.scroll} contentInsetAdjustmentBehavior="automatic">
        <Text>Settings</Text>
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

export default SettingsScreen;
