import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, Alert, query, where } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import moment from 'moment-timezone';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc, onSnapshot } from 'firebase/firestore'
// import { useNavigation } from '@react-navigation/native'

function Kitchen_List({ navigation }) {
  const handlePress = () => {
    navigation.goBack();
  };
  return (
    <View style={{ alignItems: 'center', paddingTop: 85,backgroundColor: '#F0F0DD', height:'100%' }}>
      <View style={{ alignItems: 'center' }}>
        <View style={{ paddingTop: 180, flexDirection: 'row' }}>

          <View style={{ marginRight: 10 }}>
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('Kitchen_List_Order')} style={{
                width: 180, height: 100, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center'
                , borderRadius: 20
                , borderWidth: 1

              }}>
                <Image style={{ height: 50, width: 50, }} source={require('../image/book.png')} />
                <Text style={{ fontSize: 18, paddingTop: 5 }}>Đơn đặt món</Text>
              </TouchableOpacity>
            </View>
            <View  style={{paddingTop:20}}>
              <TouchableOpacity onPress={() => navigation.navigate('Kitchen_List_Cooking')} style={{
                width: 180, height: 100, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center'
                , borderRadius: 20
                , borderWidth: 1

              }}>
                <Image style={{ height: 50, width: 50, }} source={require('../image/cooking_01.png')} />
                <Text style={{ fontSize: 18, paddingTop: 5 }}>Đơn Đang chế biến</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>
      <View style={{paddingTop:160}}>
        <TouchableOpacity style={{ height: 50, width: 160, borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F46C6C', borderRadius: 15 }}
          onPress={handlePress}>
          <Text style={{ fontSize: 22 }}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Kitchen_List;