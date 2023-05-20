import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, SafeAreaView, KeyboardAvoidingView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import moment from 'moment-timezone';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc, Timestamp } from 'firebase/firestore'





function Chat_NVPV({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');


  const currentUser = firebase.auth().currentUser;
  const orderRef = firebase.firestore().collection('MessageOrders').doc(currentUser.uid);

  const userRef = firebase.firestore().collection('users').doc(currentUser.uid);
  const handleSend = () => {
    if (message === '') {
      return; // Không làm gì nếu tin nhắn rỗng
    }
    userRef.get().then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        const newMessage = {
          content: message,
          senderId: currentUser.uid,
          senderName: userData.name,
          senderPhone: userData.phone,
          status: 'chưa xem',
          time: new Date().getTime()
        };
        const newMessage2 = {

          id: currentUser.uid,
          senderName: userData.name,
          senderPhone: userData.phone,

        };




        setMessages([...messages, newMessage,]);
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
    }).catch((error) => {
      console.log("Error getting user document:", error);
    });
  }

  const goBack = () => {
    navigation.goBack()
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
    let textStyle = styles.messageContainerRight;

    if (item.nvName) {
      sender = item.nvName;
      textStyle = styles.messageContainer; // Style của nvName
    }

    // if (item.nvName == 'nhan vien phuc vu') {
    //   sender = item.nvName;
    //   textStyle = styles.messageContainer; // Style của nvName
    // } else {
    //   textStyle = styles.messageContainerRight;
    // }

    // let sender = item.senderName;
    // let textStyle = styles.messageContainer; // Mặc định là style của senderName



    return (
      <View style={textStyle}>
        <Text style={styles.messageText}>{item.content}</Text>
        {item.status !== undefined ? (
          <Text style={styles.messageInfo}>{`${sender} • ${dateString} • ${item.status}`}</Text>
        ) : (
          <Text style={styles.messageInfo}>{`${sender} • ${dateString}`}</Text>
        )}
      </View>

    );
  };



  React.useEffect(() => {
    const unsubscribe = orderRef.collection('messages')
      .orderBy('time')
      .onSnapshot((querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => doc.data()).reverse();
        setMessages(messages);

        orderRef.get().then((documentSnapshot) => {
          const orderData = documentSnapshot.data();
          const nvid = orderData?.nvid;

          const batch = firebase.firestore().batch();
          querySnapshot.docs.forEach((documentSnapshot) => {
            const messageData = documentSnapshot.data();
            const messageId = documentSnapshot.id;
            const senderId = messageData.senderId;

            if (nvid || senderId === nvid) {
              const docRef = orderRef.collection('messages').doc(messageId);
              batch.update(docRef, { status: 'đã xem' });
            }
          });

          batch.commit().catch((error) => {
            console.error('Error updating message statuses:', error);
          });
        });
      });

    return () => {
      unsubscribe();
    };
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
          navigation.goBack();
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
          }} onPress={goBack}>
            <Image style={{
              height: 38, width: 38, borderRadius: 360,
            }} source={require('../image/return.png')} />
          </TouchableOpacity>
        </View>
        <View style={{ paddingTop: 20, marginRight: 95 }}>
          <View style={{ backgroundColor: '#F3D051', width: 194, height: 36, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18 }}>Nhắn tin</Text>
          </View>
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
          <TouchableOpacity style={{ borderRadius: 360, height: 46, width: 46, alignItems: 'center', justifyContent: 'center' }} onPress={handleSend}>
            <Image style={{
              height: 38, width: 38, marginLeft: 5
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
    backgroundColor: '#F0F0DD',
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
export default Chat_NVPV;