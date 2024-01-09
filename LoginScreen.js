import {app, database} from './Firebase'
import { useState } from "react";
import { View, Text, TextInput, Button, Modal, StyleSheet } from "react-native";
import axios from 'axios';


export default function LoginScreen(){

    const [userEmail, setUserEmail] = useState('')
    const [password, setPassword] = useState('')
    const [newUserEmail, setNewUserEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [userId, setUserId] = useState('')
    const [isModalOpen, setModalOpen] = useState(false);
    const [isModal2Open, setModal2Open] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);
    const openModal2 = () => setModal2Open(true);
    const closeModal2 = () => setModal2Open(false);
    const API_KEY = "AIzaSyBPOAGffwavYj4-j-vSqwMfO-DrYpFovsM"
    const url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
    const urlSignUp = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="


    return(
        <View style={styles.container}>
            <Modal  
                visible={isModalOpen} 
                onRequestClose={closeModal}
                transparent={true}>
                <View style={styles.modalOverlay}> 
                    <View style={styles.modalContainer}>
                        <Text style={styles.text}>Login</Text>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={setUserEmail}
                            placeholder="Enter Email"
                        />
                        <TextInput
                            style={styles.textInput}
                            onChangeText={setPassword}
                            placeholder="Enter Password"
                            //secureTextEntry
                        />
                        <Button title='Login' onPress={() => validateLogin()}/>
                    </View>
                </View>          
            </Modal>
            <Modal  
                visible={isModal2Open} 
                onRequestClose={closeModal2}
                transparent={true}>
                <View style={styles.modalOverlay}> 
                    <View style={styles.modalContainer}>
                        <Text style={styles.text}>Create New Account</Text>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={setNewUserEmail}
                            placeholder="Enter New Email"
                        />
                        <TextInput
                            style={styles.textInput}
                            onChangeText={setNewPassword}
                            placeholder="Enter New Password"
                            //secureTextEntry
                        />
                        <Button title='Sign Up' onPress={() => signup()}/>
                    </View>
                </View>          
            </Modal>
            <View style={styles.innerContainer}>
                <Text style={styles.text}>Default Page!</Text>
                <Button title='Login' onPress={openModal}/>
                <Button title='Sign Up' onPress={openModal2}/>
            </View>
        </View>
    )

   async function validateLogin(){

    console.log(userEmail)
    console.log(password)
        
        try{
            const response = await axios.post(url + API_KEY , {
            email:userEmail,
            password:password,
            returnSecureToken:true
            })
            console.log("logget ind " + response.data.localId)
            setUserId(response.data.localId)
            closeModal()
            }catch(error){
            alert("ikke logget ind " + error.response.data.error.errors[0].message)
            }
        
            
    };

    async function signup(){
        try{
        const response = await axios.post(urlSignUp + API_KEY , {
        email:newUserEmail,
        password:newPassword,
        returnSecureToken:true
        })
        closeModal2()
        alert("Oprettet " + response.data.idToken)
        
        
        }catch(error){
        alert("ikke oprettet " + error.response.data.error.errors[0].message)
        }
        }
        
    
    


}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
    innerContainer:{
        width: "90%",
        alignItems: "center",
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
    },
    textInput:{
        height: 40,
        width: "100%",
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
        padding: 10,
        borderRadius: 5,
        color: 'black'
    }
});