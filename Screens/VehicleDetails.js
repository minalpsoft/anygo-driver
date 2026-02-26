import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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

  const validateVehicle = () => {
    const nameRegex = /^[A-Za-z ]+$/;
    const modelRegex = /^[A-Za-z0-9 ]+$/;
    const vehicleNumberRegex = /^[A-Z]{2}[ -]?\d{2}[ -]?[A-Z]{1,2}[ -]?\d{4}$/;
    const chassisRegex = /^[A-HJ-NPR-Z0-9]{17}$/;

    if (!vehicleMake.trim())
      return "Vehicle make is required";
    if (!nameRegex.test(vehicleMake))
      return "Vehicle make should contain only letters";

    if (!vehicleModel.trim())
      return "Vehicle model is required";
    if (!modelRegex.test(vehicleModel))
      return "Vehicle model contains invalid characters";

    if (!vehicleType.trim())
      return "Vehicle type is required";

    if (!vehicleNumber.trim())
      return "Vehicle number is required";
    if (!vehicleNumberRegex.test(vehicleNumber.toUpperCase()))
      return "Enter valid vehicle number (e.g., MH12AB1234)";

    if (!chassisNumber.trim())
      return "Chassis number is required";
    if (!chassisRegex.test(chassisNumber.toUpperCase()))
      return "Chassis number must be 17 characters (valid VIN)";

    return null;
  };

  // const handleVehicleSubmit = async () => {
  //   if (!vehicleMake || !vehicleModel || !vehicleType || !vehicleNumber || !chassisNumber) {
  //     Alert.alert('Error', 'All fields are required');
  //     return;
  //   }

  //   try {
  //     const res = await addVehicleApi({
  //       vehicleMake,
  //       vehicleModel,
  //       vehicleType,
  //       vehicleNumber,
  //       chassisNumber,
  //     });

  //     console.log('VEHICLE RESPONSE:', res);

  //     if (res?.message) {
  //       navigation.navigate('DriverDocuments');
  //     } else {
  //       Alert.alert('Error', 'Vehicle details failed');
  //     }

  //   } catch (err) {
  //     console.log(err);
  //     Alert.alert('Server Error', 'Unable to save vehicle');
  //   }
  // };

  const handleVehicleSubmit = async () => {
    const error = validateVehicle();

    if (error) {
      Alert.alert("Validation Error", error);
      return;
    }

    try {
      const res = await addVehicleApi({
        vehicleMake,
        vehicleModel,
        vehicleType,
        vehicleNumber: vehicleNumber.toUpperCase(),
        chassisNumber: chassisNumber.toUpperCase(),
      });

      if (res?.message) {
        navigation.navigate('DriverDocuments');
      } else {
        Alert.alert('Error', 'Vehicle details failed');
      }

    } catch (err) {
      Alert.alert('Server Error', 'Unable to save vehicle');
    }
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#f2f6ff']}
      style={{ flex: 1 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        overScrollMode="always"
        bounces={true}
        contentContainerStyle={{
          paddingBottom: 300,
          backgroundColor: '#F7F9FC',
          padding: 20,
        }}
      >

        <View style={styles.backContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={28} color="#000" />
          </TouchableOpacity>
        </View>


        <AppLogo />

        <Text style={styles.title}>Vehicle Details</Text>


        <AppInput
          placeholder="Vehicle Make"
          value={vehicleMake}
          onChangeText={(t) => setVehicleMake(t.replace(/[^A-Za-z ]/g, ""))}
        />

        <AppInput
          placeholder="Vehicle Model"
          value={vehicleModel}
          onChangeText={(t) => setVehicleModel(t.replace(/[^A-Za-z0-9 ]/g, ""))}
        />

        <AppInput
          placeholder="Vehicle Type"
          value={vehicleType}
          onChangeText={(t) =>
            setVehicleType(t.replace(/[^A-Za-z ]/g, ""))
          }
        />
        <AppInput
          placeholder="Vehicle Number"
          value={vehicleNumber}
          onChangeText={(t) => setVehicleNumber(t.toUpperCase())}
        />

        <AppInput
          placeholder="Chassis Number"
          value={chassisNumber}
          onChangeText={(t) => setChassisNumber(t.toUpperCase())}
        />

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
