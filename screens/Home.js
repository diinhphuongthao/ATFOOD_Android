import { Text, StyleSheet, View, TouchableOpacity, StatusBar, TextInput, Image, FlatList, Pressable, } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'

function Home({ navigation }) {
  const [banner, setBanner] = useState([]);
  const [discount, setDiscount] = useState([]);
  const [holiday, setHoliday] = useState([]);
  const [news, setNews] = useState([]);
  const todoRef = firebase.firestore().collection('Banner');
  const todoRef_01 = firebase.firestore().collection('Discount');
  const todoRef_02 = firebase.firestore().collection('Holiday');
  const todoRef_03 = firebase.firestore().collection('News');

  useEffect(() => {
    todoRef
      .onSnapshot(
        querySnapshot => {
          const banner = []
          querySnapshot.forEach((doc) => {
            const { image, name } = doc.data()
            banner.push({
              id: doc.id,
              image,
              name,
            })
          })
          setBanner(banner)
        }
      )
  }, [])

  useEffect(() => {
    todoRef_01
      .onSnapshot(
        querySnapshot => {
          const discount = []
          querySnapshot.forEach((doc) => {
            const { image, name } = doc.data()
            discount.push({
              id: doc.id,
              image,
              name,
            })
          })
          setDiscount(discount)
        }
      )
  }, [])

  useEffect(() => {
    todoRef_02
      .onSnapshot(
        querySnapshot => {
          const holiday = []
          querySnapshot.forEach((doc) => {
            const { image, name } = doc.data()
            holiday.push({
              id: doc.id,
              image,
              name,
            })
          })
          setHoliday(holiday)
        }
      )
  }, [])

  useEffect(() => {
    todoRef_03
      .onSnapshot(
        querySnapshot => {
          const news = []
          querySnapshot.forEach((doc) => {
            const { image, name } = doc.data()
            news.push({
              id: doc.id,
              image,
              name,
            })
          })
          setNews(news)
        }
      )
  }, [])



  return (
    <View style={{ backgroundColor: '#DDF0F0', height: '100%' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
        <View style={{ paddingTop: 10, marginLeft: 10 }}>
          <TouchableOpacity style={{
            width: 46, height: 47, backgroundColor: '#89C1CD', borderRadius: 360,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 2, borderColor: '#13625D',
          }} onPress={() => navigation.navigate('Profile')} >
            <Image style={{ width: 40, height: 40, borderRadius: 360 }} source={require('../image/User.png')} />
          </TouchableOpacity>
        </View>
        <View style={{ paddingTop: 18, }}>
          <View style={{ backgroundColor: '#f5f5f5', width: 240, height: 36, borderWidth: 1, justifyContent: 'center', borderRadius: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ paddingLeft: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{ width: 22, height: 22 }} source={require('../image/search.png')} />
              </View>
              <View style={{ paddingLeft: 10, }}>
                <TextInput placeholder='giảm giá, ngày lễ,...' style={{ fontSize: 16, }}></TextInput>
              </View>
            </View>
          </View>
        </View>
        <View style={{ paddingTop: 12, marginRight: 10 }}>
          <TouchableOpacity style={{
            width: 46, height: 47, backgroundColor: '#89C1CD', borderRadius: 360,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 2, borderColor: '#13625D',
          }}>
            <Image style={{ width: 35, height: 35 }} source={require('../image/Notification.png')} />
          </TouchableOpacity>
        </View>
      </View>


      <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}>
        <FlatList
          style={{}}
          data={banner}
          numColumns={1}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <Image style={{ width: 320, height: 128 }} source={{
                uri: item.image
              }} />
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 30, }}>
        <TouchableOpacity style={{
          width: 102, height: 54, backgroundColor: '#ffffff', marginRight: 20, alignItems: 'center', justifyContent: 'center'
          , borderRadius: 10
          , borderWidth: 1
        }}>
          <Image style={{ height: 28, width: 28, }} source={require('../image/table.png')} />
          <Text style={{ fontSize: 11 }}>Table reservations</Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={() => navigation.navigate('List_Food')} style={{
          width: 102, height: 54, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center'
          , borderRadius: 10
          , borderWidth: 1
        }}>
          <Image style={{ height: 28, width: 28, }} source={require('../image/order.png')} />
          <Text style={{ fontSize: 11 }}>Food order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          width: 102, height: 54, backgroundColor: '#ffffff', marginLeft: 20, alignItems: 'center', justifyContent: 'center'
          , borderRadius: 10
          , borderWidth: 1
        }}>
          <Image style={{ height: 28, width: 28, }} source={require('../image/food.png')} />
          <Text style={{ fontSize: 11, marginRight: 3 }}>Menu</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingTop: 20 }}>
        <View style={{ paddingBottom: 4 }}>
          <Image style={{ height: 28, width: 98, }} source={require('../image/Discount.png')} />
        </View>
      </View>
      <View >
        <View style={{ width: '100%', height: 100, backgroundColor: '#ffffff' }}>
          <FlatList
            style={{}}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={discount}
            renderItem={({ item }) => (
              <View style={{ justifyContent: 'center' }}>
                <TouchableOpacity style={{ marginLeft: 15, justifyContent: 'center', borderWidth: 1, borderRadius: 10 }}>
                  <Image style={{ width: 138, height: 92, }} source={{
                    uri: item.image
                  }} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>

      <View style={{ paddingTop: 20 }}>
        <View style={{ paddingBottom: 4 }}>
          <Image style={{ height: 28, width: 98, }} source={require('../image/Holiday.png')} />
        </View>
      </View>
      <View >
        <View style={{ width: '100%', height: 100, backgroundColor: '#ffffff' }}>
          <FlatList
            style={{}}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={holiday}
            renderItem={({ item }) => (
              <View style={{ justifyContent: 'center' }}>
                <TouchableOpacity style={{ marginLeft: 15, justifyContent: 'center', borderWidth: 1, borderRadius: 10 }}>
                  <Image style={{ width: 138, height: 92, }} source={{
                    uri: item.image
                  }} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>

      <View style={{ paddingTop: 20 }}>
        <View style={{ paddingBottom: 4 }}>
          <Image style={{ height: 28, width: 76, }} source={require('../image/News.png')} />
        </View>
      </View>
      <View >
        <View style={{ width: '100%', height: 100, backgroundColor: '#ffffff' }}>
          <FlatList
            style={{}}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={news}
            renderItem={({ item }) => (
              <View style={{ justifyContent: 'center' }}>
                <TouchableOpacity style={{ marginLeft: 15, justifyContent: 'center', borderWidth: 1, borderRadius: 10 }}>
                  <Image style={{ width: 138, height: 92, }} source={{
                    uri: item.image
                  }} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>


    </View>
  )
}

export default Home;