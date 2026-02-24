import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import BottomTabs from '../components/BottomTabs';
import TodayCard from '../components/TodayCard';
import Divider from '../components/Divider';

export default function TripDetails({ navigation }) {
    return (
        <View style={styles.container}>

            {/* HEADER */}
            <AppHeader title="Trip Details" navigation={navigation} />


            <ScrollView showsVerticalScrollIndicator={false}>

                {/* TODAY EARNINGS */}
                <TodayCard
                    title="Total Balance"
                    amount="740.00"
                    trips={12}
                    centerTrips={true}
                />

                {/* WALLET */}
                <Card>
                    <View style={styles.rowBetween}>
                        <Text style={styles.cardTitle}>Girish Phalak</Text>
                        <TouchableOpacity style={styles.acceptBtn}>
                            <Text style={styles.link}>Call</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.amount1}>48 Km</Text>

                    <Divider />

                    <View style={styles.rowBetween}>
                        <TouchableOpacity style={styles.acceptBtn}>
                            <Text style={styles.link}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.acceptBtn}>
                            <Text style={styles.link}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Card>

                {/* NEW REQUEST */}
                <Card>
                    {/* Header */}
                    <View style={styles.headerRow}>
                        <Text style={styles.cardTitle}>New Request</Text>
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

            </ScrollView>

            {/* BOTTOM TABS */}
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
        fontSize: 22,
        color: '#000',
        // marginVertical: 5,
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

    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },


});
