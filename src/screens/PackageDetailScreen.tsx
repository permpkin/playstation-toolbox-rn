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
 import { Button, Card, Dialog, Image, Text, View } from 'react-native-ui-lib';
 import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
 import axios, {Axios, AxiosResponse} from 'axios';
 
 const PACKAGE_NONE = 0
 const PACKAGE_SENDING = 1
 const PACKAGE_SENT = 2
 const PACKAGE_FAILED = 3

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
 
 const PackageDetailScreen = ({ route, navigation }: any) => {

  const { device, pkg } = route.params;
 
  const [busy, setBusy] = useState(true)
  const [packageState, setPackageState] = useState(PACKAGE_NONE)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [packages, setPackages] = useState<Array<Package>>([])
  const [search, setSearch] = useState("")

   console.log(pkg)

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
 
   const installPackage = () => {
     setPackageState(PACKAGE_SENDING)
     setDialogVisible(true)
     //TODO: send package file
     //
     //
    //  const packages_to_install = ["http://THIS_DEVICE_IP:HOST_PORT/PACKAGE_NAME.pkg"]
    //  const post_url = `http://${device.ip}:12800/api/install`
    //  POST > Content-Type: application/json > { "type":"direct", "packages":[packages_to_install] }
    axios.post(`http://${device.ip}:12800/api/install`, {
      type: "direct",
      packages: [`https://pkg-zone.com/download/${pkg.id}`] // will this work?
    }, {
      timeout: 3000,
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response: AxiosResponse) => {
      setPackageState(PACKAGE_SENT)
      if (!dialogVisible) setDialogVisible(true)
    })
    .catch((err) => {
      setPackageState(PACKAGE_FAILED)
      if (!dialogVisible) setDialogVisible(true)
    })
   }
 
   return (
     <SafeAreaView style={Style.safe}>
       
       <Card style={Style.card}>
          <View style={Style.cardIcon}>
            <Image
              style={Style.cardIconImage}
              source={{uri: `https://images.weserv.nl/?url=${pkg?.image}&n=-1`}}
            />
          </View>
          <View flexG padding-10>
            <Text text80BO grey10>
              {pkg.name}
            </Text>
            <Text text90 grey40>
              Version: {pkg.version}
            </Text>
            <Text text90 grey40>
              Supports: {pkg.Size}
            </Text>
            <Text text90 grey40>
              Size: {pkg.Size}
            </Text>
          </View>
        </Card>
       <Card style={Style.card}>
          <View flexG padding-10>
            <Text text80 grey20>
              Description: {pkg.desc} {pkg.desc_1} {pkg.desc_2}
            </Text>
            <Text text80 grey20>
              Supports: {pkg.apptype}
            </Text>
            <Text text80 grey20>
              Author: {pkg.Author}
            </Text>
            <Text text80 grey20>
              Rating: {pkg.ReviewStars}
            </Text>
          </View>
        </Card>
       
       <Card style={Style.cardButton} onPress={installPackage}>
          <View row center flexG padding-10>
            <Text white marginR-5 text70BO>
              {packageState == PACKAGE_SENDING ? "Installing" : "Install Package"}
            </Text>
            <Icon name="package-down" style={Style.cardButtonIcon} size={24} />
          </View>
        </Card>

       <Dialog
         useSafeArea
         bottom={true}
         visible={dialogVisible}
         onDialogDismissed={() => {
          setPackageState(PACKAGE_NONE)
           setDialogVisible(false)
         }}
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
                 packageState == PACKAGE_FAILED ? 
                 (
                  <>
                    <Icon name="check-circle-outline" style={{color:"red"}} size={32} />
                    <View style={Style.dialogDetail}>
                      <Text red30 text80BO>Package "{pkg.name}" Failed.</Text>
                      <Text red30>Check display for confirmation.</Text>
                    </View>
                  </>
                 ) :
                 (
                   <>
                     <Icon name="check-circle-outline" size={32} />
                     <View style={Style.dialogDetail}>
                       <Text text80BO>Package "{pkg.name}" Sent.</Text>
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
   card: {
     padding: 15,
     marginTop: 10,
     marginLeft: 10,
     marginRight: 10,
     flexDirection: "row",
     alignItems: "center"
   },
   cardButton: {
     marginTop: 10,
     marginLeft: 10,
     marginRight: 10,
     flexDirection: "row",
     alignItems: "center",
     backgroundColor: "#151515"
   },
   cardButtonIcon: {
     color: "white"
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
     width: 76,
     height: 76,
     borderRadius: 5
   },
   cardIconSmall: {
     backgroundColor: "#f0f0f0",
     marginRight: 5,
     alignItems: "center",
     justifyContent: "center",
     width: 64,
     height: 64,
     borderRadius: 5
   },
   dialogClose: {
     marginTop: 10
   },
   icon: {
     color: "#fff"
   },
   cardIconImage: {
    position: "absolute",
    width: 76,
    height: 76,
    flexGrow: 1,
    resizeMode: 'cover',
    overflow: 'hidden',
    borderRadius: 5,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
   }
 });
 
 export default PackageDetailScreen;
 