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
  StatusBar,
  StyleSheet
} from 'react-native';
import { Text } from 'react-native-ui-lib';
import FindLanConsoles from '../components/FindLanConsoles';

const DashboardScreen = ({ navigation }: any) => {

  return (
    <SafeAreaView style={Style.safe}>
      <ScrollView style={Style.scroll} contentInsetAdjustmentBehavior="automatic">
        <FindLanConsoles {...{ navigation }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const Style = StyleSheet.create({
  icon_button: {
    padding: 5,
    borderRadius: 5
  },
  safe: {
    flexGrow: 1
  },
  scroll: {
  }
});

export default DashboardScreen;
