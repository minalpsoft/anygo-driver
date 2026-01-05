import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import BottomTabs from '../components/BottomTabs';
import TodayCard from '../components/TodayCard';
import Divider from '../components/Divider';
import { useState, useEffect } from 'react';

export default function DriverDashboard({ navigation }) {
    const [requests, setRequests] = useState([]);
    const [ongoingTrip, setOngoingTrip] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        const res = await api.get('/drivers/pending-requests');
        setRequests(res.data);
    };

    const acceptBooking = async (bookingId) => {
        const res = await api.post(`/drivers/accept-booking/${bookingId}`);

        navigation.navigate('OngoingTrip', {
            bookingId: res.data.bookingId,
            pickupDistance: res.data.driverToPickupDistanceKm,
        });
    };


    return (
        <View style={styles.container}>

            {/* HEADER */}
            <AppHeader title="Dashboard" navigation={navigation} />


            <ScrollView showsVerticalScrollIndicator={false}>

                {/* TODAY EARNINGS */}
                <TodayCard
                    title="Today"
                    amount="2244.00"
                    trips={4}
                    hours="7H"
                />


                {/* WALLET */}
                <Card>
                    <View style={styles.rowBetween}>
                        <Text style={styles.cardTitle}>Wallet Balance</Text>
                        <TouchableOpacity style={styles.acceptBtn}>
                            <Text style={styles.link}>Withdraw</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.amount1}>Rs. 4350.00</Text>

                    <Divider />

                    <Text style={styles.linkSmall}>View Payment History &gt;&gt;</Text>
                </Card>

                {/* NEW REQUEST */}
                {requests.length === 0 ? (
                    <Card>
                        <Text style={{ textAlign: 'center', color: '#777' }}>
                            No new requests
                        </Text>
                    </Card>
                ) : (
                    requests.map(req => (
                        <Card key={req._id}>
                            {/* Header */}
                            <View style={styles.headerRow}>
                                <Text style={styles.cardTitle}>New Request</Text>

                                <Text style={styles.labourText}>
                                    {req.labourCount} Labour
                                </Text>

                                <TouchableOpacity
                                    style={styles.acceptBtn}
                                    onPress={() => acceptBooking(req._id)}
                                >
                                    <Text style={styles.acceptText}>Accept</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Pickup Address */}
                            <Text style={styles.label}>Pickup Point</Text>
                            <Text>{req.pickupLocation?.address}</Text>

                            {/* Date & Time */}
                            <View style={styles.dateTimeRow}>
                                <View style={styles.dateTimeCol}>
                                    <Text style={styles.label}>Pickup Date</Text>
                                    <Text>{req.pickupDate}</Text>
                                </View>

                                <View style={styles.dateTimeCol}>
                                    <Text style={styles.label}>Pickup Time</Text>
                                    <Text>{req.pickupTime}</Text>
                                </View>
                            </View>

                            <Divider />

                            {/* Drop Point */}
                            <Text style={styles.label}>Drop Point</Text>
                            <Text>{req.dropLocation?.address}</Text>

                            <Text style={styles.linkSmall}>
                                View Trip Details &gt;&gt;
                            </Text>
                        </Card>
                    ))
                )}


                {/* ONGOING TRIP */}
                <Card>
                    <View style={styles.rowBetween}>
                        <Text style={styles.cardTitle}>OnGoing Trip</Text>
                        <TouchableOpacity style={styles.acceptBtn}>
                            <Text style={styles.link}>Navigation</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={{ marginBottom: "6" }}>Girish Phalak</Text>

                    <Divider />

                    <View style={styles.bottomRow}>
                        <TouchableOpacity style={styles.acceptBtn}>
                            <Text style={styles.link}>Finish</Text>
                        </TouchableOpacity>

                        <Text style={styles.linkSmall}>View Trip Details &gt;&gt;</Text>
                    </View>
                </Card>

                {/* {ongoingTrip && (
                    <Card>
                        <Text>{ongoingTrip.customerName}</Text>
                        <TouchableOpacity>
                            <Text>Navigation</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={finishTrip}>
                            <Text>Finish</Text>
                        </TouchableOpacity>
                    </Card>
                )} */}


                {/* PREVIOUS TRIP */}
                <Card>
                    {/* Header */}
                    <View style={styles.headerRow}>
                        <Text style={styles.cardTitle}>Previous Trip</Text>
                    </View>

                    {/* Pickup Address */}
                    <View style={styles.rowBetween}>
                        <Text style={styles.label}>Pickup Point</Text>
                        <Text style={styles.amountSmall}>Rs. 1349.00</Text>
                    </View>


                    <Text>Hiramandi Estate Ghodbandar Road</Text>
                    <Text>Thane</Text>

                    {/* Date & Time */}
                    <View style={styles.dateTimeRow}>
                        <View style={styles.dateTimeCol}>
                            <Text style={styles.label}>Pickup Date</Text>
                            <Text>20 Nov 2025</Text>
                        </View>

                        <View style={styles.dateTimeCol}>
                            <Text style={styles.label}>Pickup Time</Text>
                            <Text>08:00 AM</Text>
                        </View>
                    </View>

                    <Divider />


                    {/* drop point */}
                    <Text style={styles.label}>Drop Point</Text>
                    <Text>Imperial Heights Sector 21</Text>
                    <Text>Kamothe Navi Mumbai</Text>

                    {/* Date & Time */}
                    <View style={styles.dateTimeRow}>
                        <View style={styles.dateTimeCol}>
                            <Text style={styles.label}>Drop Date</Text>
                            <Text>20 Nov 2025</Text>
                        </View>

                        <View style={styles.dateTimeCol}>
                            <Text style={styles.label}>Drop Time</Text>
                            <Text>10:00 PM</Text>
                        </View>
                    </View>

                    <Divider />

                    <Text style={styles.linkSmall}>View Trip Details &gt;&gt;</Text>

                </Card>

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
