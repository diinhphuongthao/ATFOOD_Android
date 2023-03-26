import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, Alert, query, where } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import moment from 'moment-timezone';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc, onSnapshot } from 'firebase/firestore'

function Shipper_List_Order({navigation}){
    const handlePress = () => {
        navigation.goBack();
      };
      const [deliverys, setDeliverys] = useState([]);
      useEffect(() => {
        const subscriber = firebase.firestore()
          .collection('Deliverys')
          .onSnapshot((querySnapshot) => {
            const deliverys = [];
            querySnapshot.forEach((documentSnapshot) => {
              deliverys.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
            });
    
            // Sort orders by creation time in descending order
            const sortedDeliverys = deliverys.sort((a, b) => {
              return moment(b.createdAt.toDate()).diff(moment(a.createdAt.toDate()));
            });
            setDeliverys(sortedDeliverys);
          });
    
        // Unsubscribe from events when no longer in use
        return () => subscriber();
      }, []);

      const handleDeliveryStatusUpdate = async (orderId) => {
        try {
          // Lấy thông tin đơn hàng từ collection "Orders"
          const deliveryRef = firebase.firestore().collection("Deliverys").doc(orderId);
          const deliverySnapshot = await deliveryRef.get();
          const deliveryData = deliverySnapshot.data();
      
          // Kiểm tra trạng thái đơn hàng
          if (deliveryData && deliveryData.status === "Chờ shipper nhận đơn") {
            // // Cập nhật trạng thái đơn món thành "Đang giao đơn món" và lưu vào collection "Orders"
            // await deliveryRef.update({
            //   status: "Đang giao đơn món",
            //   imageStatus:
            //     "https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/delivery.png?alt=media&token=0b04e50a-17b8-4b4d-bb4c-9c3d31b4a018",
            // });
      
            // Lưu lịch sử đơn hàng
            const historyRef = firebase.firestore().collection("OrderHistory").doc(orderId);
            await historyRef.set({
              ...deliveryData,
              status: "Đang giao đơn món",
              imageStatus:
                "https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/delivery.png?alt=media&token=0b04e50a-17b8-4b4d-bb4c-9c3d31b4a018",
              deliveryTime: firebase.firestore.FieldValue.serverTimestamp(),
            });
      
            // Không xóa đơn món khỏi collection Cooking mà chuyển đến collection Delivering
            const deliveringRef = firebase.firestore().collection("Delivering").doc(orderId);
            await deliveringRef.set({
              ...deliveryData,
              status: "Đang giao đơn món",
              imageStatus:
                "https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/food-delivery-2.png?alt=media&token=26c9e5c1-139a-447c-a33d-ffd214ecfea3",
              deliveryTime: firebase.firestore.FieldValue.serverTimestamp(),
            });
      
            // Xóa đơn hàng khỏi collection "Orders"
            await deliveryRef.delete();
      
            alert("Shipper đã nhận đơn món và bắt đầu giao hàng!");
          } else {
            alert("Đơn hàng không ở trạng thái chờ shipper nhận đơn!");
          }
        } catch (error) {
          console.error(error);
          alert("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng!");
        }
      };
      

    return (
        <View style={{ backgroundColor: '#DDF0F0', height: '100%' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
          <View style={{ paddingTop: 15, marginLeft: 15 }}>
            <TouchableOpacity style={{
              width: 46, height: 47, backgroundColor: '#89C1CD', borderRadius: 360,
              alignItems: 'center', justifyContent: 'center',
              borderWidth: 2, borderColor: '#13625D',
            }} onPress={handlePress}>
              <Image style={{
                height: 38, width: 38, borderRadius: 360,
              }} source={require('../image/return.png')} />
            </TouchableOpacity>
          </View>
          <View style={{ paddingTop: 20, }}>
            <View style={{ backgroundColor: '#86D3D3', width: 194, height: 36, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 18 }}>List Order</Text>
            </View>
          </View>
          <View style={{ paddingTop: 15, marginRight: 15 }}>
            <TouchableOpacity style={{
              width: 46, height: 47, backgroundColor: '#89C1CD', borderRadius: 360,
              alignItems: 'center', justifyContent: 'center',
              borderWidth: 2, borderColor: '#13625D',
            }} onPress={() => navigation.navigate('Order_History_NVPV')}>
              <Image style={{
                height: 30, width: 30
              }} source={require('../image/order_history.png')} />
            </TouchableOpacity>
          </View>
        </View>
  
        <FlatList
          data={deliverys}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() =>
              navigation.navigate('Shipper_List_Detail', {
                orderId: item.key,
              })}>
              <View style={{ paddingTop: 20, alignItems: 'center', justifyContent: 'center', }}>
                <View style={{ height: 240, width: 380, backgroundColor: '#FBF5DE', flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1 }}>
                  <View style={{ flexDirection: 'column' }}>
                    <View style={{ paddingBottom: 10, justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{
                        height: 40, width: 220, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'
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
  
                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: 100, width: 140, paddingBottom: 2 }}>
                      <View style={{ paddingTop: 10 }}>
                        <TouchableOpacity onPress={() => handleOrderStatusUpdate(item.key)}>
                          <View style={{
                            backgroundColor: '#86D3D3', height: 40, width: 120, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, justifyContent: 'center',
  
                          }}>
  
                            <Text style={{ textAlign: 'center' }}>
                              <Text>Xem bản đồ</Text>
                            </Text>
  
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={{ paddingTop: 10 }}>
                        <View style={{
                          backgroundColor: '#9AE893', height: 40, width: 120, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, justifyContent: 'center',
  
                        }}>
                          <TouchableOpacity onPress={() => handleDeliveryStatusUpdate(item.key)}>
                            <Text style={{ textAlign: 'center' }}>Nhận đơn</Text>
                          </TouchableOpacity>
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
export default Shipper_List_Order;