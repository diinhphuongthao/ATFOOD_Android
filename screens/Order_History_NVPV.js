import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import moment from 'moment-timezone';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore'

function Order_History_NVPV({ navigation }) {
  const handlePress = () => {
    navigation.goBack();
};

  const [orderHistory, setOrderHistory] = useState([]);
  useEffect(() => {
    const subscriber = firebase.firestore()
      .collection('OrderHistory')
      .where("status", "==", "Giao đơn món thành công")
      .onSnapshot((querySnapshot) => {
        const orderHistory = [];
        querySnapshot.forEach((documentSnapshot) => {
          orderHistory.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setOrderHistory(orderHistory);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);
  return (
    <View style={{ backgroundColor: '#F0F0DD', height: '100%' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
        <View style={{ paddingTop: 15, marginLeft: 15 }}>
          <TouchableOpacity style={{
            width: 46, height: 47, backgroundColor: '#FFE55E', borderRadius: 360,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 2, borderColor: '#BFB12D',
          }} onPress={handlePress}>
            <Image style={{
              height: 38, width: 38, borderRadius: 360,
            }} source={require('../image/return.png')} />
          </TouchableOpacity>
        </View>
        <View style={{ paddingTop: 20, marginRight: 95 }}>
          <View style={{ backgroundColor: '#F3D051', width: 194, height: 36, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18 }}>Danh sách Đơn đã giao</Text>
          </View>
        </View>
      </View>
      <FlatList
        data={orderHistory}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() =>
            navigation.navigate('Order_Detail', {
              orderId: item.key,
            })}>
            <View style={{ paddingTop: 20, alignItems: 'center', justifyContent: 'center', }}>
              <View style={{ height: 240, width: 380, backgroundColor: '#FBF5DE', flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1 }}>
                <View style={{ flexDirection: 'column' }}>
                  <View style={{ paddingBottom: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{
                      height: 40, width: 240, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'
                      , borderRadius: 30, borderWidth: 1, flexDirection: 'row'
                    }}>
                      <Image style={{
                        height: 25, width: 25, marginRight: 5
                      }} source={{
                        uri: item.imageStatus
                      }} />
                      <Text style={{ fontSize: 17 }}>{item.status}</Text>

                    </View>
                  </View>
                  <View style={{
                    marginLeft: 4, backgroundColor: 'white', borderRadius: 10, width: 240, height: 110, justifyContent: 'center',
                    borderWidth: 1
                  }}>
                    <View style={{ marginLeft: 10 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text>Tên khách hàng:</Text>
                        <Text style={{ marginLeft: 5 }}>{item.customerName}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                        <Text>SĐT khách hàng:</Text>
                        <Text style={{ marginLeft: 5 }}>{item.customerPhone}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                        <Text>Thời gian:</Text>
                        <Text style={{ marginLeft: 5 }}>
                          {moment(item.createdAt.toDate()).format('DD/MM/YYYY [lúc] HH:mm:ss')}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>


            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )

}
export default Order_History_NVPV;