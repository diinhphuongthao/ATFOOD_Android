import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import moment from 'moment-timezone';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore'

function Order_History_Detail({ navigation }) {
    const [order, setOrder] = useState([]);
    console.log(order);

    const userId = firebase.auth().currentUser.uid;
    useEffect(() => {
        const unsubscribe = firebase
            .firestore()
            .collection('History')
            .doc(userId)
            .collection('orders')
            .orderBy('createdAt', 'desc')
            .onSnapshot((querySnapshot) => {
                const ordersData = [];
                querySnapshot.forEach((doc) => {
                    ordersData.push({ ...doc.data(), id: doc.id });
                });
                console.log(ordersData);
                setOrder(ordersData);
              
            });

        return () => unsubscribe();
    }, []);

    if (!order) {
        return <ActivityIndicator />;
    }
    const handlePress = () => {
        navigation.goBack();
    };


    return (
        <View style={{height: '100%', backgroundColor:'#F0F0DD'}}>
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
                        <Text style={{ fontSize: 18 }}>Lịch sử đơn món</Text>
                    </View>
                </View>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <FlatList
                    data={order}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() =>
                            navigation.navigate('Kitchen_List_Detail', {
                                orderId: item.id,
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


                                </View>


                            </View>
                        </TouchableOpacity>
                    )}
                />

            </View>
        </View>
    )
}

export default Order_History_Detail;
