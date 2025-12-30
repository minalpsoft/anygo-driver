import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import BottomTabs from '../components/BottomTabs';
import AppButton from '../components/AppButton';
import TodayCard from '../components/TodayCard';
import Divider from '../components/Divider';


export default function Profile({ navigation }) {
    return (
        <View style={styles.container}>

            {/* HEADER */}
            <AppHeader title="Profile" navigation={navigation} />


            <ScrollView showsVerticalScrollIndicator={false}>

                {/* TODAY EARNINGS */}
                <TodayCard
                    title="Roshan Patil"
                    value={"Tata pickup"}
                    centerTrips={true}
                />

                {/* My Profile */}
                <Card>
                    <View style={styles.rowBetween}>
                        <Text style={styles.cardTitle}>My Profile</Text>
                        <TouchableOpacity style={styles.acceptBtn}>
                            <Text style={styles.link}>Edit</Text>
                        </TouchableOpacity>
                    </View>

                    <Divider />

                    <View style={styles.rowBetween}>
                        <Text style={styles.amount1}>First Name</Text>
                        <Text style={styles.amount1}>Roshan</Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text style={styles.amount1}>Last Name</Text>
                        <Text style={styles.amount1}>Patil</Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text style={styles.amount1}>Mobile Number</Text>
                        <Text style={styles.amount1}>+91 1234567890</Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text style={styles.amount1}>Email</Text>
                        <Text style={styles.amount1}>roshanpatilgmail.com</Text>
                    </View>
                </Card>

                {/* LOGOUT BUTTON OUTSIDE CARD */}
                <View style={styles.buttonWrapper}>
                    <AppButton title="Logout" />
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
        backgroundColor: '#F5F7FB',
    },

    cardTitle: {
        fontWeight: 'bold',
        fontSize: 15,
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

    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    acceptBtn: {
        backgroundColor: '#E0E0E0',
        paddingHorizontal: 22,
        paddingVertical: 6,
        borderRadius: 20,
    },
    buttonWrapper: {
        marginTop: 12,
        paddingHorizontal: 16,
    },


});
