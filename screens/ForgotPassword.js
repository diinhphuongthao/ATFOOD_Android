import { Text, StyleSheet, View, TouchableOpacity, StatusBar, TextInput, Image, } from 'react-native'
import Checkbox from 'expo-checkbox';
import React, { useState, useEffect } from 'react'
import { firebase, auth } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ForgotPassword({ navigation }) {
    const [email, setEmail] = useState('');

    const handleResetPassword = () => {
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                alert('Đã gửi email reset mật khẩu. Vui lòng kiểm tra email của bạn.');
            })
            .catch((error) => {
                alert(error.message);
            });
    };

    return (
        <View style={{ height: '100%', backgroundColor: '#F3D051', flex: 1 }}>
            <View style={{ paddingTop: 15, marginLeft: 15 }}>
                <TouchableOpacity style={{
                    width: 46, height: 47, backgroundColor: '#FFEA2F', borderRadius: 360,
                    alignItems: 'center', justifyContent: 'center',
                    borderWidth: 2, borderColor: '#BFB12D',
                }} onPress={() => navigation.navigate('Login')}>
                    <Image style={{
                        height: 38, width: 38, borderRadius: 360,
                    }} source={require('../image/return.png')} />
                </TouchableOpacity>
            </View>
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
                <Image style={{ height: 129, width: 254, }} source={require('../image/ATFOOD.png')} />
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 26, marginTop: 120, paddingBottom: 30, fontWeight: 'bold' }}>Quên mật khẩu</Text>
                <TextInput
                    placeholder="Nhập email vào"
                    style={{ borderWidth: 1, width: '80%', marginBottom: 20, padding: 10, backgroundColor: 'white', borderRadius: 10 }}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoCompleteType="email"
                    keyboardType="email-address"
                />
                <TouchableOpacity onPress={handleResetPassword}>
                    <View style={{
                        backgroundColor: '#FFEA2F', borderWidth: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center'
                        , height: 40, width: 160
                    }}>
                        <Text style={{ color: 'black', fontSize: 16 }}>Reset mật khẩu</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
export default ForgotPassword;