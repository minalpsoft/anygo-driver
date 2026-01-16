import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import BottomTabs from '../components/BottomTabs';
import TodayCard from '../components/TodayCard';
import Divider from '../components/Divider';
import { useState, useEffect } from 'react';
import { getCompletedTrips, getAddressFromLatLng } from '../api/authService';

export default function History({ navigation }) {

    const [history, setHistory] = useState([]);
    const [totalTrips, setTotalTrips] = useState(0);
    const [addresses, setAddresses] = useState({});

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const res = await getCompletedTrips();
            setHistory(res.trips || []);
            setTotalTrips(res.summary?.totalTrips || 0);

            // 🔹 Fetch readable drop addresses
            const addrMap = {};

            for (const trip of res.trips) {
                const addr = await getAddressFromLatLng(
                    trip.drop.lat,
                    trip.drop.lng
                );
                addrMap[trip.bookingId] = addr;
            }

            setAddresses(addrMap);

        } catch (e) {
            console.log('History load error', e);
        }
    };


    return (
        <View style={styles.container}>

            <AppHeader title="History" navigation={navigation} />

            <ScrollView showsVerticalScrollIndicator={false}>

                <TodayCard
                    title="Total Trips"
                    value={totalTrips}
                    centerTrips
                />

                {history.map(trip => (
                    
                    <Card key={trip.bookingId}>
                        <View style={styles.rowBetween}>
                            <Text style={styles.amount1}>
                                {new Date(trip.date).toDateString()}
                            </Text>
                            <Text style={styles.amount1}>
                                ₹ {trip.fare}
                            </Text>
                        </View>

                        <Divider />

                        <Text style={styles.subText}>
                            {addresses[trip.bookingId] || 'Fetching location...'}
                        </Text>

                    </Card>
                ))}

                {history.length === 0 && (
                    <Text style={{ textAlign: 'center', marginTop: 20, color: COLORS.gray }}>
                        No completed trips yet
                    </Text>
                )}

            </ScrollView>

            <BottomTabs />
        </View>
    );
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FB',
    },

    cardTitle: {
        fontWeight: 'bold',
        fontSize: 15,
    },

    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginBottom: 6,
    },

    link: {
        color: COLORS.primary,
        fontWeight: '600',
    },

    amount1: {
        color: '#000',
        marginVertical: 3,
        textAlign: 'start',
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

    acceptBtn: {
        backgroundColor: '#E0E0E0',
        paddingHorizontal: 22,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 8
    },

    rowBetweencancel: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },


});
