import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../theme/colors';
import AppHeader from '../components/AppHeader';
import BottomTabs from '../components/BottomTabs';
import Card from '../components/Card';
import MapView, { Marker } from 'react-native-maps';
import Divider from '../components/Divider';

export default function Navigation({ route, navigation }) {
  const { booking, tripStarted } = route.params;

  const pickup = {
    latitude: booking.pickupLocation.lat,
    longitude: booking.pickupLocation.lng,
  };

  const drop = {
    latitude: booking.dropLocation.lat,
    longitude: booking.dropLocation.lng,
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Navigation" navigation={navigation} />

      <Card>
        <Text style={styles.cardTitle}>Live Navigation</Text>
        <Divider />

        <View style={styles.mapContainer}>
          <MapView
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              latitude: pickup.latitude,
              longitude: pickup.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {/* Pickup Marker */}
            <Marker coordinate={pickup} title="Pickup" />

            {/* Drop Marker ONLY after trip starts */}
            {tripStarted && (
              <Marker coordinate={drop} title="Drop" pinColor="green" />
            )}
          </MapView>
        </View>
      </Card>
    </View>
  );
}





const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    content: {
        flex: 1,
    },

    cardTitle: {
        fontWeight: 'bold',
        fontSize: 15,
    },

    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    mapContainer: {
        height: 500,
        flex: 1,
    },

});
