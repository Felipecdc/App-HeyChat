import React, {useState} from "react";
import auth, { firebase } from '@react-native-firebase/auth';
import { useNavigation } from "@react-navigation/native";
import {View, SafeAreaView, Text, TouchableOpacity, StyleSheet, TextInput, Platform} from 'react-native';

export default function SignIn(){

    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState(false);

    function handleLogin(){

        if(type){
            if(name === '' || email === '' || password === '') return;

            auth().createUserWithEmailAndPassword(email, password)
            .then((user) => {
                user.user.updateProfile({
                    displayName: name
                })
                .then(() => {
                    navigation.goBack();
                })
                .catch((err) => {
                    if(err.code === 'auth/email-already-in-use'){
                        console.log('Endereço de email ja está em uso!')
                    }
                    if(err.code === 'auth/invalid-email'){
                        console.log('Endereço de email invalido!')
                    }
                })
            })
            .catch((err) => {
                console.log("ERRO AO CADASTRAR: ", err)
            })
        }else{
            auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                navigation.goBack();
            })
            .catch((err) => {
                if(err.code === 'auth/invalid-email'){
                    console.log('Endereço de email invalido!')
                }
            })
        }

    }

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.logo}>HeyGrupos</Text>
            <Text style={{marginBottom: 20}}>Ajude, colabore, faça networking</Text>

            {type && (
            <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder="Qual seu nome"
            placeholderTextColor="#99999b"
            />
            )}


            <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="Seu email"
            placeholderTextColor="#99999b"
            />

            <TextInput
            style={styles.input}
            value={password}
            onChangeText={(text) => setPassword(text)}
            placeholder="Sua senha"
            placeholderTextColor="#99999b"
            secureTextEntry={true}
            />

            <TouchableOpacity 
            style={[styles.buttonLogin, {backgroundColor: type ? "#f53745" : "#57dd86"}]}
            onPress={handleLogin}
            >
                <Text style={styles.buttonText}>
                    {type ? 'Cadastrar' : "Acessar"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setType(!type)}>
                <Text>
                    {type ? 'Já possua uma conta' : 'Criar uma nova conta'}
                </Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: "center",
        backgroundColor: "#fff",
    },
    logo:{
        marginTop: Platform.OS === "android" ? 55 : 80,
        fontSize: 28,
        fontWeight: "bold",
        color: "#121212"
    },
    input:{
        color: "#121212",
        backgroundColor: "#ebebeb",
        width: "90%",
        borderRadius: 6,
        marginBottom: 10,
        paddingHorizontal: 8,
        height: 50,
    },
    buttonLogin:{
        width: "90%",
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        borderRadius: 6,
    },
    buttonText:{
        color: "#fff",
        fontSize: 19,
        fontWeight: "bold",
    }
})