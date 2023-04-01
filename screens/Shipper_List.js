import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, Alert, query, where } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import moment from 'moment-timezone';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc, onSnapshot } from 'firebase/firestore'

function Shipper_List({ navigation }) {
  const handlePress = () => {
    navigation.goBack();
  };
  return (
    <View style={{ alignItems: 'center', paddingTop: 85,backgroundColor: '#DDF0F0', height:'100%' }}>
      <View style={{ alignItems: 'center' }}>
        <View style={{ paddingTop: 180, flexDirection: 'row' }}>

          <View style={{ marginRight: 10 }}>
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('Shipper_List_Order')} style={{
                width: 180, height: 100, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center'
                , borderRadius: 20
                , borderWidth: 1

              }}>
                <Image style={{ height: 50, width: 50, }} source={require('../image/list.png')} />
                <Text style={{ fontSize: 18, paddingTop: 5 }}>Danh sách đơn món</Text>
              </TouchableOpacity>
            </View>
            <View style={{paddingTop:20}}>
              <TouchableOpacity onPress={() => navigation.navigate('Shipper_List_Delivering')} style={{
                width: 180, height: 100, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center'
                , borderRadius: 20
                , borderWidth: 1

              }}>
                <Image style={{ height: 50, width: 50, }} source={require('../image/food_delivery.png')} />
                <Text style={{ fontSize: 18, paddingTop: 5, textAlign:'center' }}>Đơn món đang vận chuyển</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginLeft: 10 }}>
              <TouchableOpacity onPress={() => navigation.navigate('Menu_NVPV')} style={{
                width: 180, height: 100, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center'
                , borderRadius: 20
                , borderWidth: 1
                ,
              }}>
                <Image style={{ height: 50, width: 50, marginLeft: 6 }} source={require('../image/chat_Res.png')} />
                <Text style={{ fontSize: 18, paddingTop: 5 }}>Nhắn tin</Text>
              </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{paddingTop:160}}>
        <TouchableOpacity style={{ height: 50, width: 160, borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F46C6C', borderRadius: 15 }}
          onPress={() => { firebase.auth().signOut() }}>
          <Text style={{ fontSize: 22 }}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Shipper_List;