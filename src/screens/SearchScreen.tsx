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
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import { Assets, Icon } from 'react-native-ui-lib';
import FindLanConsoles from '../components/FindLanConsoles';

const SearchScreen = ({ navigation }: any) => {

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableHighlight style={Style.icon_button} onPress={()=>{
          navigation.navigate("AddCustom")
        }} underlayColor="#CCC">
          <Icon
            source={Assets.icons.plusSmall}
          />
        </TouchableHighlight>
      ),
    });
  }, [navigation]);

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

export default SearchScreen;
