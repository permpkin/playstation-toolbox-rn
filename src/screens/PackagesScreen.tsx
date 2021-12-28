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
   TouchableHighlight,
   FlatList
 } from 'react-native';
 import { Button, Dialog, Image, Text, View } from 'react-native-ui-lib';
 import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
 import axios, {Axios, AxiosResponse} from 'axios';
 
 const PACKAGE_NONE = 0
 const PACKAGE_SENDING = 1
 const PACKAGE_SENT = 2

 interface Package {
   id: string;
   name: string;
   desc: string;
   desc_1: string;
   desc_2: string;
   image: string;
   main_icon_path: string;
   main_menu_pic: string;
   version: string;
   package: string;
   picpath: string;
   ReviewStars: string;
   Size: string;
   Author: string;
   apptype: string;
   pv: string;
   releaseddate: string;
 }
 
 const PackagesScreen = ({ navigation }: any) => {
 
  const [busy, setBusy] = useState(true)
   const [packageState, setPackageState] = useState(PACKAGE_NONE)
   const [dialogVisible, setDialogVisible] = useState(false)
   const [packages, setPackages] = useState<Array<Package>>([])
   const [search, setSearch] = useState("")

/*

{
  "packages": [
    {
      "id": "BBFF12362",
      "name": "Kill'em All.",
      "desc": "Title says it all",
      "image": "http://api.pkg-zone.com/storedata/killemall_icon0.png",
      "package": "https://pkg-zone.com/details/BBFF12362",
      "version": "1.00",
      "picpath": "/user/app/NPXS39041/storedata/killemall_icon0.png",
      "desc_1": "",
      "desc_2": "",
      "ReviewStars": "4/5 Stars",
      "Size": "1.1 GBs",
      "Author": "RetroGamer",
      "apptype": "HB Game",
      "pv": "4.70-5.05",
      "main_icon_path": "http://api.pkg-zone.com/storedata/killemall_main.png",
      "main_menu_pic": "/user/app/NPXS39041/storedata/killemall_main.png",
      "releaseddate": "2019-04-30"
    }
  ]
}

*/
// const checkIt = () => {
  
//       axios.get('http://api.pkg-zone.com/api.php?page=0')
//         .then((response: AxiosResponse) => {
//           console.log('response?.data', response?.data)
//         })
//         .catch(err => {
//           console.log('err.message', err.message)
//           console.log('err', err?.response)
//         });
//     }

   useEffect(() => {
      // Use [] as second argument in useEffect for not rendering each time
      axios.get('https://gist.githubusercontent.com/permpkin/2f4a3c843e5f73637cf8cf3d042eb606/raw/bbd083a92cc7fdf60794c45a37d2c8db8c9497b9/api.pkg-zone.com.json')
      .then((response: any) => {
        setPackages(response.data?.packages)
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
              console.log('This is a button!')
            }}
            size={20}
          />
        ),
      });
    }, [navigation]);
 
   const sendPackage = (pkg: Package) => {
     setPackageState(PACKAGE_SENDING)
     setDialogVisible(true)
     //TODO: send package file
     console.log(pkg)
     setTimeout(() => {
       setPackageState(PACKAGE_SENT)
       if (!dialogVisible) setDialogVisible(true)
     }, 1200);
   }
 
   return (
     <SafeAreaView style={Style.safe}>
      {busy ? (
          <ActivityIndicator />
        ) :
        (
          <FlatList
            data={search == "" ? packages : packages.filter((value: any) => {
              return value?.name.toUpperCase().indexOf(search.toUpperCase()) >= 0
            })}
            renderItem={({ item, index }: any) => (
              <TouchableHighlight onPress={() => {
                sendPackage(item)
              }} key={index}>
                <View margin-10 style={Style.row}>
                  <View style={Style.cardRowIcon}>
                    <Image
                      style={Style.cardRowIconImage}
                      source={{uri: `https://images.weserv.nl/?url=${item?.image}&n=-1`}}
                    />
                  </View>
                  <View style={Style.rowDetail}>
                    <Text text80BO>{item?.name}</Text>
                    <Text grey10>{`${[item?.desc,item?.desc_1,item?.desc_2].join(" ").replace("  ", " ")}`}</Text>
                  </View>
                </View>
              </TouchableHighlight>
            )}

            removeClippedSubviews={true} // Unmount components when outside of window 
            initialNumToRender={10} // Reduce initial render amount
            maxToRenderPerBatch={2} // Reduce number in each render batch
            updateCellsBatchingPeriod={50} // Increase time between renders
            windowSize={5} // Reduce the window size
          />
        )
      }
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
               packageState == PACKAGE_SENDING ?
                 (
                   <>
                     <ActivityIndicator />
                     <View style={Style.dialogDetail}>
                       <Text text80BO>Sending Package...</Text>
                     </View>
                   </>
                 ) :
                 (
                   <>
                     <Icon name="check-circle-outline" size={32} />
                     <View style={Style.dialogDetail}>
                       <Text text80BO>Package "PKG_NAME" Sent.</Text>
                       <Text grey10>Check display for confirmation.</Text>
                     </View>
                   </>
                 )
             }
           </View>
           {packageState == PACKAGE_SENT ? (
             <Button onPress={() => setDialogVisible(false)} style={Style.dialogClose} label="Done" link />
           ) : null}
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
 });
 
 export default PackagesScreen;
 