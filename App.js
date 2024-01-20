import {app} from './Firebase'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen'
import GeotrackingScreen from './GeotrackingScreen';
import ViewScreen from './ViewScreen';


const Stack = createStackNavigator();



export default function App(){

  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Geotracking" component={GeotrackingScreen}/>
        <Stack.Screen name="View" component={ViewScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  )

}