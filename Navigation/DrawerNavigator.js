import { createDrawerNavigator } from '@react-navigation/drawer';

import DriverDashboard from '../Screens/DriverDashboard';
import Earnings from '../Screens/Earnings';
import Withdrawal from '../Screens/Withdrawal';
import TripDetails from '../Screens/TripDetails';
import OnGoingTripDetails from '../Screens/OnGoingTripDetails';
import History from '../Screens/History';
import Navigation from '../Screens/Navigation';
import Profile from '../Screens/Profile';
import DeleteAccount from '../Screens/DeleteAccount';


// import Profile from '../Screens/Profile';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {

return (
  <Drawer.Navigator
    screenOptions={{
      headerShown: false,
      drawerActiveBackgroundColor: '#E31E24',   
      drawerActiveTintColor: '#fff',         

      drawerInactiveTintColor: '#E31E24',        

      drawerStyle: {
        backgroundColor: '#fff',
      },
    }}
  >
    <Drawer.Screen name="Dashboard" component={DriverDashboard} />
    <Drawer.Screen name="Earnings" component={Earnings} />
    <Drawer.Screen name="Withdrawal" component={Withdrawal} />
    {/* <Drawer.Screen name="Trip Details" component={TripDetails} /> */}
    {/* <Drawer.Screen name="OnGoing Trip Details" component={OnGoingTripDetails} /> */}
    <Drawer.Screen name="History" component={History} />
    <Drawer.Screen name="Navigation" component={Navigation} />
    <Drawer.Screen name="Profile" component={Profile} />
    <Drawer.Screen name="DeleteAccount" component={DeleteAccount} />

  </Drawer.Navigator>
);

}
