import { Text, StyleSheet, View, Image, TouchableOpacity, TextInput, ImageBackground, SafeAreaView, KeyboardAvoidingView } from 'react-native'
import React, { useState, useRef } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { firebase } from '../config'


function SignUp({ navigation }) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const firestore = firebase.firestore;
  const auth = firebase.auth;



  const registerUser = async (name, phone, email, password) => {
    await firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        firebase.auth().currentUser.sendEmailVerification({
          handleCodeInApp: true,
          url: 'https://fooddelivery-844c4.firebaseapp.com/',
        })
          .then(() => {
            alert('Verification emmail sent')
          }).catch((error) => {
            alert(error.message)
          })
          .then(() => {
            firebase.firestore().collection('users')
              .doc(firebase.auth().currentUser.uid)
              .set({
                uid: auth().currentUser.uid,
                name,
                phone,
                email,
              })
          })
          .catch((error) => {
            alert(error.message)
          })
      })
      .catch((error) => {
        alert(error.message)
      })

  }

  return (
    <View style={{ backgroundColor: '#41B9B9', height: '100%', }}>
 
      <KeyboardAwareScrollView>
        <View style={{ paddingTop: 15, marginLeft: 15 }}>
          <TouchableOpacity style={{
            width: 46, height: 47, backgroundColor: '#89C1CD', borderRadius: 360,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 2, borderColor: '#13625D',
          }} onPress={() => navigation.navigate('Login')}>
            <Image style={{
              height: 38, width: 38, borderRadius: 360,
            }} source={require('../image/return.png')} />
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center', paddingTop: 66 }}>
          <Image style={{ height: 123, width: 254, }} source={require('../image/Logo.png')} />
        </View>

        <View style={{ alignItems: 'center', paddingTop: 46 }}>
          <Image style={{ height: 31, width: 110, }} source={require('../image/SignUp.png')} />
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
              backgroundColor: '#ffffff', width: 320, height: 40, margin: 10, justifyContent: 'flex-start'
              , borderRadius: 20, flexDirection: 'row', alignItems: 'center'
            }}>
              <Image style={{ height: 22, width: 22, marginLeft: 5 }} source={require('../image/phone.png')} />
              <TextInput placeholder='Phone'
                onChangeText={(phone) => setPhone(phone)}
                autoCorrect={false}
                style={{ marginLeft: 10, width: 270 }}

              ></TextInput>
            </View>

            <View style={{
              backgroundColor: '#ffffff', width: 320, height: 40, margin: 10, justifyContent: 'flex-start'
              , borderRadius: 20, flexDirection: 'row', alignItems: 'center'
            }}>
              <Image style={{ height: 22, width: 22, marginLeft: 5 }} source={require('../image/mail.png')} />
              <TextInput placeholder='Email'
                onChangeText={(email) => setEmail(email)}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType='email-address'
                style={{ marginLeft: 10, width: 270 }}

              ></TextInput>
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
              backgroundColor: '#EAD565', width: 160, height: 46, justifyContent: 'center', alignItems: 'center', borderRadius: 20,
              borderWidth: 1, borderColor: '#13625D'
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