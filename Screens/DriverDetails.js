import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppLogo from '../components/AppLogo';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { COLORS } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerDriverApi } from '../api/authService';
import { Alert } from 'react-native';

export default function DriverDetails() {
  const navigation = useNavigation();
const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [emergencyMobile, setEmergencyMobile] = useState('');
const [password, setPassword]= useState('');

 const handleDriverRegister = async () => {
  if (!firstName || !lastName || !mobile || !emergencyMobile || !password) {
    Alert.alert('Error', 'All fields are required');
    return;
  }

  try {
    const res = await registerDriverApi({
      firstName,
      lastName,
      mobile,
      emergencyMobile,
      password
    });

    console.log('DRIVER REGISTER RESPONSE:', res);

    // ✅ ONLY CHECK TOKEN
    if (res?.token) {
      await AsyncStorage.setItem('driverToken', res.token);

      // 🔥 move to next step
      navigation.navigate('VehicleDetails');
    } else {
      Alert.alert('Error', res?.message || 'Driver registration failed');
    }

  } catch (err) {
    console.log(err);
    Alert.alert('Server Error', 'Unable to register driver');
  }
};


  return (
    <LinearGradient
      colors={['#ffffff', '#f2f6ff']}
      style={styles.container}>

      <View style={styles.backContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>


      <AppLogo />

      <Text style={styles.title}>Driver Details</Text>

       <AppInput placeholder="Driver's First Name" value={firstName} onChangeText={setFirstName} />
      <AppInput placeholder="Driver's Last Name" value={lastName} onChangeText={setLastName} />
      <AppInput placeholder="Driver's Mobile Number" value={mobile} onChangeText={setMobile} />
      <AppInput placeholder="Emergency Mobile Number" value={emergencyMobile} onChangeText={setEmergencyMobile} />
      <AppInput placeholder="Enter Password" value={password} onChangeText={setPassword} />

      <AppButton title="Next" onPress={handleDriverRegister} />

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
    flex: 1,
    backgroundColor: '#F7F9FC',
    padding: 20,
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
