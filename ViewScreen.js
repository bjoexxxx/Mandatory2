import { deleteDoc, doc, collection, getDocs } from 'firebase/firestore';
import { app, database } from './Firebase'
import { useState, useEffect } from 'react';
import { ActionSheetIOS, Button, FlatList, Modal, View, Text, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from 'react-native-maps';





export default function ViewScreen({route}){
    const {userId} = route.params;
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const openModal = (item) => {
        console.log("Opening modal for route: ", item.id);
        setSelectedRoute(item);
        setModalOpen(true);}
    const closeModal = () => setModalOpen(false);
    console.log("Viewing "+ userId)

    const fetchRoutes = async () => {
        const querySnapshot = await getDocs(collection(database, userId));
        const fetchedRoutes = querySnapshot.docs.map(doc => {
            const data = doc.data();
            if (data.creationTimestamp && data.creationTimestamp.toDate) {
                data.creationTimestamp = data.creationTimestamp.toDate();
            }
            return { ...data, id: doc.id };
        });
        console.log(fetchedRoutes);
        setRoutes(fetchedRoutes);
    };

    useEffect(() => {
        fetchRoutes();
    }, [userId]);

    const routeActionSheet = (item, fetchRoutes) =>{
         setSelectedRoute(item);
         console.log("routeActionSheet "+ item)
         ActionSheetIOS.showActionSheetWithOptions(
        {
            options: ['Cancel','View','Delete'],
            cancelButtonIndex: 0,
        },
        async buttonIndex => {
            if(buttonIndex === 1) viewRoute(item, openModal);
            else if(buttonIndex === 2){ 
               const success = await deleteRoute(userId, item.id)
               if(success){
                fetchRoutes()
               }
            }
        }
    )}


    return(
        <View style={styles.container}>
            <Modal
            visible={isModalOpen} 
            onRequestClose={closeModal}
            transparent={true}>
                <View style={styles.modalOverlay}>
                {selectedRoute ? (
                <View style={styles.modalContainer}>
                    <Text style={styles.text}>{new Date(selectedRoute.creationTimestamp).toLocaleString()}</Text>
                    <MapView
                        style={{ width: '100%', height: 300 }}
                        region={selectedRoute.region}
                        showsUserLocation>
                        {selectedRoute.routePoints.map((point, index) => (
                            <Marker
                                key={index}
                                coordinate={{ latitude: point.coords.latitude, longitude: point.coords.longitude }}
                            />
                        ))}
                        <Polyline
                            coordinates={selectedRoute.routePoints.map(point => ({ latitude: point.coords.latitude, longitude: point.coords.longitude }))}
                            strokeColor="blue" 
                            strokeWidth={3}
                        />
                    </MapView>
                    <Button title='Close Route' onPress={() => closeModal()}/>
                </View>
            ) : (
                <Text>Loading...</Text>
            )}
                </View>
            </Modal>
            <View style={styles.innerContainer} >
                <Text style={styles.text}>Old Routes</Text>
                <Text style={styles.text}>{userId}</Text>
                <FlatList
                    data={routes}
                    renderItem={({ item }) => renderItem({ item, routeActionSheet, fetchRoutes })}
                    keyExtractor={item => item.id}
                />
            </View>
        </View>
    )
}

function renderItem({item, routeActionSheet, fetchRoutes}){
    console.log("Render Item "+item.id)
    return(
        <View>
            <Button title={new Date(item.creationTimestamp).toLocaleString()} onPress={() => routeActionSheet(item, fetchRoutes)}/>
        </View>
    );
};

function viewRoute(item, openModal){
    console.log("View Route "+ item.id)

    const routePoints = item?.routePoints;
    if (!routePoints) {
        console.error("No route points found for route ID:", item.id);
        return;
    }

    const region = getMapRegion(routePoints);
    console.log("route points " + routePoints)

    openModal(item)

}

async function deleteRoute(userId, id){

    try {
        await deleteDoc(doc(database, userId, id))
        console.log("Route deleted successfully");
        return true;
    } catch (error) {
        console.error("Error deleting route:", error);
        return false;
    }
}

function getMapRegion(routePoints){
    if (!routePoints || routePoints.length === 0) {
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