import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { COLORS } from '../theme/colors';
import AppHeader from '../components/AppHeader';
import Divider from '../components/Divider';
import * as Location from 'expo-location';
import { useEffect, useState, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { startTripApi } from '../api/authService';
import { AnimatedRegion } from 'react-native-maps';
import { completeTripApi } from '../api/authService';

export default function Navigation({ route, navigation }) {
  const { booking, tripStarted } = route.params;
  const [currentLocation, setCurrentLocation] = useState(null);
  const [arrivedAtPickup, setArrivedAtPickup] = useState(false);
  const [arrivedAtDrop, setArrivedAtDrop] = useState(false);

  const [driverPosition] = useState(
    new AnimatedRegion({
      latitude: booking.pickupLocation.lat,
      longitude: booking.pickupLocation.lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    })
  );

  const mapRef = useRef(null);

  const GOOGLE_API_KEY = 'AIzaSyCe-FeBbj44cBU0lnDPbcL-w0fTKRp_HVo'; // ⚠️ move to env later

  const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const pickup = {
    latitude: booking.pickupLocation.lat,
    longitude: booking.pickupLocation.lng,
  };

  const drop = {
    latitude: booking.dropLocation.lat,
    longitude: booking.dropLocation.lng,
  };

  const activeDestination = tripStarted ? drop : pickup;

  /* LOCATION PERMISSION + LIVE TRACKING */
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
          const latitude = loc.coords.latitude;
          const longitude = loc.coords.longitude;

          setCurrentLocation({ latitude, longitude });

          driverPosition.timing({
            latitude,
            longitude,
            duration: 3000,
            useNativeDriver: false,
          }).start();

          const target = tripStarted ? drop : pickup;

          const distance = getDistanceInMeters(
            latitude,
            longitude,
            target.latitude,
            target.longitude
          );

          /* 🟢 PICKUP ARRIVAL CHECK */
          if (distance <= 50 && !arrivedAtPickup && !tripStarted) {
            setArrivedAtPickup(true);
            console.log('🟢 Driver arrived at pickup');
          }

          /* 🏁 DROP ARRIVAL CHECK */
          if (tripStarted) {
            const distanceToDrop = getDistanceInMeters(
              latitude,
              longitude,
              drop.latitude,
              drop.longitude
            );

            if (distanceToDrop <= 50 && !arrivedAtDrop) {
              setArrivedAtDrop(true);
              console.log('🏁 Driver arrived at drop');
            }
          }
        }
      );
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);


  /* AUTO FIT MAP (DRIVER + PICKUP) */
  useEffect(() => {
    if (mapRef.current && currentLocation) {
      mapRef.current.fitToCoordinates(
        [currentLocation, activeDestination],
        {
          edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
          animated: true,
        }
      );
    }
  }, [currentLocation, tripStarted]);


  /*LOADING STATE */
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
  console.log('🚗 DRIVER', currentLocation);
  console.log('📦 PICKUP', pickup);
  console.log('📦 DROP', drop);

  const handleStartTrip = async () => {
    try {
      console.log('🚀 STARTING TRIP', booking._id);

      const res = await startTripApi(booking._id);

      Alert.alert('Success', 'Trip started');

      navigation.replace('Navigation', {
        booking,
        tripStarted: true,
      });

    } catch (err) {
      console.log('❌ START TRIP ERROR', err?.response?.data || err.message);
      Alert.alert('Error', 'Unable to start trip');
    }
  };

  const handleEndTrip = async () => {
    try {
      const res = await completeTripApi(booking._id);

      Alert.alert(
        'Trip Completed',
        `Fare: ₹${res.data.fare.finalFare}`
      );

      navigation.replace('DriverDashboard');
    } catch (err) {
      console.log('❌ END TRIP ERROR', err?.response?.data || err.message);
      Alert.alert('Error', 'Unable to complete trip');
    }
  };


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
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}

        >
          {/* DRIVER */}
          <Marker.Animated
            coordinate={driverPosition}
            anchor={{ x: 0.5, y: 0.5 }}
            flat
          >
            <Image
              source={require('../assets/carimg.jpg')}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          </Marker.Animated>



          {/* PICKUP */}
          {!tripStarted && (
            <Marker
              coordinate={pickup}
              title="Pickup"
              pinColor="red"
            />
          )}

          {/* DROP */}
          {tripStarted && (
            <Marker
              coordinate={drop}
              title="Drop"
              pinColor="blue"
            />
          )}


          {/* ROUTE (OPTIONAL) */}
          <MapViewDirections
            origin={currentLocation}
            destination={activeDestination}
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

        {arrivedAtPickup && !tripStarted && (
          <View style={styles.actionBox}>
            <Text style={styles.arrivedText}>You have arrived at pickup</Text>

            <TouchableOpacity
              style={styles.startBtn}
              onPress={handleStartTrip}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                START TRIP
              </Text>
            </TouchableOpacity>

          </View>
        )}

        {tripStarted && arrivedAtDrop && (
          <View style={styles.actionBox}>
            <TouchableOpacity
              style={[styles.startBtn, { backgroundColor: '#E53935' }]}
              onPress={handleEndTrip}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                END TRIP
              </Text>
            </TouchableOpacity>
          </View>
        )}



      </View>
    </View>
  );
}


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
  actionBox: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    elevation: 5,
  },
  startBtn: {
    backgroundColor: '#FF1E1E',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  arrivedText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },


});
