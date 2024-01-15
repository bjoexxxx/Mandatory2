import {app, database} from './Firebase'
import { View, Text, StyleSheet, Button } from 'react-native';
import { useState } from "react";
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import {collection} from 'firebase/firestore'


export default function GeotrackingScreen({route}){
    const {userId} = route.params;
    const [locationSubscription, setLocationSubscription] = useState(null);
    const [routePoints, setRoutePoints] = useState([])


    return(
        <View style={styles.container}>
            <Text style={styles.text}>Movement Overview</Text>
            <Text style={styles.text}>{userId}</Text>
            <Button title='Start Tracking' onPress={() => startLocationTracking(setLocationSubscription, setRoutePoints)}/>
            <Button title='Stop Tracking' onPress={() => stopLocationTracking(locationSubscription, setLocationSubscription)}/>
            <Button title='Save Route' onPress={() => saveRoute(routePoints)} />
        </View>
    )
 }

 async function startLocationTracking(setLocationSubscription, setRoutePoints) {
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
          // Here, you can send the location data to Firebase
        }
      );
      setLocationSubscription(newLocationSubscription)
    };

 function stopLocationTracking(locationSubscription, setLocationSubscription){
    if (locationSubscription) {
        locationSubscription.remove();
        setLocationSubscription(null);
        console.log("stopped tracking")
      }
 }

 function saveRoute(routePoints){
    console.log(routePoints)
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
    text: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
    }
})