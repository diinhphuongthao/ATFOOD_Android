import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, Modal, Linking } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import moment from 'moment-timezone';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import axios from 'axios';
import _ from 'lodash';



function Cart({ navigation }) {
    const [cartItems, setCartItems] = useState([]);
    const [itemPrices, setItemPrices] = useState({});
    const [itemQuantity, setItemQuantity] = useState({});
    const [coupon, setCoupon] = useState([]);
    // const [TotalPrice, setTotalPrice] = useState({});


    useEffect(() => {
        const userId = firebase.auth().currentUser.uid;
        const cartRef = firebase.firestore().collection('Cart').doc(userId).collection('cartItems');
        const unsubscribe = cartRef.onSnapshot((snapshot) => {
            const items = snapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data().foodDetails[0] };
            });
            setCartItems(items);
        });
        return () => unsubscribe();
    }, []);
    useEffect(() => {
        const subscriber = firebase.firestore()
            .collection('Coupon')
            .onSnapshot((querySnapshot) => {
                const orders = [];
                querySnapshot.forEach((documentSnapshot) => {
                    orders.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                setCoupon(orders);
            });
        return () => subscriber();
    }, []);
    useEffect(() => {
        const prices = {};

        cartItems.forEach((item) => {
            prices[item.id] = item.price * item.quantity;
        });
        setItemPrices(prices);

        const quantitys = {};
        cartItems.forEach((item) => {
            quantitys[item.id] = item.quantity;
        });
        setItemQuantity(quantitys);
    }, [cartItems]);


    const increaseQuantity = async (id, foodId) => {
        const userId = firebase.auth().currentUser.uid;
        const itemRef = firebase.firestore().collection('Cart').doc(userId).collection('cartItems').doc(id);
        const itemDoc = await itemRef.get();
        const itemData = itemDoc.data();

        const updatedFoodDetails = itemData.foodDetails.map((food) => {
            if (food.id === foodId) {
                return {
                    ...food,
                    quantity: food.quantity + 1,
                };
            } else {
                return food;
            }
        });

        await itemRef.update({
            foodDetails: updatedFoodDetails,
        });
    };

    const decreaseQuantity = async (id, foodId) => {
        const userId = firebase.auth().currentUser.uid;
        const itemRef = firebase.firestore().collection('Cart').doc(userId).collection('cartItems').doc(id);
        const itemDoc = await itemRef.get();
        const itemData = itemDoc.data();

        const updatedFoodDetails = itemData.foodDetails
            .map((food) => {
                if (food.id === foodId) {
                    return {
                        ...food,
                        quantity: food.quantity - 1,
                    };
                } else {
                    return food;
                }
            })
            .filter((food) => food.quantity > 0);

        if (updatedFoodDetails.length > 0) {
            await itemRef.update({
                foodDetails: updatedFoodDetails,
            });
        } else {
            await itemRef.delete();
        }
    };

    const deleteItem = (id) => {
        const userId = firebase.auth().currentUser.uid;
        const index = cartItems.findIndex((item) => item.id === id);
        if (index >= 0) {
            const updatedItems = [...cartItems];
            updatedItems.splice(index, 1);
            setCartItems(updatedItems);
            // Delete item from Firestore
            const cartRef = firebase.firestore().collection('Cart').doc(userId).collection('cartItems').doc(id);
            cartRef.delete().then(() => {
                console.log("Item deleted successfully.");
            }).catch((error) => {
                console.log("Error deleting item:", error);
            });
        }
        setDeliveryPrice(0);
    };


    const handlePress = () => {
        navigation.goBack();
    };
    const [deliveryPrice, setDeliveryPrice] = useState(0);

    const calculateDeliveryPrice = async () => {
        // if (cartItems.length === 0) {
        //     return 0;
        // }
        try {
            // Get user address from Firestore
            const apiKey = 'Amn9jc6ebY9SAWGjrWUkv4SIPBGtADQQjxfJmsxmYzAeqCxkS4VMGVyDn1upfyiY';
            const userId = firebase.auth().currentUser.uid;
            const userDoc = await firebase.firestore().collection('users').doc(userId).get();
            const userAddress = userDoc.data().address;
            const normalizedAddress = _.deburr(userAddress).toLowerCase();


            // Get coordinates of user location and delivery location
            const iuhLocation = { latitude: 10.822337659582468, longitude: 106.68575779533174 };
            const response = await axios.get(`http://dev.virtualearth.net/REST/v1/Routes?wayPoint.1=${iuhLocation.latitude},${iuhLocation.longitude}&waypoint.2=${normalizedAddress}&key=${apiKey}`);
            const resources = response.data.resourceSets[0].resources;
            const travelDistance = resources[0].travelDistance;


            // Calculate delivery price based on distance
            const deliveryPricePerKm = 5000;
            const deliveryPrice = travelDistance * deliveryPricePerKm;


            setDeliveryPrice(deliveryPrice);

        } catch (error) {
            console.log(error);
            setDeliveryPrice(0);
        }
        return parseFloat(deliveryPrice.toFixed(0).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
    };

    useEffect(() => {
        if (cartItems.length > 0) {
            calculateDeliveryPrice();
        }
    }, [cartItems]);

    const calculateTotalPrice = () => {
        const totalPrice = cartItems.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);

        const finalPrice = totalPrice + deliveryPrice;
        const lastPrice = finalPrice * (getCoupon / 100);
        const price = finalPrice - lastPrice;

        return parseFloat(price.toFixed(0).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
    };


    const TotalPrice = () => {
        const totalPrice = cartItems.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
        return totalPrice.toFixed(0);
    }
    const CouponPrice = () => {
        const totalPrice = cartItems.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
        const finalPrice = totalPrice + deliveryPrice;
        const lastPrice = finalPrice * (getCoupon / 100);
        return lastPrice.toFixed(0);
    }

    const Cash = () => {
        setPaymentMethod('tiền mặt')
        setModalVisible(false)
    }

    const sendOrder = async () => {
        if (cartItems.length === 0) {
            alert('Giỏ hàng của bạn đang trống. Vui lòng chọn ít nhất một món để đặt hàng.');
            return;
        }
        if (!paymentMethod) {
            alert('Chưa chọn hình thức thanh toán');
            return;
        }
        // if (!getCoupon) {
        //     alert('Bạn chưa thêm mã, bán có chắc sẽ tiếp tục thanh toán chứ');
        // }
        // Lấy id khách hàng
        const userId = firebase.auth().currentUser.uid;

        // Lấy thông tin khách hàng từ Firestore
        const userRef = firebase.firestore().collection('users').doc(userId);
        const userDoc = await userRef.get();
        const userData = userDoc.data();

        // Kiểm tra nếu đã có đơn hàng chưa hoàn thành thì không cho đặt thêm
        const orderRef = firebase.firestore().collection('Orders').where('uid', '==', userId);
        const orderSnapshot = await orderRef.get();
        if (!orderSnapshot.empty) {
            alert('Bạn đã có đơn hàng chưa hoàn thành. Vui lòng đợi trong ít phút trước khi đặt đơn hàng mới.');
            return;
        }

        // Kiểm tra nếu đã có đơn hàng chưa hoàn thành thì không cho đặt thêm
        const deliverRef = firebase.firestore().collection('Delivering').where('uid', '==', userId);
        const deliverSnapshot = await deliverRef.get();
        if (!deliverSnapshot.empty) {
            alert('Bạn đã có đơn hàng chưa hoàn thành. Vui lòng đợi trong ít phút trước khi đặt đơn hàng mới.');
            return;
        }
        if (getCoupon) {
            const couponRef = firebase.firestore().collection('Coupon');
            const query = couponRef.where('coupon', '==', getCoupon);
            const snapshot = await query.get();
            if (!snapshot.empty) {
                // Tìm thấy coupon có giá trị value giống với giá trị của getCoupon
                const docRef = snapshot.docs[0].ref;
                await docRef.update({ amount: firebase.firestore.FieldValue.increment(-1) });
            }
        }
        // Tạo đơn hàng mới trong Firestore
        const ordersRef = firebase.firestore().collection('Orders');
        const order = {
            uid: userId,
            address: userData.address,
            customerName: userData.name,
            customerPhone: userData.phone,
            items: cartItems,
            totalPrice: calculateTotalPrice(),
            status: 'Đang chờ',
            createdAt: new Date(),
            deliveryPrice: parseFloat(deliveryPrice.toFixed(0).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")),
            payment: paymentMethod,
            coupon: getCoupon
        };
        order.imageStatus = 'https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/clockwise.png?alt=media&token=45c770f5-89b3-4f73-96b6-059e549e12b0';
        await ordersRef.doc(userId).set(order);

        const orderCustomerRef = firebase.firestore().collection('OrderCustomer').doc(userId);
        // Tạo một subcollection có tên là "orders"
        const ordersCollectionRef = orderCustomerRef.collection("orders");

        // Thêm một đơn đặt món vào subcollection
        const orders = {
            address: userData.address,
            customerName: userData.name,
            customerPhone: userData.phone,
            totalPrice: calculateTotalPrice(),
            status: 'Đang chờ',
            items: cartItems,
            createdAt: new Date(),
            deliveryPrice: parseFloat(deliveryPrice.toFixed(0).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")),
            payment: paymentMethod,
            coupon: getCoupon
        };
        orders.imageStatus = 'https://firebasestorage.googleapis.com/v0/b/fooddelivery-844c4.appspot.com/o/clockwise.png?alt=media&token=45c770f5-89b3-4f73-96b6-059e549e12b0';
        await ordersCollectionRef.doc(userId).set(orders);

        // Cập nhật thông tin đơn hàng vào document chính của user
        // Xóa giỏ hàng hiện tại
        const cartRef = firebase.firestore().collection('Cart').doc(userId).collection('cartItems');
        cartItems.forEach((item) => {
            cartRef.doc(item.id).delete();
        });
        alert('Đã tạo đơn hàng thành công!');
        calculateTotalPrice("")
        setDeliveryPrice("")

    };

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleCoupon, setModalVisibleCoupon] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');


    const handleCouponPress = () => {
        setModalVisibleCoupon(true);
    }
    const handlePaymentMethodPress = () => {
        setModalVisible(true);
    }
    const [getCoupon, setGetCoupon] = useState('');

    const Coupon = (item) => {
        setGetCoupon(item.coupon)
        setModalVisibleCoupon(false)
        console.log(getCoupon)
    }
    const NoneCoupon = () => {
        setGetCoupon('')
        setModalVisibleCoupon(false)
        console.log(getCoupon)
    }

    // Render each cart item as a FlatList item
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
                                <Text style={{ color: '#aaa', fontSize: 16, }}> {itemPrices[item.id]?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</Text>
                                <Text style={{ color: '#aaa', fontSize: 16, alignItems: 'center', justifyContent: 'center', marginLeft: 3 }}>{item.denominations}</Text>

                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 25 }}>
                        <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
                            <Text style={{ fontSize: 20, marginRight: 10 }}>-</Text>
                        </TouchableOpacity>
                        <View style={{ backgroundColor: 'white', width: 40, alignItems: 'center', borderRadius: 20 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{itemQuantity[item.id]}</Text>
                        </View>
                        <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
                            <Text style={{ fontSize: 20, marginLeft: 10 }}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{
                        backgroundColor: '#F54E4E', width: 60, height: 30, alignItems: 'center',
                        justifyContent: 'center', borderRadius: 10, marginRight: 20
                    }} onPress={() => deleteItem(item.id)}>
                        <Text style={{ color: 'white', fontSize: 16 }}>Xóa</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
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
                        <Text style={{ fontSize: 18 }}>Giỏ hàng</Text>
                    </View>
                </View>
                <View style={{ paddingTop: 15, marginRight: 15 }}>
                    <TouchableOpacity style={{
                        width: 46, height: 47, backgroundColor: '#FFE55E', borderRadius: 360,
                        alignItems: 'center', justifyContent: 'center',
                        borderWidth: 2, borderColor: '#BFB12D',
                    }} onPress={() => navigation.navigate('Order_History')}>
                        <Image style={{
                            height: 30, width: 30
                        }} source={require('../image/order_history.png')} />
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                style={{}}
                data={cartItems}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={() => (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Giỏ hàng của bạn đang trống</Text>
                    </View>
                )}

            />
            <View style={{ alignItems: 'center', backgroundColor: '#E6CA84', flexDirection: 'row' }}>
                <TouchableOpacity style={{ borderWidth: 1 }} onPress={handleCouponPress}>
                    <View style={{ width: 200, height: 60, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16 }}>Mã giảm giá</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePaymentMethodPress} style={{ borderWidth: 1 }}>
                    <View style={{ width: 200, height: 60, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16 }}>Hình thức thanh toán</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    setModalVisible(false);
                }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ width: 300, height: 200, backgroundColor: 'white', borderRadius: 10, justifyContent: 'center' }}>
                        <View style={{ alignItems: 'center', }}>
                            <TouchableOpacity style={{
                                backgroundColor: '#75D474', height: 50, width: 260, justifyContent: 'center'
                                , borderRadius: 10
                            }} onPress={Cash}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Image style={{ height: 30, width: 30 }} source={require('../image/pay.png')}></Image>
                                    <Text style={{ fontSize: 16 }}>Thanh toán bằng tiền mặt</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingTop: 30, alignItems: 'center' }}>

                            <View>

                                <TouchableOpacity>
                                    <View style={{
                                        backgroundColor: '#38BBF4',
                                        height: 50,
                                        width: 260,
                                        justifyContent: 'center',
                                        borderRadius: 10
                                    }}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                            <Image style={{ height: 30, width: 30 }} source={require('../image/VNPay.png')}></Image>
                                            <Text style={{ fontSize: 16, marginLeft: 10 }}>Thanh toán bằng Paypal</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                            </View>

                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={modalVisibleCoupon}
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    setModalVisibleCoupon(false);
                }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ width: 300, height: 200, backgroundColor: 'white', borderRadius: 10, justifyContent: 'center' }}>
                        <FlatList
                            data={coupon}
                            renderItem={({ item }) => (
                                <View style={{ padding: 10, alignItems: 'center' }}>
                                    {/* <Text style={{ fontWeight: 'bold' }}>{item.code}</Text>
                                    <Text>{item.description}</Text> */}
                                    <TouchableOpacity onPress={() => Coupon(item)}>
                                        <View style={{ width: 260, height: 60, backgroundColor: '#48d1cc', borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold', marginRight: 20, fontSize: 16 }}>{item.name}</Text>
                                            <Text style={{ color: 'green', fontSize: 16 }}>Giảm: {item.coupon}%</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                            keyExtractor={(item) => item.key}
                        />
                        <TouchableOpacity style={{ padding: 10, alignItems: 'center' }} onPress={NoneCoupon}><Text>không áp mã</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={{ alignItems: 'center', backgroundColor: '#E6AA37', }}>
                <View style={{ width: 450, height: 160, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'column', alignItems: 'flex-start', width: 180, marginLeft: 75 }}>
                        <View style={{}}>
                            <Text style={{ fontSize: 18 }}>Tạm tính:</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{TotalPrice().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</Text><Text style={{ marginLeft: 5, fontSize: 18, justifyContent: 'center', fontWeight: 'bold' }}>vnd</Text>
                            </View>
                        </View>

                        <View style={{ paddingTop: 20 }}>
                            <Text style={{ fontSize: 18, }}>Tiền được giảm:</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{CouponPrice().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</Text><Text style={{ marginLeft: 5, fontSize: 18, justifyContent: 'center', fontWeight: 'bold' }}>vnd</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'column', alignItems: 'flex-start', width: 180, }}>
                        <View style={{}}>
                            <Text style={{ fontSize: 18 }}>Tiền giao hàng:</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{deliveryPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</Text><Text style={{ marginLeft: 5, fontSize: 18, justifyContent: 'center', fontWeight: 'bold' }}>vnd</Text>
                            </View>
                        </View>
                        <View style={{ paddingTop: 20 }}>
                            <Text style={{ fontSize: 18, }}>Tổng giá tiền:</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{calculateTotalPrice().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</Text><Text style={{ marginLeft: 5, fontSize: 18, justifyContent: 'center', fontWeight: 'bold' }}>vnd</Text>
                            </View>
                        </View>
                    </View>


                </View>
                <View style={{ alignItems: 'center', paddingBottom: 20 }}>
                    <TouchableOpacity style={{
                        width: 180,
                        height: 40,
                        backgroundColor: '#E5E92A',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10,
                        borderWidth: 1,

                    }} onPress={sendOrder}>
                        <Text style={{ fontSize: 18, }}>Xác nhận đơn</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};


export default Cart;