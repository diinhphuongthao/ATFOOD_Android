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
import Order_History from "../screens/Order_History";
import Cart from "../screens/Cart";
import Home_NVPV from "../screens/Home_NVPV";
import Order_NVPV from "../screens/Order_NVPV";
import Table_NVPV from "../screens/Table_NVPV";
import Table_NVPV_Detail from "../screens/Table_NVPV_Detail";
import Chat_NVPV from "../screens/Chat_NVPV";
import Menu_NVPV from "../screens/Menu_NVPV";
import Order_History_Detail from "../screens/Order_History_Detail";
import Order_Detail from "../screens/Order_Detail";
import Order_History_NVPV from "../screens/Order_History_NVPV";
import Chat from "../screens/Chat";
import Chat_Detail from "../screens/Chat_Detail";
import Kitchen_List from "../screens/Kitchen_List";
import Kitchen_List_Detail from "../screens/Kitchen_List_Detail";
import Kitchen_List_Order from "../screens/Kitchen_List_Order";
import Kitchen_List_Cooking from "../screens/Kitchen_List_Cooking";
import Chat_Kitchen from "../screens/Chat_Kitchen";
import Shipper_List from "../screens/Shipper_List";
import Shipper_List_Detail from "../screens/Shipper_List_Detail";
import Shipper_List_Order from "../screens/Shipper_List_Order";
import Shipper_List_Delivering from "../screens/Shipper_List_Delivering";
import Map from "../screens/Map";
import Chat_Shipper from "../screens/Chat_Shipper";
import Table_Reserve from "../screens/Table_Reserve";
import Table_Reserve_Detail from "../screens/Table_Reserve_Detail";
import Banner_Detail from "../screens/Banner_Detail";
import { firebase } from '../config'
import { useState, useEffect } from 'react';



const Stack = createNativeStackNavigator();

function StackNavigator() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();
    const currentUser = firebase.auth().currentUser;
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
    } if (currentUser && currentUser.email === "nvpvmq@gmail.com") {
        return (

            <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#daa520', } }}>
                <Stack.Screen name='Home_NVPV' component={Home_NVPV} options={{ headerShown: false }} />
                <Stack.Screen name='Order_NVPV' component={Order_NVPV} options={{ headerShown: false }} />
                <Stack.Screen name='Table_NVPV' component={Table_NVPV} options={{ headerShown: false }} />
                <Stack.Screen name='Table_NVPV_Detail' component={Table_NVPV_Detail} options={{ headerShown: false }} />
                <Stack.Screen name='Chat' component={Chat} options={{ headerShown: false }} />
                <Stack.Screen name='Menu_NVPV' component={Menu_NVPV} options={{ headerShown: false }} />
                <Stack.Screen name='Order_Detail' component={Order_Detail} options={{ headerShown: false }} />
                <Stack.Screen name='Order_History_NVPV' component={Order_History_NVPV} options={{ headerShown: false }} />
                <Stack.Screen name='Chat_Detail' component={Chat_Detail} options={{ headerShown: false }} />
            </Stack.Navigator>


        );
    } if (currentUser && currentUser.email === "nvbepmq@gmail.com") {
        return (

            <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#daa520', } }}>
                <Stack.Screen name='Kitchen_List' component={Kitchen_List} options={{ headerShown: false }} />
                <Stack.Screen name='Kitchen_List_Detail' component={Kitchen_List_Detail} options={{ headerShown: false }} />
                <Stack.Screen name='Kitchen_List_Order' component={Kitchen_List_Order} options={{ headerShown: false }} />
                <Stack.Screen name='Kitchen_List_Cooking' component={Kitchen_List_Cooking} options={{ headerShown: false }} />
                <Stack.Screen name='Chat_Kitchen' component={Chat_Kitchen} options={{ headerShown: false }} />
                <Stack.Screen name='Order_Detail' component={Order_Detail} options={{ headerShown: false }} />
            </Stack.Navigator>


        );
    }
    const emailParts = currentUser.email.split('@');
    const emailName = emailParts[0];
    const emailDomain = emailParts[1];
    const emailNumber = parseInt(emailName.replace('nvship', ''));
    if (emailDomain === 'gmail.com' && emailNumber >= 1 && emailNumber <= 10) {
        return (

            <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#daa520', } }}>
                <Stack.Screen name='Shipper_List' component={Shipper_List} options={{ headerShown: false }} />
                <Stack.Screen name='Shipper_List_Detail' component={Shipper_List_Detail} options={{ headerShown: false }}/>
                <Stack.Screen name='Shipper_List_Order' component={Shipper_List_Order} options={{ headerShown: false }} />
                <Stack.Screen name='Shipper_List_Delivering' component={Shipper_List_Delivering} options={{ headerShown: false }} />
                <Stack.Screen name='Map' component={Map} options={{ headerShown: false }} />
                <Stack.Screen name='Chat_Shipper' component={Chat_Shipper} options={{ headerShown: false }} />
                <Stack.Screen name='Order_Detail' component={Order_Detail} options={{ headerShown: false }} />
            </Stack.Navigator>


        );
    }
    return (

        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#daa520', } }}>

            <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
            <Stack.Screen name='Banner_Detail' component={Banner_Detail} options={{ headerShown: false }} />
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
            <Stack.Screen name='Order_History' component={Order_History} options={{ headerShown: false }} />
            <Stack.Screen name='Order_Detail' component={Order_Detail} options={{ headerShown: false }} />
            <Stack.Screen name='Order_History_Detail' component={Order_History_Detail} options={{ headerShown: false }} />
            <Stack.Screen name='Cart' component={Cart} options={{ headerShown: false }} />
            <Stack.Screen name='Chat_NVPV' component={Chat_NVPV} options={{ headerShown: false }} />
            <Stack.Screen name='Table_Reserve' component={Table_Reserve} options={{ headerShown: false }} />
            <Stack.Screen name='Table_Reserve_Detail' component={Table_Reserve_Detail} options={{ headerShown: false }} />
            <Stack.Screen name='Shipper_List_Detail' component={Shipper_List_Detail} options={{ headerShown: false }}/>

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