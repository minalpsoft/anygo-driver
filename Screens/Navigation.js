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
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
import { getCustomerByIdForDriverApi } from '../api/authService';
import Card from '../components/Card';
import { Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabs from '../components/BottomTabs';
import { updateDriverLocation } from '../api/authService';

export default function Navigation({ route = {}, navigation }) {
  // const { booking, tripStarted } = route.params;
  const booking = route?.params?.booking;
  const [tripStarted, setTripStarted] = useState(
    route?.params?.tripStarted || false
  );
  // console.log('🔑 GOOGLE KEY:', GOOGLE_API_KEY); // 👈 ADD HERE

  // const [customer, setCustomer] = useState(null);

  if (!booking) {
    return (
      <View style={styles.container}>
        <AppHeader title="Navigation" navigation={navigation} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: COLORS.gray }}>
            No active trip found
          </Text>

          <TouchableOpacity
            style={[styles.startBtn, { marginTop: 20 }]}
            onPress={() => navigation.replace('DriverDashboard')}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              Go to Dashboard
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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

  // const GOOGLE_API_KEY = 'AIzaSyCe-FeBbj44cBU0lnDPbcL-w0fTKRp_HVo'; // ⚠️ move to env later

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

  const customerName = booking?.customerName || 'Customer';
  const customerMobile = booking?.customerMobile || null;

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

           updateDriverLocation(latitude, longitude)
      .catch(err => console.log('❌ LOCATION UPDATE FAILED', err));

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

  /* ✅ CHECK ARRIVAL WHILE TRIP IS RUNNING */
  useEffect(() => {
    if (!tripStarted || !currentLocation) return;

    const distanceToDrop = getDistanceInMeters(
      currentLocation.latitude,
      currentLocation.longitude,
      drop.latitude,
      drop.longitude
    );

    console.log('📏 Live distance to drop:', distanceToDrop);

    if (distanceToDrop <= 50 && !arrivedAtDrop) {
      setArrivedAtDrop(true);
      console.log('🏁 Arrived at drop (live tracking)');
    }
  }, [currentLocation, tripStarted]);

  /* ✅ CHECK ARRIVAL WHEN TRIP STARTS (IMPORTANT FIX) */
  useEffect(() => {
    if (!tripStarted || !currentLocation) return;

    const distanceToDrop = getDistanceInMeters(
      currentLocation.latitude,
      currentLocation.longitude,
      drop.latitude,
      drop.longitude
    );

    console.log('📏 Distance to drop (after START TRIP):', distanceToDrop);

    if (distanceToDrop <= 50 && !arrivedAtDrop) {
      setArrivedAtDrop(true);
      console.log('🏁 Arrived at drop (post startTrip)');
    }
  }, [tripStarted]);

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
    let finalFare = booking?.finalFare || Math.round(booking.distanceKm * 12); // 👈 dummy fare

    try {
      const res = await completeTripApi(booking._id);

      // ✅ If backend responds, use real fare
      if (res?.data?.fare?.finalFare) {
        finalFare = res.data.fare.finalFare;
      }

    } catch (err) {
      // ❌ Ignore backend error
      console.log(
        '⚠️ END TRIP API FAILED (ignored)',
        err?.response?.data || err.message
      );
    }

    // ✅ ALWAYS show fare & navigate
    Alert.alert(
      'Trip Completed',
      `Fare: ₹${finalFare}`,
      [
        {
          text: 'OK',
          onPress: () => navigation.replace('DriverDashboard'),
        },
      ]
    );
  };


  const handleCallCustomer = () => {
    if (!customerMobile) {
      Alert.alert('Info', 'Customer phone number not available');
      return;
    }

    Linking.openURL(`tel:${customerMobile}`);
  };


  return (
    <View style={styles.container}>
      <AppHeader title="Navigation" navigation={navigation} />

      <View style={{ marginTop: 20 }}>
        <Card>
          <View style={styles.rowBetween}>
            <View style={styles.customerRow}>
              <Text
                style={styles.customerName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {booking.customerName || 'Customer'}
              </Text>

              <TouchableOpacity
                style={[
                  styles.callBtn,
                  !customerMobile && styles.callBtnDisabled,
                ]}
                disabled={!customerMobile}
                onPress={handleCallCustomer}
              >
                <Ionicons
                  name="call"
                  size={18}
                  color={customerMobile ? '#fff' : '#999'}
                />
                <Text
                  style={[
                    styles.callText,
                    !customerMobile && { color: '#999' },
                  ]}
                >
                  Call
                </Text>
              </TouchableOpacity>
            </View>


          </View>

          <Text style={styles.amount1}>
            {booking.distanceKm.toFixed(1)} km
          </Text>

        </Card>
      </View>


      <View style={styles.mapWrapper}>
        <Text style={styles.cardTitle}>Live Navigation</Text>
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
              source={require('../assets/carimg1.png')}
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
          {GOOGLE_API_KEY && currentLocation && activeDestination && (
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
          )}
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

      <BottomTabs />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  acceptBtn: {
    backgroundColor: 'rgba(227,30,36,0.1)',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: 12,
  },

  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  callBtnDisabled: {
    backgroundColor: '#e0e0e0',
  },

  callText: {
    marginLeft: 6,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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