import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, Modal, Linking } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'

function Coupon({navigation}) {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.firestore().collection("Coupon").onSnapshot((snapshot) => {
      const newCoupons = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCoupons(newCoupons);
    });

    return unsubscribe;
  }, []);

  const renderCouponItem = ({ item }) => (
    <View style={{paddingTop:30}}>
      <View style={{
        width: 260, height: 60, backgroundColor: '#48d1cc', borderRadius: 10, alignItems: 'center', justifyContent: 'center'
        , flexDirection: 'row'
      }}>
        <Text style={{ fontWeight: 'bold', marginRight: 20, fontSize: 16 }}>{item.name}</Text>
        <Text style={{ color: 'green', fontSize: 16 }}>Giảm: {item.coupon}%</Text>
      </View>
    </View>
  );

  const handlePress = () => {
    navigation.goBack();
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
        <View style={{ paddingTop: 20, marginRight: 95 }}>
          <View style={{ backgroundColor: '#F3D051', width: 194, height: 36, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18 }}>Mã giảm giá</Text>
          </View>
        </View>
      </View>
      <View style={{ alignItems: 'center', paddingTop: 30 }}>
        <FlatList
          data={coupons}
          renderItem={renderCouponItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

export default Coupon;