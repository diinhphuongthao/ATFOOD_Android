import { Text, StyleSheet, View, Image, TouchableOpacity, TextInput, ImageBackground, SafeAreaView, KeyboardAvoidingView, Alert } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { firebase } from '../config'

function SignUp({ navigation }) {


  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')



  const registerUser = async (name, phone, email, password) => {
    if (!name || !phone || !email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      // Lưu thông tin người dùng vào Firestore
      await firebase.firestore().collection('users').doc(user.uid).set({
        uid: user.uid,
        name,
        phone,
        email,
      });

      console.log('User registered successfully:', user);
      // Hiển thị thông báo hoặc chuyển hướng đến trang xác thực thành công
    } catch (error) {
      console.error('Error registering user:', error);
      // Hiển thị thông báo lỗi cho người dùng
    }
  };

  const validatePhoneNumber = () => {
    const phoneNumberRegex = /^\d{9,10}$/; // Regex: đúng 9-10 số
    return phoneNumberRegex.test(phone);
  };

  const checkDuplicatePhoneNumber = () => {
    const usersCollection = firebase.firestore().collection("users");
    const duplicatePhoneQuery = usersCollection.where("phone", "==", phone).limit(1);

    return duplicatePhoneQuery.get().then((querySnapshot) => {
      if (!querySnapshot.empty) {
        return true; // Có số điện thoại trùng
      }
      return false; // Không có số điện thoại trùng
    });
  };

  const handlePhoneInputChange = (text) => {
    setPhone(text);
  };

  const handlePhoneInputBlur = () => {
    if (!validatePhoneNumber()) {
      Alert.alert("Lỗi", "Số điện thoại không hợp lệ. Vui lòng nhập lại!");
      setPhone('');
      return;
    }

    checkDuplicatePhoneNumber().then((isDuplicate) => {
      if (isDuplicate) {
        Alert.alert("Lỗi", "Số điện thoại đã được sử dụng. Vui lòng nhập lại!");
        setPhone('');
      }
    });
  };

  const checkDuplicateEmail = () => {
    const usersCollection = firebase.firestore().collection("users");
    const duplicateEmailQuery = usersCollection.where("email", "==", email).limit(1);

    return duplicateEmailQuery.get().then((querySnapshot) => {
      if (!querySnapshot.empty) {
        return true; // Có email trùng
      }
      return false; // Không có email trùng
    });
  };

  const handleEmailInputChange = (text) => {
    setEmail(text);
  };

  const handleEmailInputBlur = () => {
    checkDuplicateEmail().then((isDuplicate) => {
      if (isDuplicate) {
        Alert.alert("Lỗi", "Email đã được sử dụng. Vui lòng nhập lại!");
        setEmail('');
      }
    });
  };



  return (
    <View style={{ backgroundColor: '#F3D051', height: '100%', }}>

      <KeyboardAwareScrollView>
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

        <View style={{ alignItems: 'center', paddingTop: 66 }}>
          <Image style={{ height: 129, width: 254, }} source={require('../image/ATFOOD.png')} />
        </View>

        <View style={{ alignItems: 'center', paddingTop: 46 }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', }}>Sign Up</Text>
        </View>



        <View style={{ flexDirection: 'column', paddingTop: 20, alignItems: 'center' }}>

          <View style={{
            backgroundColor: '#ffffff', width: 320, height: 40, margin: 10, justifyContent: 'flex-start'
            , borderRadius: 20, flexDirection: 'row', alignItems: 'center'
          }}>
            <Image style={{ height: 22, width: 22, marginLeft: 5 }} source={require('../image/name.png')} />
            <TextInput placeholder='Name'
              onChangeText={(name) => setName(name)}
              autoCorrect={false}
              style={{ marginLeft: 10, width: 270 }}

            ></TextInput>
          </View>



          <View style={{
            backgroundColor: '#ffffff', width: 320, height: 40, margin: 10, justifyContent: 'flex-start',
            borderRadius: 20, flexDirection: 'row', alignItems: 'center'
          }}>
            <Image style={{ height: 22, width: 22, marginLeft: 5 }} source={require('../image/phone.png')} />
            <TextInput
              placeholder='Phone'
              onChangeText={handlePhoneInputChange}
              onBlur={handlePhoneInputBlur}
              value={phone}
              autoCorrect={false}
              keyboardType='phone-pad'
              style={{ marginLeft: 10, width: 270 }}
            />
          </View>

          <View style={{
            backgroundColor: '#ffffff', width: 320, height: 40, margin: 10, justifyContent: 'flex-start',
            borderRadius: 20, flexDirection: 'row', alignItems: 'center'
          }}>
            <Image style={{ height: 22, width: 22, marginLeft: 5 }} source={require('../image/mail.png')} />
            <TextInput
              placeholder='Email'
              onChangeText={handleEmailInputChange}
              onBlur={handleEmailInputBlur}
              value={email}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType='email-address'
              style={{ marginLeft: 10, width: 270 }}
            />
          </View>

          <View style={{
            backgroundColor: '#ffffff', width: 320, height: 40, margin: 10, justifyContent: 'flex-start'
            , borderRadius: 20, flexDirection: 'row', alignItems: 'center'
          }}>
            <Image style={{ height: 22, width: 22, marginLeft: 5 }} source={require('../image/pass.png')} />
            <TextInput placeholder='Password'
              onChangeText={(password) => setPassword(password)}
              autoCorrect={false}
              autoCapitalize="none"
              secureTextEntry={true}
              style={{ marginLeft: 10, width: 270 }}

            ></TextInput>
          </View>
        </View>
        <View style={{ alignItems: 'center', paddingTop: 30, }}>
          <TouchableOpacity onPress={() => registerUser(name, phone, email, password)}
            style={{ paddingBottom: 80 }}>
            <View style={{
              backgroundColor: '#FFEA2F', width: 160, height: 46, justifyContent: 'center', alignItems: 'center', borderRadius: 20,
              borderWidth: 1, borderColor: 'black'
            }}>
              <Text style={{ fontSize: 18, color: '#000000' }}>Sign Up</Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

    </View>

  )

}

export default SignUp;