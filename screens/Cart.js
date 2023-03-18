import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore'

function Cart({ navigation }) {
    const [cartItems, setCartItems] = useState([]);
    const [itemPrices, setItemPrices] = useState({});
    const [itemQuantity, setItemQuantity] = useState({});

    useEffect(() => {
        const cartRef = firebase.firestore().collection('Cart');
        const unsubscribe = cartRef.onSnapshot((snapshot) => {
            const items = snapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data().foodDetails[0] };
            });
            setCartItems(items);
        });
        return () => unsubscribe();
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
        const itemRef = firebase.firestore().collection('Cart').doc(id);
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
        const itemRef = firebase.firestore().collection('Cart').doc(id);
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
        const index = cartItems.findIndex((item) => item.id === id);
        if (index >= 0) {
            const updatedItems = [...cartItems];
            updatedItems.splice(index, 1);
            setCartItems(updatedItems);
            // Delete item from Firestore
            const cartRef = firebase.firestore().collection('Cart').doc(id);
            cartRef.delete().then(() => {
                console.log("Item deleted successfully.");
            }).catch((error) => {
                console.log("Error deleting item:", error);
            });
        }
    };

    const handlePress = () => {
        navigation.goBack();
    };


    const calculateTotalPrice = () => {
        const totalPrice = cartItems.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);

        return totalPrice;
    }

    const sendOrder = async () => {
        // Lấy id khách hàng
        const userId = firebase.auth().currentUser.uid;
    
        // Lấy thông tin khách hàng từ Firestore
        const userRef = firebase.firestore().collection('users').doc(userId);
        const userDoc = await userRef.get();
        const userData = userDoc.data();
    
        // Tạo đơn hàng mới trong Firestore
        const ordersRef = firebase.firestore().collection('Orders');
        const order = {
            uid: userId,
            customerName: userData.name,
            customerPhone: userData.phone,
            items: cartItems,
            totalPrice: calculateTotalPrice(),
            status: 'pending',
            createdAt: new Date(),
        };
        await ordersRef.add(order);
    
        // Xóa giỏ hàng hiện tại
        const cartRef = firebase.firestore().collection('Cart');
        cartItems.forEach((item) => {
            cartRef.doc(item.id).delete();
        });
        alert('Đã tạo đơn hàng thành công!');
    };
    




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
                        <View style={{ width: 120, }}>
                            <Text style={{ fontSize: 18 }}>{item.name}</Text>
                        </View>
                        <View style={{ width: 120 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 24, marginRight: 12 }}>

                                <Text style={{ color: '#aaa', fontSize: 16, marginRight: 2, alignItems: 'center', justifyContent: 'center' }}>Giá:</Text>
                                <Text style={{ color: '#aaa', fontSize: 16, }}>{itemPrices[item.id]}</Text>
                                <Text style={{ color: '#aaa', fontSize: 16, alignItems: 'center', justifyContent: 'center', marginLeft: 3 }}>{item.denominations}</Text>

                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                        <Text style={{ fontSize: 18 }}>Cart</Text>
                    </View>
                </View>
                <View style={{ paddingTop: 15, marginRight: 15 }}>
                    <TouchableOpacity style={{
                        width: 46, height: 47, backgroundColor: '#89C1CD', borderRadius: 360,
                        alignItems: 'center', justifyContent: 'center',
                        borderWidth: 2, borderColor: '#13625D',
                    }} onPress={() => navigation.navigate('Cart')}>
                        <Image style={{
                            height: 38, width: 38
                        }} source={require('../image/Notification.png')} />
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
            <View style={{ alignItems: 'center', backgroundColor: '#89C1CD', }}>
                <View style={{ width: 380, height: 70, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ marginLeft: 20 }}>
                        <Text style={{ fontSize: 18 }}>Tổng giá tiền:</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 18 }}>{calculateTotalPrice()}</Text><Text style={{ marginLeft: 5, fontSize: 18, justifyContent: 'center' }}>vnd</Text>
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', marginRight: 30 }}>
                        <TouchableOpacity style={{
                            width: 180,
                            height: 40,
                            backgroundColor: '#E5E92A',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 10,
                            borderWidth: 1,

                        }} onPress={sendOrder}>
                            <Text style={{ fontSize: 18, }}>Confirm Order</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};


export default Cart;