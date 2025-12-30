import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import BottomTabs from '../components/BottomTabs';
import TodayCard from '../components/TodayCard';
import Divider from '../components/Divider';

export default function History({ navigation }) {
    return (
        <View style={styles.container}>

            {/* HEADER */}
            <AppHeader title="History" navigation={navigation} />


            <ScrollView showsVerticalScrollIndicator={false}>

                {/* TODAY EARNINGS */}
                <TodayCard
                    title="Total Trips"
                  value={12}       
                    centerTrips={true}
                />

                {/* trip history */}
                <Card>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.cardTitle}>Trip History</Text>
                        </View>
                    </View>

                    <Divider />

                    <View style={styles.rowBetween}>
                        <Text style={styles.amount1}>18 Nov 2025</Text>
                        <Text style={styles.amount1}>Thane</Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text style={styles.amount1}>17 Nov 2025</Text>
                        <Text style={styles.amount1}>Panvel</Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text style={styles.amount1}>16 Nov 2025</Text>
                        <Text style={styles.amount1}>Bhivandi</Text>
                    </View>

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
