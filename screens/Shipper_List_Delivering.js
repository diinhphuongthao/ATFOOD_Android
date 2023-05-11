import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, Alert, query, where } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import moment from 'moment-timezone';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc, onSnapshot } from 'firebase/firestore'

function Shipper_List_Delivering({ navigation }) {
    const handlePress = () => {
        navigation.goBack();
    };
    const [delivering, setDelivering] = useState([]);
    useEffect(() => {
        const subscriber = firebase.firestore()
            .collection('Delivering')
            .onSnapshot((querySnapshot) => {
                const delivering = [];
                querySnapshot.forEach((documentSnapshot) => {
                    delivering.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });

                // Sort orders by creation time in descending order
                const sortedDelivering = delivering.sort((a, b) => {
                    return moment(b.createdAt.toDate()).diff(moment(a.createdAt.toDate()));
                });
                setDelivering(sortedDelivering);
            });

        // Unsubscribe from events when no longer in use
        return () => subscriber();
    }, []);

    const handleDeliveryStatusUpdate = async (orderId) => {
        try {
            const deliveringCollectionRef = firebase.firestore().collection('Delivering');
            const deliveringDocRef = deliveringCollectionRef.doc(orderId);
            const querySnapshot = await firebase.firestore().collectionGroup('orders').get();

            const orderCustomerIds = [];
            querySnapshot.forEach((doc) => {
                orderCustomerIds.push(doc.ref.parent.parent.id);
                // doc.ref.parent là bộ sưu tập con "orders"
                // doc.ref.parent.parent là bộ sưu tập cha "OrderCustomer"
            });

            const ordersCollectionRef = firebase.firestore().collectionGroup('Delivering');
            const ordersSnapshot = await ordersCollectionRef.get();

            const orderCustomerId = [];
            ordersSnapshot.forEach((doc) => {
                orderCustomerId.push(doc.id);
            });

            if (orderCustomerId.length >= orderCustomerIds.length || orderCustomerId.length <= orderCustomerIds.length) {
                // nested loop để so sánh id của 2 mảng
                for (let i = 0; i < orderCustomerId.length; i++) {
                    for (let j = 0; j < orderCustomerIds.length; j++) {
                        if (orderCustomerId[i] === orderCustomerIds[j]) {
                            // nếu có id nào trùng nhau thì ta sẽ thay đổi trạng thái của document trong subcollection orders
                            const orderId = querySnapshot.docs[j].id;
                            const orderRef = querySnapshot.docs[j].ref;
                            orderRef.update({
                                status: 'Giao đơn món thành công',
                                imageStatus: 'https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/checked.png?alt=media&token=08e9edcb-dfd0-4a35-a521-9999aea87af0',
                                updatedAt: new Date()
                            });
                            console.log(`Updated order with id ${orderId}`);
                        }
                    }
                }
            }
            const orderRef = firebase.firestore().collection('Delivering').doc(orderId);
            const order = await orderRef.get();
            const NotificationRef = firebase.firestore().collection('Notification').doc(orderId).collection('notificate').doc();
            try {
                await NotificationRef.set({
                    ...order.data(),
                    NotiStatus: 'chưa xem',
                    status: 'Hoàn thành đơn món',
                    imageStatus: 'https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/checked.png?alt=media&token=08e9edcb-dfd0-4a35-a521-9999aea87af0',
                    finishAt: firebase.firestore.FieldValue.serverTimestamp(),
                    finishReason: 'Hoàn thành đơn món'
                });
                console.log('Order moved to Notification');
            } catch (error) {
                console.log(`Error moving order to Notification: ${error}`);
                return;
            }

            await deliveringDocRef.update({
                status: 'Giao đơn món thành công',
                imageStatus: 'https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/checked.png?alt=media&token=08e9edcb-dfd0-4a35-a521-9999aea87af0',
                finishdAt: new Date()
            });
            const oldOrderRef = firebase.firestore().collection('OrderHistory').doc();
            const deliveringDoc = await deliveringDocRef.get();
            await oldOrderRef.set(deliveringDoc.data());

            const CustomerRef = firebase.firestore().collection('History').doc(orderId).collection('orders').doc();
            await CustomerRef.set({
                ...order.data(),
                status: 'Hoàn thành đơn món',
                imageStatus: 'https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/checked.png?alt=media&token=08e9edcb-dfd0-4a35-a521-9999aea87af0',
                finishAt: firebase.firestore.FieldValue.serverTimestamp(),
                finishReason: 'Hoàn thành đơn món'
            });

            const OrderRef = firebase.firestore().collection('OrderCustomer').doc(orderId).collection('orders').doc(orderId);
            await OrderRef.delete();

            await deliveringDocRef.delete();
            console.log('Delivery status updated successfully');
        } catch (error) {
            console.log(`Error updating delivery status: ${error}`);
        }
    };
    const handleMap = async () => {

    };
    const handleDeliveryBackStatusUpdate = async (orderId) => {
        try {
            // Lấy đối tượng đơn hàng trong Collection Orders
            const orderRef = firebase.firestore().collection('Delivering').doc(orderId);
            const orderDoc = await orderRef.get();
            const orderData = orderDoc.data();

            const querySnapshot = await firebase.firestore().collectionGroup('orders').get();

            const orderCustomerIds = [];
            querySnapshot.forEach((doc) => {
                orderCustomerIds.push(doc.ref.parent.parent.id);
                // doc.ref.parent là bộ sưu tập con "orders"
                // doc.ref.parent.parent là bộ sưu tập cha "OrderCustomer"
            });

            const ordersCollectionRef = firebase.firestore().collectionGroup('Delivering');
            const ordersSnapshot = await ordersCollectionRef.get();

            const orderCustomerId = [];
            ordersSnapshot.forEach((doc) => {
                orderCustomerId.push(doc.id);
            });

            if (orderCustomerId.length >= orderCustomerIds.length || orderCustomerId.length <= orderCustomerIds.length) {
                // nested loop để so sánh id của 2 mảng
                for (let i = 0; i < orderCustomerId.length; i++) {
                    for (let j = 0; j < orderCustomerIds.length; j++) {
                        if (orderCustomerId[i] === orderCustomerIds[j]) {
                            // nếu có id nào trùng nhau thì ta sẽ thay đổi trạng thái của document trong subcollection orders
                            const orderId = querySnapshot.docs[j].id;
                            const orderRef = querySnapshot.docs[j].ref;
                            orderRef.update({
                                status: "Chờ tài xế xác nhận lại",
                                imageStatus: 'https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/kitchen_waiting.png?alt=media&token=fd1747fd-76bc-4644-996b-1a5dcd874917',
                                deliveryTime: firebase.firestore.FieldValue.serverTimestamp(),
                            });
                            console.log(`Updated order with id ${orderId}`);
                        }
                    }
                }
            }

            // Tạo mới đơn hàng trong Collection Kitchen
            const kitchenRef = firebase.firestore().collection('Deliverys').doc(orderId);
            await kitchenRef.set({
                ...orderData,
                status: 'Chờ tài xế xác nhận lại',
                imageStatus: 'https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/kitchen_waiting.png?alt=media&token=fd1747fd-76bc-4644-996b-1a5dcd874917'
            });
            console.log(`Moved order with id ${orderId} back to Kitchen collection`);

            // Xóa đơn hàng khỏi danh sách Collection Cooking
            const cookingRef = firebase.firestore().collection('Delivering').doc(orderId);
            await cookingRef.delete();
            console.log(`Deleted cooking order with id ${orderId}`);

        } catch (error) {
            console.error('Error updating order and deleting cooking order:', error);
        }
    };



    return (
        <View style={{ backgroundColor: '#F0F0DD', height: '100%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                <View style={{ paddingTop: 15, marginLeft: 15 }}>
                    <TouchableOpacity style={{
                        width: 46, height: 47, backgroundColor: '#FFE55E', borderRadius: 360,
                        alignItems: 'center', justifyContent: 'center',
                        borderWidth: 2, borderColor: '#BFB12D',
                    }} onPress={handlePress}>
                        <Image style={{
                            height: 38, width: 38, borderRadius: 360,
                        }} source={require('../image/return.png')} />
                    </TouchableOpacity>
                </View>
                <View style={{ paddingTop: 20, }}>
                    <View style={{ backgroundColor: '#F3D051', width: 194, height: 36, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18 }}>Đơn món đang giao</Text>
                    </View>
                </View>
                <View style={{ paddingTop: 15, marginRight: 15 }}>
                    <TouchableOpacity style={{
                        width: 46, height: 47, backgroundColor: '#FFE55E', borderRadius: 360,
                        alignItems: 'center', justifyContent: 'center',
                        borderWidth: 2, borderColor: '#BFB12D',
                    }} onPress={() => navigation.navigate('Order_History_NVPV')}>
                        <Image style={{
                            height: 30, width: 30
                        }} source={require('../image/order_history.png')} />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={delivering}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() =>
                        navigation.navigate('Shipper_List_Detail', {
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
                                            <TouchableOpacity onPress={() => handleDeliveryBackStatusUpdate(item.key)}>
                                                <View style={{
                                                    backgroundColor: '#86D3D3', height: 40, width: 120, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, justifyContent: 'center',

                                                }}>

                                                    <Text style={{ textAlign: 'center' }}>
                                                        <Text>Trả đơn</Text>
                                                    </Text>

                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ paddingTop: 10 }}>
                                            <TouchableOpacity onPress={() => handleDeliveryStatusUpdate(item.key)}>
                                                <View style={{
                                                    backgroundColor: '#9AE893', height: 40, width: 120, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, justifyContent: 'center',
                                                }}>
                                                    <Text style={{ textAlign: 'center' }}>Hoàn thành giao đơn</Text>
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
export default Shipper_List_Delivering;