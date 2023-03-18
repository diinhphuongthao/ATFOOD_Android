import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from "../screens/Home";
import StartedApp from "../screens/StartedApp";
import SignUp from "../screens/SignUp";
import Login from "../screens/Login";
import Profile from "../screens/Profile";
import List_Food from "../screens/List_Food";
import Meat_List from "../screens/Meat_List";
import Fish_List from "../screens/Fish_List";
import Soup_List from "../screens/Soup_List";
import Drink_List from "../screens/Drink_List";
import Detail_Meat from "../screens/Detail_Meat";
import Detail_Soup from "../screens/Detail_Soup";
import Detail_Fish from "../screens/Detail_Fish";
import Detail_Drink from "../screens/Detail_Drink";
import Cart from "../screens/Cart";
import Home_NVPV from "../screens/Home_NVPV";
import { firebase } from '../config'
import { useState, useEffect } from 'react';


const Stack = createNativeStackNavigator();

function StackNavigator() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }
    useEffect(() => {
        const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);
    if (initializing) return null;

    if (!user) {
        return (

            <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#daa520', } }}>
                <Stack.Screen name='StartedApp' component={StartedApp} options={{ headerShown: false }} />
                <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
                <Stack.Screen name='SignUp' component={SignUp} options={{ headerShown: false }} />
            </Stack.Navigator>


        );
    }
    return (

        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#daa520', } }}>
            <Stack.Screen name='Home_NVPV' component={Home_NVPV} options={{ headerShown: false }} />
            <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
            <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name='List_Food' component={List_Food} options={{ headerShown: false }} />
            <Stack.Screen name='Meat_List' component={Meat_List} options={{ headerShown: false }} />
            <Stack.Screen name='Fish_List' component={Fish_List} options={{ headerShown: false }} />
            <Stack.Screen name='Soup_List' component={Soup_List} options={{ headerShown: false }} />
            <Stack.Screen name='Drink_List' component={Drink_List} options={{ headerShown: false }} />
            <Stack.Screen name='Detail_Meat' component={Detail_Meat} options={{ headerShown: false }} />
            <Stack.Screen name='Detail_Soup' component={Detail_Soup} options={{ headerShown: false }} />
            <Stack.Screen name='Detail_Fish' component={Detail_Fish} options={{ headerShown: false }} />
            <Stack.Screen name='Detail_Drink' component={Detail_Drink} options={{ headerShown: false }} />
            <Stack.Screen name='Cart' component={Cart} options={{ headerShown: false }} />
        </Stack.Navigator>
  


    );
}
const MainNavigator = () => {
    return (

        <NavigationContainer>
            <StackNavigator >

            </StackNavigator>
        </NavigationContainer>

    );
}

export default MainNavigator;