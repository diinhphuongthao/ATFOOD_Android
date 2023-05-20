import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import { v4 as uuidv4 } from 'uuid';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc, onSnapshot, where } from 'firebase/firestore'

function Table_NVPV_Detail({ navigation, route }) {
    const { TableId } = route.params;
    const [users, setUsers] = useState([]);
    // const currentUser = firebase.auth().currentUser;
    const [TableDetail, setTableDetail] = useState([]);
    const db = getFirestore();
    // const docRef1 = doc(db, 'users', where(''))
    const docRef = doc(db, 'Table', TableId)
    useEffect(() => {
        const LoadDetail = async () => {
            const unsubscribe = onSnapshot(docRef, (doc) => {
                if (doc.exists()) {
                    setTableDetail(doc.data());
                }
            });
            return unsubscribe;
        };
        LoadDetail();
    }, [TableId]);

    // const docSnap = async () => {
    //     try {
    //         await getDoc(docRef1).then((doc) => {
    //             setUsers(doc.data());
    //         });

    //     } catch (error) {
    //         alert(error.messgae)
    //     }
    // }

    // useEffect(() => {
    //     docSnap();
    // }, [])

    const getAmountRange = (number) => {
        if (number >= 1 && number <= 6) {
            return [2, 4];
        } else if (number >= 7 && number <= 12) {
            return [5, 8];
        } else if (number >= 13 && number <= 16) {
            return [9, 12];
        } else {
            return null; // hoặc throw exception tùy vào nhu cầu sử dụng
        }
    }
    const getAmountDefault = (number) => {
        if (number >= 1 && number <= 6) {
            return 2;
        } else if (number >= 7 && number <= 12) {
            return 5;
        } else if (number >= 13 && number <= 16) {
            return 9;
        } else {
            return null; // hoặc throw exception tùy vào nhu cầu sử dụng
        }
    }


    const handleBookTable = async () => {
        if (TableDetail.status === "đang chờ") {
            alert('Bàn đang chờ khách')
            return;
        }
        if (TableDetail.status === "đã đặt") {
            alert('Bàn đã có khách đặt')
            return;
        }
        const newAmount = parseInt(TableDetail.amount);
        const amountRange = getAmountRange(TableDetail.number);
        if (isNaN(newAmount) || newAmount < amountRange[0] || newAmount > amountRange[1]) {
            // Số người phải trong range cho phép
            return;
        }

        await updateDoc(docRef, { amount: newAmount, status: "đang chờ" });

        // Cập nhật lại state để hiển thị số người mới và status mới
        setTableDetail(prevState => ({ ...prevState, amount: newAmount, status: "đang chờ" }));
    }

    const handleCancelTable = async () => {
        if (TableDetail.status === "còn trống") {
            alert('Bàn chưa có khách đặt')
            return;
        }

        const tableRef = firebase.firestore().collection('Table').doc(TableId);
        const tableHistoryRef = firebase.firestore().collection('TableHistory');



        try {
            if (TableDetail.status === "đã đặt" || TableDetail.status === "đang chờ") {
                await tableRef.update({
                    status: 'còn trống',
                    name: firebase.firestore.FieldValue.delete(),
                    phone: firebase.firestore.FieldValue.delete(),
                    amount: getAmountDefault(TableDetail.number),
                    date: firebase.firestore.FieldValue.delete(),
                });
                console.log('Table status updated and name & phone fields removed successfully.');
                // Delete matching documents from the TableHistory collection
                const querySnapshot = await tableHistoryRef.where('phone', '==', TableDetail.phone).get();
                querySnapshot.forEach(doc => {
                    doc.ref.delete();
                    console.log('TableHistory document deleted successfully.');
                });
            }
        } catch (error) {
            console.error('Error updating table status and removing name & phone fields:', error);
        }

    };

    const handleServeTable = async () => {
        if (TableDetail.status === "còn trống") {
            alert('Bàn chưa có khách đặt')
            return;
        }
        const tableRef = firebase.firestore().collection('Table').doc(TableId);

        try {
            await tableRef.update({ status: 'đã đặt' });
            console.log('Table status updated and name & phone fields removed successfully.');
        } catch (error) {
            console.error('Error updating table status and removing name & phone fields:', error);
        }
    };


    return (
        <View style={{ height: '100%', backgroundColor: '#F0F0DD' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                <View style={{ paddingTop: 15, marginLeft: 15 }}>
                    <TouchableOpacity style={{
                        width: 46, height: 47, backgroundColor: '#FFE55E', borderRadius: 360,
                        alignItems: 'center', justifyContent: 'center',
                        borderWidth: 2, borderColor: '#BFB12D',
                    }} onPress={() => navigation.goBack()}>
                        <Image style={{
                            height: 38, width: 38, borderRadius: 360,
                        }} source={require('../image/return.png')} />
                    </TouchableOpacity>
                </View>
                <View style={{ paddingTop: 20, }}>
                    <View style={{ backgroundColor: '#F3D051', width: 194, height: 36, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18 }}>Đặt bàn</Text>
                    </View>
                </View>
                <View style={{ paddingTop: 15, marginRight: 15 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Table_Reserve')} style={{
                        width: 46, height: 47, backgroundColor: '#FFE55E', borderRadius: 360,
                        alignItems: 'center', justifyContent: 'center',
                        borderWidth: 2, borderColor: '#BFB12D',
                    }}>
                        {/* <Image style={{
              height: 26, width: 26
            }} source={require('../image/cart.png')} /> */}
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ alignItems: 'center', paddingTop: 80 }}>
                <View style={{
                    marginHorizontal: 20, marginVertical: 10, justifyContent: 'center', alignItems: 'center', width: 130, height: 130,
                }}>

                    {TableDetail.amount == 8 ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                            </View>
                            <View style={{
                                backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", borderWidth: 2, borderRadius: 20, height: 120, justifyContent: 'center', alignItems: 'center', width: 70
                            }}>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>Bàn số:{TableDetail.number}</Text>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>{TableDetail.status}</Text>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                            </View>

                        </View>
                    ) : TableDetail.amount == 7 ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                            </View>
                            <View style={{
                                backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", borderWidth: 2, borderRadius: 20, height: 120, justifyContent: 'center', alignItems: 'center', width: 70
                            }}>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>Bàn số:{TableDetail.number}</Text>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>{TableDetail.status}</Text>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                            </View>

                        </View>
                    ) : TableDetail.amount == 6 ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                            </View>
                            <View style={{
                                backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", borderWidth: 2, borderRadius: 20, height: 120, justifyContent: 'center', alignItems: 'center', width: 70
                            }}>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>Bàn số:{TableDetail.number}</Text>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>{TableDetail.status}</Text>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                            </View>

                        </View>
                    ) : TableDetail.amount == 5 ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                            </View>
                            <View style={{
                                backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", borderWidth: 2, borderRadius: 20, height: 120, justifyContent: 'center', alignItems: 'center', width: 70
                            }}>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>Bàn số:{TableDetail.number}</Text>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>{TableDetail.status}</Text>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                            </View>
                        </View>

                    ) : TableDetail.amount == 4 ? (
                        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                            </View>
                            <View style={{ backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", borderWidth: 2, borderRadius: 20, height: 60, justifyContent: 'center', alignItems: 'center', width: 100 }}>
                                <Text style={{ fontSize: 16 }}>Bàn số:{TableDetail.number}</Text>
                                <Text style={{ fontSize: 16 }}>{TableDetail.status}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                            </View>
                        </View>

                    ) : TableDetail.amount == 3 ? (
                        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                            </View>
                            <View style={{ backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", borderWidth: 2, borderRadius: 20, height: 60, justifyContent: 'center', alignItems: 'center', width: 100 }}>
                                <Text style={{ fontSize: 16 }}>Bàn số:{TableDetail.number}</Text>
                                <Text style={{ fontSize: 16 }}>{TableDetail.status}</Text>
                            </View>
                            <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginVertical: 5, borderWidth: 2, borderRadius: 5 }}></View>
                        </View>
                    ) : TableDetail.amount == 2 ? (
                        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginVertical: 5, borderWidth: 2, borderRadius: 5 }}></View>
                            <View style={{ backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", borderWidth: 2, borderRadius: 20, height: 60, justifyContent: 'center', alignItems: 'center', width: 100 }}>
                                <Text style={{ fontSize: 16 }}>Bàn số:{TableDetail.number}</Text>
                                <Text style={{ fontSize: 16 }}>{TableDetail.status}</Text>
                            </View>
                            <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginVertical: 5, borderWidth: 2, borderRadius: 5 }}></View>
                        </View>
                    ) : TableDetail.amount == null ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                            <View style={{ backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", borderWidth: 2, borderRadius: 20, height: 60, justifyContent: 'center', alignItems: 'center', width: 100 }}>
                                <Text style={{ fontSize: 16 }}>Bàn số:{TableDetail.number}</Text>
                                <Text style={{ fontSize: 16 }}>{TableDetail.status}</Text>
                            </View>

                        </View>
                    ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginVertical: 5, borderWidth: 2, borderRadius: 5 }}></View>
                            <View style={{ backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", borderWidth: 2, borderRadius: 20, height: 60, justifyContent: 'center', alignItems: 'center', width: 100 }}>
                                <Text style={{ fontSize: 16 }}>Bàn số:{TableDetail.number}</Text>
                                <Text style={{ fontSize: 16 }}>{TableDetail.status}</Text>
                            </View>
                            <View style={{ height: 20, width: 20, backgroundColor: TableDetail.status === "đang chờ" ? "#FFFF00" : TableDetail.status === "đã đặt" ? "#F54E4E" : "#16BB13", marginVertical: 5, borderWidth: 2, borderRadius: 5 }}></View>
                        </View>
                    )

                    }
                </View>
            </View>
            <View style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{}}>
                    <Text style={{ fontSize: 22 }}>Bàn số:{TableDetail.number}</Text>
                </View>
                <View>
                    <Text style={{ fontSize: 20 }}>Tình trạng:{TableDetail.status}</Text>
                </View>
                <View>
                    <Text style={{ fontSize: 20 }}>Số lượng người:{TableDetail.amount}</Text>
                </View>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 50 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 20 }}>Số người:</Text>
                    <View style={{ height: 30, width: 40, backgroundColor: 'white', borderWidth: 1, borderRadius: 10, alignItems: 'center', marginLeft: 10, justifyContent: 'center' }}>

                        <TextInput
                            style={{ fontSize: 20, marginLeft: 7 }}
                            value={TableDetail.amount ? TableDetail.amount.toString() : ""}
                            onChangeText={(text) => {
                                const amountRange = getAmountRange(TableDetail.number);
                                if (!text) {
                                    setTableDetail(prevState => ({ ...prevState, amount: null }));
                                } else {
                                    const number = parseInt(text);
                                    if (number >= amountRange[0] && number <= amountRange[1]) {
                                        setTableDetail(prevState => ({ ...prevState, amount: number }));
                                    } else {
                                        alert(`Số người phải từ ${amountRange[0]} đến ${amountRange[1]}!`);
                                    }
                                }
                            }}
                        />

                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 20 }}>
                    <Text style={{ fontSize: 20 }}>Ngày đặt:</Text>
                    <View style={{ height: 30, width: 200, backgroundColor: 'white', borderWidth: 1, borderRadius: 10, alignItems: 'center', marginLeft: 10 }}>
                        <TextInput style={{ fontSize: 20 }} value={TableDetail.date}></TextInput>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 20 }}>
                    <Text style={{ fontSize: 20 }}>Tên khách hàng:</Text>
                    <View style={{ height: 30, width: 200, backgroundColor: 'white', borderWidth: 1, borderRadius: 10, alignItems: 'center', marginLeft: 10 }}>
                        <TextInput style={{ fontSize: 20 }} value={TableDetail.name}></TextInput>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 20 }}>
                    <Text style={{ fontSize: 20 }}>Số điện thoại:</Text>
                    <View style={{ height: 30, width: 200, backgroundColor: 'white', borderWidth: 1, borderRadius: 10, alignItems: 'center', marginLeft: 10 }}>
                        <TextInput style={{ fontSize: 20 }} value={TableDetail.phone}></TextInput>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ paddingTop: 40, justifyContent: 'center', marginHorizontal: 5 }}>
                        <TouchableOpacity style={{}} onPress={handleBookTable}>
                            <View style={{ height: 40, width: 120, alignItems: 'center', backgroundColor: '#39D7CD', justifyContent: 'center', borderRadius: 10, }}>
                                <Text style={{ fontSize: 20 }}>Đặt bàn</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ paddingTop: 40, justifyContent: 'center', marginHorizontal: 5 }}>
                        <TouchableOpacity style={{}} onPress={handleCancelTable}>
                            <View style={{ height: 40, width: 120, alignItems: 'center', backgroundColor: '#F54E4E', justifyContent: 'center', borderRadius: 10, }}>
                                <Text style={{ fontSize: 20 }}>Hủy bàn</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ paddingTop: 40, justifyContent: 'center', marginHorizontal: 5 }}>
                        <TouchableOpacity style={{}} onPress={handleServeTable}>
                            <View style={{ height: 40, width: 120, alignItems: 'center', backgroundColor: '#CCCF23', justifyContent: 'center', borderRadius: 10 }}>
                                <Text style={{ fontSize: 20 }}>Phục vụ</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Table_NVPV_Detail;