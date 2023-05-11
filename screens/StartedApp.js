import { Text, StyleSheet, View, TouchableOpacity, StatusBar, Image, SafeAreaView, ImageBackground } from 'react-native'
import React, { Component } from 'react'

function StartedApp({ navigation }) {
    return (
        <SafeAreaView>
            <StatusBar></StatusBar>
            <View style={{ backgroundColor: '#F3D051', height: '100%', }}>

                {/* <View> */}

                <View style={{ alignItems: 'center', paddingTop:200 }}>
                    <Image style={{ height: 129, width: 254, }} source={require('../image/ATFOOD.png')} />
                </View>

                <View style={{ alignItems: 'center', paddingTop: 20, }}>

                    <View style={{ alignItems: 'center', paddingBottom: 30 }}>
                        <Image style={{ height: 47, width: 284, }} source={require('../image/Slogun.png')} />
                    </View>

                </View>
                <View style={{ alignItems: 'center', paddingTop:200 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <View style={{
                            justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: '#FFEA2F', width: 240
                            , height: 60
                            , borderRadius: 20
                            , borderWidth: 2
                            , borderColor: '#BFB12D'
                        }}>
                            <View>
                                <Text style={{ marginLeft: 12, fontSize: 18, color: '#000000' }}>Bắt đầu</Text>
                            </View>
                            <View>
                                <Image style={{ marginLeft: 5, height: 18, width: 32, }} source={require('../image/right_arow.png')} />
                            </View>
                        </View>

                    </TouchableOpacity>

                </View>

                {/* </View> */}



            </View>
        </SafeAreaView>
    )

}

export default StartedApp;