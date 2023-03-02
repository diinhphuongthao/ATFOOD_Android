import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'

function Profile({ navigation }) {
    const [users, setUsers] = useState([]);
    const db = getFirestore();
    const docRef = doc(db, 'users', firebase.auth().currentUser.uid)
    const todoRef = firebase.firestore().collection('users');
    const docSnap = async () => {
        try {
            await getDoc(docRef).then((doc) => {
                setUsers(doc.data());
                console.log(doc.data())
            });

        } catch (error) {
            alert(error.messgae)
        }
    }

    useEffect(() => {
        docSnap();
    }, [])

    return (
        <View style={{ backgroundColor: '#DDF0F0', height: '100%' }}>
            <View style={{ paddingTop: 15, marginLeft: 15 }}>
                <TouchableOpacity style={{
                    width: 46, height: 47, backgroundColor: '#89C1CD', borderRadius: 360,
                    alignItems: 'center', justifyContent: 'center',
                    borderWidth: 2, borderColor: '#13625D',
                }} onPress={() => navigation.navigate('Home')}>
                    <Image style={{
                        height: 38, width: 38, borderRadius: 360,
                    }} source={require('../image/return.png')} />
                </TouchableOpacity>
            </View>
            <View style={{ alignItems: 'center' }}>
                <View style={{ alignItems: 'center', paddingTop: 20, width: 280, borderTopLeftRadius: 60, borderTopRightRadius: 60 }}>
                    <Image style={{ width: 140, height: 140, borderRadius: 360 }} source={require('../image/User_Profile.png')} />
                </View>
            </View>
            <View style={{ alignItems: 'center', paddingTop: 20 }}>
                <View style={{ justifyContent: 'center', width: '100%', height: 200, backgroundColor: '#9ABEF4', }}>
                    <View>
                        <Text style={{ fontSize: 16, width: 300, marginLeft: 10 }}>Name:</Text>
                        <View style={{ flexDirection: 'row', }}>
                            <Text style={{ fontSize: 20, width: 350, marginLeft: 10 }}>{users.name}</Text>
                            <TouchableOpacity style={{ justifyContent: 'center' }}>
                                <Image style={{ width: 20, height: 20, }} source={require('../image/edit.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, width: 300, paddingTop: 15, marginLeft: 10 }}>Phone Number:</Text>
                        <View style={{ flexDirection: 'row', }}>
                            <Text style={{ fontSize: 20, width: 350, marginLeft: 10 }}>{users.phone}</Text>
                            <TouchableOpacity style={{ justifyContent: 'center' }}>
                                <Image style={{ width: 20, height: 20, }} source={require('../image/edit.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, width: 300, paddingTop: 15, marginLeft: 10 }}>Email:</Text>
                        <View style={{ flexDirection: 'row', }}>
                            <Text style={{ fontSize: 20, width: 350, marginLeft: 10, }}>{users.email}</Text>
                            <TouchableOpacity style={{ justifyContent: 'center' }}>
                                <Image style={{ width: 20, height: 20, }} source={require('../image/edit.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ paddingTop: 10 }}>
                <View style={{ paddingTop: 10 }}>
                    <TouchableOpacity style={{ width: '100%', height: 50, backgroundColor: '#669DF0', justifyContent: 'center' }}>
                        <View style={{ justifyContent: 'flex-start', flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'flex-start', flexDirection: 'row', width: 100 }}>
                                <Image style={{ width: 25, height: 25, marginLeft: 10, }} source={require('../image/coupon.png')} />
                                <Text style={{ marginLeft: 10, fontSize: 16 }}>Coupon</Text>
                            </View>
                            <View style={{ justifyContent: 'center' }}>
                                <Image style={{ width: 20, height: 20, marginLeft: 260, }} source={require('../image/right-arrow.png')} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ paddingTop: 10 }}>
                    <TouchableOpacity style={{ width: '100%', height: 50, backgroundColor: '#669DF0', justifyContent: 'center' }}>
                        <View style={{ justifyContent: 'flex-start', flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'flex-start', flexDirection: 'row', width: 100 }}>
                                <Image style={{ width: 25, height: 25, marginLeft: 10, }} source={require('../image/invoice.png')} />
                                <Text style={{ marginLeft: 10, fontSize: 16 }}>Transaction</Text>
                            </View>
                            <View style={{ justifyContent: 'center' }}>
                                <Image style={{ width: 20, height: 20, marginLeft: 260, }} source={require('../image/right-arrow.png')} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ paddingTop: 10 }}>
                    <TouchableOpacity style={{ width: '100%', height: 50, backgroundColor: '#669DF0', justifyContent: 'center' }}>
                        <View style={{ justifyContent: 'flex-start', flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'flex-start', flexDirection: 'row', width: 100 }}>
                                <Image style={{ width: 25, height: 25, marginLeft: 10, }} source={require('../image/customer-service.png')} />
                                <Text style={{ marginLeft: 10, fontSize: 16 }}>Support</Text>
                            </View>
                            <View style={{ justifyContent: 'center' }}>
                                <Image style={{ width: 20, height: 20, marginLeft: 260, }} source={require('../image/right-arrow.png')} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ alignItems: 'center', paddingTop: 35 }}>
                <TouchableOpacity style={{ height: 50, width: 160, borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F46C6C', borderRadius: 15 }}
                    onPress={() => { firebase.auth().signOut() }}>
                    <Text style={{ fontSize: 22 }}>
                        Sign Out
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}


export default Profile;