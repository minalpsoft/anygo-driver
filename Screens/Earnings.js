import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import BottomTabs from '../components/BottomTabs';
import TodayCard from '../components/TodayCard';
import Divider from '../components/Divider';
import { useEffect, useState } from 'react';
import { getDriverEarningsApi } from '../api/authService';

export default function Earnings({ navigation }) {

    const [earnings, setEarnings] = useState(null);

    useEffect(() => {
        const loadEarnings = async () => {
            try {
                const res = await getDriverEarningsApi();
                setEarnings(res.data);
            } catch (err) {
                console.log('❌ EARNINGS ERROR', err?.response?.data || err.message);
            }
        };

        loadEarnings();
    }, []);

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <AppHeader title="Earnings" navigation={navigation} />


            <ScrollView showsVerticalScrollIndicator={false}>

                <TodayCard
                    title="Total Balance"
                    amount={earnings?.totalEarnings || 0}
                    trips={earnings?.tripsCount || 0}
                    centerTrips
                />



                {/* WALLET */}
                <Card>
                    <View style={styles.rowBetween}>
                        <Text style={styles.cardTitle}>Wallet Balance</Text>
                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.acceptBtn}>
                            <Text style={styles.link}>Withdrawal</Text>
                        </TouchableOpacity>
                    </View>

                    <Divider />

                    {earnings?.trips?.map((trip) => (
                        <View style={styles.rowBetween} key={trip.id}>
                            <Text style={styles.amount1}>
                                {new Date(trip.date).toDateString()}
                            </Text>
                            <Text style={styles.amount1}>
                                ₹ {trip.earning}
                            </Text>
                        </View>
                    ))}



                </Card>

                {/* withdrawal history */}
                <Card>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.cardTitle}>Withdrawal History</Text>
                            <Text style={styles.subTitle}>Last 10 withdrawal</Text>
                        </View>

                        <TouchableOpacity style={styles.acceptBtn}>
                            <Text style={styles.link}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    <Divider />

                    {earnings?.withdrawalHistory?.length > 0 ? (
                        earnings.withdrawalHistory.map((item) => (
                            <View style={styles.rowBetween} key={item.id}>
                                <Text style={styles.amount1}>
                                    {new Date(item.requestedAt).toDateString()}
                                </Text>
                                <Text style={styles.amount1}>
                                    ₹ {item.amount}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={{ textAlign: 'center', color: '#777' }}>
                            No withdrawals yet
                        </Text>
                    )}
                </Card>


            </ScrollView>

            {/* BOTTOM TABS */}
            <BottomTabs />

        </View >
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FB',
    },

    divider: {
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.6)',
        marginVertical: 5,
        marginLeft: -20,
        marginRight: -20,
    },

    cardTitle: {
        fontWeight: 'bold',
        fontSize: 15,
    },

    subTitle: {
        fontSize: 12
    },

    acceptBtn: {
        backgroundColor: '#E0E0E0',
        paddingHorizontal: 22,
        paddingVertical: 6,
        borderRadius: 20,
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

    linkSmall: {
        color: COLORS.primary,
        marginTop: 6,
        fontSize: 13,
        textAlign: 'right',
    },

    amount1: {
        color: '#000',
        marginVertical: 3,
        textAlign: 'start',
    },


});
