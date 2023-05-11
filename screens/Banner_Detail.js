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

    const goBack = () => {
        navigation.goBack()
    }

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
        <View style={{ backgroundColor: '#F0F0DD', height: '100%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                <View style={{ paddingTop: 15, marginLeft: 15 }}>
                    <TouchableOpacity style={{
                        width: 46, height: 47, backgroundColor: '#FFE55E', borderRadius: 360,
                        alignItems: 'center', justifyContent: 'center',
                        borderWidth: 2, borderColor: '#BFB12D',
                    }} onPress={goBack}>
                        <Image style={{
                            height: 38, width: 38, borderRadius: 360,
                        }} source={require('../image/return.png')} />
                    </TouchableOpacity>
                </View>
                <View style={{ paddingTop: 20, marginRight: 95 }}>
                    <View style={{ backgroundColor: '#F3D051', width: 194, height: 36, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18 }}>Nội dung</Text>
                    </View>
                </View>
            </View>
            <View style={{ alignItems: 'center', paddingTop: 80 }}>
                <Image style={{ width: 288, height: 188, }} source={{
                    uri: discount.image || holiday.image || news.image
                }} />

            </View>
            <View style={{ alignItems: 'center', paddingTop: 40 }}>
                <View style={{ width: 300 }}>
                    <Text style={{ textAlign: 'center', fontSize: 26, fontWeight:'bold' }}>{discount.name || holiday.name || news.name}</Text>
                </View>
                <View style={{ width: 300, paddingTop: 10 }}>
                    <Text style={{ textAlign: 'justify', fontSize: 20 }}>{discount.description || holiday.description || news.description}</Text>
                </View>
            </View>
        </View>
    )
}

export default Banner_Detail;