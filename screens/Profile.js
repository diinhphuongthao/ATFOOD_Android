import { Text, StyleSheet, View, TouchableOpacity, Image, TextInput, Alert, } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import { collection, doc, getDoc, getFirestore, setDoc, onSnapshot, } from 'firebase/firestore'
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import Geocoding from 'react-native-geocoding';


import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Animated } from 'react-native-maps';

function Profile({ navigation }) {
    const [users, setUsers] = useState([]);
    const [editName, setEditName] = useState(false);
    const [editEmail, setEditEmail] = useState(false);
    const [editPhone, setEditPhone] = useState(false);
    const [editAddress, setEditAddress] = useState(false);
    const currentUser = firebase.auth().currentUser;
    const todoRef = firebase.firestore().collection('users');
    const handlePresss = () => {
        navigation.goBack();
    };
    useEffect(() => {
        const docRef = firebase.firestore().collection('users').doc(currentUser.uid);

        const unsubscribe = docRef.onSnapshot((doc) => {
            setUsers(doc.data());
            console.log(doc.data())
        }, (error) => {
            console.error('Error fetching user data: ', error);
            alert(error.message);
        });

        return () => {
            unsubscribe(); // Hủy đăng ký lắng nghe khi component bị hủy
        };
    }, [currentUser]);

    const updateName = async () => {
        const userRef = firebase.firestore().collection('users').doc(currentUser.uid);
        await userRef.update({
            name: users.name,
        }).catch((error) => {
            console.error('Error updating name: ', error);
        });
    };

    const updateEmail = async () => {
        const userRef = firebase.firestore().collection('users').doc(currentUser.uid);
        await userRef.update({
            email: users.email,
        }).catch((error) => {
            console.error('Error updating email: ', error);
        });
    };

    const updatePhone = async () => {
        const userRef = firebase.firestore().collection('users').doc(currentUser.uid);
        await userRef.update({
            phone: users.phone,
        }).catch((error) => {
            console.error('Error updating phone: ', error);
        });
    };

    const updateAddress = async () => {
        const userRef = firebase.firestore().collection('users').doc(currentUser.uid);
        await userRef.update({
            address: users.address,
        }).catch((error) => {
            console.error('Error updating address: ', error);
        });
    };

    const [initialName, setInitialName] = useState(users.name);
    const handleEditName = () => {
        if (editName) {
            if (users.name !== initialName) {
                Alert.alert(
                    'Confirm Changes',
                    'Are you sure you want to update this information?',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => setUsers({ ...users, name: initialName }),
                            style: 'cancel',
                        },
                        {
                            text: 'OK',
                            onPress: () => {
                                setEditName(false);
                                updateName();
                            },
                        },
                    ],
                );
            } else {
                setEditName(false);
            }
        } else {
            setInitialName(users.name);
            setEditName(true);
        }
    };

    const [initialPhone, setInitialPhone] = useState(users.phone);
    const handleEditPhone = () => {
        if (editPhone) {
            if (users.phone !== initialPhone) {
                Alert.alert(
                    'Confirm Changes',
                    'Are you sure you want to update this information?',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => setUsers({ ...users, phone: initialPhone }),
                            style: 'cancel',
                        },
                        {
                            text: 'OK',
                            onPress: () => {
                                setEditPhone(false);
                                updatePhone();
                            },
                        },
                    ],
                );
            } else {
                setEditPhone(false);
            }
        } else {
            setInitialPhone(users.phone);
            setEditPhone(true);
        }
    };

    const [initialMail, setInitialMail] = useState(users.email);
    const handleEditMail = () => {
        if (editEmail) {
            if (users.email !== initialMail) {
                Alert.alert(
                    'Confirm Changes',
                    'Are you sure you want to update this information?',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => setUsers({ ...users, email: initialMail }),
                            style: 'cancel',
                        },
                        {
                            text: 'OK',
                            onPress: () => {
                                setEditEmail(false);
                                updateEmail();
                            },
                        },
                    ],
                );
            } else {
                setEditEmail(false);
            }
        } else {
            setInitialMail(users.email);
            setEditEmail(true);
        }
    };
    const [initialAddress, setInitialAddress] = useState(users.address);
    const handleEditAddress = () => {
        if (editAddress) {
            if (users.address !== initialAddress) {
                Alert.alert(
                    'Confirm Changes',
                    'Are you sure you want to update this information?',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => setUsers({ ...users, address: initialAddress }),
                            style: 'cancel',
                        },
                        {
                            text: 'OK',
                            onPress: () => {
                                setEditAddress(false);
                                updateAddress();
                            },
                        },
                    ],
                );
            } else {
                setEditAddress(false);
            }
        } else {
            setInitialAddress(users.address);
            setEditAddress(true);
        }
    };



    return (
        <View style={{ backgroundColor: '#F0F0DD', height: '100%' }}>
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
            <View style={{ alignItems: 'center',paddingTop: 10 }}>
                <Image style={{ width: 100, height: 100, }} source={require('../image/profile.png')} />
            </View>
            <View style={{ alignItems: 'center', paddingTop: 20 }}>
                <View style={{ justifyContent: 'center', width: '100%', height: 280, backgroundColor: '#FFE55E', }}>
                    <View>
                        <Text style={{ fontSize: 16, width: 300, marginLeft: 10 }}>Tên:</Text>
                        <View style={{ flexDirection: 'row', }}>
                            <TextInput style={{ fontSize: 20, width: 350, marginLeft: 10 }}
                                editable={editName}
                                value={users.name}
                                onChangeText={(text) => setUsers({ ...users, name: text })}
                            ></TextInput>
                            <TouchableOpacity onPress={handleEditName} style={{ justifyContent: 'center' }}>
                                <Image style={{ width: 20, height: 20, }} source={require('../image/edit.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, width: 300, paddingTop: 15, marginLeft: 10 }}>Số điện thoại:</Text>
                        <View style={{ flexDirection: 'row', }}>
                            <TextInput style={{ fontSize: 20, width: 350, marginLeft: 10 }}
                                editable={editPhone}
                                value={users.phone}
                                keyboardType="numeric"
                                onChangeText={(number) => setUsers({ ...users, phone: number })}
                            ></TextInput>
                            <TouchableOpacity onPress={handleEditPhone} style={{ justifyContent: 'center' }}>
                                <Image style={{ width: 20, height: 20, }} source={require('../image/edit.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, width: 300, paddingTop: 15, marginLeft: 10 }}>Email:</Text>
                        <View style={{ flexDirection: 'row', }}>
                            <TextInput style={{ fontSize: 20, width: 350, marginLeft: 10, }}
                                editable={editEmail}
                                value={users.email}
                                onChangeText={(text) => setUsers({ ...users, email: text })}
                            ></TextInput>
                            <TouchableOpacity onPress={handleEditMail} style={{ justifyContent: 'center' }}>
                                <Image style={{ width: 20, height: 20, }} source={require('../image/edit.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, width: 300, paddingTop: 15, marginLeft: 10 }}>Địa chỉ:</Text>
                        <View style={{ flexDirection: 'row', }}>
                            <TextInput style={{ fontSize: 20, width: 350, marginLeft: 10, }}
                                editable={editAddress}
                                value={users.address}
                                onChangeText={(text) => setUsers({ ...users, address: text })}
                            ></TextInput>
                            <TouchableOpacity onPress={handleEditAddress} style={{ justifyContent: 'center' }}>
                                <Image style={{ width: 20, height: 20, }} source={require('../image/edit.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ paddingTop: 20 }}>
                <View style={{ paddingTop: 10 }}>
                    <TouchableOpacity style={{ width: '100%', height: 50, backgroundColor: '#BFB12D', justifyContent: 'center' }}>
                        <View style={{ justifyContent: 'flex-start', flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'flex-start', flexDirection: 'row', width: 100 }}>
                                <Image style={{ width: 25, height: 25, marginLeft: 10, }} source={require('../image/coupon.png')} />
                                <Text style={{ marginLeft: 10, fontSize: 16 }}>Khuyến mãi</Text>
                            </View>
                            <View style={{ justifyContent: 'center' }}>
                                <Image style={{ width: 20, height: 20, marginLeft: 260, }} source={require('../image/right-arrow.png')} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ paddingTop: 10 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Order_History_Detail')} style={{ width: '100%', height: 50, backgroundColor: '#BFB12D', justifyContent: 'center' }}>
                        <View style={{ justifyContent: 'flex-start', flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'flex-start', flexDirection: 'row', width: 100 }}>
                                <Image style={{ width: 25, height: 25, marginLeft: 10, }} source={require('../image/invoice.png')} />
                                <Text style={{ marginLeft: 10, fontSize: 16 }}>Đơn món</Text>
                            </View>
                            <View style={{ justifyContent: 'center' }}>
                                <Image style={{ width: 20, height: 20, marginLeft: 260, }} source={require('../image/right-arrow.png')} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ paddingTop: 10 }}>
                    <TouchableOpacity style={{ width: '100%', height: 50, backgroundColor: '#BFB12D', justifyContent: 'center' }}>
                        <View style={{ justifyContent: 'flex-start', flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'flex-start', flexDirection: 'row', width: 100 }}>
                                <Image style={{ width: 25, height: 25, marginLeft: 10, }} source={require('../image/customer-service.png')} />
                                <Text style={{ marginLeft: 10, fontSize: 16 }}>Trợ giúp</Text>
                            </View>
                            <View style={{ justifyContent: 'center' }}>
                                <Image style={{ width: 20, height: 20, marginLeft: 260, }} source={require('../image/right-arrow.png')} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ alignItems: 'center', paddingTop: 30 }}>
                <TouchableOpacity style={{ height: 50, width: 160, borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F46C6C', borderRadius: 15 }}
                    onPress={() => { firebase.auth().signOut() }}>
                    <Text style={{ fontSize: 22 }}>
                        Đăng xuất
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: '100%',
        height: '70%',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginHorizontal: 16,
        marginBottom: 16,
        width: '90%',
        backgroundColor: '#fff',
    },
});


export default Profile;