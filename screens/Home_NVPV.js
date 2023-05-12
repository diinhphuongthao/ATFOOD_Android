import { Text, StyleSheet, View, TouchableOpacity, StatusBar, TextInput, Image, FlatList, Pressable, } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'

function Home_NVPV({ navigation, route }) {
  const { IdStaff } = route.params;
  const { Staff } = route.params;
  console.log("idStaff:" + IdStaff)
  console.log("Staff:" + Staff)
  const handlePress = () => {
    navigation.goBack();
  };
  const [email, setEmail] = useState('');
  const userRef = firebase.firestore().collection('Staff').where('email', '==', IdStaff || Staff);
  userRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      const userData = doc.data();
      setEmail(userData.email)
    });
  }).catch((error) => {
    console.log("Error getting documents: ", error);
  });

  return (
    <View style={{ alignItems: 'center', paddingTop: 85, backgroundColor: '#F0F0DD', height: '100%' }}>
      <View style={{ alignItems: 'center' }}>
        <View style={{ paddingTop: 180, flexDirection: 'row' }}>

          <View style={{ marginRight: 10 }}>
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('Order_NVPV')} style={{
                width: 160, height: 100, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center'
                , borderRadius: 20
                , borderWidth: 1

              }}>
                <Image style={{ height: 50, width: 50, }} source={require('../image/order.png')} />
                <Text style={{ fontSize: 18, paddingTop: 5 }}>Order</Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingTop: 20 }}>
              <TouchableOpacity onPress={() => navigation.navigate('Table_NVPV', { EmailStaff: IdStaff })} style={{
                width: 160, height: 100, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center'
                , borderRadius: 20
                , borderWidth: 1
                ,
              }}>
                <Image style={{ height: 50, width: 50, }} source={require('../image/table.png')} />
                <Text style={{ fontSize: 18, paddingTop: 5 }}>Table</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginLeft: 10 }}>
            <View style={{}}>
              <TouchableOpacity onPress={() => navigation.navigate('Chat', { EmailStaff: email })} style={{
                width: 160, height: 100, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center'
                , borderRadius: 20
                , borderWidth: 1
                ,
              }}>
                <Image style={{ height: 50, width: 50, }} source={require('../image/chat_box.png')} />
                <Text style={{ fontSize: 18, paddingTop: 5 }}>Chat</Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingTop: 20 }}>
              <TouchableOpacity onPress={() => navigation.navigate('List_Food_NVPV', { EmailStaff: IdStaff || Staff })} style={{
                width: 160, height: 100, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center'
                , borderRadius: 20
                , borderWidth: 1
                ,
              }}>
                <Image style={{ height: 50, width: 50, marginLeft: 6 }} source={require('../image/food.png')} />
                <Text style={{ fontSize: 18, paddingTop: 5 }}>Menu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={{ paddingTop: 180 }}>
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

export default Home_NVPV;