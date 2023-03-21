import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'




function Detail_Fish({ route, navigation }) {
  const { foodID } = route.params;

  const [foodcount, setFoodCount] = useState([]);
  const [foodDetail, setFoodDetail] = useState([]);
  const db = getFirestore();
  const docRef = doc(db, 'Fish', foodID)

  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);

  const checkProductInCart = async () => {
    const cartRef = firebase.firestore().collection('Cart');
    const cartSnapshot = await cartRef.get();
    const cartDocs = cartSnapshot.docs;
  
    // Duyệt qua tất cả các document trong collection 'Cart'
    for (const doc of cartDocs) {
      const cartData = doc.data();
      const foodDetails = cartData.foodDetails;
  
      // Duyệt qua tất cả các food item trong field 'foodDetails' của document
      for (const foodItem of foodDetails) {
        if (foodItem.foodID === foodID) {
          // Nếu foodID đã có trong giỏ hàng thì trả về true
          return true;
        }
      }
    }
  
    // Nếu không tìm thấy foodID trong giỏ hàng thì trả về false
    return false;
  };
  


  const addToCart = async () => {
    try {
        const isAddedToCart = await checkProductInCart();

    if (isAddedToCart) {
      console.log('Sản phẩm đã có trong giỏ hàng');
      alert('Món ăn đã có trong giỏ hàng');
      return;
    }
      const cartRef = firebase.firestore().collection('Cart');
      const cartDocRef = cartRef.doc();

      const foodItem = {
        foodID: foodID,
        name: foodDetail.name,
        price: foodDetail.price,
        quantity: quantity,
        image: foodDetail.image,
        denominations: foodDetail.denominations
      };

      await cartDocRef.set({
        foodDetails: firebase.firestore.FieldValue.arrayUnion(foodItem),
      }, { merge: true }); // Sử dụng option {merge: true} để cập nhật field 'foodDetails' mà không ghi đè lên những fields khác

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

  function resetFoodCount() {
    setFoodCount(0);
  }



  return (
    <View style={{ backgroundColor: '#DDF0F0', height: '100%' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
        <View style={{ paddingTop: 15, marginLeft: 15 }}>
          <TouchableOpacity style={{
            width: 46, height: 47, backgroundColor: '#89C1CD', borderRadius: 360,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 2, borderColor: '#13625D',
          }} onPress={() => navigation.navigate('Fish_List')}>
            <Image style={{
              height: 38, width: 38, borderRadius: 360,
            }} source={require('../image/return.png')} />
          </TouchableOpacity>
        </View>
        <View style={{ paddingTop: 20, }}>
          <View style={{ backgroundColor: '#86D3D3', width: 194, height: 36, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18 }}>Detail</Text>
          </View>
        </View>
        <View style={{ paddingTop: 15, marginRight: 15 }}>
          <TouchableOpacity style={{
            width: 46, height: 47, backgroundColor: '#89C1CD', borderRadius: 360,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 2, borderColor: '#13625D',
          }} onPress={() => navigation.navigate('Cart')}>
            <Image style={{
              height: 26, width: 26
            }} source={require('../image/cart.png')} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{
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
           
              <View style={{ alignItems: 'center', paddingTop:10}}>
                <View style={{ backgroundColor: 'white', width: 340,height:100, borderWidth: 1, borderRadius:10 }}>
                  <TextInput style={{ marginLeft: 10, fontSize:16 }} placeholder='ghi chú cho món ăn...'>
                  </TextInput>
                </View>
              </View>
            </View>
          
        </View>
      </ScrollView>



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

export default Detail_Fish;