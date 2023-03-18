import { Text, StyleSheet, View, TouchableOpacity, StatusBar, TextInput, Image, FlatList, Pressable, } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'

function Home_NVPV({ navigation }) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 35 }}>
    <TouchableOpacity style={{ height: 50, width: 160, borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F46C6C', borderRadius: 15 }}
        onPress={() => { firebase.auth().signOut() }}>
        <Text style={{ fontSize: 22 }}>
            Sign Out
        </Text>
    </TouchableOpacity>
</View>
  )
}

export default Home_NVPV;