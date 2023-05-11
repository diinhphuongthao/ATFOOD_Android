import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import moment from 'moment-timezone';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore'

function Chat({ navigation, route }) {
  const { EmailStaff } = route.params;
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);

  const [orderCustomer, setOrderCustomer] = useState([]);
  useEffect(() => {
    // const userId = firebase.auth().currentUser.uid;

    const subscriber = firebase.firestore()
      .collection('MessageOrders')
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
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={{paddingTop:30}} onPress={() => navigation.navigate('Chat_Detail', { itemId: item.id, emailStaff: EmailStaff })}>
        <View style={{ height: 100, width: 260, backgroundColor: '#EBE5AB', borderRadius:20,justifyContent:'center', borderWidth:1 }}>
          <View style={{ flexDirection: 'row', marginLeft:30, paddingTop:10  }}>
            <Text style={{ fontWeight: 'bold' }}>Số điện thoại:</Text><Text style={{}}>{item.senderPhone}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginLeft:30, paddingTop:10  }}>
            <Text style={{ fontWeight: 'bold' }}>Khách hàng:</Text><Text style={{}}>{item.senderName}</Text>
          </View>
          <Text>{item.lastMessage}</Text>
        </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ height: '100%', backgroundColor: '#F0F0DD' }}>
      <View style={{ paddingTop: 50, alignItems: 'center', }}>
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