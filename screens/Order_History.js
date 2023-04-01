import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, Alert } from 'react-native'
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



  };


  return (
    <View>
      <FlatList
        data={orderCustomer}
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
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: 100, width: 140, paddingBottom: 2 }}>
                    <View style={{ paddingTop: 10 }}>
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



            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )

}
export default Order_History;