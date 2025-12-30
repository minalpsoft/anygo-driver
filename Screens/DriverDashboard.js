import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import BottomTabs from '../components/BottomTabs';
import TodayCard from '../components/TodayCard';
import Divider from '../components/Divider';

export default function DriverDashboard({ navigation }) {
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
                <Card>
                    {/* Header */}
                    <View style={styles.headerRow}>
                        <Text style={styles.cardTitle}>New Request</Text>

                        <Text style={styles.labourText}>2 Labour</Text>

                        <TouchableOpacity style={styles.acceptBtn}>
                            <Text style={styles.acceptText}>Accept</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Pickup Address */}
                    <Text style={styles.label}>Pickup Point</Text>
                    <Text>Imperial Heights Sector 21</Text>
                    <Text>Kamothe Navi Mumbai</Text>

                    {/* Date & Time */}
                    <View style={styles.dateTimeRow}>
                        <View style={styles.dateTimeCol}>
                            <Text style={styles.label}>Pickup Date</Text>
                            <Text>20 Nov 2025</Text>
                        </View>

                        <View style={styles.dateTimeCol}>
                            <Text style={styles.label}>Pickup Time</Text>
                            <Text>10:00 AM</Text>
                        </View>
                    </View>

                     <Divider />


                    {/* drop point */}
                    <Text style={styles.label}>Drop Point</Text>
                    <Text>Hiramandi Estate Ghodbandar Road</Text>
                    <Text>Thane</Text>

                    {/* Date & Time */}
                    <View style={styles.dateTimeRow}>
                        <View style={styles.dateTimeCol}>
                            <Text style={styles.label}>Drop Date</Text>
                            <Text>20 Nov 2025</Text>
                        </View>

                        <View style={styles.dateTimeCol}>
                            <Text style={styles.label}>Drop Time</Text>
                            <Text>03:00 PM</Text>
                        </View>
                    </View>
                    <Text style={styles.linkSmall}>View Trip Details &gt;&gt;</Text>

                </Card>

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
