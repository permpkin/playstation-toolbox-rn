/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import { Assets } from 'react-native-ui-lib';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ToolboxScreen from './ToolboxScreen';
import AddCustomScreen from './AddCustomScreen';
import DeviceScreen from './DeviceScreen';
import SettingsScreen from './SettingsScreen';
import TrainerScreen from './TrainerScreen';
import PackagesScreen from './PackagesScreen';
import PayloadsScreen from './PayloadsScreen';
import TrainerAppletScreen from './TrainerAppletScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator();

const DeviceNavigator = ({ route, navigation }: any) => {

  const { device } = route.params

  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <TouchableHighlight style={Style.icon_button} onPress={()=>{
  //         navigation.navigate("AddCustom")
  //       }} underlayColor="#CCC">
  //         <Icon
  //           source={Assets.icons.plusSmall}
  //         />
  //       </TouchableHighlight>
  //     ),
  //   });
  // }, [navigation]);

  return (
    <Stack.Navigator initialRouteName="Device">
      <Stack.Screen
        name="Overview"
        component={DeviceScreen}
        initialParams={{device}}
        options={{
          title: 'Overview',
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Trainer"
        component={TrainerScreen}
        options={{
          headerTintColor: "#151515",
          headerStyle: {
            backgroundColor: "#fff"
          }
        }}
      />
      <Stack.Screen
        name="TrainerApplet"
        component={TrainerAppletScreen}
        options={({ route }: any) => ({
          headerTintColor: "#151515",
          presentation: "modal",
          headerShown: false,
          title: `${route.params?.title}`
        })}
      />
      <Stack.Screen
        name="Packages"
        component={PackagesScreen}
        options={{
          headerTintColor: "#151515",
          headerStyle: {
            backgroundColor: "#fff"
          }
        }}
      />
      <Stack.Screen
        name="Payloads"
        component={PayloadsScreen}
        options={{
          headerTintColor: "#151515",
          headerStyle: {
            backgroundColor: "#fff"
          }
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          presentation: "modal",
          title: 'Settings',
          headerTintColor: "#151515",
          headerStyle: {
            backgroundColor: "#fff"
          }
        }}
      />
    </Stack.Navigator>
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

export default DeviceNavigator;
