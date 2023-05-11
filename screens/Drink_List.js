import { Text, StyleSheet, View, TouchableOpacity, Image, TextInput, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'

function Drink_List({ navigation }) {
    const [drink, setDrink] = useState([]);
    const todoRef = firebase.firestore().collection('Drink');
    useEffect(() => {
        todoRef
            .onSnapshot(
                querySnapshot => {
                    const drink = []
                    querySnapshot.forEach((doc) => {
                        const { image, name, price, denominations } = doc.data()
                        drink.push({
                            id: doc.id,
                            image,
                            name,
                            price,
                            denominations,
                        })
                    })
                    setDrink(drink)
                }
            )
    }, [])
    const [cartItems, setCartItems] = useState([]);

    // Lấy số lượng item trong giỏ hàng từ sub collection "cartItems"
    useEffect(() => {
        const userId = firebase.auth().currentUser.uid;
        const cartRef = firebase.firestore().collection('Cart').doc(userId).collection('cartItems');
        const unsubscribe = cartRef.onSnapshot((querySnapshot) => {
            const cartItemsCount = querySnapshot.size;
            setCartItems(cartItemsCount);

        }, (error) => {
            console.log('Error getting cart items: ', error);
        });
        return () => unsubscribe();
    }, []);

    const [lastDrink, setLastDrink] = useState(null);

    const searchFishes = (text) => {
        text = text.toLowerCase();
        const query = firebase.firestore()
            .collection('Drink')
            .where('name', '>=', text)
            .where('name', '<=', text + '\uf8ff')
            .orderBy('name')
            .limit(10);

        query.get().then((querySnapshot) => {
            const newFishes = [];
            querySnapshot.forEach((doc) => {
                const fish = doc.data();
                fish.id = doc.id;
                newFishes.push(fish);
            });
            setDrink(newFishes);
            setLastDrink(querySnapshot.docs[querySnapshot.docs.length - 1]);
        }).catch((error) => {
            console.log('Error searching fishes:', error);
        });
    };

    const loadMoreFishes = (text) => {
        if (!lastDrink) return;
        const query = firebase.firestore()
            .collection('Drink')
            .where('name', '>=', text)
            .where('name', '<=', text + '\uf8ff')
            .orderBy('name')
            .startAfter(lastDrink)
            .limit(10);

        query.get().then((querySnapshot) => {
            const newFishes = [...drink];
            querySnapshot.forEach((doc) => {
                const fish = doc.data();
                fish.id = doc.id;
                newFishes.push(fish);
            });
            setDrink(newFishes);
            setLastDrink(querySnapshot.docs[querySnapshot.docs.length - 1]);
        }).catch((error) => {
            console.log('Error loading more fishes:', error);
        });
    };


    return (
        <View style={{ backgroundColor: '#F0F0DD', height: '100%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                <View style={{ paddingTop: 15, marginLeft: 15 }}>
                    <TouchableOpacity style={{
                        width: 46, height: 47, backgroundColor: '#FFE55E', borderRadius: 360,
                        alignItems: 'center', justifyContent: 'center',
                        borderWidth: 2, borderColor: '#BFB12D',
                    }} onPress={() => navigation.navigate('List_Food')}>
                        <Image style={{
                            height: 38, width: 38, borderRadius: 360,
                        }} source={require('../image/return.png')} />
                    </TouchableOpacity>
                </View>
                <View style={{ paddingTop: 20, }}>
                    <View style={{ backgroundColor: '#F3D051', width: 194, height: 36, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18 }}>Thức uống</Text>
                    </View>
                </View>
                <View style={{ paddingTop: 15, marginRight: 15 }}>
                    <TouchableOpacity style={{
                        width: 46, height: 47, backgroundColor: '#FFE55E', borderRadius: 360,
                        alignItems: 'center', justifyContent: 'center',
                        borderWidth: 2, borderColor: '#BFB12D',
                    }} onPress={() => navigation.navigate('Cart')}>
                        <Image style={{
                            height: 26, width: 26
                        }} source={require('../image/cart.png')} />
                        {cartItems > 0 && (
                            <View style={{
                                position: 'absolute', top: 30, right: -6, backgroundColor: '#DA2121',
                                width: 18, height: 18, borderRadius: 9,
                                alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Text style={{ color: 'white', fontSize: 12 }}>{cartItems}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ paddingTop: 18, alignItems: 'center' }}>
                <View style={{ backgroundColor: '#f5f5f5', width: 280, height: 36, borderWidth: 1, justifyContent: 'center', borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ paddingLeft: 10, justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={{ width: 22, height: 22 }} source={require('../image/search.png')} />
                        </View>
                        <View style={{ paddingLeft: 10, }}>
                            <TextInput placeholder='Tên món...' style={{ fontSize: 16, width: 280 }} onChangeText={searchFishes}></TextInput>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ paddingTop: 20 }}>
                <View style={{ width: '100%', height: 600, alignItems: 'center', }}>
                    <FlatList
                        style={{}}
                        onEndReached={loadMoreFishes}
                        onEndReachedThreshold={0.1}
                        showsVerticalScrollIndicator={false}
                        data={drink}
                        numColumns={2}
                        renderItem={({ item }) => (
                            <View style={{ justifyContent: 'center', paddingTop: 40, alignItems: 'center', marginRight: 15 }}>
                                <TouchableOpacity onPress={() => navigation.navigate('Detail_Drink', { foodID: item.id })} style={{ marginLeft: 15, justifyContent: 'center', borderWidth: 1, borderRadius: 10, marginLeft: 15, }}>
                                    <View style={{}}>
                                        <Image style={{ width: 130, height: 92, borderTopRightRadius: 10, borderTopLeftRadius: 10 }} source={{
                                            uri: item.image
                                        }} />
                                    </View>
                                    <View style={{
                                        backgroundColor: '#EBE5AB', height: 60, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderTopWidth: 1
                                        , alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Text style={{ fontSize: 16 }}>{item.name}</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontSize: 15 }}>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</Text>
                                            <Text style={{ marginLeft: 2, fontSize: 15 }}>{item.denominations}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
            </View>

        </View>
    )
}

export default Drink_List;