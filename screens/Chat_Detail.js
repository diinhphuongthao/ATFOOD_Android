import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, SafeAreaView, KeyboardAvoidingView } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { firebase } from '../config'
import moment from 'moment-timezone';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

function Chat_Detail({ orderId, route, navigation }) {
  const { itemId } = route.params;
  const { emailStaff } = route.params;
  // console.log(itemId)
  // console.log(emailStaff)
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');




  // const currentUser = firebase.auth().currentUser;
  const orderRef = firebase.firestore().collection('MessageOrders').doc(itemId);
  const userRef = firebase.firestore().collection('Staff').where('email', '==', emailStaff);
  const handleSend = () => {
    if (message === '') {
      return; // Không làm gì nếu tin nhắn rỗng
    }
    userRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          console.log(userData)
          const newMessage = {
            content: message,
            nvid: doc.id,
            nvName: userData.name,
            nvPhone: userData.phone,
            time: new Date().getTime()
          };
          const newMessage2 = {
            nvid: doc.id,
            nvName: userData.name,
            nvPhone: userData.phone,
          };
          setMessages([...messages, newMessage, newMessage2]);
          setMessage('');

          // Lưu tin nhắn mới vào database
          orderRef.get().then((docSnapshot) => {
            if (docSnapshot.exists) {
              orderRef.update(newMessage2);
            } else {
              orderRef.set(newMessage2);
            }
          }).catch((error) => {
            console.log("Error getting document:", error);
          });
          orderRef.collection('messages').add(newMessage);

        } else {
          console.log("No such user document!");
        }
      });
    }).catch((error) => {
      console.log("Error getting user document:", error);
    });
  }

  const renderItem = ({ item }) => {
    const timestamp = item.time;
    const date = new Date(timestamp);
    // const year = date.getFullYear();
    // const month = ('0' + (date.getMonth() + 1)).slice(-2);
    // const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    const dateString = `${hours}:${minutes}:${seconds}`;
    let sender = item.senderName;
    let textStyle = styles.messageContainer; // Mặc định là style của senderName

    if (item.nvName) {
      sender = item.nvName;
      textStyle = styles.messageContainerRight; // Style của nvName
    }

    return (
      <View style={textStyle}>
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.messageInfo}>{`${sender} • ${dateString}`}</Text>
      </View>
    );
  };

  React.useEffect(() => {
    const unsubscribe = orderRef.collection('messages')
      .orderBy('time')
      .onSnapshot((querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => doc.data()).reverse();
        setMessages(messages);
      });
    return () => unsubscribe();
  }, []);

  const handleDeleteConversation = () => {
    orderRef.collection('messages').get()
      .then(querySnapshot => {
        const batch = firebase.firestore().batch();
        querySnapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
        return batch.commit();
      })
      .then(() => {
        orderRef.delete().then(() => {
          navigation.navigate('Chat');
        });
      })
      .catch(error => {
        console.error("Error deleting conversation: ", error);
      });
  }


  return (
    <SafeAreaView style={styles.container}>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
        <View style={{ paddingTop: 15, marginLeft: 15 }}>
          <TouchableOpacity style={{
            width: 46, height: 47, backgroundColor: '#FFE55E', borderRadius: 360,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 2, borderColor: '#BFB12D',
          }} onPress={() => navigation.navigate('Chat',  { EmailStaff: emailStaff })}>
            <Image style={{
              height: 38, width: 38, borderRadius: 360,
            }} source={require('../image/return.png')} />
          </TouchableOpacity>
        </View>
        <View style={{ paddingTop: 20, }}>
          <View style={{ backgroundColor: '#86D3D3', width: 194, height: 36, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18 }}>Nhắn tin</Text>
          </View>
        </View>
        <View style={{ paddingTop: 15, marginRight: 15 }}>
          <TouchableOpacity style={{
            width: 46, height: 47, backgroundColor: '#89C1CD', borderRadius: 360,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 2, borderColor: '#13625D',
          }} onPress={handleDeleteConversation}>
            {/* <Image style={{
              height: 26, width: 26
            }} source={require('../image/cart.png')} /> */}
          </TouchableOpacity>
        </View>
      </View>
      <KeyboardAvoidingView
        style={{ height: 700 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          inverted={true}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message here"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={{ backgroundColor: '#8CD6F6', borderRadius: 360, height: 46, width: 46, alignItems: 'center', justifyContent: 'center' }} onPress={handleSend}>
            <Image style={{
              height: 38, width: 38, marginRight: 5
            }} source={require('../image/Send.png')} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    height: '100%', backgroundColor: '#F0F0DD'
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 10,
    marginLeft: 10
  },
  messageContainerRight: {
    backgroundColor: '#A7D0F7',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignSelf: 'flex-end',
    maxWidth: '50%',
    marginRight: 10
  },
  messageContainer: {
    backgroundColor: '#A7D0F7',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
    maxWidth: '50%',
    marginLeft: 10
  },
  messageText: {
    fontSize: 16,
  },
  messageInfo: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DDF0F0',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
export default Chat_Detail;