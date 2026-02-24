import { View, Text, StyleSheet, TouchableOpacity,ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppLogo from '../components/AppLogo';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { COLORS } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { addVehicleApi } from '../api/authService';

export default function VehicleDetails() {
  const navigation = useNavigation();

  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [chassisNumber, setChassisNumber] = useState('');


  const handleVehicleSubmit = async () => {
    if (!vehicleMake || !vehicleModel || !vehicleType || !vehicleNumber || !chassisNumber) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      const res = await addVehicleApi({
        vehicleMake,
        vehicleModel,
        vehicleType,
        vehicleNumber,
        chassisNumber,
      });

      console.log('VEHICLE RESPONSE:', res);

      if (res?.message) {
        navigation.navigate('DriverDocuments');
      } else {
        Alert.alert('Error', 'Vehicle details failed');
      }

    } catch (err) {
      console.log(err);
      Alert.alert('Server Error', 'Unable to save vehicle');
    }
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#f2f6ff']}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        overScrollMode="always"
        bounces={true}
      >

        <View style={styles.backContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={28} color="#000" />
          </TouchableOpacity>
        </View>


        <AppLogo />

        <Text style={styles.title}>Vehicle Details</Text>


        <AppInput placeholder="Vehicle Make" value={vehicleMake} onChangeText={setVehicleMake} />
        <AppInput placeholder="Vehicle Model" value={vehicleModel} onChangeText={setVehicleModel} />
        <AppInput placeholder="Vehicle Type" value={vehicleType} onChangeText={setVehicleType} />
        <AppInput placeholder="Vehicle Number" value={vehicleNumber} onChangeText={setVehicleNumber} />
        <AppInput placeholder="Chassis Number" value={chassisNumber} onChangeText={setChassisNumber} />

        <AppButton title="Next" onPress={handleVehicleSubmit} />

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  backContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  container: {
    // flex: 1,
    backgroundColor: '#F7F9FC',
    padding: 20,
    paddingBottom: 80,
    // justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 25,
  }

});
