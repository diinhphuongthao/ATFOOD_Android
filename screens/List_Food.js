import { Text, StyleSheet, View, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'

function List_Food({ navigation }) {
  return (
    <View style={{ backgroundColor: '#F0F0DD', height: '100%' }}>

      <View style={{ flexDirection: 'row', }}>
        <View style={{ paddingTop: 15, marginLeft: 15 }}>
          <TouchableOpacity style={{
            width: 46, height: 47, backgroundColor: '#FFE55E', borderRadius: 360,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 2, borderColor: '#BFB12D',
          }} onPress={() => navigation.navigate('Home')}>
            <Image style={{
              height: 38, width: 38, borderRadius: 360,
            }} source={require('../image/return.png')} />
          </TouchableOpacity>
        </View>
        <View style={{ paddingTop: 20, marginLeft:40 }}>
          <View style={{ backgroundColor: '#F3D051', width: 194, height: 36, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18 }}>Loại món ăn</Text>
          </View>
        </View>
      </View>
      {/* <View style={{alignItems: 'center',paddingTop: 140,}}>
        <View style={{   alignItems:'center',backgroundColor: '#DBB016',height:50, width:280, justifyContent:'center',borderRadius:20 }}>
          <Text style={{fontSize:20}}>Choose a variety of dishes</Text>
        </View>
      </View> */}

      <View style={{ alignItems: 'center' }}>
        <View style={{ paddingTop: 180, flexDirection: 'row' }}>

          <View style={{ marginRight: 10 }}>
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('Meat_List')} style={{
                width: 160, height: 100, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center'
                , borderRadius: 20
                , borderWidth: 1

              }}>
                <Image style={{ height: 50, width: 50, }} source={require('../image/meal.png')} />
                <Text style={{ fontSize: 18, paddingTop: 5 }}>Món thịt</Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingTop: 20 }}>
              <TouchableOpacity onPress={() => navigation.navigate('Fish_List')} style={{
                width: 160, height: 100, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center'
                , borderRadius: 20
                , borderWidth: 1
                ,
              }}>
                <Image style={{ height: 50, width: 50, }} source={require('../image/fish_01.png')} />
                <Text style={{ fontSize: 18, paddingTop: 5 }}>Món cá</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginLeft: 10 }}>
            <View style={{}}>
              <TouchableOpacity onPress={() => navigation.navigate('Soup_List')} style={{
                width: 160, height: 100, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center'
                , borderRadius: 20
                , borderWidth: 1
                ,
              }}>
                <Image style={{ height: 50, width: 50, }} source={require('../image/hot_soup.png')} />
                <Text style={{ fontSize: 18, paddingTop: 5 }}>Món canh</Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingTop: 20 }}>
              <TouchableOpacity onPress={() => navigation.navigate('Drink_List')} style={{
                width: 160, height: 100, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center'
                , borderRadius: 20
                , borderWidth: 1
                ,
              }}>
                <Image style={{ height: 50, width: 50, }} source={require('../image/soft_drink.png')} />
                <Text style={{ fontSize: 18, paddingTop: 5 }}>Thức uống</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      {/* <View style={{ paddingTop: 215, marginRight: 15, alignItems: 'flex-end' }}>
        <TouchableOpacity style={{
          width: 50, height: 50, backgroundColor: '#FFE55E', borderRadius: 360,
          alignItems: 'center', justifyContent: 'center',
          borderWidth: 2, borderColor: '##BFB12D',
        }} onPress={() => navigation.navigate('Chat_NVPV')}>
          <Image style={{
            height: 38, width: 38,
          }} source={require('../image/chat_box.png')} />
        </TouchableOpacity>
      </View> */}
    </View>
  )
}

export default List_Food;