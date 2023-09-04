import React,{useState} from "react";
import {View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Alert} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

function ModalNewRoom({setVisible}){

    const [roomName, setRoomName] = useState('');

    const user = auth().currentUser.toJSON();

    function handleButtonCreat(){
        if(roomName === '') return;

        firestore().collection('MESSAGE_THREADS')
        .get()
        .then((snapshot) => {
            let myThreads = 0

            snapshot.docs.map( docItem => {
                if(docItem.data().owner === user.uid){
                    myThreads += 1
                }
            })

            if(myThreads >= 4){
                alert('Limite de salas por usuario atingido!')
            }else{
                createRoom();
            }
        })

    }

    function createRoom(){
        firestore()
        .collection('MESSAGE_THREADS')
        .add({
            name: roomName,
            owner: user.uid,
            lastMessage:{
                text:`Grupo ${roomName} criado. Bem vindo(a)!`,
                createdAt: firestore.FieldValue.serverTimestamp(),
            }
        })
        .then((docRef)=>{
            docRef.collection('MESSAGES').add({
                text:`Grupo ${roomName} criado. Bem vindo(a)!`,
                createdAt: firestore.FieldValue.serverTimestamp(),
                system: true,
            }) 
            .then(()=>{
                setVisible()
            })
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    return(
        <View style={styles.container}>

            <TouchableWithoutFeedback onPress={setVisible}>
                <View style={styles.modal}></View>
            </TouchableWithoutFeedback>

            <View style={styles.modalContent}>
                <Text style={styles.title}>Criar um novo grupo?</Text>
                <TextInput
                placeholder="Nome do grupo"
                style={styles.input}
                value={roomName}
                onChangeText={(text) => setRoomName(text)}
                />
                <TouchableOpacity style={styles.button} onPress={handleButtonCreat}>
                    <Text style={styles.buttonText}>Criar sala</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default ModalNewRoom;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'rgba(34, 34, 34, 0.4)',
    },
    modal:{
        flex: 1,
    },
    modalContent:{
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
    },
    title:{
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 19,
        marginTop: 14,
        color: '#121212'
    },
    input:{
        borderRadius: 4,
        height: 45,
        backgroundColor: '#ddd',
        marginVertical: 15,
        paddingHorizontal: 8,
        fontSize: 16
    },
    button:{
        borderRadius: 4,
        backgroundColor: '#2e54d4',
        height: 45,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText:{
        fontSize: 19,
        fontWeight: "bold",
        color: '#fff'
    }
})