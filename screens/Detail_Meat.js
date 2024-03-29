import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'




function Detail_Meat({ route, navigation }) {
  const { foodID } = route.params;
  const [note, setNote] = useState("");

  const [foodDetail, setFoodDetail] = useState([]);
  const db = getFirestore();
  const docRef = doc(db, 'Meat', foodID)

  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [hasOrders, setHasOrders] = useState(false);
  const currentUser = firebase.auth().currentUser;

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("OrderCustomer")
      .doc(currentUser.uid)
      .collection("orders")
      .where(firebase.firestore.FieldPath.documentId(), "==", currentUser.uid)
      .onSnapshot((snapshot) => {
        const orderDocuments = snapshot.docs;
        if (orderDocuments.length > 0) {
          setCartItems(orderDocuments.length);
          setHasOrders(true);
        } else {
          setCartItems(0);
          setHasOrders(false);
        }
      });

    return unsubscribe;
  }, []);

  const handleNoteChange = (text) => {
    setNote(text); // Cập nhật giá trị của note khi người dùng nhập liệu vào TextInput
  };
  const [cartItems, setCartItems] = useState([]);
  // Lấy số lượng item trong giỏ hàng từ sub collection "cartItems"
  useEffect(() => {
    const userId = firebase.auth().currentUser.uid;
    const cartRef = firebase.firestore().collection('Cart').doc(userId).collection('cartItems');
    const unsubscribe = cartRef.onSnapshot((querySnapshot) => {
      const cartItemsCount = querySnapshot.size;
      setCartItems(cartItemsCount);

    }, (error) => {
      console.log('Error getting cart items: ', error);
    });
    return () => unsubscribe();
  }, []);

  const addToCart = async () => {
    const userId = firebase.auth().currentUser.uid;
    const cartRef = firebase.firestore().collection('Cart').doc(userId);
    try {
      // Kiểm tra xem món ăn đã tồn tại trong giỏ hàng chưa
      const snapshot = await cartRef.collection('cartItems').get();
      if (snapshot.docs.length > 0) {
        // Kiểm tra từng document để tìm foodID giống với foodID mà bạn muốn kiểm tra
        for (let i = 0; i < snapshot.docs.length; i++) {
          const foodDetails = snapshot.docs[i].data().foodDetails;
          for (let j = 0; j < foodDetails.length; j++) {
            if (foodDetails[j].foodID === foodID) {
              // Món ăn đã tồn tại trong giỏ hàng, không thêm vào nữa
              console.log('Món ăn đã tồn tại trong giỏ hàng');
              alert('Món ăn đã tồn tại trong giỏ hàng');
              return;
            }
          }
        }
      }
      // Kiểm tra nếu đã có đơn hàng chưa hoàn thành thì không cho đặt thêm
      const orderRef = firebase.firestore().collection('Orders').where('uid', '==', userId);
      const orderSnapshot = await orderRef.get();
      if (!orderSnapshot.empty) {
        alert('Bạn đã có đơn hàng chưa hoàn thành. Vui lòng đợi trong ít phút trước khi đặt đơn hàng mới.');
        return;
      }
      // Kiểm tra nếu đã có đơn hàng chưa hoàn thành thì không cho đặt thêm
      const deliverRef = firebase.firestore().collection('Delivering').where('uid', '==', userId);
      const deliverSnapshot = await deliverRef.get();
      if (!deliverSnapshot.empty) {
        alert('Bạn đã có đơn hàng chưa hoàn thành. Vui lòng đợi trong ít phút trước khi đặt đơn hàng mới.');
        return;
      }
      const cartDocRef = cartRef.collection('cartItems').doc();
      const foodItem = {
        foodID: foodID,
        name: foodDetail.name,
        price: foodDetail.price,
        quantity: quantity,
        image: foodDetail.image,
        denominations: foodDetail.denominations,
        note: note.toString()
      };
      await cartDocRef.set({
        foodDetails: firebase.firestore.FieldValue.arrayUnion(foodItem),
      }, { merge: true });
      console.log('Đã thêm sản phẩm vào giỏ hàng');
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1 && !0) {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    const LoadDetail = async () => {
      const FoodData = await getDoc(docRef).then((doc) => {
        setFoodDetail(doc.data());

        // console.log(doc.data())
      });
    }


    LoadDetail();

  }, [foodID])






  return (
    <View style={{ backgroundColor: '#F0F0DD', height: '100%' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
        <View style={{ paddingTop: 15, marginLeft: 15 }}>
          <TouchableOpacity style={{
            width: 46, height: 47, backgroundColor: '#FFE55E', borderRadius: 360,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 2, borderColor: '#BFB12D',
          }} onPress={() => navigation.navigate('Meat_List')}>
            <Image style={{
              height: 38, width: 38, borderRadius: 360,
            }} source={require('../image/return.png')} />
          </TouchableOpacity>
        </View>
        <View style={{ paddingTop: 20, }}>
          <View style={{ backgroundColor: '#F3D051', width: 194, height: 36, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18 }}>Chi tiết</Text>
          </View>
        </View>
        <View style={{ paddingTop: 15, marginRight: 15 }}>
          <TouchableOpacity style={{
            width: 46, height: 47, backgroundColor: '#FFE55E', borderRadius: 360,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 2, borderColor: '#BFB12D',
          }} onPress={() => {
            if (cartItems > 0) {
              navigation.navigate('Cart');
            } else if (hasOrders) {
              navigation.navigate('Cart');
            } else {
              alert('Chưa thêm món vào giỏ hàng');
            }
          }}>
            <Image style={{
              height: 26, width: 26
            }} source={require('../image/cart.png')} />
            {cartItems > 0 && (
              <View style={{
                position: 'absolute', top: 30, right: -6, backgroundColor: '#DA2121',
                width: 18, height: 18, borderRadius: 9,
                alignItems: 'center', justifyContent: 'center'
              }}>
                <Text style={{ color: 'white', fontSize: 12 }}>{cartItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAwareScrollView style={{
        position: 'absolute',
        top: 200,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        paddingTop: 230
      }}>
        <View style={{ width: '100%' }}>

          <View style={{ backgroundColor: '#DFAE30', height: 700, borderTopRightRadius: 60, borderTopLeftRadius: 60 }}>
            <View style={{ alignItems: 'center', paddingTop: 15 }}>
              <Text style={{ fontSize: 30, color: '#2947E1' }}>{foodDetail.name}</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 15 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={decreaseQuantity}>
                  <Image style={{ height: 20, width: 20, borderRadius: 360, marginRight: 10 }} source={require('../image/minus.png')} />
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ paddingHorizontal: 20, backgroundColor: 'white', borderRadius: 10, fontSize: 15 }}>{quantity}</Text>
                </View>
                <TouchableOpacity onPress={increaseQuantity}>
                  <Image style={{ height: 20, width: 20, borderRadius: 360, marginLeft: 10 }} source={require('../image/plus.png')} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flexDirection: 'row', width: 200, marginLeft: 28, paddingTop: 20 }}>
              <Text style={{ fontSize: 20, color: '#2947E1' }}>Mô tả món ăn: </Text>
              <Text style={{ fontSize: 20, textAlign: 'justify', marginLeft: 5 }}>{foodDetail.describe}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginLeft: 28 }}>
              <Text style={{ fontSize: 20, color: '#2947E1' }}>Price:</Text>
              <Text style={{ marginLeft: 5, fontSize: 20 }}>{foodDetail.price}</Text>
              <Text style={{ marginLeft: 2, fontSize: 20 }}>{foodDetail.denominations}</Text>
            </View>

            <View style={{ alignItems: 'center', paddingTop: 10 }}>

              <View style={{ backgroundColor: 'white', width: 340, height: 100, borderWidth: 1, borderRadius: 10 }}>
                <TextInput
                  style={{
                    marginLeft: 10,
                    fontSize: 16,
                    width: 310,
                    height: 90,
                    paddingTop: 10, // căn lề trên
                    textAlignVertical: 'top'
                  }}
                  placeholder='ghi chú cho món ăn...'
                  multiline={true} // đa dòng
                  onChangeText={handleNoteChange}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Enter' && nativeEvent.returnKeyType === 'done') {
                      Keyboard.dismiss();
                    }
                  }}
                  returnKeyType={'done'}
                />
              </View>
            </View>
          </View>

        </View>
      </KeyboardAwareScrollView>



      <View style={{ alignItems: 'center', paddingTop: 40 }}>
        <Image style={{ width: 340, height: 306, borderRadius: 20 }} source={{
          uri: foodDetail.image
        }} />
      </View>

      <View style={{
        height: 40,
        width: '100%',
        backgroundColor: '#DFAE30',
        position: 'absolute',
        top: 670,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <TouchableOpacity onPress={addToCart} style={{
          width: 160,
          height: 40,
          backgroundColor: '#E5E92A',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          borderWidth: 1
        }}>
          <Text style={{ fontSize: 18 }}>Add to Cart</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

export default Detail_Meat;