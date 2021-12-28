/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConnectionStatusBar } from 'react-native-ui-lib';
import AddCustomScreen from './screens/AddCustomScreen';
import DeviceNavigator from './screens/DeviceNavigator';
import DrawerCmp from './Drawer';
import DashboardScreen from './screens/DashboardScreen';
import DeviceScreen from './screens/DeviceScreen';
import SettingsScreen from './screens/SettingsScreen';
import TrainerScreen from './screens/TrainerScreen';
import PackagesScreen from './screens/PackagesScreen';
import PayloadsScreen from './screens/PayloadsScreen';
import TrainerAppletScreen from './screens/TrainerAppletScreen';

const Stack = createNativeStackNavigator();

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(0, 111, 205)',
  },
};

const App = () => {

  return (
    <NavigationContainer theme={Theme}>
      <StatusBar barStyle="light-content" translucent={true} />
      <Fragment>
        <SafeAreaView style={{ flex:0, backgroundColor: '#151515' }} />
        <SafeAreaView style={{ flex:1, backgroundColor: '#f0f0f0' }}>
          <ConnectionStatusBar />
          <Stack.Navigator initialRouteName="Dashboard">
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{
                title: 'Toolbox',
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: "#151515"
                }
              }}
            />
            <Stack.Screen
              name="AddCustom"
              component={AddCustomScreen}
              options={{
                title: "Add Custom Device"
              }}
            />
            <Stack.Screen
              name="Overview"
              component={DeviceScreen}
              options={{
                title: 'Overview',
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: "#151515"
                }
              }}
            />
            <Stack.Screen
              name="Trainer"
              component={TrainerScreen}
              options={{
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: "#151515"
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
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: "#151515"
                }
              }}
            />
            <Stack.Screen
              name="Payloads"
              component={PayloadsScreen}
              options={{
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: "#151515"
                }
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                presentation: "modal",
                title: 'Settings',
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: "#151515"
                }
              }}
            />
          </Stack.Navigator>
        </SafeAreaView>
      </Fragment>
    </NavigationContainer>
  );
};

const Style = StyleSheet.create({
  unsafe: {
    backgroundColor: "red",
    flexGrow: 1
  },
  footer: {
    backgroundColor: "yellow",
    flexShrink: 1,
    flexGrow: 1
  },
  safe: {
    flexGrow: 1,
    flexShrink: 0,
  },
  scroll: {
  }
});

export default App;
