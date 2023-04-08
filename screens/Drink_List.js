import { Text, StyleSheet, View, TouchableOpacity, Image, TextInput, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'

function Drink_List({navigation}) {
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


  return (
      <View style={{ backgroundColor: '#DDF0F0', height: '100%' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
              <View style={{ paddingTop: 15, marginLeft: 15 }}>
                  <TouchableOpacity style={{
                      width: 46, height: 47, backgroundColor: '#89C1CD', borderRadius: 360,
                      alignItems: 'center', justifyContent: 'center',
                      borderWidth: 2, borderColor: '#13625D',
                  }} onPress={() => navigation.navigate('List_Food')}>
                      <Image style={{
                          height: 38, width: 38, borderRadius: 360,
                      }} source={require('../image/return.png')} />
                  </TouchableOpacity>
              </View>
              <View style={{ paddingTop: 20, }}>
                  <View style={{ backgroundColor: '#86D3D3', width: 194, height: 36, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontSize: 18 }}>Thức uống</Text>
                  </View>
              </View>
              <View style={{ paddingTop: 15, marginRight: 15 }}>
                  <TouchableOpacity style={{
                      width: 46, height: 47, backgroundColor: '#89C1CD', borderRadius: 360,
                      alignItems: 'center', justifyContent: 'center',
                      borderWidth: 2, borderColor: '#13625D',
                  }}>
                      <Image style={{ width: 35, height: 35 }} source={require('../image/Notification.png')} />
                  </TouchableOpacity>
              </View>
          </View>
          <View style={{ paddingTop: 20 }}>
              <View style={{ width: '100%', height: 600, alignItems: 'center', }}>
                  <FlatList
                      style={{}}
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
                                  <View style={{ backgroundColor: '#EBE5AB', height: 60, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderTopWidth: 1
                                  , alignItems:'center', justifyContent:'center'
                                   }}>
                                      <Text style={{fontSize:16}}>{item.name}</Text>
                                      <View style={{flexDirection:'row'}}>
                                          <Text style={{fontSize:15}}>{item.price}</Text>
                                          <Text style={{ marginLeft: 2, fontSize:15 }}>{item.denominations}</Text>
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