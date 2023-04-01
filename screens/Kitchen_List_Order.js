import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, Alert, query, where } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import moment from 'moment-timezone';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc, onSnapshot } from 'firebase/firestore'

function Kitchen_List_Order({ navigation }) {
    const handlePress = () => {
        navigation.goBack();
    };
    const [kitchens, setKitchens] = useState([]);
    useEffect(() => {
        const subscriber = firebase.firestore()
            .collection('Kitchen')
            .onSnapshot((querySnapshot) => {
                const kitchens = [];
                querySnapshot.forEach((documentSnapshot) => {
                    kitchens.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });

                // Sort orders by creation time in descending order
                const sortedKitchens = kitchens.sort((a, b) => {
                    return moment(b.createdAt.toDate()).diff(moment(a.createdAt.toDate()));
                });
                setKitchens(sortedKitchens);
            });

        // Unsubscribe from events when no longer in use
        return () => subscriber();
    }, []);

    const handleKitchenStatusUpdate = async (orderId) => {
        try {
            // Lấy thông tin đơn hàng từ collection "Kitchen"


            const querySnapshot = await firebase.firestore().collectionGroup('orders').get();

            const orderCustomerIds = [];
            querySnapshot.forEach((doc) => {
                orderCustomerIds.push(doc.ref.parent.parent.id);
                // doc.ref.parent là bộ sưu tập con "orders"
                // doc.ref.parent.parent là bộ sưu tập cha "OrderCustomer"
            });

            const KitchenRef = firebase.firestore().collectionGroup('Kitchen');
            const kitchenSnapshot = await KitchenRef.get();
            const kitchenData = kitchenSnapshot.docs[0].data();


            const orderCustomerId = [];
            kitchenSnapshot.forEach((doc) => {
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
                                status: "Đang chế biến",
                                imageStatus: 'https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/cooking.png?alt=media&token=3e9b95c4-9499-4911-95a9-a043305cd340'
                            });
                            console.log(`Updated order with id ${orderId}`);
                        }
                    }
                }
            }

            // Kiểm tra trạng thái đơn hàng
            if (kitchenData.status === "Chờ bếp nhận đơn" || kitchenData.status === "Chờ bếp xác nhận lại") {
                // Cập nhật trạng thái đơn món thành "Đang chế biến" và lưu vào collection "Orders"
                const orderRef = firebase.firestore().collection("Orders").doc(orderId);
                await orderRef.update({
                    status: "Đang chế biến",
                    imageStatus: 'https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/cooking.png?alt=media&token=3e9b95c4-9499-4911-95a9-a043305cd340'
                });

                // Lưu lịch sử đơn hàng
                const historyRef = firebase.firestore().collection('OrderHistory').doc(orderId);
                await historyRef.set({
                    ...kitchenData,
                    status: "Đang chế biến",
                    imageStatus: 'https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/cooking.png?alt=media&token=3e9b95c4-9499-4911-95a9-a043305cd340',
                    cookingTime: firebase.firestore.FieldValue.serverTimestamp()
                });

                // Không xóa đơn món khỏi collection Kitchen mà chuyển đến collection Cooking
                const cookingRef = firebase.firestore().collection('Cooking').doc(orderId);
                await cookingRef.set({
                    ...kitchenData,
                    status: "Đang chế biến",
                    imageStatus: 'https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/cooking.png?alt=media&token=3e9b95c4-9499-4911-95a9-a043305cd340',
                    cookingTime: firebase.firestore.FieldValue.serverTimestamp()
                });

                // Xóa đơn hàng khỏi collection "Kitchen"
                kitchenSnapshot.forEach(async (doc) => {
                    await doc.ref.delete();
                });

                alert("Bếp đã nhận đơn món và bắt đầu chế biến!");
            } else {
                alert("Đơn hàng không ở trạng thái chờ bếp nhận đơn!");
            }
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng!");
        }
    };
    const handleKitchenBackStatusUpdate = async (orderId) => {
        try {
          // Lấy đối tượng đơn hàng trong Collection Orders
          const orderRef = firebase.firestore().collection('Orders').doc(orderId);
          const orderDoc = await orderRef.get();
      
          // Cập nhật trạng thái đơn hàng là "Trả đơn"
          await orderRef.update({
            status: 'Trả đơn',
            imageStatus: 'https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/rejected.png?alt=media&token=6fa60c08-56a2-4d6e-a8db-b2d0048d2c1a',
          });
          console.log(`Updated order with id ${orderId}`);
      
          // Xóa đơn hàng khỏi danh sách Collection Cooking
          const cookingRef = firebase.firestore().collection('Kitchen').doc(orderId);
          await cookingRef.delete();
          console.log(`Deleted cooking order with id ${orderId}`);
      
        } catch (error) {
          console.error('Error updating order and deleting cooking order:', error);
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
                data={kitchens}
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
                                            height: 40, width: 200, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'
                                            , borderRadius: 30, borderWidth: 1, flexDirection: 'row'
                                        }}>
                                            <Image style={{
                                                height: 25, width: 25,
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
                                            <TouchableOpacity onPress={() => handleKitchenBackStatusUpdate(item.key)}>
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
                                            <TouchableOpacity onPress={() => handleKitchenStatusUpdate(item.key)}>
                                                <View style={{
                                                    backgroundColor: '#9AE893', height: 40, width: 120, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, justifyContent: 'center',
                                                }}>
                                                    <Text style={{ textAlign: 'center' }}>Nhận đơn</Text>
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
export default Kitchen_List_Order;