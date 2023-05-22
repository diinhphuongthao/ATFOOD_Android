import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, Alert, query, where, Linking } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { firebase } from '../config'
import moment from 'moment-timezone';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc, onSnapshot } from 'firebase/firestore'
import Geocoder from 'react-native-geocoding';

function Shipper_List_Order({ navigation, orderId }) {

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

      const querySnapshot = await firebase.firestore().collectionGroup('orders').get();

      const orderCustomerIds = [];
      querySnapshot.forEach((doc) => {
        orderCustomerIds.push(doc.ref.parent.parent.id);
        // doc.ref.parent là bộ sưu tập con "orders"
        // doc.ref.parent.parent là bộ sưu tập cha "OrderCustomer"
      });

      const ordersCollectionRef = firebase.firestore().collectionGroup('Deliverys');
      const ordersSnapshot = await ordersCollectionRef.get();

      const orderCustomerId = [];
      ordersSnapshot.forEach((doc) => {
        orderCustomerId.push(doc.id);
      });

      if (orderCustomerId.length >= orderCustomerIds.length || orderCustomerId.length <= orderCustomerIds.length) {
        // nested loop để so sánh id của 2 mảng
        for (let i = 0; i < orderCustomerId.length; i++) {
          for (let j = 0; j < orderCustomerIds.length; j++) {
            if (orderCustomerId[i] === orderCustomerIds[j]) {
              // nếu có id nào trùng nhau thì ta sẽ thay đổi trạng thái của document trong subcollection orders
              const orderId = querySnapshot.docs[j].id;
              const orderRef = querySnapshot.docs[j].ref;
              orderRef.update({
                status: "Đang giao đơn món",
                imageStatus: "https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/food-delivery-2.png?alt=media&token=26c9e5c1-139a-447c-a33d-ffd214ecfea3",
                deliveryTime: firebase.firestore.FieldValue.serverTimestamp(),
              });
              console.log(`Updated order with id ${orderId}`);
            }
          }
        }
      }

      // Kiểm tra trạng thái đơn hàng
      if (deliveryData && deliveryData.status === "Chờ shipper nhận đơn" || deliveryData.status === "Chờ tài xế xác nhận lại") {

        // // Lưu lịch sử đơn hàng
        // const historyRef = firebase.firestore().collection("OrderHistory").doc(orderId);
        // await historyRef.set({
        //   ...deliveryData,
        //   status: "Đang giao đơn món",
        //   imageStatus:
        //     "https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/food-delivery-2.png?alt=media&token=26c9e5c1-139a-447c-a33d-ffd214ecfea3",
        //   deliveryTime: firebase.firestore.FieldValue.serverTimestamp(),
        // });

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




  const handleDeliveryAddressSearch = async (orderId) => {
    try {
      const deliveryRef = firebase.firestore().collection("Deliverys").doc(orderId);
      const deliverySnapshot = await deliveryRef.get();
      const deliveryData = deliverySnapshot.data();

      if (deliveryData) {
        const address = deliveryData.address;

        // Get the location of IUH
        const iuhLocation = "Khu phố 6, phường Linh Trung, Thủ Đức, Thành phố Hồ Chí Minh";

        // Create URL for Google Maps with directions
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}&dir_action=navigate&travelmode=driving&origin=${encodeURIComponent(iuhLocation)}`;

        // Open Google Maps app with directions
        Linking.openURL(directionsUrl);
      } else {
        alert("Không tìm thấy thông tin địa chỉ của đơn hàng!");
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi tìm kiếm địa chỉ đơn hàng!");
    }
  };






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
        <View style={{ paddingTop: 20, }}>
          <View style={{ backgroundColor: '#F3D051', width: 194, height: 36, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18 }}>Đơn món cần giao</Text>
          </View>
        </View>
        <View style={{ paddingTop: 15, marginRight: 15 }}>
          <TouchableOpacity style={{
            width: 46, height: 47, backgroundColor: '#FFE55E', borderRadius: 360,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 2, borderColor: '#BFB12D',
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
                    marginLeft: 4, backgroundColor: 'white', borderRadius: 10, width: 240, height: 140, justifyContent: 'center',
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
                        <Text>Tiền giao đơn món:</Text>
                        <Text style={{ marginLeft: 5 }}>{item.deliveryPrice} vnd</Text>
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
                      <TouchableOpacity onPress={() => handleDeliveryAddressSearch(item.key)}>
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
                      <TouchableOpacity onPress={() => handleDeliveryStatusUpdate(item.key)}>
                        <View style={{
                          backgroundColor: '#9AE893', height: 40, width: 120, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, justifyContent: 'center',

                        }}>

                          <Text style={{ textAlign: 'center' }}>Nhận đơn</Text>

                        </View>
                      </TouchableOpacity>
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