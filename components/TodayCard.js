import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function TodayCard({
    title = 'Today',
    amount = '0.00',
    value,
    trips,
    hours,
    showStats = true,
    centerTrips = false,
}) {
    const showTrips = trips !== undefined;
    const showHours = hours !== undefined && !centerTrips;

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>

            {value !== undefined ? (
        <Text style={styles.amount}>{value}</Text>
      ) : (
        amount !== undefined && (
          <Text style={styles.amount}>Rs. {amount}</Text>
        )
      )}

            {showStats && (showTrips || showHours) && (
                <>
                    <View style={styles.divider} />

                    <View
                        style={[
                            styles.stats,
                            centerTrips && { justifyContent: 'center' },
                        ]}
                    >

                        {showTrips && (
                            <View style={styles.statItem}>
                                <Ionicons
                                    name="repeat-outline"
                                    size={20}
                                    color={COLORS.white}
                                />
                                <Text style={styles.statText}>{trips} Trips</Text>
                            </View>
                        )}

                        {showHours && (
                            <View style={styles.statItem}>
                                <Ionicons
                                    name="time-outline"
                                    size={18}
                                    color={COLORS.white}
                                />
                                <Text style={styles.statText}>{hours}</Text>
                            </View>
                        )}
                    </View>
                </>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.navy,
        marginHorizontal: 18,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 22,
        paddingVertical: 25,
        paddingHorizontal: 20,
        elevation: 4,
    },

    title: {
        fontSize: 22,
        color: COLORS.white,
        fontWeight: '700',
        textAlign: 'center',
    },

    amount: {
        fontSize: 26,
        fontWeight: '700',
        color: COLORS.yellow,
        marginVertical: 6,
        textAlign: 'center',
    },

    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.35)',
        marginVertical: 12,
    },

    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        marginTop: 12,
    },

    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    statText: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.white,
    },
});
