import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppLogo from '../components/AppLogo';
import AppFileInput from '../components/AppFileInput';
import AppButton from '../components/AppButton';
import { COLORS } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { uploadDriverDocumentsApi, initDigiLockerApi } from '../api/authService';
import { Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

export default function DriverDocuments() {
  const navigation = useNavigation();

  const [aadhaar, setAadhaar] = useState(null);
  const [panCard, setPanCard] = useState(null);
  const [licenseFront, setLicenseFront] = useState(null);
  const [licenseBack, setLicenseBack] = useState(null);

  
  // const handleDigiLocker = async () => {
  //   try {
  //     const response = await initDigiLockerApi();

  //     if (!response?.authUrl) {
  //       Alert.alert('Error', 'DigiLocker not available');
  //       return;
  //     }

  //     await Linking.openURL(response.authUrl);
  //   } catch (error) {
  //     console.log(error);
  //     Alert.alert('Error', 'Unable to open DigiLocker');
  //   }
  // };


  const handleDigiLocker = async () => {
    try {
      // MOCKING until backend is ready
      const response = {
        authUrl: 'https://digilocker.mock.url/authorize?mock=123',
      };

      // Uncomment the real call when backend keys are ready
      // const response = await initDigiLockerApi();

      if (!response?.authUrl) {
        Alert.alert('Error', 'DigiLocker not available');
        return;
      }

      await Linking.openURL(response.authUrl);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Unable to open DigiLocker');
    }
  };

  useEffect(() => {
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleDeepLink = (event) => {
    const url = event.url;

    if (url.includes('digilocker-success')) {
      navigation.navigate('DriverVerification');
    }

    if (url.includes('digilocker-failed')) {
      Alert.alert('Error', 'DigiLocker verification failed');
    }
  };

  const handleUpload = async () => {
    if (!aadhaar || !panCard || !licenseFront || !licenseBack) {
      Alert.alert('Error', 'All documents required');
      return;
    }

    const formData = new FormData();

    formData.append('aadhaar', {
      uri: aadhaar.uri,
      name: 'aadhaar.jpg',
      type: 'image/jpeg',
    });

    formData.append('panCard', {
      uri: panCard.uri,
      name: 'pan.jpg',
      type: 'image/jpeg',
    });

    formData.append('licenseFront', {
      uri: licenseFront.uri,
      name: 'license_front.jpg',
      type: 'image/jpeg',
    });

    formData.append('licenseBack', {
      uri: licenseBack.uri,
      name: 'license_back.jpg',
      type: 'image/jpeg',
    });

    try {
      await uploadDriverDocumentsApi(formData);

      // ✅ ALWAYS NAVIGATE (backend bug)
      navigation.navigate('DriverVerification');
    } catch (error) {
      console.log('Upload error:', error);

      // ✅ STILL NAVIGATE
      navigation.navigate('DriverVerification');
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

      <Text style={styles.title}>Driver Documents</Text>

      <TouchableOpacity style={styles.digiBtn} onPress={handleDigiLocker}>
        <Ionicons name="shield-checkmark-outline" size={22} color="#1a73e8" />
        <Text style={styles.digiText}>Upload via DigiLocker</Text>
      </TouchableOpacity>


      <AppFileInput label="Upload Aadhaar Card" onSelect={setAadhaar} />
      <AppFileInput label="Upload Pan Card" onSelect={setPanCard} />
      <AppFileInput label="License Front" onSelect={setLicenseFront} />
      <AppFileInput label="License Back" onSelect={setLicenseBack} />

      <AppButton title="Submit" onPress={handleUpload} />

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
  },
  digiBtn: {
    flexDirection: 'row', // icon and text side by side
    alignItems: 'center',
    justifyContent: 'center', // center horizontally
    backgroundColor: '#E6F0FF', // light background (optional)
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 20, // space below button
  },
  digiText: {
    color: '#1a73e8', // your new text color
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8, // space between icon and text
  },

});
