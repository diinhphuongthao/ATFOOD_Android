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
import axios from 'axios';
import MapViewDirections from 'react-native-maps-directions';
const apiKey = 'Amn9jc6ebY9SAWGjrWUkv4SIPBGtADQQjxfJmsxmYzAeqCxkS4VMGVyDn1upfyiY';
function Map({ navigation, route }) {
  // const { orderId } = route.params;
  const userId = firebase.auth().currentUser.uid;
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [directions, setDirections] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      // Get user address from Firestore
      const userDoc = await firebase.firestore().collection('users').doc(userId).get();
      const userAddress = userDoc.data().address;
      setAddress(userAddress);

      // Get coordinates of user address using Bing Maps API
      const response = await axios.get(`http://dev.virtualearth.net/REST/v1/Locations?query=${encodeURIComponent(userAddress)}&key=${apiKey}`);
      const location = response.data.resourceSets[0].resources[0].geocodePoints[0].coordinates;
      const newRegion = {
        latitude: location[0],
        longitude: location[1],
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setRegion(newRegion);

      // Set markers for user location and IUH
      const userMarker = { latlng: newRegion, title: 'My Location' };
      const iuhLocation = { latitude: 10.851, longitude: 106.772, latitudeDelta: 0.0922, longitudeDelta: 0.0421 };
      const iuhMarker = { latlng: iuhLocation, title: 'IUH' };
      setMarkers([userMarker, iuhMarker]);
    };
    fetchData();
  }, []);

  const getDirections = async () => {
    try {
      // Get coordinates of user location and IUH
      const iuhLocation = { latitude: 10.851, longitude: 106.772 };
      const userLocation = markers[0].latlng;

      // Call Bing Maps API to get directions
      const response = await axios.get(`http://dev.virtualearth.net/REST/v1/Routes?wayPoint.1=${iuhLocation.latitude},${iuhLocation.longitude}&waypoint.2=${userLocation.latitude},${userLocation.longitude}&key=${apiKey}`);
      console.log(response.data)

      // Create an array of coordinates to draw the route on the map
      const resources = response.data.resourceSets[0].resources;
      const travelDistance = resources[0].travelDistance;
      console.log(travelDistance)
      // const coordinates = resources[0].routePathIndex.line.coordinates.map((point) => ({
      //   latitude: point[0],
      //   longitude: point[1],
      // }));

      // Set the state to render the route on the map
      setDirections(coordinates);
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
      >
        {markers.map(marker => (
          <Marker
            coordinate={marker.latlng}
            title={marker.title}
            key={marker.title}
          />
        ))}
        {directions && (
          <MapViewDirections
            origin={{ latitude: 10.851, longitude: 106.772 }}
            destination={{ latitude: region.latitude, longitude: region.longitude }}
            apikey={apiKey}
            strokeWidth={3}
            strokeColor="hotpink"
            onReady={result => {
              console.log(result);
            }}
          />
        )}
      </MapView>
      <View>
        <Button title="Get Directions" onPress={getDirections} />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '90%',
  },
});






export default Map;