import React, {useState, useEffect} from "react";
import {View, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function Messages({route}){

    const { thread } = route.params;
    const [messages, setMessages] = useState([])
    
    const user = auth().currentUser.toJSON();

    useEffect(() => {

        const unsubscribeListener = firestore().collection('MESSAGE_THREADS')
        .doc(thread._id)
        .collection('MESSAGES')
        .orderBy('createdAt', 'desc')
        .onSnapshot( querysnapshot => {
            const messages = querysnapshot.docs.map(doc => {
                const firebaseData = doc.data()

                const data = {
                    _id: doc.id,
                    text: '',
                    createdAt: firestore.FieldValue.serverTimestamp(),
                    ...firebaseData
                }

                if(!firebaseData.system){
                    data.user = {
                        ...firebaseData.user,
                        name: firebaseData.user.displayName,
                    }
                }

                return data;
            })

            setMessages(messages)
            //console.log(messages)

        })

        return () => unsubscribeListener();

    }, [])

    return(
        <View>
            <Text>ola</Text>
        </View>
    )
}