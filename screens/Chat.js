import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import moment from 'moment-timezone';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore'

function Chat({ navigation, route }) {
  const { EmailStaff } = route.params;
  // console.log(EmailStaff);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);

  const [orderCustomer, setOrderCustomer] = useState([]);


  useEffect(() => {
    const findOrderId = async (documentId) => {
      try {
        const orderSnapshot = await firebase.firestore().collection('Orders').doc(documentId).get();
        if (orderSnapshot.exists) {
          return orderSnapshot.data().orderId;
        }
      } catch (error) {
        console.error('Lỗi khi tìm orderId:', error);
      }
      return null;
    };

    const subscriber = firebase.firestore().collection('MessageOrders').onSnapshot(async (querySnapshot) => {
      const orders = [];

      for (const documentSnapshot of querySnapshot.docs) {
        const orderData = documentSnapshot.data();

        // Fetch the message documents from the subcollection
        const messageSnapshot = await documentSnapshot.ref.collection('messages').get();
        const messageDocuments = messageSnapshot.docs;

        // Get the status and senderId from each message document
        const messageDetails = messageDocuments.map((messageDoc) => {
          const messageData = messageDoc.data();
          const status = messageData.status;
          const senderId = messageData.senderId;
          return { status, senderId };
        });

        const unreadCustomerMessages = messageDetails.filter((message) => {
          return message.status === 'chưa xem' && message.senderId;
        });

        const unreadCustomerMessageCount = unreadCustomerMessages.length;
        const isCustomerOrder = !!orderData.senderId;

        const order = {
          ...orderData,
          key: documentSnapshot.id,
          messageCount: messageDocuments.length,
          unreadMessageCount: unreadCustomerMessageCount,
          status: unreadCustomerMessageCount > 0 ? 'chưa xem' : 'đã xem',
          isCustomerOrder: isCustomerOrder,
        };

        orders.push(order);

        // Listen for changes in the 'messages' subcollection
        documentSnapshot.ref.collection('messages').onSnapshot((messageQuerySnapshot) => {
          const updatedMessageDocuments = messageQuerySnapshot.docs;

          // Process the updated message documents or update the state accordingly
          const updatedMessageDetails = updatedMessageDocuments.map((messageDoc) => {
            const messageData = messageDoc.data();
            const status = messageData.status;
            const senderId = messageData.senderId;
            return { status, senderId };
          });

          const updatedUnreadCustomerMessages = updatedMessageDetails.filter((message) => {
            return message.status === 'chưa xem' && message.senderId;
          });

          const updatedUnreadCustomerMessageCount = updatedUnreadCustomerMessages.length;

          const updatedOrders = orders.map((existingOrder) => {
            if (existingOrder.key === documentSnapshot.id) {
              return {
                ...existingOrder,
                messageCount: updatedMessageDocuments.length,
                unreadMessageCount: updatedUnreadCustomerMessageCount,
                status: updatedUnreadCustomerMessageCount > 0 ? 'chưa xem' : 'đã xem',
              };
            }
            return existingOrder;
          });

          // Update the state with the updated orders
          setOrderCustomer(updatedOrders);
        });
      }

      // Find and update the orderId for each order
      const updatedOrdersWithOrderId = await Promise.all(
        orders.map(async (order) => {
          if (order.key) {
            const orderId = await findOrderId(order.key);
            if (orderId) {
              return {
                ...order,
                orderId: orderId,
              };
            }
          }
          return order;
        })
      );

      setOrderCustomer(updatedOrdersWithOrderId);
    });

    return () => subscriber();
  }, []);


  // const [orderId, setOrderIds] = useState([]);
  // const findOrderIds = async () => {
  //   try {
  //     const ordersSnapshot = await firebase.firestore().collection('Orders').get();
  //     const messageOrdersSnapshot = await firebase.firestore().collection('MessageOrders').get();

  //     const messageOrdersIds = messageOrdersSnapshot.docs.map((doc) => doc.id);
  //     const matchedOrders = ordersSnapshot.docs.filter((doc) => messageOrdersIds.includes(doc.id));

  //     const orderIds = matchedOrders.map((doc) => doc.data().orderId);
  //     console.log('OrderIds:', orderIds);
  //     // Đồng bộ hóa với state để hiển thị trong View
  //     setOrderIds(orderIds);
  //   } catch (error) {
  //     console.error('Lỗi khi tìm các orderId:', error);
  //   }
  // };

  // useEffect(() => {

  // }, []);




  const handleItemPress = async (item) => {
    const messagesRef = firebase
      .firestore()
      .collection('MessageOrders')
      .doc(item.key)
      .collection('messages');

    // Fetch staff data based on EmailStaff
    const staffSnapshot = await firebase.firestore().collection('Staff').where('email', '==', EmailStaff).get();
    const nvid = staffSnapshot.docs[0]?.id;
    const staffData = staffSnapshot.docs[0]?.data();
    const nvName = staffData?.name;
    const nvPhone = staffData?.phone;
    console.log(nvid);

    // Check if status is "Đã có"
    if (item.statusRoom === 'Đã có') {
      return; // Do nothing if status is "Đã có"
    }

    messagesRef
      .where('status', '==', 'chưa xem')
      .get()
      .then((querySnapshot) => {
        const batch = firebase.firestore().batch();
        querySnapshot.forEach((documentSnapshot) => {
          const docRef = messagesRef.doc(documentSnapshot.id);
          batch.update(docRef, { status: 'chưa xem' });
        });
        return batch.commit();
      })
      .then(() => {
        // Update status to "Đã có" in MessageOrders
        return firebase.firestore().collection('MessageOrders').doc(item.key).update({
          statusRoom: 'Đã có',
          nvid: nvid,
          nvName: nvName,
          nvPhone: nvPhone,
        });
      })
      .then(() => {
        const senderName = orderCustomer.find((order) => order.key === item.key)?.senderName;
        return messagesRef.where('senderName', '==', senderName).get();
      })
      .then((querySnapshot) => {
        const batch = firebase.firestore().batch();
        querySnapshot.forEach((documentSnapshot) => {
          const docRef = messagesRef.doc(documentSnapshot.id);
          batch.update(docRef, { status: 'đã xem' });
        });
        return batch.commit();
      })
      .then(() => {
        navigation.navigate('Chat_Detail', { itemId: item.id, emailStaff: EmailStaff });
      })
      .catch((error) => {
        console.error('Error updating message status:', error);
      });
  };





  const renderItem = ({ item }) => {

    const unreadMessageCount = item.status === 'chưa xem' ? item.unreadMessageCount : 0;
    const buttonColor = item.statusRoom === 'Đã có' ? 'lightgrey' : '#EBE5AB';

    return (
      <TouchableOpacity style={{ paddingTop: 30 }} onPress={() => handleItemPress(item)} disabled={item.statusRoom === 'Đã có'}>
        <View style={{ height: 100, width: 320, backgroundColor: buttonColor, borderRadius: 20, justifyContent: 'center', borderWidth: 1 }}>
          <View style={{ flexDirection: 'row', paddingTop: 10  }}>
            <View style={{ flexDirection: 'row', marginLeft: 20, paddingTop: 10 }}>
              <View style={{ alignItems: 'center', backgroundColor: "white", justifyContent: 'center', width: 60,borderRadius:10 }}>
                <Text style={{}}>Mã đơn:</Text>
                <Text style={{fontWeight:'bold'}}>{item.orderId}</Text>
              </View>
            </View>
            <View>
              <View style={{ flexDirection: 'row', marginLeft: 15, paddingTop: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>Số điện thoại:</Text>
                <Text style={{}}>{item.senderPhone}</Text>
              </View>
              <View style={{ flexDirection: 'row', marginLeft: 15, paddingTop: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>Khách hàng:</Text>
                <Text style={{}}>{item.senderName}</Text>
              </View>
            </View>
          </View>
          <Text>{item.lastMessage}</Text>
          {unreadMessageCount > 0 && <View style={{ position: 'absolute', top: 35, right: 10, backgroundColor: 'red', borderRadius: 360, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>{unreadMessageCount}</Text>
          </View>}
        </View>
      </TouchableOpacity>
    );
  };




  return (
    <View style={{ height: '100%', backgroundColor: '#F0F0DD' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
        <View style={{ paddingTop: 15, marginLeft: 15 }}>
          <TouchableOpacity style={{
            width: 46, height: 47, backgroundColor: '#FFE55E', borderRadius: 360,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 2, borderColor: '#BFB12D',
          }} onPress={() => navigation.navigate('Home_NVPV', { Staff: EmailStaff })}>
            <Image style={{
              height: 38, width: 38, borderRadius: 360,
            }} source={require('../image/return.png')} />
          </TouchableOpacity>
        </View>
        <View style={{ paddingTop: 20, marginRight: 95 }}>
          <View style={{ backgroundColor: '#F3D051', width: 194, height: 36, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18 }}>Danh sách tin nhắn</Text>
          </View>
        </View>
      </View>
      <View style={{ paddingTop: 50, alignItems: 'center', height: 700 }}>
        <FlatList
          data={orderCustomer}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}

export default Chat;