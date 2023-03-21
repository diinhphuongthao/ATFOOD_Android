import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore'

function Order_Detail({ route }) {
    const { orderId } = route.params;
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const subscriber = firebase.firestore()
            .collection('Orders')
            .doc(orderId)
            .onSnapshot((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    setOrder(documentSnapshot.data());
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
                    setOrder(documentSnapshot.data());
                }
            });

        // Unsubscribe from events when no longer in use
        return () => subscriber();
    }, [orderId]);

    if (!order) {
        return <ActivityIndicator />;
    }


    const renderCartItem = ({ item }) => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: '#eee',
                }}>
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-between', height: 160, backgroundColor: '#EBE5AB', width: 340, alignItems: 'center',
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight:25 }}>
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
        <View>
            {/* <FlatList
                data={order.items}
                renderItem={({ item }) => <Text>{item.name}</Text>}
            /> */}
             <FlatList
                style={{}}
                data={order.items}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    )
}

export default Order_Detail
