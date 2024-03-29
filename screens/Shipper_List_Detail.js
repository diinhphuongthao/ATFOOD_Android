import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore'

function Shipper_List_Detail({ route, navigation }) {
    const { orderId } = route.params;
    console.log(orderId)
    const [email, setEmail] = useState('');
    console.log(email)
    const userRef = firebase.firestore().collection('users').where('uid', '==', orderId);
    userRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            if (doc.id) {
                setEmail(doc.id);
            }
            // const userData = doc.data();
        });
    }).catch((error) => {
        console.log("Error getting documents: ", error);
    });

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


    // useEffect(() => {
    //     const unsubscribe = firebase
    //         .firestore()
    //         .collection('History')
    //         .doc(email)
    //         .collection('orders')
    //         .doc(orderId)
    //         .onSnapshot((doc) => {
    //             if (doc.exists) {
    //                 const orderData = doc.data();
    //                 setDeliverys(orderData);
    //             }
    //         }, (error) => {
    //             console.log('Error getting order document:', error);
    //         });

    //     return () => unsubscribe();
    // }, [orderId]);

    // useEffect(() => {
    //     const unsubscribe = firebase
    //         .firestore()
    //         .collection('Notification')
    //         .doc(email)
    //         .collection('notificate')
    //         .doc(orderId)
    //         .onSnapshot((doc) => {
    //             if (doc.exists) {
    //                 const orderData = doc.data();
    //                 setDeliverys(orderData);
    //             }
    //         }, (error) => {
    //             console.log('Error getting order document:', error);
    //         });

    //     return () => unsubscribe();
    // }, [orderId]);




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
    const handlePress = () => {
        navigation.goBack();
    };


    return (
        <View style={{ height: '100%', backgroundColor: '#F0F0DD' }}>
            <View style={{ flexDirection: 'row', }}>
                <View style={{ paddingTop: 10, marginLeft: 10 }}>
                    <TouchableOpacity style={{
                        width: 46, height: 47, backgroundColor: '#FFE55E', borderRadius: 360,
                        alignItems: 'center', justifyContent: 'center',
                        borderWidth: 2, borderColor: '#BFB12D',
                    }} onPress={handlePress} >
                        <Image style={{ width: 40, height: 40, borderRadius: 360 }} source={require('../image/return.png')} />
                    </TouchableOpacity>
                </View>
                <View style={{ paddingTop: 20, }}>
                    <View style={{ backgroundColor: '#F3D051', width: 194, height: 36, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 50 }}>
                        <Text style={{ fontSize: 18 }}>Chi tiết đơn món</Text>
                    </View>
                </View>
            </View>
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
