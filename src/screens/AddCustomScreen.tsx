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

const AddCustomScreen = ({ route, navigation }: any) => {

  // const { device } = route.params;
  
  // navigation.setParams({
  //   device: { /**/ },
  // });

  return (
    <SafeAreaView style={Style.safe}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text>Add New</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const Style = StyleSheet.create({
  safe: {
    backgroundColor: "#fff",
    flexGrow: 1
  }
});

export default AddCustomScreen;
