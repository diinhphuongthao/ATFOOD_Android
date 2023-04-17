import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore'

function Shipper_List_Detail({ route }) {
    const { orderId } = route.params;
    const userId = firebase.auth().currentUser.uid;
    const [deliverys, setDeliverys] = useState(null);


    useEffect(() => {
        const subscriber = firebase.firestore()
            .collection('Deliverys')
            .doc(orderId)
            .onSnapshot((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    setDeliverys(documentSnapshot.data());
                }
            });

        // Unsubscribe from events when no longer in use
        return () => subscriber();
    }, [orderId]);

    useEffect(() => {
        const subscriber = firebase.firestore()
            .collection('OrderHistory')
            .doc(orderId)
            .onSnapshot((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    setDeliverys(documentSnapshot.data());
                }
            });

        // Unsubscribe from events when no longer in use
        return () => subscriber();
    }, [orderId]);


    useEffect(() => {
        const unsubscribe = firebase
          .firestore()
          .collection('History')
          .doc(userId)
          .collection('orders')
          .doc(orderId)
          .onSnapshot((doc) => {
            if (doc.exists) {
              const orderData = doc.data();
              setDeliverys(orderData);
            }
          }, (error) => {
            console.log('Error getting order document:', error);
          });
      
        return () => unsubscribe();
      }, [orderId]);
      



    if (!deliverys) {
        return <ActivityIndicator />;
    }
    const renderCartItem = ({ item }) => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: '#eee',
                }}>
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-between', height: 160, backgroundColor: '#EBE5AB', width: 380
                    , alignItems: 'center',
                    borderRadius: 20
                }}>
                    <View style={{ marginLeft: 20 }}>
                        <Image style={{
                            height: 100, width: 100, borderRadius: 10
                        }} source={{
                            uri: item.image
                        }} />
                        <View style={{ width: 150, }}>
                            <Text style={{ fontSize: 18 }}>{item.name}</Text>
                        </View>
                        <View style={{ width: 120 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 24, marginRight: 12 }}>

                                <Text style={{ color: '#aaa', fontSize: 16, marginRight: 2, alignItems: 'center', justifyContent: 'center' }}>Giá:</Text>
                                <Text style={{ color: '#aaa', fontSize: 16, }}>{item.price}</Text>
                                <Text style={{ color: '#aaa', fontSize: 16, alignItems: 'center', justifyContent: 'center', marginLeft: 3 }}>{item.denominations}</Text>

                            </View>
                        </View>
                    </View>
                    <View style={{ backgroundColor: 'white', borderRadius: 10, height: 100, width: 120, alignItems: 'center', marginRight: 10 }}>
                        <Text style={{ width: 100 }}>{item.note}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                        <View style={{ backgroundColor: 'white', width: 40, alignItems: 'center', borderRadius: 20 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.quantity}</Text>
                        </View>
                    </View>
                    {/* <TouchableOpacity style={{
                        backgroundColor: '#F54E4E', width: 60, height: 30, alignItems: 'center',
                        justifyContent: 'center', borderRadius: 10, marginRight: 20
                    }} onPress={() => deleteItem(item.id)}>
                        <Text style={{ color: 'white', fontSize: 16 }}>Xóa</Text>
                    </TouchableOpacity> */}
                </View>
            </View>
        );
    };

    return (
        <View style={{ alignItems: 'center' }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <FlatList
                    data={deliverys.items}
                    renderItem={renderCartItem}
                    keyExtractor={(item) => item.id}
                />
            </View>
        </View>
    )
}

export default Shipper_List_Detail
