import React from "react";
import {View, Text, Button} from 'react-native';
import { useNavigation } from "@react-navigation/native";

import auth from '@react-native-firebase/auth';

export default function ChatRoom(){

    const navigation = useNavigation()

    return(
        <View>
            <Text>Tela de ChatRoom do app</Text>
            <Button
            title="navegar"
            onPress={() => navigation.navigate("SignIn")}
            />
        </View>
    )
}