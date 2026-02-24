import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './Screens/LoginScreen';
import OwnerRegistration from './Screens/OwnerRegistration';
import VehicleDetails from './Screens/VehicleDetails';
import DriverDocuments from './Screens/DriverDocuments';
import DriverVerification from './Screens/DriverVerification';
import DriverDetails from './Screens/DriverDetails';
import DrawerNavigator from './Navigation/DrawerNavigator';
import TodayCard from './components/TodayCard';
import Navigation from './Screens/Navigation';
import ForgotPassword from './Screens/ForgotPassword';
import ResetPassword from './Screens/ResetPassword';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* AUTH FLOW */}
        <Stack.Screen name="Login" component={LoginScreen} />
        {/* <Stack.Screen name="OwnerRegistration" component={OwnerRegistration} /> */}
        <Stack.Screen name="VehicleDetails" component={VehicleDetails} />
        <Stack.Screen name="DriverDocuments" component={DriverDocuments} />
        <Stack.Screen name="DriverDetails" component={DriverDetails} />
        <Stack.Screen name="DriverVerification" component={DriverVerification} />
        <Stack.Screen name="TodayCard" component={TodayCard} />
        <Stack.Screen name="Navigation" component={Navigation} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />

        {/* APP FLOW */}
        <Stack.Screen name="DriverDashboard" component={DrawerNavigator} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
