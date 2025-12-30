import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../theme/colors';
import AppHeader from '../components/AppHeader';
import BottomTabs from '../components/BottomTabs';
import Card from '../components/Card';
import MapView, { Marker } from 'react-native-maps';
import Divider from '../components/Divider';

export default function Navigation({ navigation }) {
    return (
        <View style={styles.container}>

            {/* HEADER */}
            <AppHeader title="Navigation" navigation={navigation} />

            {/* CONTENT */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={{ paddingBottom: 80, marginTop: 20 }}
                showsVerticalScrollIndicator={false} >


                <Card>
                    <View style={styles.rowBetween}>
                        <Text style={styles.cardTitle}>Map Navigation</Text>
                    </View>

                    <Divider />

                    {/* MAP */}
                    <View style={styles.mapContainer}>
                        <MapView
                            style={StyleSheet.absoluteFillObject}
                            initialRegion={{
                                latitude: 18.5204,
                                longitude: 73.8567,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                        />
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
        backgroundColor: COLORS.background,
    },

    content: {
        flex: 1,
    },

    cardTitle: {
        fontWeight: 'bold',
        fontSize: 15,
    },

    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    mapContainer: {
        height: 500,
        flex: 1,
    },

});
