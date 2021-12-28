/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { DrawerContentScrollView } from '@react-navigation/drawer';
import React from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { Text } from 'react-native-ui-lib';
import FindLanConsoles from './components/FindLanConsoles';

const DrawerCmp = ({ navigation }: any) => {

  return (
    <View style={Style.wrapper}>
      <DrawerContentScrollView style={Style.scroll} contentInsetAdjustmentBehavior="automatic">
        <FindLanConsoles {...{ navigation }} />
      </DrawerContentScrollView>
      <View style={Style.toolbar}>
        <Button onPress={()=>{
          navigation.navigate('AddCustom')
        }} title="Add Custom"/>
      </View>
    </View>
  );
};

const Style = StyleSheet.create({
  wrapper: {
    flexGrow: 1
  },
  toolbar: {
    flexGrow: 0
  },
  scroll: {
    backgroundColor: "#f0f0f0",
    flexGrow: 1
  }
});

export default DrawerCmp;
