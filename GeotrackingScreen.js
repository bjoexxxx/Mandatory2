import {app, database} from './Firebase'
import { View, Text, StyleSheet, Button, Modal } from 'react-native';
import { useState } from "react";
import * as Location from 'expo-location';
import MapView, { Marker, Polyline } from 'react-native-maps';
import {collection, addDoc} from 'firebase/firestore'


export default function GeotrackingScreen({navigation, route}){
    const {userId} = route.params;
    const [locationSubscription, setLocationSubscription] = useState(null);
    const [routePoints, setRoutePoints] = useState([])
    const [isModalOpen, setModalOpen] = useState(false)
    const openModal = () => setModalOpen(true)
    const closeModal = () => setModalOpen(false)


    return(
        <View style={styles.container}>
            <Text style={styles.text}>Movement Overview</Text>
            <Text style={styles.text}>{userId}</Text>
            <Modal 
                visible={isModalOpen} 
                onRequestClose={closeModal}
                transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text>Current Route</Text>
                        <MapView
                            style={{ width: '100%', height: 300 }}
                            region={getMapRegion(routePoints)}
                            showsUserLocation>
                            {routePoints.map((point, index) => (
                            <Marker
                                key={index}
                                coordinate={{ latitude: point.coords.latitude, longitude: point.coords.longitude }}
                            />
                        ))}
                            <Polyline
                                coordinates={routePoints.map(point => ({ latitude: point.coords.latitude, longitude: point.coords.longitude }))}
                                strokeColor="blue" 
                                strokeWidth={3}
                            />
                        </MapView>
                        <Button title='Stop Tracking' onPress={() => stopLocationTracking(locationSubscription, setLocationSubscription, closeModal)}/>
                    </View>
                </View>
            </Modal>
            <Button title='Start Tracking' onPress={() => startLocationTracking(setLocationSubscription, setRoutePoints, openModal)}/>
            <Button title='Save Route' onPress={() => saveRoute(routePoints, userId)} />
            <Button title='Old Routes' onPress={() => navigation.navigate('View', { userId: userId })}/>
        </View>
    )
 }

 function getMapRegion(routePoints){
    if (routePoints.length === 0) {
        return null;
    }
    const latitudes = routePoints.map(point => point.coords.latitude);
    const longitudes = routePoints.map(point => point.coords.longitude);

    const maxLat = Math.max(...latitudes);
    const minLat = Math.min(...latitudes);
    const maxLng = Math.max(...longitudes);
    const minLng = Math.min(...longitudes);
    return {
        latitude: (maxLat + minLat) / 2,
        longitude: (maxLng + minLng) / 2,
        latitudeDelta: (maxLat - minLat) + 0.01,
        longitudeDelta: (maxLng - minLng) + 0.01
    };
 }

 async function startLocationTracking(setLocationSubscription, setRoutePoints, openModal) {
    openModal()
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        console.error('Permission to access location was denied');
    return;
    }
  
    newLocationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (locationUpdate) => {
          console.log(locationUpdate);
          setRoutePoints(prevRoutePoints => [...prevRoutePoints, locationUpdate]);
        }
      );
      setLocationSubscription(newLocationSubscription)
    };

 function stopLocationTracking(locationSubscription, setLocationSubscription, closeModal){
    if (locationSubscription) {
        locationSubscription.remove();
        setLocationSubscription(null);
        console.log("stopped tracking")
        closeModal()
      }
 }

 async function saveRoute(routePoints, userId){
    console.log(userId)
    console.log(routePoints)
    const userRouteCollectionRef = collection(database, userId);

    try{
        await addDoc(userRouteCollectionRef, {
            routePoints: routePoints,
            creationTimestamp: new Date()
        });
        console.log("Route saved successfully for user:", userId);
    } catch(error) {
        console.error("Failed to save for user:", userId, error);
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
    }
})