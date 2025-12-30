import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppLogo from '../components/AppLogo';
import AppFileInput from '../components/AppFileInput';
import AppButton from '../components/AppButton';
import { COLORS } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { uploadDriverDocumentsApi } from '../api/authService';

export default function DriverDocuments() {
  const navigation = useNavigation();

  const [aadhaar, setAadhaar] = useState(null);
  const [panCard, setPanCard] = useState(null);
  const [licenseFront, setLicenseFront] = useState(null);
  const [licenseBack, setLicenseBack] = useState(null);

  const handleUpload = async () => {
    if (!aadhaar || !panCard || !licenseFront || !licenseBack) {
      Alert.alert('Error', 'All documents required');
      return;
    }

    const formData = new FormData();

    const appendFile = (key, file) => {
      formData.append(key, {
        uri: file.uri,
        name: `${key}.jpg`,
        type: 'image/jpeg',
      });
    };

    appendFile('aadhaar', aadhaar);
    appendFile('panCard', panCard);
    appendFile('licenseFront', licenseFront);
    appendFile('licenseBack', licenseBack);

    try {
      const res = await uploadDriverDocumentsApi(formData);
      console.log('DOCUMENT UPLOAD RESPONSE:', res);

      if (res?.message) {
        Alert.alert('Success', res.message);
        navigation.navigate('DriverVerification');
      } else {
        Alert.alert('Error', 'Upload failed');
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Server error');
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
  }

});
