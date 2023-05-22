import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import moment from 'moment-timezone';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore'


function Notification() {
    const [order, setOrder] = useState([]);
    const userId = firebase.auth().currentUser.uid;
    useEffect(() => {
        const unsubscribe = firebase
            .firestore()
            .collection('Notification')
            .doc(userId)
            .collection('notificate')
            .onSnapshot((querySnapshot) => {
                const ordersData = [];
                querySnapshot.forEach((doc) => {
                    ordersData.push({ ...doc.data(), id: doc.id });
                });
                setOrder(ordersData);
            });

        return () => unsubscribe();
    }, []);

    if (!order) {
        return <ActivityIndicator />;
    }


    return (
        <View>
            <FlatList
                data={order}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() =>
                        navigation.navigate('Shipper_List_Detail', {
                            orderId: item.id,
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


                            </View>


                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}


export default Notification;