import React from "react";
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { useNavigation } from "@react-navigation/native";

function FabButton({setVisible, userStatus}){

    const navigate = useNavigation();

    function handleAdd(){
        userStatus ? setVisible() : navigate.navigate('SignIn')
    }

    return(
        <TouchableOpacity 
        style={styles.containerBtn}
        activeOpacity={0.7}
        onPress={handleAdd}
        >
            <View>
                <Text style={styles.Text}>+</Text>
            </View>
        </TouchableOpacity>
    )
}

export default FabButton;

const styles = StyleSheet.create({
    containerBtn:{
        backgroundColor: '#2e54d7',
        width: 60,
        height: 60,
        borderRadius: 31,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: '5%',
        right: '6%',
    },
    Text:{
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold",
    }
})