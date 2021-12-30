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
import TcpSocket from 'react-native-tcp-socket';
import { Buffer } from 'buffer';

const PAYLOAD_NONE = 0
const PAYLOAD_RETRIEVING = 1
const PAYLOAD_SENDING = 2
const PAYLOAD_SENT = 3
const PAYLOAD_FAILED = 4

const PayloadsScreen = ({ route, navigation }: any) => {

  const { device } = route.params

  console.log(device)

  const [busy, setBusy] = useState(true)
  const [payloadState, setPayloadState] = useState(PAYLOAD_NONE)
  const [settingsVisible, setSettingsVisible] = useState(false)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [payloads, setPayloads] = useState([])
  const [payload, setPayload] = useState<any>()

  useEffect(() => {
     // Use [] as second argument in useEffect for not rendering each time
     axios.get('https://gist.githubusercontent.com/permpkin/008a8e73893b97bee905e00c62a04cd4/raw/e296cf819f1c672dfe045f0283d237b593026867/ps4-900-payloads.json')
     .then((response: any) => {
      setPayloads(response.data?.payloads)
       setBusy(false)
     })
     .catch(err => {
       console.log(err.message)
     });

     // Check payload server status
     getPayloadServerStatus()
   }, []);

  React.useLayoutEffect(() => {
     navigation.setOptions({
       headerRight: () => (
         <Icon
           name='dots-horizontal'
           onPress={() => {
            setSettingsVisible(true)
           }}
           style={Style.icon}
           size={20}
         />
       ),
     });
   }, [navigation]);

  const getPayloadServerStatus = () => {
    //:9090/status
    axios.get(`http://${device.ip}:9090/status`)
      .then((response: any) => {
        // response.data.status == "ready"
        console.log(response.data)
      })
      .catch(err => {
        console.log(err.message)
      });
  }

  //encode file as baes64

  {
    // header encoding base64
    /*
setPayloadName(result.name);
									const file = await FileSystem.readAsStringAsync(result.uri, {
										encoding: "base64",
									});

									setPayload(file);
    */
  }

  const getPayload = function(payload: any, onLoadEndCallback: Function) {
    var req = new XMLHttpRequest();
    req.responseType = "arraybuffer";
    req.open('GET', payload);
    req.send();
    req.onload = function (event) {
        if (onLoadEndCallback) onLoadEndCallback(req, event);
    };
  }

  const sendPayloadBin = (url: string, data: any, onLoadEndCallback: Function) => {
    var req = new XMLHttpRequest();
    req.open("POST", url, true);
    req.send(data);
  
    req.onload = function (event) {
        if (onLoadEndCallback) onLoadEndCallback(req, event);
    };
    req.onerror = function(event) {
      console.log("ERR", event)
    }
  }

  const sendPayload = (payload: any) => {
    setPayload(payload)
    //https://kameleonreloaded.github.io/900V4B/pl_webrte.bin
    console.log("PAYLOAD_RETRIEVING")
    setPayloadState(PAYLOAD_RETRIEVING)
    setDialogVisible(true)
    // axios.get("https://kameleonreloaded.github.io/900V4B/pl_webrte.bin", {

    // getPayload("https://kameleonreloaded.github.io/900V4B/pl_webrte.bin", (req: any) => {
    //   console.log("PAYLOAD_SENDING", req.response)

    //   if ((req.status === 200 || req.status === 304) && req.response) {

    //     setPayloadState(PAYLOAD_SENDING)

    //     sendPayloadBin(`http://10.0.0.149:9090`, req.response, function (req2: any) {
    //       if (req2.status === 200) {
    //         console.log("Payload sent !");

    //         setPayloadState(PAYLOAD_SENT)
    //         if (!dialogVisible) setDialogVisible(true)
    //       }else{
    //         setPayloadState(PAYLOAD_FAILED)
    //         return;
    //       }
    //     })
    //   } else {
    //     console.log("error_fail")
    //   }

    // })

    axios.get(payload.url, {
        responseType: 'arraybuffer'
      })
      .then((response: any) => {
        
        var binDat = Buffer.from(response.data, 'binary').toString('base64')
        
        // var binData = new Blob([response.data])

        // let formData = new FormData()
        // formData.append('name', 'pl_goldhen20b.bin')
        // formData.append('file', response.data)

        // console.log(data)

        setPayloadState(PAYLOAD_SENDING)
        console.log("SENDING")

        // sendPayloadBin("http://10.0.0.149:9090", binDat, () => {
        //   console.log("DONE.")
        // })

        // const tcp_opts = {
        //   host: "10.0.0.149",
        //   port: 9090
        // }

        // const TcpClient = TcpSocket.createConnection(tcp_opts, () => {
        //   console.log("WRITE....")
        //   // TcpClient.write(binDat, "base64");
        //   TcpClient.write(binDat);
        //   TcpClient.destroy();
        //   setPayloadState(PAYLOAD_SENT)
        //   if (!dialogVisible) setDialogVisible(true)
        //   console.log("DONE.")
        // });
        
        // // TcpClient.on("data", function (data) {
        // //   console.log("GOT_DATA", data);
        // // });
        
        // TcpClient.on("error", function (error) {
        //   console.error(error);
        //   setPayloadState(PAYLOAD_FAILED)
        //   if (!dialogVisible) setDialogVisible(true)
        // });
        
        // TcpClient.on("close", () => {
        //   console.log("CLOSED...");
        // });

        axios.post("http://10.0.0.149:9090", binDat, {
          timeout: 3000,
          headers: {
            "Content-Type": "application/octet-stream",
            "Content-Transfer-Encoding": "base64"
          }
        })
          .then((response2: any)=> {
            setPayloadState(PAYLOAD_SENT)
            if (!dialogVisible) setDialogVisible(true)
          })
          .catch((err) => {
            console.log("SEND_ERROR", err.message)
            setPayloadState(PAYLOAD_FAILED)
            if (!dialogVisible) setDialogVisible(true)
          })
      })
      .catch((err) => {
        console.log("RETRIEVE_ERROR")
        console.log(err.message)
      })
    //TODO: send payload file
    // setTimeout(() => {
    //   setPayloadState(PAYLOAD_SENT)
    //   if (!dialogVisible) setDialogVisible(true)
    // }, 1200);
  }

  return (
    <SafeAreaView style={Style.safe}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
      {busy ? (
          <ActivityIndicator />
        ) :
        payloads.map((payload: any, index) => (
          <TouchableHighlight
          underlayColor="#CCC"
            onPress={() => {
              sendPayload(payload)
            }}
          key={index}>
            <View margin-10 style={Style.row}>
              <View style={Style.rowDetail}>
                <View style={Style.rowDetailHeading}>
                  <Text text80BO>{payload.name}</Text>
                  <Text grey30>FW:{payload?.fw?.pop()}</Text>
                </View>
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
              (payloadState == PAYLOAD_RETRIEVING || payloadState == PAYLOAD_SENDING) ?
                (
                  <>
                    <ActivityIndicator />
                    <View style={Style.dialogDetail}>
                      <Text text80BO>{payloadState == PAYLOAD_RETRIEVING?"Retrieving":"Sending"} Payload...</Text>
                    </View>
                  </>
                ) :
                payloadState == PAYLOAD_FAILED ? (
                  <>
                    <Icon name="alert-circle-outline" style={{color:"red"}} size={32} />
                    <View style={Style.dialogDetail}>
                      <Text red30 text80BO>Payload "{payload?.name}" Failed.</Text>
                      <Text red30>Check display for more information.</Text>
                    </View>
                  </>
                ) :
                (
                  <>
                    <Icon name="check-circle-outline" size={32} />
                    <View style={Style.dialogDetail}>
                      <Text text80BO>Payload "{payload?.name}" Sent.</Text>
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
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: "row",
    alignItems: "stretch"
  },
  rowIconCage: {
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    width: 32,
    height: 32,
    borderRadius: 5
  },
  rowIcon: {
    color: "#fff"
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
  rowDetailHeading: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  dialogClose: {
    marginTop: 10
  },
  icon: {
    color: "#fff"
  }
});

export default PayloadsScreen;
