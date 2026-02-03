import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import BottomTabs from '../components/BottomTabs';
import TodayCard from '../components/TodayCard';
import Divider from '../components/Divider';
import { useState, useEffect, useCallback } from 'react';
import { updateDriverLocation } from '../api/authService';
import api from '../api/api';
import { getAddressFromLatLng } from '../api/authService';
import { getDriverEarningsApi, getDriverDashboardApi } from '../api/authService';
import { useFocusEffect } from '@react-navigation/native';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function DriverDashboard({ navigation }) {

    const [requests, setRequests] = useState([]);
    const [ongoingTrip, setOngoingTrip] = useState(null);
    const [isOnline, setIsOnline] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [isDocumentVerified, setIsDocumentVerified] = useState(false);


    useFocusEffect(
        useCallback(() => {
            updateDriverLocation(); // 📍 update GPS whenever dashboard opens
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            loadWallet();
        }, [])
    );

    const loadWallet = async () => {
        try {
            const res = await getDriverEarningsApi();

            // console.log('DASHBOARD WALLET API 👉', res.data);

            setWalletBalance(res.data.balance || 0);
        } catch (err) {
            console.log('Wallet load error', err.message);
        }
    };

    const isToday = (dateStr) => {
        const d = new Date(dateStr);

        const now = new Date();

        return (
            d.getDate() === now.getDate() &&
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
        );
    };


    const initDriver = async () => {
        try {
            // await updateDriverLocation();
            await loadDashboard();
            await fetchRequests();
        } catch (e) {
            // console.log('Init error 👉', e.message);
        }
    };

    const loadDashboard = async () => {
        try {
            const res = await getDriverDashboardApi();

            // console.log('🟡 DASHBOARD RESPONSE 👉', res.data);

            // 👇 VERY IMPORTANT
            const driver = res.data.driver || res.data;

            setIsDocumentVerified(driver?.documents?.verified === true);
            setIsOnline(driver?.isOnline === true);

            console.log(
                '🟢 DOCUMENT VERIFIED 👉',
                driver?.documents?.verified,
                ' @ ',
                new Date().toISOString()
            );
        } catch (err) {
            console.log('❌ DASHBOARD ERROR 👉', err.response?.data || err.message);
        }
    };

    const fetchRequests = async () => {
        try {
            if (!isOnline) {
                setRequests([]); // 🧹 hard clear
                return;
            }
            const res = await api.get('/driver/booking-requests');

            if (!res.data || res.data.length === 0) {
                return;
            }

            setRequests(prev => {
                if (JSON.stringify(prev) === JSON.stringify(res.data)) {
                    return prev;
                }
                return res.data;
            });

        } catch (e) {
            console.log('❌ FETCH ERROR 👉', e.response?.data || e.message);
        }
    };

    useEffect(() => {
        if (!isOnline) {
            setRequests([]);
            return;
        }

        const interval = setInterval(() => {
            fetchRequests();
        }, 3000);

        fetchRequests(); // first fetch

        return () => clearInterval(interval);
    }, [isOnline]);


    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const run = async () => {
                if (!isActive) return;
                await loadDashboard();
                await fetchRequests();
            };

            run();

            return () => {
                isActive = false;
            };
        }, [])
    );

    const resolveLatLng = (location) => {
        if (!location) return null;

        // GeoJSON format
        if (Array.isArray(location.coordinates)) {
            return {
                lat: Number(location.coordinates[0]),
                lng: Number(location.coordinates[1]),
            };
        }

        // Plain object format
        if (
            location.lat !== undefined &&
            location.lng !== undefined
        ) {
            return {
                lat: Number(location.lat),
                lng: Number(location.lng),
            };
        }

        return null;
    };

    useEffect(() => {
        if (!requests.length) return;

        let cancelled = false;

        const loadAddresses = async () => {
            const updated = await Promise.all(
                requests.map(async (req) => {
                    if (req.pickupAddress && req.dropAddress) return req;

                    const pickup = resolveLatLng(req.pickupLocation);
                    const drop = resolveLatLng(req.dropLocation);

                    if (!pickup || !drop) {
                        return {
                            ...req,
                            pickupAddress: 'Location not available',
                            dropAddress: 'Location not available',
                        };
                    }

                    const pickupAddress = await getAddressFromLatLng(pickup.lat, pickup.lng);
                    const dropAddress = await getAddressFromLatLng(drop.lat, drop.lng);

                    return {
                        ...req,
                        pickupAddress,
                        dropAddress,
                    };
                })
            );

            if (!cancelled) {
                setRequests(prev =>
                    prev.map(r => updated.find(u => u._id === r._id) || r)
                );
            }
        };

        loadAddresses();

        return () => {
            cancelled = true;
        };
    }, [requests]); // ✅ THIS IS THE KEY


    useEffect(() => {
        if (!requests.length) return;

        let cancelled = false;

        const loadAddresses = async () => {
            const updated = await Promise.all(
                requests.map(async (req) => {
                    if (req.pickupAddress && req.dropAddress) return req;

                    const pickup = resolveLatLng(req.pickupLocation);
                    const drop = resolveLatLng(req.dropLocation);

                    if (!pickup || !drop) {
                        return {
                            ...req,
                            pickupAddress: 'Location not available',
                            dropAddress: 'Location not available',
                        };
                    }

                    const pickupAddress = await getAddressFromLatLng(pickup.lat, pickup.lng);
                    const dropAddress = await getAddressFromLatLng(drop.lat, drop.lng);

                    return {
                        ...req,
                        pickupAddress,
                        dropAddress,
                    };
                })
            );

            if (!cancelled) {
                setRequests(prev =>
                    prev.map(r => updated.find(u => u._id === r._id) || r)
                );
            }
        };

        loadAddresses();

        return () => {
            cancelled = true;
        };
    }, []);


    const toggleOnline = async () => {
        try {
            if (isDocumentVerified !== true) {
                Alert.alert(
                    'Verification Pending',
                    'Your documents are not verified yet. Please wait for admin approval.'
                );
                return;
            }


            if (!isOnline) {
                await updateDriverLocation();
            }

            const res = await api.patch('/driver/driver-status', {
                isOnline: !isOnline,
            });

            const newStatus = !isOnline;
            setIsOnline(newStatus);

            if (newStatus) {
                console.log('🟢 Driver ONLINE → fetching bookings');
                await fetchRequests();
            } else {
                setRequests([]);
            }

            alert(res.data.message);
        } catch (e) {
            console.log('❌ STATUS ERROR 👉', e.response?.data || e.message);
        }
    };

    const acceptBooking = async (req) => {

        try {
            console.log('🔥 ACCEPT BOOKING START', req._id);

            await api.post(`/driver/${req._id}/accept`);

            setIsOnline(false); // 🛑 stop polling
            setRequests([]);

            navigation.navigate('Navigation', {
                booking: req,
                tripStarted: false,
            });

        } catch (err) {
            navigation.navigate('Navigation', {
                booking: req,
                tripStarted: false,
            });
        }
    };

    const rejectBooking = async (bookingId) => {
        try {
            await api.post(`driver/${bookingId}/reject`);

            // optimistic remove
            setRequests(prev => prev.filter(r => r._id !== bookingId));

        } catch (e) {
            Alert.alert('Error', 'Could not reject booking');
        }
    };


    const [earnings, setEarnings] = useState(null);

    // useEffect(() => {
    //     const loadEarnings = async () => {
    //         try {
    //             const res = await getDriverEarningsApi();
    //             setEarnings(res.data);
    //         } catch (err) {
    //             console.log('❌ EARNINGS ERROR', err?.response?.data || err.message);
    //         }
    //     };

    //     loadEarnings();
    // }, []);

    const [todayStats, setTodayStats] = useState({
        earnings: 0,
        trips: 0,
        durationMin: 0,
    });

    useEffect(() => {
        const loadTodayStats = async () => {
            try {
                const res = await getDriverEarningsApi();

                //   console.log('📦 RAW EARNINGS API:', res.data);

                const today = res.data?.today;

                if (!today) {
                    setTodayStats({
                        earnings: 0,
                        trips: 0,
                        durationMin: 0,
                    });
                    return;
                }

                setTodayStats({
                    earnings: today.earnings || 0,
                    trips: today.trips || 0,
                    durationMin: today.durationMin || 0,
                });

            } catch (err) {
                console.log('❌ TODAY STATS ERROR', err?.response?.data || err.message);
            }
        };

        loadTodayStats();
    }, []);



    const formatDuration = (mins = 0) => {
        if (mins < 60) return `${mins} min`;
        return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    };

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <AppHeader title="Dashboard" navigation={navigation} />

            <TouchableOpacity
                onPress={toggleOnline}
                style={[
                    styles.statusBtn,
                    { backgroundColor: isOnline ? '#2ecc71' : '#e74c3c' },
                ]}
            >
                <Text style={{ color: '#fff' }}>
                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                </Text>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>

                <TodayCard
                    title="Today"
                    amount={todayStats.earnings}
                    trips={todayStats.trips}
                    hours={formatDuration(todayStats.durationMin)}
                />



                {/* WALLET */}
                <Card>
                    <View style={styles.rowBetween}>
                        <Text style={styles.cardTitle}>Wallet Balance</Text>
                        <TouchableOpacity
                            style={styles.acceptBtn}
                            onPress={() => navigation.navigate('Withdrawal')}
                        >
                            <Text style={styles.link}>Withdraw</Text>
                        </TouchableOpacity>

                    </View>
                    <Text style={styles.amount1}>
                        ₹ {walletBalance.toFixed(2)}
                    </Text>


                    <Divider />

                    <Text style={styles.linkSmall} onPress={() => navigation.navigate('Withdrawal')}>View Payment History &gt;&gt;</Text>
                </Card>

                {/* NEW REQUEST */}
                {!ongoingTrip && (
                    requests.length === 0 ? (
                        <Card>
                            <Text style={{ textAlign: 'center', color: '#777' }}>
                                No new requests
                            </Text>
                        </Card>
                    ) : (
                        requests.map(req => {
                            const pickupDate = new Date(req.createdAt).toLocaleDateString();
                            const pickupTime = new Date(req.createdAt).toLocaleTimeString();

                            return (
                                <Card key={req._id}>
                                    <View style={styles.headerRow}>
                                        <Text style={styles.cardTitle}>New Request</Text>

                                        <View style={{ flexDirection: 'row', gap: 8 }}>

                                            <TouchableOpacity
                                                style={styles.acceptBtn}
                                                onPress={() => acceptBooking(req)}
                                            >
                                                <Text style={styles.acceptText}>Accept</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.rejectBtn}
                                                onPress={() => rejectBooking(req._id)}
                                            >
                                                <Text style={styles.rejectText}>Reject</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>


                                    <Text style={styles.label}>Pickup Point</Text>
                                    <Text>
                                        {req.pickupAddress || 'Resolving location...'}
                                    </Text>

                                    <View style={styles.dateTimeRow}>
                                        <View style={styles.dateTimeCol}>
                                            <Text style={styles.label}>Pickup Date</Text>
                                            <Text>{pickupDate}</Text>
                                        </View>

                                        <View style={styles.dateTimeCol}>
                                            <Text style={styles.label}>Pickup Time</Text>
                                            <Text>{pickupTime}</Text>
                                        </View>
                                    </View>

                                    <Divider />

                                    <Text style={styles.label}>Drop Point</Text>
                                    <Text>
                                        {req.dropAddress || 'Resolving location...'}
                                    </Text>

                                    <Text style={{ marginTop: 6, color: '#555' }}>
                                        📏 {req.distanceKm} km • ⏳ {req.durationMin} min
                                    </Text>

                                    <Text style={styles.linkSmall}>
                                        View Trip Details &gt;&gt;
                                    </Text>
                                </Card>
                            );
                        })
                    )
                )}

                {/* ONGOING TRIP */}
                {/* {ongoingTrip && (
                    <Card>
                        <View style={styles.rowBetween}>
                            <Text style={styles.cardTitle}>Ongoing Trip</Text>

                            <TouchableOpacity
                                style={styles.acceptBtn}
                                onPress={() =>
                                    navigation.navigate('Navigation', {
                                        booking: ongoingTrip,
                                    })
                                }
                            >
                                <Text style={styles.link}>Navigation</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Pickup</Text>
                        <Text>{ongoingTrip.pickupAddress}</Text>

                        <Divider />

                        <TouchableOpacity
                            style={[styles.acceptBtn, { marginTop: 10 }]}
                            onPress={async () => {
                                await api.post(`/drivers/start-trip/${ongoingTrip.bookingId}`);
                                setOngoingTrip({ ...ongoingTrip, status: 'STARTED' });

                                navigation.navigate('Navigation', {
                                    booking: ongoingTrip,
                                    tripStarted: true,
                                });
                            }}
                        >
                            <Text style={styles.acceptText}>Start Trip</Text>
                        </TouchableOpacity>
                    </Card>
                )} */}

                {/* QR CODE */}
                <View style={styles.qrCard}>

                    <Image
                        source={require('../assets/qr.jpg')}
                        style={styles.qrImage}
                        resizeMode="contain"
                    />
                </View>

            </ScrollView>

            {/* BOTTOM TABS */}
            <BottomTabs />

        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FA',
    },
    rejectBtn: {
        backgroundColor: '#eee',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    rejectText: {
        color: 'red',
    },


    cardTitle: {
        fontWeight: 'bold',
        fontSize: 15,
        color: COLORS.navy,
    },

    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },

    link: {
        color: COLORS.primary,
        fontWeight: '600',
    },

    amount1: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.black,
        //   marginVertical: 4,
    },

    linkSmall: {
        color: COLORS.primary,
        marginTop: 6,
        fontSize: 13,
        textAlign: 'right',
    },

    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    dateTimeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },

    dateTimeCol: {
        flex: 1,
        marginBottom: 15,
    },

    label: {
        fontSize: 13,
        marginBottom: 4,
        fontWeight: '600',
        marginTop: 6
    },

    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    labourText: {
        fontSize: 13,
        marginTop: 2,
    },

    acceptBtn: {
        backgroundColor: 'rgba(227,30,36,0.1)',
        paddingHorizontal: 18,
        paddingVertical: 6,
        borderRadius: 20,
    },

    acceptText: {
        fontWeight: '600',
        color: "green"
    },

    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },

    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    amountSmall: {
        fontSize: 14,
        color: '#000',
    },

    qrCard: {
        //   backgroundColor: '#fff',
        margin: 16,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        //   elevation: 4,
    },

    qrImage: {
        width: 200,
        height: 200,
    },


});
