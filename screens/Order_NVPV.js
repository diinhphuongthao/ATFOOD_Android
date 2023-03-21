import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import moment from 'moment-timezone';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore'

function Order_NVPV({ navigation }) {
  const handlePress = () => {
    navigation.goBack();
  };
  const [orders, setOrders] = useState([]);
  const [isCancelDialogVisible, setIsCancelDialogVisible] = useState(false);

  useEffect(() => {
    const subscriber = firebase.firestore()
      .collection('Orders')
      .onSnapshot((querySnapshot) => {
        const orders = [];
        querySnapshot.forEach((documentSnapshot) => {
          orders.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setOrders(orders);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  const handleOrderStatusUpdate = async (orderId) => {
    const orderRef = doc(firebase.firestore(), 'Orders', orderId);
    await updateDoc(orderRef, {
      status: 'Đang chế biến'
    });
  }

  const cancelOrder = async (orderId) => {
    const orderRef = firebase.firestore().collection('Orders').doc(orderId);
    const order = await orderRef.get();
    if (!order.exists) {
      console.log('Order not found');
      return;
    }

    // Show confirmation modal
    const confirmed = await new Promise((resolve) => {
      Alert.alert(
        'Cancel Order',
        'Are you sure you want to cancel this order?',
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
        const orderRef = doc(firebase.firestore(), 'Orders', orderId);
        await updateDoc(orderRef, {
          status: 'Đã hủy đơn'
        });
        console.log('Order canceled successfully');
      } catch (error) {
        console.log(`Error canceling order: ${error}`);
        return;
      }
     

      // Move canceled order to history
      const historyRef = firebase.firestore().collection('OrderHistory').doc(orderId);
      try {
        await historyRef.set({
          ...order.data(),
          canceledAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('Order moved to history successfully');
      } catch (error) {
        console.log(`Error moving order to history: ${error}`);
        return;
      }
      try {
        const orderRef = doc(firebase.firestore(), 'OrderHistory', orderId);
        await updateDoc(orderRef, {
          status: 'Đã hủy đơn'
        });
        console.log('Order canceled successfully');
      } catch (error) {
        console.log(`Error canceling order: ${error}`);
        return;
      }

      // Remove order from current list
      try {
        await orderRef.delete();
        console.log('Order removed from current list successfully');
      } catch (error) {
        console.log(`Error removing order from current list: ${error}`);
        return;
      }
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
      <View>
        <FlatList
          data={orders}
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
                      <TouchableOpacity onPress={() => cancelOrder(item.key)}>
                        <View style={{
                          backgroundColor: '#F54E4E', height: 40, width: 120, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, justifyContent: 'center',
                        }}>

                          <Text style={{}}>Hủy đơn</Text>

                        </View>
                      </TouchableOpacity>
                      <View style={{ paddingTop: 10 }}>
                        <View style={{
                          backgroundColor: '#61EF80', height: 40, width: 120, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, justifyContent: 'center',
                        }}>
                          <TouchableOpacity onPress={() => handleOrderStatusUpdate(item.key)}>
                            <Text style={{}}>Chuyển cho bếp</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
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
    </View>
  )

}
export default Order_NVPV;