import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import BottomTabs from '../components/BottomTabs';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import TodayCard from '../components/TodayCard';
import Divider from '../components/Divider';

export default function Withdrawal({ navigation }) {
    return (
        <View style={styles.container}>

            {/* HEADER */}
            <AppHeader title="Withdrawal" navigation={navigation} />


            <ScrollView showsVerticalScrollIndicator={false}>

                {/* TODAY EARNINGS */}
                <TodayCard
                    title="Total Balance"
                    amount="4350.00"
                    trips={12}
                    centerTrips={true}
                />

                {/* WITHDRAW AMOUNT */}
                <View style={styles.withdraw}>

                    <AppInput placeholder="Enter withdrawal amount" />

                    <Text style={styles.helperText}>
                        Please submit your bank details
                    </Text>

                    <AppButton title="Submit" />

                </View>


                {/* withdrawal history */}
                <Card>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.cardTitle}>Withdrawal History</Text>
                            {/* <Text style={styles.subTitle}>Last 10 withdrawal</Text> */}
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

    withdraw: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 14,
        // elevation: 2,
    },

    helperText: {
        fontSize: 13,
        color: '#888',
        marginBottom: 12,
        marginHorizontal: 5
    },

});
