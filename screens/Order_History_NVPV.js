import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import moment from 'moment-timezone';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore'

 function Order_History_NVPV({navigation}){
    const [orderHistory, setOrderHistory] = useState([]);
    useEffect(() => {
        const subscriber = firebase.firestore()
          .collection('OrderHistory')
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
      <View>
         <FlatList
          data={orderHistory}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() =>
              navigation.navigate('Order_Detail', {
                orderId: item.key,
              })}>
              <View style={{ paddingTop: 20, alignItems: 'center', justifyContent: 'center', }}>
                <View style={{ height: 180, width: 380, backgroundColor: '#EBE5AB', flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1 }}>
                  <View style={{ marginLeft: 4, backgroundColor: 'white', borderRadius: 10, width: 240, height: 110, justifyContent: 'center' }}>
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
                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: 100, width: 140, paddingBottom: 2 }}>
                      {/* <TouchableOpacity>
                        <View style={{
                          backgroundColor: '#F54E4E', height: 40, width: 120, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, justifyContent: 'center',
                        }}>

                          <Text style={{}}>Xóa đơn</Text>

                        </View>
                      </TouchableOpacity> */}
                      {/* <View style={{ paddingTop: 10 }}>
                        <View style={{
                          backgroundColor: '#61EF80', height: 40, width: 120, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, justifyContent: 'center',
                        }}>
                          <TouchableOpacity onPress={() => handleOrderStatusUpdate(item.key)}>
                            <Text style={{}}>Chuyển cho bếp</Text>
                          </TouchableOpacity>
                        </View>
                      </View> */}
                      <View style={{ paddingTop: 10 }}>
                        <View style={{ height: 30, width: 100, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                          <Text style={{}}>{item.status}</Text>
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