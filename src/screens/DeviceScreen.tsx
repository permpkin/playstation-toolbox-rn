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
  StyleSheet,
  View
} from 'react-native';
import { Card, Text } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DeviceScreen = ({ route, navigation }: any) => {

  const { device } = route.params

  console.log("GO")

  return (
    <SafeAreaView style={Style.safe}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">

        <Card style={Style.cardInvert}>
          <View style={Style.cardIcon}>
            <Icon name="sony-playstation" size={32} />
          </View>
          <View padding-10>
            <Text text80BO white>
              {device.type}
            </Text>
            <Text text90 grey50>
              {device.mac} - {device.ip}
            </Text>
          </View>
        </Card>

        <Card style={Style.card} onPress={()=>{
          navigation.navigate("Trainer")
        }}>
          <View style={Style.cardIcon}>
            <Icon name="memory" size={32} />
          </View>
          <View padding-10>
            <Text text80BO grey10>
              Game Trainer
            </Text>
            <Text text90 grey50>
              Memory Editor/Game Trainer.
            </Text>
          </View>
        </Card>

        <Card style={Style.card} onPress={()=>{
          navigation.navigate("Packages")
        }}>
          <View style={Style.cardIcon}>
            <Icon name="package-variant" size={32} />
          </View>
          <View padding-10>
            <Text text80BO grey10>
              Package Installer
            </Text>
            <Text text90 grey50>
              Remote package installer.
            </Text>
          </View>
        </Card>

        <Card style={Style.card} onPress={()=>{
          navigation.navigate("Payloads")
        }}>
          <View style={Style.cardIcon}>
            <Icon name="iframe-braces-outline" size={32} />
          </View>
          <View padding-10>
            <Text text80BO grey10>
              Payload Sender
            </Text>
            <Text text90 grey50>
              Deploy device/application payloads.
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const Style = StyleSheet.create({
  safe: {
    flexGrow: 1
  },
  actions: {
    marginTop: 15
  },
  card: {
    padding: 15,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  cardInvert: {
    padding: 15,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#151515"
  },
  cardIcon: {
    backgroundColor: "#f0f0f0",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 38,
    height: 38,
    borderRadius: 5
  }
});

export default DeviceScreen;
