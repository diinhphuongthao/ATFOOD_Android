import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, Alert, query, where } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import moment from 'moment-timezone';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc, onSnapshot, writeBatch } from 'firebase/firestore'

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

        // Sort orders by creation time in descending order
        const sortedOrders = orders.sort((a, b) => {
          return moment(b.createdAt.toDate()).diff(moment(a.createdAt.toDate()));
        });

        setOrders(sortedOrders);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  const handleOrderStatusUpdate = async (orderId) => {
    const orderRef = doc(firebase.firestore(), 'Orders', orderId);
    const snapshot = await getDoc(orderRef);
    const order = snapshot.data();
    if (order.status === 'Đang chế biến') {
      alert('Đơn hàng đang chế biến, không thể chuyển cho bếp');
      return;
    }
    if (order.status === 'Đã chuyển cho bếp') {
      alert('Đã chuyển cho bếp, đợi bếp xác nhận đơn');
      return;
    }
    if (order.status === 'Hoàn thành đơn món') {
      alert('Đã hoàn thành đơn món, đợi chuyển cho shipper');
      return;
    } 
    
   

    // Tạo một batch để update trạng thái đơn hàng và chuyển sang collection Kitchen
    const batch = writeBatch(firebase.firestore());

    // Thêm lệnh update trạng thái đơn hàng vào batch
    batch.update(orderRef, {
      status: 'Đã chuyển cho bếp',
      imageStatus: 'https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/kitchen.png?alt=media&token=39eef676-b517-47f4-86ac-4e9ab659f1de'
    });

    // Thêm lệnh chuyển document sang collection Kitchen vào batch
    const kitchenRef = doc(firebase.firestore(), 'Kitchen', orderId);
    batch.set(kitchenRef, order);
    batch.set(kitchenRef, {
      ...order,
      status: 'Chờ bếp nhận đơn',
      imageStatus: 'https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/kitchen_waiting.png?alt=media&token=fd1747fd-76bc-4644-996b-1a5dcd874917'
    });

    // Thực hiện batch
    await batch.commit();

    return () => {
      unsubscribe();
    };
  };


  const cancelOrder = async (orderId) => {

    const orderRef = firebase.firestore().collection('Orders').doc(orderId);
    const order = await orderRef.get();
    if (!order.exists) {
      console.log('Order not found');
      return;
    }
    if (order.data().status === 'Đang chế biến') {
      alert('Đơn hàng đang chế biến, không thể chuyển cho bếp');
      return;
    }
    if (order.data().status === 'Đang chuyển cho bếp') {
      alert('Đã chuyển cho bếp, đợi bếp xác nhận đơn');
      return;
    }
    if (order.data().status === 'Hoàn thành đơn món') {
      alert('Đã hoàn thành đơn món, đợi chuyển cho shipper');
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
          status: 'Đã hủy đơn',
          imageStatus: 'https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/cancel.png?alt=media&token=ff491b3f-02a3-4ac4-b31b-4bd30d2d3c2c'
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

  const handleDeliveryStatusUpdate = async (orderId) => {
    try {
      // Đọc dữ liệu đơn hàng từ collection "Orders"
      const orderRef = firebase.firestore().collection("Orders").doc(orderId);
      const orderSnapshot = await orderRef.get();
      const orderData = orderSnapshot.data();
      const historyRef = firebase.firestore().collection('OrderHistory').doc(orderId);
      const order = await orderRef.get();
      // Kiểm tra trạng thái đơn hàng
      if (orderData.status === "Hoàn thành đơn món") {
        // Lưu đơn hàng vào collection "Deliverys"
        const deliveryRef = firebase.firestore().collection("Deliverys").doc(orderId);
        await deliveryRef.set(orderData);

         // Update trạng thái đơn hàng thành "Chờ shipper nhận đơn"
         const deliveryStatusRef = firebase.firestore().collection("Deliverys").doc(orderId);
         await deliveryStatusRef.update({
           status: "Chờ shipper nhận đơn",
           imageStatus: 'https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/wait-time.png?alt=media&token=b3a9697a-f32b-4f81-8764-cb1ba9b1fe09'
         });
   
         alert("Chuyển đơn hàng thành công!");
  
        await historyRef.set({
          ...order.data(),
          canceledAt: firebase.firestore.FieldValue.serverTimestamp()
        });
  
        console.log('Order moved to history successfully');
        // Xóa đơn hàng khỏi collection "Orders"
        await orderRef.delete();
      }
      else if (orderData.status === "Đang chờ" || orderData.status === "Đang chế biến") {
        alert("Đơn hàng đang trong quá trình chờ xác nhận, không thể chuyển cho shipper!");
      } else {
        alert("Đơn hàng chưa hoàn thành đơn món, không thể chuyển cho shipper!");
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi chuyển đơn hàng!");
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
        data={orders}
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
                      height: 40, width: 200, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'
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
                          <Text style={{}}>Hủy đơn</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={{ paddingTop: 10 }}>
                      <TouchableOpacity onPress={() => handleOrderStatusUpdate(item.key)}>
                        <View style={{
                          backgroundColor: '#86D3D3', height: 40, width: 120, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, justifyContent: 'center',

                        }}>

                          <Text style={{ textAlign: 'center' }}>
                            <Text>Chuyển đến bếp</Text>
                          </Text>

                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={{ paddingTop: 10 }}>
                      <View style={{
                        backgroundColor: '#9AE893', height: 40, width: 120, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, justifyContent: 'center',

                      }}>
                        <TouchableOpacity onPress={() => handleDeliveryStatusUpdate(item.key)}>
                          <Text style={{ textAlign: 'center' }}>Chuyển cho shipper</Text>
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
export default Order_NVPV;