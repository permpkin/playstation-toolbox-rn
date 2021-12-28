/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, Card, Text } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FindLanConsoles = ({ navigation }: any) => {

  const [devices, setDevices] = useState([
    {
      type: "Playstation 4",
      variant: "Pro",
      hen: "GoldHen2.0b",
      mac: "00:00:00:00:00:00",
      ip: "10.0.0.254"
    }
  ])

  return (
    <View>
      <Text margin-5 text90BO>{`Found ${devices.length} Device(s)`}</Text>
      {devices.map(device => (
        <Card
          key={device.mac}
          flex
          style={Style.card}
          onPress={() => navigation.navigate('Overview', {
            device: device
          })}
        >
          <View style={Style.cardIcon}>
            <Icon name="sony-playstation" size={32} />
          </View>
          <View>
            <Text text80BO grey10>
              {`${device.type} (${device.variant})`}
            </Text>
            <Text text80BO grey10>
              {`${device.hen}`}
            </Text>
            <Text text90 grey50>
              {`${device.mac}`}
            </Text>
            <Text text90 grey50>
              {`IP: ${device.ip}`}
            </Text>
          </View>
        </Card>
      ))}
    </View>
  );
};

const Style = StyleSheet.create({
  card: {
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5
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

export default FindLanConsoles;
