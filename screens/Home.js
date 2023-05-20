import { Text, StyleSheet, View, TouchableOpacity, StatusBar, TextInput, Image, FlatList, Pressable, ActivityIndicator, Modal, Button, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import moment from 'moment-timezone';
import { firebase } from '../config'

function Home({ navigation }) {
  const [banner, setBanner] = useState([]);
  const [discount, setDiscount] = useState([]);
  const [holiday, setHoliday] = useState([]);
  const [news, setNews] = useState([]);
  const todoRef = firebase.firestore().collection('Banner');
  const todoRef_01 = firebase.firestore().collection('Discount');
  const todoRef_02 = firebase.firestore().collection('Holiday');
  const todoRef_03 = firebase.firestore().collection('News');

  const [showNotification, setShowNotification] = useState(false);

  const [showEmailVerificationView, setShowEmailVerificationView] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  useEffect(() => {
    const checkEmailVerification = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        await user.reload();

        if (user.emailVerified) {
          setIsEmailVerified(true);
        } else {
          setIsEmailVerified(false);
          setShowEmailVerificationView(true);
        }
      }
    };

    checkEmailVerification();
  }, []);

  const handleEmailVerification = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      try {
        setIsCheckingEmail(true);
        await user.sendEmailVerification();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleVerifyButton = async () => {
    setIsCheckingEmail(true);

    const user = firebase.auth().currentUser;
    if (user) {
      try {
        await user.reload();
        setIsEmailVerified(user.emailVerified);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleCloseModal = () => {
    if (isEmailVerified) {
      setShowEmailVerificationView(false);
    } else {
      // Hiển thị thông báo cho người dùng rằng email chưa được xác thực
      // Hoặc bạn có thể thực hiện các hành động khác tùy theo yêu cầu của bạn
      alert('Email chưa được xác thực');
    }
  };




  const handlePress = () => {

    firebase
      .firestore()
      .collection('Notification')
      .doc(userId)
      .collection('notificate')
      .where('NotiStatus', '==', 'chưa xem')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            NotiStatus: 'đã xem'
          });
        });
      })
      .catch((error) => {
        console.error('Error updating documents: ', error);
      });

    setShowNotification(!showNotification);
  };




  useEffect(() => {
    todoRef
      .onSnapshot(
        querySnapshot => {
          const banner = []
          querySnapshot.forEach((doc) => {
            const { image, name } = doc.data()
            banner.push({
              id: doc.id,
              image,
              name,
            })
          })
          setBanner(banner)
        }
      )
  }, [])

  useEffect(() => {
    todoRef_01
      .onSnapshot(
        querySnapshot => {
          const discount = []
          querySnapshot.forEach((doc) => {
            const { image, name, description } = doc.data()
            discount.push({
              id: doc.id,
              image,
              name,
              description
            })
          })
          setDiscount(discount)
        }
      )
  }, [])

  useEffect(() => {
    todoRef_02
      .onSnapshot(
        querySnapshot => {
          const holiday = []
          querySnapshot.forEach((doc) => {
            const { image, name } = doc.data()
            holiday.push({
              id: doc.id,
              image,
              name,
            })
          })
          setHoliday(holiday)
        }
      )
  }, [])

  useEffect(() => {
    todoRef_03
      .onSnapshot(
        querySnapshot => {
          const news = []
          querySnapshot.forEach((doc) => {
            const { image, name } = doc.data()
            news.push({
              id: doc.id,
              image,
              name,
            })
          })
          setNews(news)
        }
      )
  }, [])

  const [order, setOrder] = useState([]);
  const [count, setCount] = useState([]);
  const userId = firebase.auth().currentUser.uid;
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('Notification')
      .doc(userId)
      .collection('notificate')
      .onSnapshot((querySnapshot) => {
        const ordersData = [];
        querySnapshot.forEach((doc) => {
          ordersData.push({ ...doc.data(), id: doc.id });
        });
        const ItemsCount = querySnapshot.docs.filter(doc => doc.data().NotiStatus === "chưa xem").length;
        setOrder(ordersData);
        setCount(ItemsCount)
      });

    return () => unsubscribe();
  }, []);

  if (!order) {
    return <ActivityIndicator />;
  }

  const handleUpdateStatus = () => {
    const messageOrdersRef = firebase.firestore().collection('MessageOrders');

    messageOrdersRef
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          const orderId = documentSnapshot.id;
          const messagesRef = messageOrdersRef.doc(orderId).collection('messages');

          messagesRef
            .where('status', '==', 'chưa xem')
            .get()
            .then((messageQuerySnapshot) => {
              const batch = firebase.firestore().batch();

              messageQuerySnapshot.forEach((messageDocumentSnapshot) => {
                const messageDocRef = messagesRef.doc(messageDocumentSnapshot.id);
                batch.update(messageDocRef, { status: 'đã xem' });
              });

              return batch.commit();
            })
            .catch((error) => {
              console.error('Error updating message status:', error);
            });
        });
      })
      .catch((error) => {
        console.error('Error retrieving message orders:', error);
      });

    navigation.navigate('Chat_NVPV');
  };

  return (
    <View style={{ backgroundColor: '#F0F0DD', height: '100%' }}>
      <Modal
        visible={showEmailVerificationView}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Yêu cầu xác thực email</Text>
            {isEmailVerified ? (
              <Button title="Đóng" onPress={handleCloseModal} />
            ) : (
              <>
                <Button title="Gửi email xác thực" onPress={handleEmailVerification} />
                <Button title="Kiểm tra" onPress={handleVerifyButton} />
              </>
            )}
          </View>
        </View>
      </Modal>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
        <View style={{ paddingTop: 10, marginLeft: 10 }}>
          <TouchableOpacity style={{
            width: 46, height: 47, backgroundColor: '#F3D051', borderRadius: 360,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 2, borderColor: '#C7AC4F',
          }} onPress={() => navigation.navigate('Profile')} >
            <Image style={{ width: 30, height: 30, borderRadius: 360 }} source={require('../image/User.png')} />
          </TouchableOpacity>
        </View>
        <View style={{ paddingTop: 20, }}>
          <View style={{ backgroundColor: '#F3D051', width: 194, height: 36, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18 }}>Trang chủ</Text>
          </View>
        </View>
        <View style={{ paddingTop: 12, marginRight: 10 }}>
          <TouchableOpacity onPress={handlePress} style={{
            width: 46, height: 47, backgroundColor: '#F3D051', borderRadius: 360,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 2, borderColor: '#C7AC4F',
          }}>
            <Image style={{ width: 35, height: 35 }} source={require('../image/Notification.png')} />
            {count > 0 && (
              <View style={{
                position: 'absolute',
                top: 30,
                right: -6,
                backgroundColor: '#DA2121',
                width: 18,
                height: 18,
                borderRadius: 9,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{ color: 'white', fontSize: 12 }}>{count}</Text>
              </View>
            )}


          </TouchableOpacity>
        </View>
      </View>


      <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}>
        <FlatList
          style={{}}
          data={banner}
          numColumns={1}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <Image style={{ width: 320, height: 128, zIndex: 1 }} source={{
                uri: item.image
              }} />
            </TouchableOpacity>
          )}
        />
      </View>
      {showNotification && (
        <View
          style={{
            position: 'absolute',
            top: 64,
            right: 30,
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 10,
            elevation: 5,
            zIndex: 100, // Giá trị có thể thay đổi tùy theo trường hợp
            width: 250,
            height: 300
          }}

        >
          <FlatList
            data={order}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() =>
                navigation.navigate('Kitchen_List_Detail', {
                  orderId: item.id,
                })}>
                <View style={{ paddingTop: 10, alignItems: 'center', justifyContent: 'center', }}>
                  <View style={{ height: 140, width: 230, backgroundColor: '#FBF5DE', flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1 }}>
                    <View style={{ flexDirection: 'column' }}>
                      <View style={{ paddingBottom: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{
                          height: 25, width: 180, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'
                          , borderRadius: 30, borderWidth: 1, flexDirection: 'row', marginLeft: 10
                        }}>
                          <Image style={{
                            height: 18, width: 18, marginRight: 5
                          }} source={{
                            uri: item.imageStatus
                          }} />
                          <Text style={{ fontSize: 14 }}>{item.status}</Text>

                        </View>
                      </View>
                      <View style={{ alignItems: 'center' }}>
                        <View style={{
                          marginLeft: 9, backgroundColor: 'white', borderRadius: 10, width: 210, height: 80, justifyContent: 'center',
                          borderWidth: 1
                        }}>
                          <View style={{ alignItems: 'flex-start', marginLeft: 5 }}>
                            <View style={{ flexDirection: 'row' }}>
                              <Text>Tên khách hàng:</Text>
                              <Text style={{ marginLeft: 5 }}>{item.customerName}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                              <Text>Nội dung:</Text>
                              {item.cancelReason && (
                                <Text style={{ marginLeft: 5 }}>
                                  {item.cancelReason}
                                </Text>
                              )}
                              {!item.cancelReason && item.finishReason && (
                                <Text style={{ marginLeft: 5 }}>
                                  {item.finishReason}
                                </Text>
                              )}
                            </View>
                            <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                              <Text>Thời gian:</Text>
                              {item.canceledAt && (
                                <Text style={{ marginLeft: 5 }}>
                                  {moment(item.canceledAt.toDate()).format('DD/MM/YYYY')}
                                </Text>
                              )}
                              {!item.canceledAt && item.finishAt && (
                                <Text style={{ marginLeft: 5 }}>
                                  {moment(item.finishAt.toDate()).format('DD/MM/YYYY')}
                                </Text>
                              )}
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 30, }}>
        <TouchableOpacity onPress={() => navigation.navigate('Table_Reserve')} style={{
          width: 102, height: 54, backgroundColor: '#ffffff', marginRight: 20, alignItems: 'center', justifyContent: 'center'
          , borderRadius: 10
          , borderWidth: 1
        }}>
          <Image style={{ height: 28, width: 28, }} source={require('../image/table.png')} />
          <Text style={{ fontSize: 11 }}>Đặt bàn</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('List_Food')} style={{
          width: 102, height: 54, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center'
          , borderRadius: 10
          , borderWidth: 1
        }}>
          <Image style={{ height: 28, width: 28, }} source={require('../image/order.png')} />
          <Text style={{ fontSize: 11 }}>Đặt món</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          width: 102, height: 54, backgroundColor: '#ffffff', marginLeft: 20, alignItems: 'center', justifyContent: 'center'
          , borderRadius: 10
          , borderWidth: 1
        }} onPress={handleUpdateStatus}>
          <Image style={{ height: 28, width: 28, }} source={require('../image/chat_box.png')} />
          <Text style={{ fontSize: 11, marginRight: 3 }}>Nhắn tin</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingTop: 20 }}>
        <View style={{ paddingBottom: 4 }}>
          <Image style={{ height: 28, width: 98, }} source={require('../image/Discount.png')} />
        </View>
      </View>
      <View >
        <View style={{ width: '100%', height: 100, backgroundColor: '#ffffff' }}>
          <FlatList
            style={{}}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={discount}
            renderItem={({ item }) => (
              <View style={{ justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate('Banner_Detail', { bannerId: item.id })} style={{ marginLeft: 15, justifyContent: 'center', borderWidth: 1, borderRadius: 10 }}>
                  <Image style={{ width: 138, height: 92, borderRadius: 10 }} source={{
                    uri: item.image
                  }} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>

      <View style={{ paddingTop: 20 }}>
        <View style={{ paddingBottom: 4 }}>
          <Image style={{ height: 28, width: 98, }} source={require('../image/Holiday.png')} />
        </View>
      </View>
      <View >
        <View style={{ width: '100%', height: 100, backgroundColor: '#ffffff' }}>
          <FlatList
            style={{}}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={holiday}
            renderItem={({ item }) => (
              <View style={{ justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate('Banner_Detail', { bannerId: item.id })} style={{ marginLeft: 15, justifyContent: 'center', borderWidth: 1, borderRadius: 10 }}>
                  <Image style={{ width: 138, height: 92, borderRadius: 10 }} source={{
                    uri: item.image
                  }} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>

      <View style={{ paddingTop: 20 }}>
        <View style={{ paddingBottom: 4 }}>
          <Image style={{ height: 28, width: 76, }} source={require('../image/News.png')} />
        </View>
      </View>
      <View >
        <View style={{ width: '100%', height: 100, backgroundColor: '#ffffff' }}>
          <FlatList
            style={{}}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={news}
            renderItem={({ item }) => (
              <View style={{ justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate('Banner_Detail', { bannerId: item.id })} style={{ marginLeft: 15, justifyContent: 'center', borderWidth: 1, borderRadius: 10 }}>
                  <Image style={{ width: 138, height: 92, borderRadius: 10 }} source={{
                    uri: item.image
                  }} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>


    </View>
  )
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
});


export default Home;