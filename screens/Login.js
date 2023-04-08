import { Text, StyleSheet, View, TouchableOpacity, StatusBar, TextInput, Image, } from 'react-native'
import Checkbox from 'expo-checkbox';
import React, { useState, useEffect } from 'react'
import { firebase } from '../config';

function Login({ navigation }) {

  const [isChecked, setChecked] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  loginUser = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      const currentUser = firebase.auth().currentUser;
      const emailParts = currentUser.email.split('@');
      const emailName = emailParts[0];
      const emailDomain = emailParts[1];
      const emailNumber = parseInt(emailName.replace('nvship', ''));
      if (currentUser && currentUser.email === "nvpvmq@gmail.com") {
        // chuyển hướng đến màn hình Home_NVPV
        // ví dụ:
        navigation.navigate("Home_NVPV");
      } else if (currentUser && currentUser.email === "nvbepmq@gmail.com") {
        // chuyển hướng đến màn hình Home_NVBep
        // ví dụ:
        navigation.navigate("Kitchen_List");
      } if (emailDomain === 'gmail.com' && emailNumber >= 1 && emailNumber <= 10) {
        navigation.navigate('Shipper_List');
      }
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <View style={{ backgroundColor: '#41B9B9', height: '100%', }}>
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
        <Image style={{ height: 123, width: 254, }} source={require('../image/Logo.png')} />
      </View>
      <View style={{ alignItems: 'center', paddingTop: 80 }}>
        <Image style={{ height: 34, width: 107, }} source={require('../image/SignIn.png')} />
      </View>

      <View style={{ alignItems: 'center', paddingTop: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
          <View style={{
            height: 40, width: 320, backgroundColor: '#ffffff', justifyContent: 'flex-start', borderRadius: 20, marginLeft: 10
            , flexDirection: 'row'
          }}>
            <View style={{ justifyContent: 'center'}}>
              <Image style={{ height: 30, width: 30, marginLeft: 10 }} source={require('../image/mail.png')} />
            </View>
            <TextInput placeholder='Email'
              onChangeText={(email) => setEmail(email)}
              autoCapitalize="none"
              autoCorrect={false}
              style={{ fontSize: 16, marginLeft: 10, width: 250,}}></TextInput>
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
            <TextInput secureTextEntry={true} placeholder='Mật khẩu'
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
            onValueChange={setChecked}
            color={isChecked ? '#13625D' : undefined}
          />
          <Text style={{
            fontSize: 14, fontWeight: 'bold', color: '#CCF0EA', marginLeft: 5
          }}>Nhớ mật khẩu</Text>
        </View>
        <View style={{ alignItems: 'center', paddingTop: 15, marginLeft: 66 }}>
          <TouchableOpacity><Text style={{
            fontSize: 14, fontWeight: 'bold', color: '#CCF0EA'
            , borderBottomWidth: 1, borderColor: '#13625D'
          }}>Quên mật khẩu?</Text></TouchableOpacity>
        </View>
      </View>

      <View style={{ alignItems: 'center', paddingTop: 30 }}>
        <TouchableOpacity onPress={() => loginUser(email, password)}>
          <View style={{
            backgroundColor: '#EAD565', width: 188, height: 47, alignItems: 'center', justifyContent: 'center', borderRadius: 20
            , borderWidth: 1
            , borderColor: '#13625D'
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Đăng nhập</Text>
          </View>
        </TouchableOpacity>
      </View>


      {/* <View style={{ alignItems: 'center', paddingTop: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Or Login With</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
        <TouchableOpacity>
          <View style={{ backgroundColor: '#ffff00', width: 140, height: 50, borderRadius: 10, justifyContent: 'center',justifyContent: 'center', alignItems: 'center', flexDirection:'row'  }}>
            <Image style={{ height: 40, width: 40 }} source={require('../image/FB.png')} />
            <Text style={{marginLeft:5}}>Facebook</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity >
        <View style={{ backgroundColor: '#ffff00', width: 140, height: 50, marginLeft: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexDirection:'row' }}>
            <Image style={{ height: 40, width: 40 }} source={require('../image/GG.png')} />
            <Text style={{marginLeft:5}}>Google</Text>
        </View>
        </TouchableOpacity>
      </View> */}

      <View style={{ alignItems: 'center', paddingTop: 25, }}>
        <View style={{ flexDirection: 'row' }}>
          <View><Text style={{ fontSize: 16, }}>Bạn chưa có tài khoản?</Text></View>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={{
                fontSize: 16, fontWeight: 'bold', marginLeft: 5, color: '#CCF0EA'
                , borderBottomWidth: 2, borderColor: '#13625D'
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
