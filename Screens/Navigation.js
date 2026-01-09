import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import AppHeader from '../components/AppHeader';
import Divider from '../components/Divider';
import * as Location from 'expo-location';
import { useEffect, useState, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

export default function Navigation({ route, navigation }) {
  const { booking, tripStarted } = route.params;

  const [currentLocation, setCurrentLocation] = useState(null);
  const mapRef = useRef(null);

  const GOOGLE_API_KEY = 'AIzaSyCe-FeBbj44cBU0lnDPbcL-w0fTKRp_HVo'; // ⚠️ move to env later

  const pickup = {
    latitude: booking.pickupLocation.lat,
    longitude: booking.pickupLocation.lng,
  };

  const drop = {
    latitude: booking.dropLocation.lat,
    longitude: booking.dropLocation.lng,
  };

  /* ============================
     LOCATION PERMISSION + LIVE TRACKING
  ============================ */
  useEffect(() => {
    let subscription;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('❌ Location permission denied');
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 5,
        },
        (loc) => {
          setCurrentLocation({
            latitude: Number(loc.coords.latitude),
            longitude: Number(loc.coords.longitude),
          });
        }
      );
    })();

    return () => subscription && subscription.remove();
  }, []);

  /* ============================
     AUTO FIT MAP (DRIVER + PICKUP)
  ============================ */
  useEffect(() => {
    if (mapRef.current && currentLocation) {
      mapRef.current.fitToCoordinates(
        [currentLocation, pickup],
        {
          edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
          animated: true,
        }
      );
    }
  }, [currentLocation]);

  /* ============================
     LOADING STATE
  ============================ */
  if (!currentLocation) {
    return (
      <View style={styles.container}>
        <AppHeader title="Navigation" navigation={navigation} />
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          Fetching live location...
        </Text>
      </View>
    );
  }
  console.log('📍 DRIVER LOCATION RAW:', currentLocation);

  /* ============================
     UI
  ============================ */
  return (
    <View style={styles.container}>
      <AppHeader title="Navigation" navigation={navigation} />

      <View style={styles.mapWrapper}>
        <Text style={styles.cardTitle}>Live Navigation till pickup point</Text>
        <Divider />

        <MapView
          ref={mapRef}
          provider="google"
          style={StyleSheet.absoluteFillObject}
          region={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {/* DRIVER */}
          <Marker
            coordinate={currentLocation}
            title="Driver"
            pinColor="blue"
          />

          {/* PICKUP */}
          <Marker
            coordinate={pickup}
            title="Pickup"
            pinColor="red"
          />

          {/* ROUTE (OPTIONAL) */}
          <MapViewDirections
            origin={currentLocation}
            destination={tripStarted ? drop : pickup}
            apikey={GOOGLE_API_KEY}
            mode="DRIVING"
            strokeWidth={4}
            strokeColor="#1E90FF"
            onError={() => {
              console.log('⚠️ Route not found – markers still visible');
            }}
            onReady={(result) => {
              mapRef.current.fitToCoordinates(result.coordinates, {
                edgePadding: { top: 80, bottom: 80, left: 40, right: 40 },
                animated: true,
              });
            }}
          />
        </MapView>

      </View>
    </View>
  );
}

/* ============================
   STYLES
============================ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    padding: 10,
  },
  mapWrapper: {
    flex: 1,
    margin: 10,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
});
