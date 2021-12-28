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
import { Button, Card, Image, Switch, Text, View } from 'react-native-ui-lib';
import axios, { AxiosResponse } from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import WebRTE from '../services/WebRTE';
import Utils from '../services/Utils';
import bigInt from 'big-integer'

interface ModSet {
  type: string;
  name: string;
  memory: Array<string>;
  value: boolean;
}

interface AppSet {
  id: string;
  name: string;
  process: string;
  version: string;
  credits: Array<string>;
  mods: Array<ModSet>;
}

const TrainerAppletScreen = ({ route, navigation }: any) => {

  const { apps } = route.params;
  const initialApp = apps[0] // TODO: add catch here

  const [busy, setBusy] = useState(true)
  const [status, setStatus] = useState("Fetching Instructions")
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(true)
  const [failure, setFailure] = useState(false)
  const [stateAll, setStateAll] = useState(false)
  const [app, setApp] = useState<AppSet>()
  const [mods, setMods] = useState<Array<ModSet>>([])

  // const device_ip = "10.0.0.254" // TODO: passthrough ip
  // const baseUrl = "http://" + device_ip + ":771/";
  // const WEB_RTE = WebRTE(baseUrl)

  useEffect(() => {

    // Use [] as second argument in useEffect for not rendering each time
    axios.get(`https://github.com/KameleonReloaded/PS4OfflineTrainer/raw/main/${initialApp?.url}`)
      .then((response: AxiosResponse) => {

        //
        // messageType: 14 ("X connected their companion app"), 15 disconnected
        // 79: Joined the party (alt sound)
        /*
        
    {
      "credits": [
        "Weysincha"
      ],
      "name": "inFAMOUS™ Second Son",
      "process": "eboot.bin",
      "version": "01.07"
      "id": "CUSA00004",
      "mods": [
        {
          "memory": [Array
          ],
          "name": "Infinite Skillpoints / Shards",
          "type": "checkbox"
        },
        {
          "memory": [Array
          ],
          "name": "Max Level True Hero",
          "type": "button"
        },
      ],
    }

    TODO: add "recheck app" after app resume
        */
        setApp(response.data)
        setMods(response.data?.mods)
        setBusy(false)
        connectDevice()
      });
  }, []);

  const connectDevice = () => {

    setStatus("Connecting to Device")
    // if has master code (in cusa json)
    // var master = data.master;
    // if(master !== undefined && master.memory.length !== undefined && v1 != null)
    // {
    //     HandleMasterCode(master, mods);
    // }

    //TODO: longpoll GetProcessInfo(pid), check for 404 after success connection

    if (!initialApp?.pid) {

      // TODO: check matching processes etc, suggested nearest match.

    } else {

      WebRTE.Notify(222, `Trainer Attached (${initialApp?.pid})`)
        .then((response: AxiosResponse) => setConnected(true))
        .catch((e) => {
          setStatus("Connection Failed")
          setConnected(false)
          setFailure(true)
        })

    }
  }

  const FindBase = (ProcessMaps: any) => {
    var base: any = null;
    ProcessMaps.some((entry: any) => {
        if(entry.name === "executable" && entry.prot === 5)
        {
            base = entry;
            return true;
        }
        return false;
    });
    if(base != null)
    {
        return base.start;
    }
    return null;
  }

  const GetNthEntry = (ProcessMaps: any, n: number) => {
    if(ProcessMaps != null)
    {
        return ProcessMaps[n].start;
    }
    return null;
  }

  const WriteMemory = (ProcessMaps: any, memory: any, activated: boolean) => {
    var base: any = null;
    if(memory.section === undefined || memory.section === 0)
    {
        base = bigInt(FindBase(ProcessMaps));
    }
    else
    {
        base = bigInt(GetNthEntry(ProcessMaps, memory.section));
    }
    var offset = bigInt(memory.offset, 16);
    var address = (base.add(offset));

    var hex = (activated) ? memory.on : memory.off;

    var data = Utils.HexStringToBase64(hex);
    
    var length = hex.length / 2;
    
    return WebRTE.WriteMemory(initialApp?.pid, address.toString(10), data, length);
  }

  const sendInstruction = (mod: any) => {
    
    var memory = mod.memory

    if (memory.length == undefined) {
      WebRTE.Notify(222, 'Config Error!');
      return
    }

    WebRTE.GetProcessMaps(initialApp?.pid)
      .then((response: AxiosResponse) => {
        
        const ProcessMaps = response?.data

        WebRTE.PauseProcess(initialApp?.pid)
          .then(async () => {

            await Promise.all(memory.map(async (modAddress: any) => {

              await WriteMemory(ProcessMaps, modAddress, mod?.value)

            }))

            await WebRTE.ResumeProcess(initialApp?.pid);

            switch (mod.type) {
              case 'checkbox':
                if (mod?.value)
                {
                    WebRTE.Notify(222, mod?.name + ' |Enabled ');
                } else {
                    WebRTE.Notify(222, mod?.name + ' |Disabled ');
                }
              break;
              case 'button':
                WebRTE.Notify(222, mod?.name + ' |Activated ');
              break;
            }

          });
    })
    .catch((err) => {
      
      console.log(err.message)

    })
  }

  const toggleRow = (index: number) => {
    setMods(mods.map((mod, i) => {
      if (i === index) {
        mod.value = !mod.value
        sendInstruction(mod)
      }
      return mod
    }))
  }

  const activateRow = (mod: ModSet) => {
    mod.value = true
    sendInstruction(mod)
  }

  const toggleAll = () => {
    setStateAll(!stateAll)
    setMods(mods.map((mod, i) => {
      if (mod.value != stateAll) {
        mod.value = stateAll
        sendInstruction(mod)
      }
      return mod
    }))
  }

  return (
    <SafeAreaView style={Style.safe}>
      <Card style={Style.headerCard}>
        <Image
          style={Style.imageOverlay}
          source={{uri: `https://github.com/KameleonReloaded/PS4OfflineTrainer/blob/main/${initialApp?.title}.jpg?raw=true`}}
        />
        {
          connected ? (
            <View style={Style.cardRowIconReady}>
              <Icon name="check-circle" size={32} style={Style.cardRowIconReadyIcon} />
            </View>
          ) : !failure ? (
            <View style={Style.cardRowIcon}>
              <ActivityIndicator />
            </View>
          ) : (
            <View style={Style.cardRowIconError}>
              <Icon name="close-network" size={32} style={Style.cardRowIconReadyIcon} />
            </View>
          )
        }
        <View padding-10>
          <Text text80BO white>
            {initialApp?.name}
          </Text>
          <Text text90 grey50>
            {!connected ? status : 'Connected'}
          </Text>
        </View>
      </Card>
      { /*connected ? (
        <View style={Style.connected}>
          <Text style={Style.connectedText}>Ready</Text>
        </View>
        ) : connecting ? (
            <View style={Style.connecting}>
              <ActivityIndicator />
              <Text style={Style.connectingText}>Connecting</Text>
            </View>
          ) : (
            <View style={Style.notConnected}>
              <Text style={Style.connectedText}>Not Connected</Text>
            </View> 
        )*/ }
      <ScrollView style={Style.scroll} contentInsetAdjustmentBehavior="automatic">
        {busy ? (
          <View padding-10>
            <ActivityIndicator />
          </View>
        ) :
          mods.map((mod: any, index) => (
            <TouchableHighlight margin-10 key={index} onPress={()=>{
              toggleRow(index)
            }}>
              <View style={Style.row}>
                <View style={Style.rowToggle}>
                  {(mod.type == "checkbox") ? (
                    <Switch disabled={!connected} onValueChange={value => {
                      toggleRow(index)
                    }} offColor="#999" disabledColor="#CCC" onColor="#09b709" value={mod.value} />
                  ) : null}
                  {(mod.type == "button") ? (
                    <TouchableHighlight disabled={!connected} style={Style.buttonTrigger} onPress={() => activateRow(mod)}>
                      <Icon name="circle" color="#fff" size={24} />
                    </TouchableHighlight>
                  ) : null}
                </View>
                <View style={Style.rowDetail}>
                  <Text text80BO>{mod.name}</Text>
                  {(mod.type == "button") ? (
                    <Text grey30>Tap to activate</Text>
                  ) : (
                    <Text grey30>Tap to toggle</Text>
                  )}
                </View>
              </View>
            </TouchableHighlight>
          ))
        }
      </ScrollView>
    </SafeAreaView>
  );
};

const Style = StyleSheet.create({
  scroll: {
    flex: 1
  },
  safe: {
    flexGrow: 1
  },
  button: {
    backgroundColor: "#151515"
  },
  buttonTrigger: {
    width: 40,
    backgroundColor: "#999",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
    color: "#fff"
  },
  cardRowIcon: {
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 5
  },
  cardRowIconReady: {
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    backgroundColor: "#09b709",
    borderRadius: 5
  },
  cardRowIconError: {
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    backgroundColor: "#f50059",
    borderRadius: 5
  },
  cardRowIconReadyIcon: {
    color: "#fff"
  },
  headerCard: {
    backgroundColor: "#333",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
    borderRadius: 0
  },
  imageOverlay: {
    backgroundColor: "#333",
    position: "absolute",
    flexGrow: 1,
    resizeMode: 'cover',
    opacity: 0.25,
    right: 0,
    left: 0,
    top: 0,
    bottom: 0
  },
  card: {
    padding: 15,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10
  },
  row: {
    backgroundColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "stretch",
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
    padding: 10
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
  notConnected: {
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red"
  },
  connecting: {
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#151515",
    flexDirection: "row"
  },
  connected: {
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green"
  },
  connectingText: {
    marginLeft: 10,
    fontWeight: "700",
    color: "#fff"
  },
  connectedText: {
    fontWeight: "700",
    color: "#fff"
  }
});

export default TrainerAppletScreen;
