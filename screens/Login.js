import { Text, StyleSheet, View, TouchableOpacity, StatusBar, TextInput, Image, } from 'react-native'
import Checkbox from 'expo-checkbox';
import React, { useState, useEffect } from 'react'
import { firebase, auth } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';


function Login({ navigation }) {

  const [isChecked, setChecked] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [option, setOption] = useState('');
  const [user, setUser] = useState(null);


  const loginUser = async (email, password) => {
    // Thực hiện đăng nhập và kiểm tra quyền truy cập cho nhân viên (nếu option = 'option1')
    // hoặc chỉ thực hiện đăng nhập bằng email và password (nếu option = 'option2')

    const staffRef = firebase.firestore().collection('Staff').where('email', '==', email);
    const staffDoc = await staffRef.get();
    let loggedIn = false; // Khởi tạo biến boolean cho biết đăng nhập có thành công hay không

    if (staffDoc.size > 0) {
      const loaiNV = staffDoc.docs[0].data().loaiNV;
      if (loaiNV === 'nhan vien phuc vu') {
        console.log('đăng nhập thành công')
        navigation.navigate("Home_NVPV", { IdStaff: email });
        loggedIn = true; // Đặt biến loggedIn thành true nếu đăng nhập thành công
      } else if (loaiNV === 'nhan vien bep') {
        navigation.navigate("Kitchen_List", { IdStaff: email });
        loggedIn = true;
      } else if (loaiNV === 'nhan vien giao hang') {
        navigation.navigate("Shipper_List", { IdStaff: email });
        loggedIn = true;
      }
    }
    try {
      if (!loggedIn) {
        // Nếu không đăng nhập thành công, thực hiện đăng nhập bằng email và password
        await firebase.auth().signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      alert('Đăng nhập không thành công, sai mật khẩu hoặc tài khoản');
    }
    if (isChecked) {
      AsyncStorage.setItem('rememberMe', JSON.stringify(true));
      AsyncStorage.setItem('email', email);
      AsyncStorage.setItem('password', password);
    } else {
      AsyncStorage.removeItem('rememberMe');
      AsyncStorage.removeItem('email');
      AsyncStorage.removeItem('password');
    }
  }



  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    AsyncStorage.getItem('rememberMe').then((value) => {
      if (value !== null) {
        setChecked(JSON.parse(value));
      }
    });
    AsyncStorage.getItem('email').then((email) => {
      AsyncStorage.getItem('password').then((password) => {
        if (email && password) {
          setEmail(email);
          setPassword(password);
        }
      });
    });
    return unsubscribe;
  }, []);





  return (
    <View style={{ backgroundColor: '#F3D051', height: '100%', }}>
      <StatusBar></StatusBar>

      <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
        <View style={{ alignItems: 'center', marginRight: 200 }}>
          <Image style={{ height: 100, width: 100, }} source={require('../image/Sun.png')} />
        </View>
        <View style={{ alignItems: 'center', marginLeft: 10 }}>
          <Image style={{ height: 100, width: 100, }} source={require('../image/Cloud.png')} />
        </View>
      </View>

      <View style={{ alignItems: 'center', paddingTop: 26 }}>
        <Image style={{ height: 129, width: 254, }} source={require('../image/ATFOOD.png')} />
      </View>
      <View style={{ alignItems: 'center', paddingTop: 60 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', }}>Sign In</Text>
      </View>

      <View style={{ alignItems: 'center', paddingTop: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
          <View style={{
            height: 40, width: 320, backgroundColor: '#ffffff', justifyContent: 'flex-start', borderRadius: 20, marginLeft: 10
            , flexDirection: 'row'
          }}>
            <View style={{ justifyContent: 'center' }}>
              <Image style={{ height: 30, width: 30, marginLeft: 10 }} source={require('../image/mail.png')} />
            </View>
            <TextInput placeholder='Email'
              value={email}
              onChangeText={(email) => setEmail(email)}
              autoCapitalize="none"
              autoCorrect={false}

              style={{ fontSize: 16, marginLeft: 10, width: 250, }}></TextInput>
          </View>
        </View>

        <View style={{ paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{
            height: 40, width: 320, backgroundColor: '#ffffff', justifyContent: 'flex-start', borderRadius: 20, marginLeft: 10
            , flexDirection: 'row'
          }}>
            <View style={{ paddingTop: 2, justifyContent: 'center' }}>
              <Image style={{ height: 30, width: 30, marginLeft: 10, }} source={require('../image/pass.png')} />
            </View>
            <TextInput
              value={password}
              secureTextEntry={true}
              placeholder='Mật khẩu'
              onChangeText={(password) => setPassword(password)}
              autoCapitalize="none"
              autoCorrect={false}
              style={{ fontSize: 16, marginLeft: 10, width: 250 }}></TextInput>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ alignItems: 'center', paddingTop: 15, marginLeft: 12, flexDirection: 'row', justifyContent: 'center' }}>
          <Checkbox
            style={{ backgroundColor: 'white' }}
            value={isChecked}
            onValueChange={(isChecked) => setChecked(isChecked)}
            color={isChecked ? '#13625D' : undefined}
          />
          <Text style={{
            fontSize: 14, fontWeight: 'bold', color: 'black', marginLeft: 5
          }}>Nhớ mật khẩu</Text>
        </View>
        <View style={{ alignItems: 'center', paddingTop: 15, marginLeft: 66 }}>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}><Text style={{
            fontSize: 14, fontWeight: 'bold', color: 'black'
            , borderBottomWidth: 1, borderColor: 'black'
          }}>Quên mật khẩu?</Text></TouchableOpacity>
        </View>
      </View>

      <View style={{ alignItems: 'center', paddingTop: 30 }}>
        <TouchableOpacity onPress={() => loginUser(email, password)}>
          <View style={{
            backgroundColor: '#FFEA2F', width: 188, height: 47, alignItems: 'center', justifyContent: 'center', borderRadius: 20
            , borderWidth: 1
            , borderColor: '#BFB12D'
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Đăng nhập</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: 'center', paddingTop: 25, }}>
        <View style={{ flexDirection: 'row' }}>
          <View><Text style={{ fontSize: 16, }}>Bạn chưa có tài khoản?</Text></View>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={{
                fontSize: 16, fontWeight: 'bold', marginLeft: 5, color: 'black'
                , borderBottomWidth: 2, borderColor: 'black'
              }}>Đăng ký ở đây</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginRight: 14 }}>
        <View style={{ alignItems: 'center', paddingTop: 4, marginRight: 232 }}>
          <Image style={{ height: 118, width: 117, }} source={require('../image/tree.png')} />
        </View>
        <View style={{ alignItems: 'center', paddingTop: 4, marginLeft: 10 }}>
          <Image style={{ height: 118, width: 117, }} source={require('../image/hello.png')} />
        </View>
        {/* <TouchableOpacity onPress={() => navigation.navigate('StartedApp')}>
          <Text>Started</Text>
        </TouchableOpacity> */}
      </View>
    </View>

  )

}
export default Login;
