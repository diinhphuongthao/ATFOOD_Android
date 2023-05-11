import { Text, StyleSheet, View, TouchableOpacity, StatusBar, TextInput, Image, FlatList, Pressable, ImageBackground, ScrollView, } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import { v4 as uuidv4 } from 'uuid';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore'

function Table_Reserve({ navigation }) {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const tableRef = firebase.firestore().collection('Table').orderBy(firebase.firestore.FieldPath.documentId());

      // Listen for changes from Firestore
      const unsubscribeSnapshot = tableRef.onSnapshot(snapshot => {
        const usersData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setTables(usersData.sort((a, b) => a.number - b.number));
      });

      // Return the unsubscribe function
      return () => {
        unsubscribeSnapshot();
      };
    });

    return unsubscribe;
  }, []);
  return (
    <View style={{ backgroundColor: '#F0F0DD', height: '100%' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
        <View style={{ paddingTop: 15, marginLeft: 15 }}>
          <TouchableOpacity style={{
            width: 46, height: 47, backgroundColor: '#FFE55E', borderRadius: 360,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 2, borderColor: '#BFB12D',
          }} onPress={() => navigation.navigate('Home')}>
            <Image style={{
              height: 38, width: 38, borderRadius: 360,
            }} source={require('../image/return.png')} />
          </TouchableOpacity>
        </View>
        <View style={{ paddingTop: 20, marginRight:95 }}>
          <View style={{ backgroundColor: '#F3D051', width: 194, height: 36, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18 }}>Đặt bàn</Text>
          </View>
        </View>

      </View>
      {/* <View style={{
        position: 'absolute', height: 28, width: 130, backgroundColor: '#D7B96B', top: 93,
        left: 134,
        right: 100,
        bottom: 0,
        zIndex: 1, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center'
      }}><Text style={{ fontWeight: 'bold', fontSize: 16 }}>Cửa ra vào</Text></View> */}
      <View style={{alignItems:'center', paddingTop:20}}>
        <Text style={{fontSize:18, fontWeight:'bold'}}>Ghi chú</Text>
      </View>

      <View style={{ flexDirection: 'row', paddingTop:20 }}>
        <View style={{ flexDirection: 'column', marginLeft: 30 }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <View style={{ width: 30, height: 30, backgroundColor: '#16BB13', marginRight: 5, borderWidth:1 }}>

            </View>
            <Text style={{fontSize:18}}>: Bàn còn trống</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 20 }}>
            <View style={{ width: 30, height: 30, backgroundColor: '#F54E4E', marginRight: 5, borderWidth:1 }}>

            </View>
            <Text style={{fontSize:18}}>: Bàn đã đặt</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'column', marginLeft: 30 }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: 30, height: 30, backgroundColor: '#FFFF00', marginRight: 5, borderWidth:1 }}>

            </View>
            <Text style={{fontSize:18}}>: Bàn đang chờ</Text>
          </View> 
        </View>
      </View>
      <View style={{ paddingTop: 30 }}>
        <View style={{ height: 530, alignItems: 'center', justifyContent: 'center', width: 395 }}>

          <ImageBackground source={require('../image/wood.png')} style={{ borderWidth: 10, borderColor: '#4F320F' }}>
            <FlatList
              data={tables}
              keyExtractor={item => item.id}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (

                <View style={{
                  marginHorizontal: 20, marginVertical: 20, justifyContent: 'center', alignItems: 'center', width: 130, height: 160,
                }}>

                  {item.amount == 10 ? (
                    <TouchableOpacity onPress={() => {
                      if (item.status !== "đang chờ" && item.status !== "đã đặt") {
                        navigation.navigate('Table_Reserve_Detail', { TableId: item.id });
                      }
                    }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <View style={{ flexDirection: 'column' }}>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                      </View>
                      <View style={{
                        backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, borderWidth: 2, borderRadius: 20, height: 160, justifyContent: 'center', alignItems: 'center', width: 70
                      }}>
                        <Text style={{ fontSize: 16, textAlign: 'center' }}>Bàn số:{item.number}</Text>
                        <Text style={{ fontSize: 16, textAlign: 'center' }}>{item.status}</Text>
                      </View>
                      <View style={{ flexDirection: 'column' }}>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                      </View>
                    </TouchableOpacity>
                  ) : item.amount == 9 ? (
                    <TouchableOpacity onPress={() => {
                      if (item.status !== "đang chờ" && item.status !== "đã đặt") {
                        navigation.navigate('Table_Reserve_Detail', { TableId: item.id });
                      }
                    }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <View style={{ flexDirection: 'column' }}>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                      </View>
                      <View style={{
                        backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, borderWidth: 2, borderRadius: 20, height: 160, justifyContent: 'center', alignItems: 'center', width: 70
                      }}>
                        <Text style={{ fontSize: 16, textAlign: 'center' }}>Bàn số:{item.number}</Text>
                        <Text style={{ fontSize: 16, textAlign: 'center' }}>{item.status}</Text>
                      </View>
                      <View style={{ flexDirection: 'column' }}>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                      </View>
                    </TouchableOpacity>
                  ) : item.amount == 8 ? (
                    <TouchableOpacity onPress={() => {
                      if (item.status !== "đang chờ" && item.status !== "đã đặt") {
                        navigation.navigate('Table_Reserve_Detail', { TableId: item.id });
                      }
                    }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <View style={{ flexDirection: 'column' }}>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                      </View>
                      <View style={{
                        backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, borderWidth: 2, borderRadius: 20, height: 120, justifyContent: 'center', alignItems: 'center', width: 70
                      }}>
                        <Text style={{ fontSize: 16, textAlign: 'center' }}>Bàn số:{item.number}</Text>
                        <Text style={{ fontSize: 16, textAlign: 'center' }}>{item.status}</Text>
                      </View>
                      <View style={{ flexDirection: 'column' }}>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 3, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                      </View>
                    </TouchableOpacity>
                  ) : item.amount == 7 ? (
                    <TouchableOpacity onPress={() => {
                      if (item.status !== "đang chờ" && item.status !== "đã đặt") {
                        navigation.navigate('Table_Reserve_Detail', { TableId: item.id });
                      }
                    }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <View style={{ flexDirection: 'column' }}>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                      </View>
                      <View style={{
                        backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, borderWidth: 2, borderRadius: 20, height: 120, justifyContent: 'center', alignItems: 'center', width: 70
                      }}>
                        <Text style={{ fontSize: 16, textAlign: 'center' }}>Bàn số:{item.number}</Text>
                        <Text style={{ fontSize: 16, textAlign: 'center' }}>{item.status}</Text>
                      </View>
                      <View style={{ flexDirection: 'column' }}>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                      </View>
                    </TouchableOpacity>
                  ) : item.amount == 6 ? (
                    <TouchableOpacity onPress={() => {
                      if (item.status !== "đang chờ" && item.status !== "đã đặt") {
                        navigation.navigate('Table_Reserve_Detail', { TableId: item.id });
                      }
                    }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <View style={{ flexDirection: 'column' }}>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                      </View>
                      <View style={{
                        backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, borderWidth: 2, borderRadius: 20, height: 120, justifyContent: 'center', alignItems: 'center', width: 70
                      }}>
                        <Text style={{ fontSize: 16, textAlign: 'center' }}>Bàn số:{item.number}</Text>
                        <Text style={{ fontSize: 16, textAlign: 'center' }}>{item.status}</Text>
                      </View>
                      <View style={{ flexDirection: 'column' }}>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                      </View>
                    </TouchableOpacity>
                  ) : item.amount == 5 ? (
                    <TouchableOpacity onPress={() => {
                      if (item.status !== "đang chờ" && item.status !== "đã đặt") {
                        navigation.navigate('Table_Reserve_Detail', { TableId: item.id });
                      }
                    }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <View style={{ flexDirection: 'column' }}>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                      </View>
                      <View style={{
                        backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, borderWidth: 2, borderRadius: 20, height: 120, justifyContent: 'center', alignItems: 'center', width: 70
                      }}>
                        <Text style={{ fontSize: 16, textAlign: 'center' }}>Bàn số:{item.number}</Text>
                        <Text style={{ fontSize: 16, textAlign: 'center' }}>{item.status}</Text>
                      </View>
                      <View style={{ flexDirection: 'column' }}>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                      </View>
                    </TouchableOpacity>

                  ) : item.amount == 4 ? (
                    <TouchableOpacity onPress={() => {
                      if (item.status !== "đang chờ" && item.status !== "đã đặt") {
                        navigation.navigate('Table_Reserve_Detail', { TableId: item.id });
                      }
                    }} style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                      </View>
                      <View style={{ backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, borderWidth: 2, borderRadius: 20, height: 60, justifyContent: 'center', alignItems: 'center', width: 100 }}>
                        <Text style={{ fontSize: 16 }}>Bàn số:{item.number}</Text>
                        <Text style={{ fontSize: 16 }}>{item.status}</Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                      </View>
                    </TouchableOpacity>

                  ) : item.amount == 3 ? (
                    <TouchableOpacity
                      onPress={() => {
                        if (item.status !== "đang chờ" && item.status !== "đã đặt") {
                          navigation.navigate('Table_Reserve_Detail', { TableId: item.id });
                        } else if (item.status !== "đã đặt") {
                          navigation.navigate('Table_Reserve_Detail', { TableId: item.id });
                        }
                      }} style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                        <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                      </View>
                      <View style={{ backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, borderWidth: 2, borderRadius: 20, height: 60, justifyContent: 'center', alignItems: 'center', width: 100 }}>
                        <Text style={{ fontSize: 16 }}>Bàn số:{item.number}</Text>
                        <Text style={{ fontSize: 16 }}>{item.status}</Text>
                      </View>
                      <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginVertical: 5, borderWidth: 2, borderRadius: 5 }}></View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        if (item.status !== "đang chờ" && item.status !== "đã đặt") {
                          navigation.navigate('Table_Reserve_Detail', { TableId: item.id });
                        }
                      }} style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginVertical: 5, borderWidth: 2, borderRadius: 5 }}></View>
                      <View style={{ backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, borderWidth: 2, borderRadius: 20, height: 60, justifyContent: 'center', alignItems: 'center', width: 100 }}>
                        <Text style={{ fontSize: 16 }}>Bàn số:{item.number}</Text>
                        <Text style={{ fontSize: 16 }}>{item.status}</Text>
                      </View>
                      <View style={{ height: 20, width: 20, backgroundColor: item.status === "đang chờ" ? "#FFFF00" : item.status === "đã đặt" ? "#F54E4E" : "#16BB13", padding: 10, marginVertical: 5, borderWidth: 2, borderRadius: 5 }}></View>
                    </TouchableOpacity>
                  )

                  }
                </View>

              )} >

            </FlatList>

          </ImageBackground>
        </View>
      </View>

    </View>
  )


}


export default Table_Reserve;
