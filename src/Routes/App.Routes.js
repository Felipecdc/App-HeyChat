import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignIn from "../Pages/SignIn";
import ChatRoom from "../Pages/ChatRoom";
import Search from "../Pages/Search";
import Messages from "../Pages/Messages";

const Stack = createNativeStackNavigator();

function AppRoutes(){
    return(
        <Stack.Navigator
        initialRouteName="ChatRoom"
        >

            <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{
                title: "Faça login"
            }}
            />

            <Stack.Screen
            name="ChatRoom"
            component={ChatRoom}
            options={{
                headerShown: false
            }}
            />

            <Stack.Screen
            name="Search"
            component={Search}
            />

        </Stack.Navigator>
    )
}

export default AppRoutes;