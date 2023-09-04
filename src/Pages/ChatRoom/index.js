import React, {useState, useEffect, useLayoutEffect} from "react";
import {View, Text, StyleSheet, Button, SafeAreaView, TouchableOpacity, FlatList, Modal, ActivityIndicator, Alert} from 'react-native';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'

import FabButton from "../../Components/FabButton";
import ModalNewRoom from "../../Components/ModalNewRoom";
import ChatList from "../../Components/ChatList";

export default function ChatRoom(){

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [modalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState(null);
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null;
        //console.log(hasUser);
        setUser(hasUser)
    }, [isFocused])

    useEffect(() => {
        let isActive = true;

        function getChats(){
            firestore().collection('MESSAGE_THREADS')
            .orderBy('lastMessage.createdAt', 'desc')
            .limit(10)
            .get()
            .then((snapshot)=>{
                const threads = snapshot.docs.map((docsnapshot) => {
                    return{
                        _id: docsnapshot.id,
                        name: '',
                        lastMessage: {text: ''},
                        ...docsnapshot.data()
                    }
                })
                if(isActive){
                    setThreads(threads)
                    setLoading(false)
                    //console.log(threads)
                }
            })
        }

        getChats();
        return () => {
            isActive = false;
        }
    }, [isFocused, modalVisible, handleDeletRoom()])

    function handleSignOut(){

        if(user === null){
            navigation.navigate('SignIn')
            return;
        }
        
        auth()
        .signOut()
        .then(() => {
            setUser(null)
            navigation.navigate('SignIn')
        })
        .catch(() => {
            console.log('Não possui nenhum usuário')
        })
    }

    function deleteRoom(ownerId, idRoom){
        if(ownerId !== user?.uid) return;

        Alert.alert(
            "Atenção",
            "Você tem certeza que deseja deletar essa sala?",
            [
                {
                    text: "Cancel",
                    onPress: () => {},
                    style: "cancel",
                },
                {
                    text: "Ok",
                    onPress: () => handleDeletRoom(idRoom),
                }
            ]
        )
    }

    async function handleDeletRoom(idRoom){
        await firestore()
        .collection('MESSAGE_THREADS')
        .doc(idRoom)
        .delete()
    }

    if(loading){
        return(
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator size="large" color="#555"/>
            </View>
        )
    }

    return(
        <SafeAreaView style={styles.container}>

            <View style={styles.headerRoom}>
                <View style={styles.headerRoomLeft}>
                    {user ? (
                        <TouchableOpacity onPress={handleSignOut}>
                        <MaterialIcons
                        name= "arrow-back"
                        size={28}
                        color="#fff"
                        />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={handleSignOut}>
                        <MaterialIcons
                        name= "login"
                        size={28}
                        color="#fff"
                        />
                        </TouchableOpacity>
                    )}

                    <Text style={styles.title}>{user ? 'Grupos' : 'Logar'}</Text>
                </View>

                <TouchableOpacity>
                    <MaterialIcons
                    name="search"
                    size={28}
                    color="#fff"
                    />
                </TouchableOpacity>
            </View>

            <FlatList
            data={threads}
            keyExtractor={item => item._id}
            renderItem={ ({item}) => 

            <ChatList data={item} 
            deleteRoom={() => deleteRoom(item.owner, item._id)}
            userStatus={user}
            /> }
            
            showsVerticalScrollIndicator={false}
            />

            <FabButton setVisible={() => setModalVisible(true)} userStatus={user}/>

            <Modal visible={modalVisible} animationType="fade" transparent={true}> 
                <ModalNewRoom setVisible={() => setModalVisible(false)}/>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff'
    },
    headerRoom:{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 40,
        paddingBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#2e54d4',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
    headerRoomLeft:{
        flexDirection: "row",
        alignItems: "center",
    },
    title:{
        color: '#fff',
        fontSize: 26,
        fontWeight: "bold",
        paddingLeft: 10,
    }
})