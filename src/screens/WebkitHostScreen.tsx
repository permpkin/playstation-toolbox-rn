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
import { Button, Card, Dialog, Text, View } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios, { AxiosResponse } from 'axios';
import { NetworkInfo } from 'react-native-network-info';
// import StaticServer from 'react-native-static-server';
// import RNFS from 'react-native-fs';
// import { DeviceEventEmitter } from 'react-native';
import httpBridge from 'react-native-http-bridge';
// import { HTTPServer, Router }  from 'http-server-react-native';


const WebkitHostScreen = ({ navigation }: any) => {

  const [settingsVisible, setSettingsVisible] = useState(false)
  const [hostEnabled, setHostEnabled] = useState(false)
  const [deviceIp, setDeviceIp] = useState<string>("0.0.0.0")
  const [uptime, setUptime] = useState<string>("0m")
  const [sfrate, setSFRate] = useState<string>("0/0")

  // const router = new Router('/');

  // router
  //   .get((data: any) => {
  //     return { status: 200, data: { some: 'data' } };
  //   })

  // const server = new HTTPServer({ port: 8080 });
  
  // server.registerRouter(router);
  // server
  //   .start()
  //   .then((url: any) => console.log(`Server running on ${url}`))
  //   .catch((err: any) => console.error(err))

// console.log(Server)

// var httpBridge = require('react-native-http-bridge');


// const hostCallback = (request: any) => {

//   // you can use request.url, request.type and request.postData here
//   if (request.type === "GET" && request.url.split("/")[1] === "users") {
    
//     Server.respond(request.requestId, 200, "application/json", "{\"message\": \"OK\"}");
  
//   } else {
    
//     Server.respond(request.requestId, 400, "application/json", "{\"message\": \"Bad Request\"}");

//   }

// }
// DeviceEventEmitter.addListener('httpServerResponseReceived', hostCallback);
// DeviceEventEmitter.removeListener('httpServerResponseReceived', callback);

  // RNFS.mkdir(RNFS.TemporaryDirectoryPath + 'webkit/')
  //   .then((result) => {
  //     console.log('result', result)
  //   })
  //   .catch((err) => {
  //       console.warn('err', err)
  //   })

  // RNFS.readDir(RNFS.DocumentDirectoryPath + 'webkit/') // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
  //   .then((result) => {
  //     console.log('GOT RESULT', result);
  //   })

  // axios.get("https://karo218.ir/index.html", {
  //   //
  // })
  //   .then((response: AxiosResponse) => {
      
  //     console.log("response?.data", response?.data)

  //     var path = RNFS.DocumentDirectoryPath + '/webkit/index.html';

  //     RNFS.writeFile(path, response?.data, 'utf8')
  //       .then((success) => {
  //         console.log('FILE WRITTEN!');
  //       })
  //       .catch((err) => {
  //         console.log(err.message);
  //       });

  //   })
  
  // path where files will be served from (index.html here)
  // let path = RNFS.DocumentDirectoryPath + 'assets/webkit/';

  // const host = new StaticServer(1234, path, { keepAlive : true, localOnly : false });

  // // Start the server
  // host.start().then((url: string) => {
  //   console.log("Serving at URL", url);
  // });

  // useEffect(() => {
     
  //   //
  //  }, []);

  React.useLayoutEffect(() => {

     // get current device (phone) ip to server from
     NetworkInfo.getIPAddress().then(ipAddress => setDeviceIp(`${ipAddress}`))

   }, [navigation]);

   const toggleHost = () => {
     setHostEnabled(!hostEnabled)
     if (hostEnabled) {
      // kill hosting
      httpBridge.stop()
     } else {
       // start hosting
       httpBridge.start(1234, 'exploit_host_service', (request: any) => {

        // you can use request.url, request.type and request.postData here
        if (request.type === "GET" && request.url.split("/")[1] === "users") {
          httpBridge.respond(request.requestId, 200, "application/json", "{\"message\": \"OK\"}");
        } else {
          httpBridge.respond(request.requestId, 400, "application/json", "{\"message\": \"Bad Request\"}");
        }
      
      });
     }
   }

  return (
    <SafeAreaView style={Style.safe}>
      <Card style={Style.cardHeader}>
        <View style={Style.cardIcon}>
          <Icon name="web" size={32} />
        </View>
        <View flexG padding-10>
          <Text text80BO grey10>
            {deviceIp}
          </Text>
          <Text text90 grey40>
            Uptime: {uptime}
          </Text>
          <Text text90 grey40>
            S/F Rate: {sfrate}
          </Text>
        </View>
      </Card>
      {
        !hostEnabled ? (
          <Card style={Style.cardButtonOff} onPress={toggleHost}>
            <View row center flexG padding-10>
              <Text white marginR-5 text70BO>
                Enable Exploit Host
              </Text>
              <Icon name="server-network-off" style={Style.cardButtonIcon} size={24} />
            </View>
          </Card>
        ) : (
          <View>
            <Card style={Style.cardButtonOn} onPress={toggleHost}>
              <View row center flexG padding-10>
                <Text white marginR-5 text70BO>
                  Disable Exploit Host
                </Text>
                <Icon name="server-network" style={Style.cardButtonIcon} size={24} />
              </View>
            </Card>
            <View margin-10>
              <Text text80BO>Connected Clients</Text>
              <Text grey10>No clients.</Text>
            </View>
          </View>
        )
      }
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
  cardHeader: {
    flexDirection: "row",
    padding: 15,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10
  },
  cardIcon: {
    backgroundColor: "#f0f0f0",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 76,
    height: 76,
    borderRadius: 5
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
  cardButtonOn: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#05a948"
  },
  cardButtonOff: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#757575"
  },
  cardButtonIcon: {
    color: "white"
  },
  rowDetail: {
    flexGrow: 1,
    justifyContent: "center"
  },
  dialogClose: {
    marginTop: 10
  },
  icon: {
    color: "#fff"
  }
});

export default WebkitHostScreen;
