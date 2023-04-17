import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, Alert, Linking } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import moment from 'moment-timezone';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore'

function Order_History({ navigation }) {
  const [orderCustomer, setOrderCustomer] = useState([]);
  const userId = firebase.auth().currentUser.uid;
  useEffect(() => {
    const userId = firebase.auth().currentUser.uid;
    const subscriber = firebase.firestore()
      .collection('OrderCustomer')
      .doc(userId)
      .collection('orders')
      .onSnapshot((querySnapshot) => {
        const orders = [];
        querySnapshot.forEach((documentSnapshot) => {
          orders.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setOrderCustomer(orders);
      });
    return () => subscriber();
  }, [userId]);

  const cancelOrder = async () => {
    const userId = firebase.auth().currentUser.uid;
    const ordersRef = firebase
      .firestore()
      .collection('OrderCustomer')
      .doc(userId)
      .collection('orders');
    const orderSnapshot = await ordersRef.get();

    if (orderSnapshot.empty) {
      console.log('No orders found');
      return;
    }

    const order = orderSnapshot.docs[0];
    const orderData = order.data();

    if (orderData.status === 'Đang chuyển cho bếp') {
      alert('Đã chuyển cho bếp, không thể hủy đơn');
      return;
    }
    if (orderData.status === 'Đang chế biến') {
      alert('Đơn hàng đang chế biến, không thể hủy đơn');
      return;
    }
    if (orderData.status === 'Hoàn thành đơn món') {
      alert('Đã hoàn thành đơn món, không thể hủy đơn');
      return;
    }

    // Show confirmation modal
    const confirmed = await new Promise((resolve) => {
      Alert.alert(
        'Cancel Order',
        'Bạn có chắc chắn sẽ hủy đơn này chứ?',
        [
          {
            text: 'Hủy',
            onPress: () => resolve(false),
            style: 'cancel'
          },
          {
            text: 'Xác nhận',
            onPress: () => resolve(true),
            style: 'destructive'
          }
        ],
        { cancelable: true }
      );
    });

    if (confirmed) {
      // Cancel order
      try {
        // Delete order document in the 'Orders' collection
        const ordersCollectionRef = firebase.firestore().collection('Orders');
        const orderDocRef = ordersCollectionRef.where('uid', '==', userId);
        const orderQuerySnapshot = await orderDocRef.get();
        if (!orderQuerySnapshot.empty) {
          try {
            await orderQuerySnapshot.docs[0].ref.delete();
            console.log('Order document deleted successfully');
          } catch (error) {
            console.log(`Error deleting order document: ${error}`);
          }
        } else {
          console.log('No matching order document found in Orders collection');
        }
        await order.ref.update({
          status: 'Đã hủy đơn',
          imageStatus:
            'https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/cancel.png?alt=media&token=ff491b3f-02a3-4ac4-b31b-4bd30d2d3c2c'
        });
        console.log('Order canceled successfully');
      } catch (error) {
        console.log(`Error canceling order: ${error}`);
        return;
      }
    }
    try {
      // Add canceled order to History collection
      const historyRef = firebase
        .firestore()
        .collection('History')
        .doc(userId)
        .collection('orders');
      await historyRef.add(orderData);
      console.log('Canceled order added to History collection');
      // Delete order document in the 'OrderCustomer' collection
      try {
        await order.ref.delete();
        await historyRef.update({
          status: 'Đã hủy đơn',
          imageStatus: 'https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/cancel.png?alt=media&token=ff491b3f-02a3-4ac4-b31b-4bd30d2d3c2c'
        });
        console.log('Order document deleted from OrderCustomer collection');
      } catch (error) {
        console.log(`Error deleting order document from OrderCustomer collection: ${error}`);
      }
    } catch (error) {
      console.log(`Error adding canceled order to History collection: ${error}`);
      return;
    }
  };
  const handleDeliveryAddressSearch = async () => {
    const userId = firebase.auth().currentUser.uid;
    try {
      const deliveryRef = firebase.firestore()
        .collection('OrderCustomer')
        .doc(userId)
        .collection('orders');
      const deliverySnapshot = await deliveryRef.get();

      if (!deliverySnapshot.empty) {
        const deliveryData = deliverySnapshot.docs[0].data();
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
    <View style={{ backgroundColor: '#DDF0F0', height: '100%' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
        <View style={{ paddingTop: 15, marginLeft: 15 }}>
          <TouchableOpacity style={{
            width: 46, height: 47, backgroundColor: '#89C1CD', borderRadius: 360,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 2, borderColor: '#13625D',
          }} onPress={() => navigation.navigate('Cart')}>
            <Image style={{
              height: 38, width: 38, borderRadius: 360,
            }} source={require('../image/return.png')} />
          </TouchableOpacity>
        </View>
        <View style={{ paddingTop: 20, }}>
          <View style={{ backgroundColor: '#86D3D3', width: 194, height: 36, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 30 }}>
            <Text style={{ fontSize: 18 }}>Chi tiết</Text>
          </View>
        </View>
        <View style={{ paddingTop: 15, marginRight: 15 }}>
        </View>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <FlatList
          style={{}}
          data={orderCustomer}
          renderItem={({ item }) => (

            <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}>
              <View style={{
                height: 640, width: 380, backgroundColor: '#FBF5DE', flexDirection: 'column', alignItems: 'center'
                , justifyContent: 'center', borderRadius: 10, borderWidth: 1
              }}>
                <View style={{ flexDirection: 'column' }}>
                  <View style={{ alignItems: 'center', }}>
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
                  <View style={{ paddingTop: 40 }}>
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
                <View style={{ alignItems: 'center', paddingTop: 50 }}>
                  <TouchableOpacity onPress={() =>
                    navigation.navigate('Order_Detail', {
                      orderId: item.key,
                    })}>
                    <View style={{
                      height: 60, width: 200, backgroundColor: '#39D7CD', justifyContent: 'center', alignItems: 'center',
                      borderRadius: 10
                    }}>
                      <Text style={{ fontSize: 16 }}>Xem chi tiết đơn hàng</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center', paddingTop: 30 }}>
                  <TouchableOpacity onPress={handleDeliveryAddressSearch}>
                    <View style={{
                      height: 60, width: 200, backgroundColor: '#16BB13', justifyContent: 'center', alignItems: 'center',
                      borderRadius: 10
                    }}>
                      <Text style={{ fontSize: 16 }}>Xem bản đồ</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <View style={{ paddingTop: 140, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => cancelOrder(item.key)}>
                      <View style={{
                        backgroundColor: '#E45B5B', height: 40, width: 120, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, justifyContent: 'center',
                      }}>
                        <Text style={{ textAlign: 'center' }}>Hủy đơn</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>



            </View>

          )}
        />
      </View>
    </View>
  )

}
export default Order_History;