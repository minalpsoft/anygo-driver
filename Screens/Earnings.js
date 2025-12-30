import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import BottomTabs from '../components/BottomTabs';
import TodayCard from '../components/TodayCard';
import Divider from '../components/Divider';

export default function Earnings({ navigation }) {
    return (
        <View style={styles.container}>

            {/* HEADER */}
            <AppHeader title="Earnings" navigation={navigation} />


            <ScrollView showsVerticalScrollIndicator={false}>

                <TodayCard
                    title="Total Balance"
                    amount="2244.00"
                    trips={12}
                     centerTrips={true}
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

                    <View style={styles.rowBetween}>
                        <Text style={styles.amount1}>18 Nov 2025</Text>
                        <Text style={styles.amount1}>Rs. 350.00</Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text style={styles.amount1}>17 Nov 2025</Text>
                        <Text style={styles.amount1}>Rs. 350.00</Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text style={styles.amount1}>16 Nov 2025</Text>
                        <Text style={styles.amount1}>Rs. 730.00</Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text style={styles.amount1}>15 Nov 2025</Text>
                        <Text style={styles.amount1}>Rs. 2300.00</Text>
                    </View>

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

                    <View style={styles.rowBetween}>
                        <Text style={styles.amount1}>18 Nov 2025</Text>
                        <Text style={styles.amount1}>Rs. 1250.00</Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text style={styles.amount1}>17 Nov 2025</Text>
                        <Text style={styles.amount1}>Rs. 350.00</Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text style={styles.amount1}>16 Nov 2025</Text>
                        <Text style={styles.amount1}>Rs. 300.00</Text>
                    </View>

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
