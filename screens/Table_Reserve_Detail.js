import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import { v4 as uuidv4 } from 'uuid';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore'

function Table_Reserve_Detail({ navigation, route }) {
    const { TableId } = route.params;
    const [users, setUsers] = useState([]);
    // const currentUser = firebase.auth().currentUser;
    const [TableDetail, setTableDetail] = useState([]);
    const [date, setDate] = useState("");
    const db = getFirestore();
    const docRef1 = doc(db, 'users', firebase.auth().currentUser.uid)
    const docRef = doc(db, 'Table', TableId)
    useEffect(() => {
        const LoadDetail = async () => {
            const TableData = await getDoc(docRef).then((doc) => {
                setTableDetail(doc.data());
            });
        }
        LoadDetail();

    }, [TableId])
    const docSnap = async () => {
        try {
            await getDoc(docRef1).then((doc) => {
                setUsers(doc.data());
            });

        } catch (error) {
            alert(error.messgae)
        }
    }

    useEffect(() => {
        docSnap();
    }, [])

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
    const tableHistoryRef = collection(db, 'TableHistory')

    const handleBookTable = async () => {
        const tableHistoryDocRef = doc(tableHistoryRef, firebase.auth().currentUser.uid)
        const tableHistoryDocSnapshot = await getDoc(tableHistoryDocRef)
        if (tableHistoryDocSnapshot.exists()) {
            // User has already booked a table
            alert('Bạn chỉ đặt được một bàn, nếu bạn muốn đặt thêm hãy nhắn tin với nhân viên để được hỗ trợ. Xin cảm ơn!')
            return;
        }

        // convert to Date object
        const newAmount = parseInt(TableDetail.amount);
        const amountRange = getAmountRange(TableDetail.number);
        if (isNaN(newAmount) || newAmount < amountRange[0] || newAmount > amountRange[1]) {
            // Số người phải trong range cho phép
            return;
        }

        await setDoc(tableHistoryDocRef, { amount: newAmount, status: "đang chờ", name: users.name, phone: users.phone, number: TableDetail.number, date: date });

        await updateDoc(docRef, { amount: newAmount, status: "đang chờ", name: users.name, phone: users.phone, date: date  });

        // Cập nhật lại state để hiển thị số người mới và status mới
        setTableDetail(prevState => ({ ...prevState, amount: newAmount, status: "đang chờ" }));
        navigation.navigate('Table_Reserve');
    }

    const handleDateChange = (text) => {
        let formattedDate = "";

        // Người dùng đang nhập ngày
        if (text.length <= 2) {
            formattedDate = text.replace(/[^0-9]/g, ""); // Chỉ giữ lại các ký tự số
            if (formattedDate.length === 2) {
                formattedDate += "/";
            }
        }
        // Người dùng đang nhập tháng
        else if (text.length <= 5) {
            formattedDate = text.replace(/[^0-9/]/g, ""); // Chỉ giữ lại các ký tự số và /
            formattedDate = formattedDate.replace(/^([0-9]{2})[/-]?/, "$1/"); // Tự động thêm dấu / sau 2 ký tự đầu tiên (nếu chưa có)
            if (formattedDate.length === 5) {
                formattedDate += "/";
            }
        }
        // Người dùng đang nhập năm
        else {
            formattedDate = text.replace(/[^0-9/]/g, ""); // Chỉ giữ lại các ký tự số và /
            formattedDate = formattedDate.replace(/^([0-9]{2})[/-]?([0-9]{2})[/-]?([0-9]{4})?$/, "$1/$2/$3"); // Định dạng lại ngày tháng năm
        }

        setDate(formattedDate);
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
                <View style={{ paddingTop: 20, marginRight:95}}>
                    <View style={{ backgroundColor: '#F3D051', width: 194, height: 36, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18 }}>Đặt bàn</Text>
                    </View>
                </View>

            </View>
            <View style={{ alignItems: 'center', paddingTop: 80 }}>
                <View style={{
                    marginHorizontal: 20, marginVertical: 10, justifyContent: 'center', alignItems: 'center', width: 130, height: 130,
                }}>

                    {TableDetail.amount == 8 ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                            </View>
                            <View style={{
                                backgroundColor: '#16BB13', borderWidth: 2, borderRadius: 20, height: 120, justifyContent: 'center', alignItems: 'center', width: 70
                            }}>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>Bàn số:{TableDetail.number}</Text>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>{TableDetail.status}</Text>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                            </View>

                        </View>
                    ) : TableDetail.amount == 7 ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 5 }}></View>
                            </View>
                            <View style={{
                                backgroundColor: '#16BB13', borderWidth: 2, borderRadius: 20, height: 120, justifyContent: 'center', alignItems: 'center', width: 70
                            }}>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>Bàn số:{TableDetail.number}</Text>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>{TableDetail.status}</Text>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                            </View>

                        </View>
                    ) : TableDetail.amount == 6 ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                            </View>
                            <View style={{
                                backgroundColor: '#16BB13', borderWidth: 2, borderRadius: 20, height: 120, justifyContent: 'center', alignItems: 'center', width: 70
                            }}>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>Bàn số:{TableDetail.number}</Text>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>{TableDetail.status}</Text>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                            </View>

                        </View>
                    ) : TableDetail.amount == 5 ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                            </View>
                            <View style={{
                                backgroundColor: '#16BB13', borderWidth: 2, borderRadius: 20, height: 120, justifyContent: 'center', alignItems: 'center', width: 70
                            }}>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>Bàn số:{TableDetail.number}</Text>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>{TableDetail.status}</Text>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                            </View>
                        </View>

                    ) : TableDetail.amount == 4 ? (
                        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                            </View>
                            <View style={{ backgroundColor: '#16BB13', borderWidth: 2, borderRadius: 20, height: 60, justifyContent: 'center', alignItems: 'center', width: 100 }}>
                                <Text style={{ fontSize: 16 }}>Bàn số:{TableDetail.number}</Text>
                                <Text style={{ fontSize: 16 }}>{TableDetail.status}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                            </View>
                        </View>

                    ) : TableDetail.amount == 3 ? (
                        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                                <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginHorizontal: 5, borderWidth: 2, borderRadius: 5, marginVertical: 10 }}></View>
                            </View>
                            <View style={{ backgroundColor: '#16BB13', borderWidth: 2, borderRadius: 20, height: 60, justifyContent: 'center', alignItems: 'center', width: 100 }}>
                                <Text style={{ fontSize: 16 }}>Bàn số:{TableDetail.number}</Text>
                                <Text style={{ fontSize: 16 }}>{TableDetail.status}</Text>
                            </View>
                            <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginVertical: 5, borderWidth: 2, borderRadius: 5 }}></View>
                        </View>
                    ) : TableDetail.amount == 2 ? (
                        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginVertical: 5, borderWidth: 2, borderRadius: 5 }}></View>
                            <View style={{ backgroundColor: '#16BB13', borderWidth: 2, borderRadius: 20, height: 60, justifyContent: 'center', alignItems: 'center', width: 100 }}>
                                <Text style={{ fontSize: 16 }}>Bàn số:{TableDetail.number}</Text>
                                <Text style={{ fontSize: 16 }}>{TableDetail.status}</Text>
                            </View>
                            <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginVertical: 5, borderWidth: 2, borderRadius: 5 }}></View>
                        </View>
                    ) : TableDetail.amount == null ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                            <View style={{ backgroundColor: '#16BB13', borderWidth: 2, borderRadius: 20, height: 60, justifyContent: 'center', alignItems: 'center', width: 100 }}>
                                <Text style={{ fontSize: 16 }}>Bàn số:{TableDetail.number}</Text>
                                <Text style={{ fontSize: 16 }}>{TableDetail.status}</Text>
                            </View>

                        </View>
                    ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginVertical: 5, borderWidth: 2, borderRadius: 5 }}></View>
                            <View style={{ backgroundColor: '#16BB13', borderWidth: 2, borderRadius: 20, height: 60, justifyContent: 'center', alignItems: 'center', width: 100 }}>
                                <Text style={{ fontSize: 16 }}>Bàn số:{TableDetail.number}</Text>
                                <Text style={{ fontSize: 16 }}>{TableDetail.status}</Text>
                            </View>
                            <View style={{ height: 20, width: 20, backgroundColor: '#16BB13', marginVertical: 5, borderWidth: 2, borderRadius: 5 }}></View>
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
                        <TextInput style={{ fontSize: 20 }} value={date} onChangeText={handleDateChange}></TextInput>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 20 }}>
                    <Text style={{ fontSize: 20 }}>Tên khách hàng:</Text>
                    <View style={{ height: 30, width: 200, backgroundColor: 'white', borderWidth: 1, borderRadius: 10, alignItems: 'center', marginLeft: 10 }}>
                        <TextInput style={{ fontSize: 20 }} value={users.name}></TextInput>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 20 }}>
                    <Text style={{ fontSize: 20 }}>Số điện thoại:</Text>
                    <View style={{ height: 30, width: 200, backgroundColor: 'white', borderWidth: 1, borderRadius: 10, alignItems: 'center', marginLeft: 10 }}>
                        <TextInput style={{ fontSize: 20 }} value={users.phone}></TextInput>
                    </View>
                </View>
                <View style={{ paddingTop: 40, justifyContent: 'center' }}>
                    <TouchableOpacity style={{}} onPress={handleBookTable}>
                        <View style={{ height: 40, width: 120, alignItems: 'center', backgroundColor: '#39D7CD', justifyContent: 'center', borderRadius: 10 }}>
                            <Text style={{ fontSize: 20 }}>Đặt bàn</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Table_Reserve_Detail;