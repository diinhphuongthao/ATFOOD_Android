import { Text, StyleSheet, View, TouchableOpacity, StatusBar, TextInput, Image, FlatList, Pressable, Switch } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'

function Home_NVPV({ navigation, route }) {
  const { IdStaff } = route.params;
  const { Staff } = route.params;
  console.log("idStaff:" + IdStaff)
  console.log("Staff:" + Staff)
  const handlePress = () => {
    navigation.goBack();
  };
  const [email, setEmail] = useState('');
  const userRef = firebase.firestore().collection('Staff').where('email', '==', IdStaff || Staff);
  userRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      const userData = doc.data();
      setEmail(userData.email)
    });
  }).catch((error) => {
    console.log("Error getting documents: ", error);
  });

  const [status, setStatus] = useState(true);
  const updateAllCollectionsStatus = async (newStatus) => {
    const firestore = firebase.firestore();

    // Get a reference to each collection
    const meatRef = firestore.collection('Meat');
    const fishRef = firestore.collection('Fish');
    const soupRef = firestore.collection('Soup');
    const drinkRef = firestore.collection('Drink');

    try {
      // Fetch the documents from each collection
      const meatSnapshot = await meatRef.get();
      const fishSnapshot = await fishRef.get();
      const soupSnapshot = await soupRef.get();
      const drinkSnapshot = await drinkRef.get();

      // Update the status of each document in each collection
      const batch = firestore.batch();

      const statusString = newStatus ? 'Còn món' : 'Hết món' ;

      meatSnapshot.forEach((doc) => {
        const meatDocRef = meatRef.doc(doc.id);
        batch.update(meatDocRef, { status: statusString });
      });

      fishSnapshot.forEach((doc) => {
        const fishDocRef = fishRef.doc(doc.id);
        batch.update(fishDocRef, { status: statusString });
      });

      soupSnapshot.forEach((doc) => {
        const soupDocRef = soupRef.doc(doc.id);
        batch.update(soupDocRef, { status: statusString });
      });

      drinkSnapshot.forEach((doc) => {
        const drinkDocRef = drinkRef.doc(doc.id);
        batch.update(drinkDocRef, { status: statusString });
      });

      // Commit the batch update
      await batch.commit();

      console.log('All collections updated successfully');
    } catch (error) {
      console.error('Error updating collections:', error);
    }
  };


  // Example usage: Toggle the status and update all collections
  const toggleStatus = async () => {
    const newStatus = !status;

    // Call the updateAllCollectionsStatus function with the new status
    await updateAllCollectionsStatus(newStatus);

    // Update the status state if needed
    setStatus(newStatus);
  };

  return (
    <View style={{ alignItems: 'center', paddingTop: 85, backgroundColor: '#F0F0DD', height: '100%' }}>
      <View style={{ alignItems: 'center' }}>

        <View>
          <Switch
            value={status}
            onValueChange={toggleStatus}
          />
          <Text>{status ? 'Còn món' : 'Hết món'}</Text>
        </View>
        <View style={{ paddingTop: 180, flexDirection: 'row' }}>

          <View style={{ marginRight: 10 }}>
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('Order_NVPV')} style={{
                width: 160, height: 100, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center'
                , borderRadius: 20
                , borderWidth: 1

              }}>
                <Image style={{ height: 50, width: 50, }} source={require('../image/order.png')} />
                <Text style={{ fontSize: 18, paddingTop: 5 }}>Order</Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingTop: 20 }}>
              <TouchableOpacity onPress={() => navigation.navigate('Table_NVPV', { EmailStaff: IdStaff })} style={{
                width: 160, height: 100, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center'
                , borderRadius: 20
                , borderWidth: 1
                ,
              }}>
                <Image style={{ height: 50, width: 50, }} source={require('../image/table.png')} />
                <Text style={{ fontSize: 18, paddingTop: 5 }}>Table</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginLeft: 10 }}>
            <View style={{}}>
              <TouchableOpacity onPress={() => navigation.navigate('Chat', { EmailStaff: email })} style={{
                width: 160, height: 100, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center'
                , borderRadius: 20
                , borderWidth: 1
                ,
              }}>
                <Image style={{ height: 50, width: 50, }} source={require('../image/chat_box.png')} />
                <Text style={{ fontSize: 18, paddingTop: 5 }}>Chat</Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingTop: 20 }}>
              <TouchableOpacity onPress={() => navigation.navigate('List_Food_NVPV', { EmailStaff: IdStaff || Staff })} style={{
                width: 160, height: 100, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center'
                , borderRadius: 20
                , borderWidth: 1
                ,
              }}>
                <Image style={{ height: 50, width: 50, marginLeft: 6 }} source={require('../image/food.png')} />
                <Text style={{ fontSize: 18, paddingTop: 5 }}>Menu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={{ paddingTop: 140 }}>
        <TouchableOpacity style={{ height: 50, width: 160, borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F46C6C', borderRadius: 15 }}
          onPress={handlePress}>
          <Text style={{ fontSize: 22 }}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Home_NVPV;