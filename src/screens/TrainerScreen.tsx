/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  View,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { Image, Card, Button, Text, ActionSheet, TextField } from 'react-native-ui-lib';
import axios, { AxiosResponse } from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import WEB_RTE from '../services/WebRTE';

const TrainerScreen = ({ route, navigation }: any) => {

  const { device } = route.params;

  const [matching, setMatching] = useState(false)
  const [activeApp, setActiveApp] = useState<any>(null)
  const [busy, setBusy] = useState(true)
  const [apps, setApps] = useState([])
  const [app, setApp] = useState<any>(null)
  const [search, setSearch] = useState("")
  var processes: any = []

  const WebRTE = new WEB_RTE(`http://${device.ip}`)

  useEffect(() => {
   // Use [] as second argument in useEffect for not rendering each time
   axios.get('https://github.com/KameleonReloaded/PS4OfflineTrainer/raw/main/list.json')
   .then((response: any) => {
     /*
"games": [
       {
           "name": "KILLZONE™ SHADOW FALL",
           "title": "CUSA00002",
           "version": "01.00",
           "url": "CUSA00002_01.00.json"
       },
     */

    var newData = response.data?.games
    const dataFiltered: any = []
    newData.map((item: any, index: number) => {

      const itemMatch = dataFiltered.findIndex((row: any) => (
        row.name == item.name
      ))
      // exists in filtered array
      if (itemMatch >= 0) {
        dataFiltered[itemMatch].titles.push(item.title)
        dataFiltered[itemMatch].versions.push(item)
      } else {
        let newItem = item
        newItem.titles = [item.title]
        newItem.versions = [item]
        dataFiltered.push(newItem)
      }
    });

    //
    //FIXME:
    // setActiveApp(newData[10])
    //
    //
    // setMatching(false) // finished matching.
    setApps(dataFiltered.sort(function(a: any, b: any) {
      var textA = a.name.toUpperCase();
      var textB = b.name.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    }))
    setBusy(false)
    // scanActiveApp()
   });
   }, []);

   /*
[
  {"name": "A Plague Tale: Innocence", "title": "CUSA10812", "url": "CUSA10812_1.06.json", "version": "1.06"}]
   */

  const scanActiveApp = async () => {

    setMatching(true)

    WebRTE.GetProcessList()
      .then(async (response: AxiosResponse) => {

        const sysPIDs: any[] = response?.data

        processes = sysPIDs

        await Promise.all(sysPIDs.map(async (row: any) => {
          
          // get process info foreach process.
          const processInfo: any = await WebRTE.GetProcessInfo(row?.pid)

          apps.forEach((item: any) => {

            item.versions.forEach((ver: any) => {

              if (processInfo?.data?.titleid == ver.title) {

                if (processInfo?.data?.version == "") {

                  // handle no version alert

                } else if (processInfo?.data?.version == ver.version) {

                  // handle exact version priority

                }

                ver.pid = row?.pid // attach process id.
          
                setActiveApp(ver)

              }

            })
  
          })
          
        }));

        setMatching(false)

        // apps.map((item: any, index: number) => {
        //   //TODO: map running processes against "this", if match setActiveApp(item)
        //   //get_pid_info{ "name": "SceSpkService", "version": "", "path": "", "titleid": "", "contentid": "" }
        //   sysPIDs.forEach((pid: any) => {
        //     if (pid.titleid == item.title) {
        //       if (pid.version == item.version) {
        //         // TODO: is exact match, else select nearest version, show warning.
        //       }
        //       setActiveApp(item)
        //     }
        //   })

        // })
            
      })
      .catch((err: any) => {

        setTimeout(() => {
          // TODO: handle no response/errors etc
          setMatching(false)
        }, 250);

      })

  }

  const loadActiveApp = () => {
    const versions: any[] = [{
      name: activeApp.name,
      title: activeApp.title,
      url: activeApp.url,
      version: activeApp.version,
      pid: activeApp?.pid
    }]
    console.log("USE_APP", versions[0])
    navigation.navigate("TrainerApplet", {
      processes: processes,
      apps: versions,
      device: device
    })
  }

   const loadApp = (item: any) => {
     const versions: any[] = []
    item.versions.map((row: any) => versions.push({
        name: row.name,
        title: row.title,
        url: row.url,
        version: row.version,
    }))
    navigation.navigate("TrainerApplet", {
      apps: versions,
      device: device
    })
   }

  return (
    <SafeAreaView style={Style.safe}>
      {
        matching ? (
          <Card style={Style.card} marginT-10 onPress={()=>{
            scanActiveApp()
          }}>
            <View style={Style.cardIconScanning}>
              <ActivityIndicator />
            </View>
            <View padding-10>
              <Text text80BO>
                Scanning...
              </Text>
              <Text text90 grey30>
                Searching for matching app on device.
              </Text>
            </View>
          </Card>
        ) : activeApp ? (
          <Card style={Style.card} marginT-10 onPress={()=>loadActiveApp()}>
            <View style={Style.cardIcon}>
              {
                matching ? (
                  <ActivityIndicator />
                ) : (
                  <Image
                    style={{resizeMode: 'cover', height: 40, width: 40, borderRadius: 5}}
                    source={{uri: `https://github.com/KameleonReloaded/PS4OfflineTrainer/blob/main/${activeApp.title}.jpg?raw=true`}}
                  />
                )
              }
            </View>
            <View padding-10>
              <Text text80BO>
                {activeApp.name}
              </Text>
              <Text text90 grey50>
                {activeApp.title} - {activeApp.version}
              </Text>
            </View>
          </Card>
        ) : (
          <Card style={Style.card} marginT-10 onPress={()=>{
            scanActiveApp()
          }}>
            <View style={Style.cardIconMissing}>
              <Icon name="help-rhombus" size={32}  style={Style.cardIconMissingIcon} />
            </View>
            <View padding-10>
              <Text text80BO>
                No Match Found
              </Text>
              <Text text90 grey30>
                Tap here to rescan.
              </Text>
            </View>
          </Card>
        )
      }
      <View style={Style.inputContainer}>
        <TextField
          autoFocus={true}
          style={Style.input}
          hideUnderline={true}
          enableErrors={false}
          clearButtonMode="while-editing"
          onChangeText={setSearch}
          placeholder="Search"
        />
      </View>
      {busy ? (
        <ActivityIndicator margin-10 />
      ) : null }
      <FlatList
        data={search == "" ? apps : apps.filter((value: any) => {
          return value?.name.toUpperCase().indexOf(search.toUpperCase()) >= 0
        })}
        renderItem={({ item, index }: any) => (
          <Card key={`${item.id}-${index}`} enableShadow={false} style={Style.cardRow} onPress={() => loadApp(item)}>
            <View style={Style.cardRowIcon}>
              <Image
                style={Style.cardRowIconImage}
                source={{uri: `https://github.com/KameleonReloaded/PS4OfflineTrainer/blob/main/${item.title}.jpg?raw=true`}}
              />
            </View>
            <View style={Style.cardRowDetail} padding-10>
              <Text text80BO grey10>
                {item.name}
              </Text>
              <Text text90 grey30>
                {`${item.versions.length} Option${item.versions.length>1?'s':''}.`}
              </Text>
            </View>
          </Card>
        )}

        removeClippedSubviews={true} // Unmount components when outside of window 
        initialNumToRender={10} // Reduce initial render amount
        maxToRenderPerBatch={2} // Reduce number in each render batch
        updateCellsBatchingPeriod={50} // Increase time between renders
        windowSize={5} // Reduce the window size
      />
    </SafeAreaView>
  );
};

const Style = StyleSheet.create({
  safe: {
    backgroundColor: "#f0f0f0",
    flexGrow: 1
  },
  inputContainer: {
    padding: 10,
    paddingTop: 0
  },
  input: {
    borderWidth: 1,
    borderColor: "#f0f0f0",
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#fff"
  },
  card: {
    padding: 15,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    flexDirection: "row"
  },
  cardModal: {
    padding: 10,
    flexDirection: "row"
  },
  cardRow: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    borderRadius: 0,
    flexDirection: "row"
  },
  cardIcon: {
    backgroundColor: "#f0f0f0",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 38,
    height: 38,
    borderRadius: 5
  },
  cardIconScanning: {
    backgroundColor: "#151515",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 38,
    height: 38,
    borderRadius: 5
  },
  cardIconMissing: {
    backgroundColor: "#151515",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 38,
    height: 38,
    borderRadius: 5
  },
  cardIconMissingIcon: {
    color: "#fff"
  },
  cardRowIcon: {
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 5
  },
  cardRowIconImage: {
    position: "absolute",
    width: 50,
    height: 50,
    flexGrow: 1,
    resizeMode: 'cover',
    overflow: 'hidden',
    borderRadius: 5,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  cardRowDetail: {
    justifyContent: "center"
  },
  fieldRow: {
    padding: 10,
    flexGrow: 0,
    height: 60
  },
  withFrame: {
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 10,
    borderRadius: 5
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
  matching: {
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#151515"
  },
  matchingText: {
    marginTop: 5,
    color: "#f0f0f0",
    fontWeight: "700"
  }
});

export default TrainerScreen;
