import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button, FlatList, TextInput, Alert, query, where } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { firebase } from '../config'
import moment from 'moment-timezone';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Platform } from 'react-native';
import Geocoder from 'react-native-geocoding';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { geocodeAsync } from 'expo-location';
import *as Location from 'expo-location';

function Map({ navigation, route }) {
  const { orderId } = route.params;
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState({
    latitude: 10.8231,
    longitude: 106.6297,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [marker, setMarker] = useState({
    coordinate: {
      latitude: 10.8231,
      longitude: 106.6297,
    },
  });


  const handleSearch = async () => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${'AIzaSyD-7KtEO8VS2FGW1qkLcKdYMc-1LyUJbTM'}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.results[0] && data.results[0].geometry) {
        const location = data.results[0].geometry.location;
        setMarker({
          coordinate: {
            latitude: location.lat,
            longitude: location.lng,
          },
        });
        setRegion({
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } else {
        alert('Địa chỉ không hợp lệ')
      }
    } catch (error) {
      console.error(error);
    }
  };


  const handlePresss = () => {
    navigation.goBack();
  };

  const handlePress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarker({
      coordinate: { latitude, longitude },
    });
  };

  const [marker1, setMarker1] = useState(null);
  const [marker2, setMarker2] = useState(null);
  const [deliveryId, setDeliveryId] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // const getCurrentLocation = async () => {
  //   const { status } = await Location.requestForegroundPermissionsAsync();
  //   if (status !== 'granted') {
  //     console.log('Permission to access location was denied');
  //     return;
  //   }

  //   try {
  //     const location = await Location.getCurrentPositionAsync({});
  //     const { latitude, longitude } = location.coords;
  //     setRegion({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });
  //     setMarker1({ latitude, longitude });
  //   } catch (error) {
  //     console.log('Error getting current location', error);
  //   }
  // };


  const getDeliveryAddress = async () => {
    try {
      const deliveryRef = firebase.firestore().collection("Deliverys").doc(orderId);
      const deliveryDoc = await deliveryRef.get();
      if (!deliveryDoc.exists) {
        throw new Error(`Delivery document with id ${orderId} does not exist`);
      }
      const { address, coordinate } = deliveryDoc.data();
      setDeliveryAddress(address);
      setMarker2({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        latitudeDelta: coordinate.latitudeDelta,
        longitudeDelta: coordinate.longitudeDelta
      });
      console.log(`Địa chỉ: ${address}, Tọa độ: (${coordinate.latitude}, ${coordinate.longitude})`);
    } catch (error) {
      console.error(error);
    }
  };



  useEffect(() => {

    getDeliveryAddress();
  }, []);

  const [markerAddress, setMarkerAddress] = useState('');
  const handleMarkerPress = (event) => {
    const { coordinate } = event.nativeEvent;
    const { latitude, longitude } = coordinate;

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${'AIzaSyD-7KtEO8VS2FGW1qkLcKdYMc-1LyUJbTM'}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          const address = data.results[0].formatted_address;
          setAddress(address);
          setMarkerAddress(address);
          setTextInputValue("");
          console.log(`Địa chỉ: ${address}, Tọa độ: (${latitude}, ${longitude})`);
        } else {
          console.log('Không tìm thấy địa chỉ');
        }
      })
      .catch((error) => console.error(error));
  };



  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
        <View style={{ paddingTop: 15, marginLeft: 15 }}>
          <TouchableOpacity style={{
            width: 46, height: 47, backgroundColor: '#89C1CD', borderRadius: 360,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 2, borderColor: '#13625D',
          }} onPress={handlePresss}>
            <Image style={{
              height: 38, width: 38, borderRadius: 360,
            }} source={require('../image/return.png')} />
          </TouchableOpacity>
        </View>
        <View style={{ paddingTop: 20, }}>
          <View style={{ backgroundColor: '#86D3D3', width: 194, height: 36, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18 }}>Cart</Text>
          </View>
        </View>
        <View style={{ paddingTop: 15, marginRight: 15 }}>
          <TouchableOpacity style={{
            width: 46, height: 47, backgroundColor: '#89C1CD', borderRadius: 360,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 2, borderColor: '#13625D',
          }} onPress={() => navigation.navigate('Order_History')}>
            <Image style={{
              height: 30, width: 30
            }} source={require('../image/order_history.png')} />
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={styles.searchInput}
        value={address || markerAddress}
        onChangeText={(text) => setAddress(text) || setMarkerAddress(text)}
        onSubmitEditing={handleSearch}
        placeholder="Enter address"
      />
      <TextInput
        style={styles.searchInput}
        value={deliveryAddress}
        onChangeText={(text) => setDeliveryAddress(text)}
        onSubmitEditing={() => getDeliveryAddress(deliveryId)}
        placeholder="Enter delivery ID"
      />



      <MapView style={styles.map}
        region={region}
        onPress={handlePress}>
        <Marker coordinate={marker.coordinate} onPress={handleMarkerPress} />
      </MapView>
    </View>
  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '70%',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    width: '90%',
    backgroundColor: '#fff',
  },
});






export default Map;