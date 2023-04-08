import { Text, StyleSheet, View, TouchableOpacity, Image, TextInput, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import Geocoding from 'react-native-geocoding';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Animated } from 'react-native-maps';

function Profile({ navigation }) {
    const [users, setUsers] = useState([]);
    const db = getFirestore();
    const docRef = doc(db, 'users', firebase.auth().currentUser.uid)
    const currentUser = firebase.auth().currentUser;
    const todoRef = firebase.firestore().collection('users');
    const [editModalVisible, setEditModalVisible] = useState(false);


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




    const [address, setAddress] = useState('');
    const [region, setRegion] = useState({
        latitude: 10.8231,
        longitude: 106.6297,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [marker, setMarker] = useState({
        coordinate: {
            latitude: 10.8231,
            longitude: 106.6297,
        },
    });
    

    const handleSearch = async () => {
        try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                address
            )}&key=${'AIzaSyD-7KtEO8VS2FGW1qkLcKdYMc-1LyUJbTM'}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.results[0] && data.results[0].geometry) {
                const location = data.results[0].geometry.location;
                setMarker({
                    coordinate: {
                        latitude: location.lat,
                        longitude: location.lng,
                    },
                });
                setRegion({
                    latitude: location.lat,
                    longitude: location.lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
            } else {
                alert('Địa chỉ không hợp lệ')
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handlePresss = () => {
        navigation.goBack();
    };

    const handlePress = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setMarker({
            coordinate: { latitude, longitude },
        });
    };

    const [modalVisible, setModalVisible] = useState(false);

    const handlePressMoodal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const [markerAddress, setMarkerAddress] = useState('');
    const [textInputValue, setTextInputValue] = useState("");
 
    const handleMarkerPress = (event) => {
        const { coordinate } = event.nativeEvent;
        const { latitude, longitude } = coordinate;
    
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${'AIzaSyD-7KtEO8VS2FGW1qkLcKdYMc-1LyUJbTM'}`;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                if (data.results && data.results.length > 0) {
                    const address = data.results[0].formatted_address;
                    setAddress(address);
                    setMarkerAddress(address);
                    setTextInputValue("");
                    console.log(`Địa chỉ: ${address}, Tọa độ: (${latitude}, ${longitude})`);
                } else {
                    console.log('Không tìm thấy địa chỉ');
                }
            })
            .catch((error) => console.error(error));
    };

    const handleConfirmButtonPress = () => {
        // Thêm thuộc tính mới "address" vào document của currentUser trong collection "users"
        firebase.firestore().collection('users').doc(currentUser.uid).update({
            address: address,
        })
        .then(() => {
            console.log(address);
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
        });
    
        // Xóa nội dung của TextInput
        setTextInputValue("");
    }
    

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
            </View>
            <View style={{ alignItems: 'center', paddingTop: 50 }}>
                <View style={{ justifyContent: 'center', width: '100%', height: 320, backgroundColor: '#9ABEF4', }}>
                    <View>
                        <Text style={{ fontSize: 16, width: 300, marginLeft: 10 }}>Tên:</Text>
                        <View style={{ flexDirection: 'row', }}>
                            <Text style={{ fontSize: 20, width: 350, marginLeft: 10 }}>{users.name}</Text>
                            <TouchableOpacity style={{ justifyContent: 'center' }}>
                                <Image style={{ width: 20, height: 20, }} source={require('../image/edit.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, width: 300, paddingTop: 15, marginLeft: 10 }}>Số điện thoại:</Text>
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
                    <View>
                        <Text style={{ fontSize: 16, width: 300, paddingTop: 15, marginLeft: 10 }}>Địa chỉ:</Text>
                        <View style={{ flexDirection: 'row', }}>
                            <Text style={{ fontSize: 20, width: 350, marginLeft: 10, }}>{users.address}</Text>
                            <TouchableOpacity onPress={handlePressMoodal}>
                                <Image style={{ width: 20, height: 20 }} source={require('../image/edit.png')} />
                            </TouchableOpacity>
                            <Modal
                                animationType="slide"
                                visible={modalVisible}
                                onRequestClose={handleCloseModal}
                            >
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                        <View style={{ paddingTop: 15, marginLeft: 15 }}>
                                            <TouchableOpacity style={{
                                                width: 46, height: 47, backgroundColor: '#89C1CD', borderRadius: 360,
                                                alignItems: 'center', justifyContent: 'center',
                                                borderWidth: 2, borderColor: '#13625D',
                                            }} onPress={handleCloseModal}>
                                                <Image style={{
                                                    height: 38, width: 38, borderRadius: 360,
                                                }} source={require('../image/return.png')} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ paddingTop: 20, }}>
                                            <View style={{ backgroundColor: '#86D3D3', width: 194, height: 36, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 18 }}>Bản đồ</Text>
                                            </View>
                                        </View>
                                        <View style={{ paddingTop: 15, marginRight: 15 }}>
                                            <TouchableOpacity style={{
                                                width: 46, height: 47, backgroundColor: '#89C1CD', borderRadius: 360,
                                                alignItems: 'center', justifyContent: 'center',
                                                borderWidth: 2, borderColor: '#13625D',
                                            }} onPress={() => navigation.navigate('Order_History')}>
                                                <Image style={{
                                                    height: 30, width: 30
                                                }} source={require('../image/order_history.png')} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <TextInput
                                        style={styles.searchInput}
                                        value={address || markerAddress}
                                        onChangeText={(text) => setAddress(text) || setMarkerAddress(text)}
                                        onSubmitEditing={handleSearch}
                                        placeholder="Enter address"
                                    />
                                    <TouchableOpacity onPress={handleConfirmButtonPress}>
                                        <Text>Xác nhận</Text>
                                    </TouchableOpacity>
                                    <MapView style={styles.map}
                                        region={region}
                                        onPress={handlePress}>
                                        <Marker coordinate={marker.coordinate} onPress={handleMarkerPress} />
                                    </MapView>
                                </View>
                            </Modal>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ paddingTop: 20 }}>
                <View style={{ paddingTop: 10 }}>
                    <TouchableOpacity style={{ width: '100%', height: 50, backgroundColor: '#669DF0', justifyContent: 'center' }}>
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
                    <TouchableOpacity style={{ width: '100%', height: 50, backgroundColor: '#669DF0', justifyContent: 'center' }}>
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
                    <TouchableOpacity style={{ width: '100%', height: 50, backgroundColor: '#669DF0', justifyContent: 'center' }}>
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

            <View style={{ alignItems: 'center', paddingTop: 35 }}>
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