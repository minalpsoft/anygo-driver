import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppLogo from '../components/AppLogo';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { COLORS } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { verifyOtpApi } from '../api/authService';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DriverVerification() {
  const navigation = useNavigation();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);


const handleVerifyOtp = async () => {
  setLoading(true);

  try {
    const mobile = await AsyncStorage.getItem('otp_mobile');

    if (!mobile) {
      setLoading(false);
      Alert.alert('Error', 'Mobile number missing');
      return;
    }

    if (!otp) {
      setLoading(false);
      Alert.alert('Error', 'Please enter OTP');
      return;
    }

    const res = await verifyOtpApi({ mobile, otp });

    console.log('VERIFY OTP RESPONSE:', res);

    if (res?.userType === 'driver') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } else {
      Alert.alert('Failed', res?.message || 'Invalid OTP');
    }

  } catch (error) {
    console.log('OTP ERROR:', error);
    Alert.alert('Error', 'OTP verification failed');
  } finally {
    setLoading(false);
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

      <Text style={styles.title}>Driver Verification</Text>

      <AppInput
        placeholder="Enter OTP"
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
      />

      <AppButton
        title={loading ? 'Verifying...' : 'Finish'}
        onPress={handleVerifyOtp}
        disabled={loading}
      />

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
