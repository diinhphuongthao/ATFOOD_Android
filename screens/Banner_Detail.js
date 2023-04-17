import { Text, StyleSheet, View, TouchableOpacity, StatusBar, TextInput, Image, FlatList, Pressable, } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'

function Banner_Detail({ navigation, route }) {
    const { bannerId } = route.params;
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
                        const { image, name, description } = doc.data()
                        discount.push({
                            id: doc.id,
                            image,
                            name,
                            description
                        })
                    })
                    const banner = discount.find(banner => banner.id === bannerId)
                    if (banner) {
                        setDiscount(banner)
                    }
                }
            )
    }, [bannerId, discount])

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
                    const banner = holiday.find(banner => banner.id === bannerId)
                    if (banner) {
                        setHoliday(banner)
                    }

                }
            )
    }, [bannerId, holiday])

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
                    const banner = news.find(banner => banner.id === bannerId)
                    if (banner) {
                        setNews(banner)
                    }

                }
            )
    }, [])

    return (
        <View>
           
            <View style={{ alignItems: 'center', paddingTop:80 }}>
                <Image style={{ width: 288, height: 188, }} source={{
                    uri: discount.image || holiday.image || news.image
                }} />

            </View>
            <View style={{ alignItems: 'center', paddingTop:40 }}>
                <View style={{ width: 300}}>
                    <Text style={{ textAlign: 'justify', fontSize:20 }}>{discount.description}</Text>
                </View>
            </View>
        </View>
    )
}

export default Banner_Detail;