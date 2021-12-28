/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import { Button, Dialog, Text, View } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios, {Axios, AxiosResponse} from 'axios';

const PAYLOAD_NONE = 0
const PAYLOAD_SENDING = 1
const PAYLOAD_SENT = 2

const PayloadsScreen = ({ navigation }: any) => {

  const [busy, setBusy] = useState(true)
  const [payloadState, setPayloadState] = useState(PAYLOAD_NONE)
  const [settingsVisible, setSettingsVisible] = useState(false)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [payloads, setPayloads] = useState([])

  useEffect(() => {
     // Use [] as second argument in useEffect for not rendering each time
     axios.get('https://gist.githubusercontent.com/permpkin/008a8e73893b97bee905e00c62a04cd4/raw/0d8daa0765dd4dbc4e67a68c791cc2372a80069d/ps4-900-payloads.json')
     .then((response: any) => {
      setPayloads(response.data?.payloads)
       setBusy(false)
     })
     .catch(err => {
       console.log(err.message)
     });
   }, []);

  React.useLayoutEffect(() => {
     navigation.setOptions({
       headerRight: () => (
         <Icon
           name='dots-horizontal'
           onPress={() => {
            setSettingsVisible(true)
           }}
           size={20}
         />
       ),
     });
   }, [navigation]);

  const sendPayload = (payload: any) => {
    setPayloadState(PAYLOAD_SENDING)
    setDialogVisible(true)
    //TODO: send payload file
    setTimeout(() => {
      setPayloadState(PAYLOAD_SENT)
      if (!dialogVisible) setDialogVisible(true)
    }, 1200);
  }

  return (
    <SafeAreaView style={Style.safe}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
      {busy ? (
          <ActivityIndicator />
        ) :
        payloads.map((payload: any, index) => (
          <TouchableHighlight onPress={() => {
            sendPayload(payload)
          }} key={index}>
            <View margin-10 style={Style.row}>
              <View style={Style.rowIcon}></View>
              <View style={Style.rowDetail}>
                <Text text80BO>{payload.name}</Text>
                <Text grey10>{payload?.description}</Text>
              </View>
            </View>
          </TouchableHighlight>
        ))
      }
      </ScrollView>
      <Dialog
        useSafeArea
        bottom={true}
        visible={dialogVisible}
        onDialogDismissed={() => setDialogVisible(false)}
        ignoreBackgroundPress={false}
      >
        <View style={Style.dialog} margin-10>
          <View style={Style.dialogContent}>
            {
              payloadState == PAYLOAD_SENDING ?
                (
                  <>
                    <ActivityIndicator />
                    <View style={Style.dialogDetail}>
                      <Text text80BO>Sending Payload...</Text>
                    </View>
                  </>
                ) :
                (
                  <>
                    <Icon name="check-circle-outline" size={32} />
                    <View style={Style.dialogDetail}>
                      <Text text80BO>Payload "PKG_NAME" Sent.</Text>
                      <Text grey10>Check display for confirmation.</Text>
                    </View>
                  </>
                )
            }
          </View>
          {payloadState == PAYLOAD_SENT ? (
            <Button onPress={() => setDialogVisible(false)} style={Style.dialogClose} label="Done" link />
          ) : null}
        </View>
      </Dialog>

      <Dialog
        useSafeArea
        bottom={true}
        visible={settingsVisible}
        onDialogDismissed={() => setSettingsVisible(false)}
        ignoreBackgroundPress={false}
      >
        <View style={Style.dialog} margin-10>
          <View style={Style.dialogContent}>
            <View>
              <Button style={Style.dialogLink} onPress={() => console.log("press")} label="Edit/Add Source" blue30 link />
              <Button style={Style.dialogLink} onPress={() => console.log("press")} label="Refresh List(s)" blue30 link />
              <Button style={Style.dialogLink} onPress={() => console.log("press")} label="Cancel" red30 link />
            </View>
          </View>
        </View>
      </Dialog>
    </SafeAreaView>
  );
};

const Style = StyleSheet.create({
  safe: {
    flexGrow: 1
  },
  dialog: {
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 10,
    borderRadius: 10
  },
  dialogLink: {
    padding: 5
  },
  dialogContent: {
    flexDirection: "row",
    alignItems: "center"
  },
  dialogDetail: {
    marginLeft: 10
  },
  button: {
    backgroundColor: "#151515"
  },
  card: {
    padding: 15,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
    paddingBottom: 10
  },
  rowIcon: {
    backgroundColor: "#000",
    marginRight: 10,
    width: 38,
    borderRadius: 5
  },
  rowLast: {
    alignItems: "center"
  },
  rowToggle: {
    width: 50,
    marginRight: 10,
    flexGrow: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  rowDetail: {
    flexGrow: 1,
    justifyContent: "center"
  },
  dialogClose: {
    marginTop: 10
  }
});

export default PayloadsScreen;
