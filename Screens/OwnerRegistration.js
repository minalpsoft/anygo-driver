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
import { ownerRegisterApi } from '../api/authService';
import { Alert } from 'react-native';

export default function OwnerRegistration() {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // const handleOwnerRegister = async () => {
  //   console.log("NEXT BUTTON CLICKED");
  // console.log("REGISTER API PAYLOAD:", payload);
  //   if (!firstName || !lastName || !mobile || !email || !password) {
  //     Alert.alert("Error", "All fields are required");
  //     return;
  //   }

  //   try {
  //     const res = await ownerRegisterApi({
  //       firstName,
  //       lastName,
  //       mobile,
  //       email,
  //       password
  //     });

  //     console.log("OWNER REGISTER RESPONSE:", res);

  //     if (res?.data?._id) {
  //       await AsyncStorage.setItem('ownerId', res.data._id);
  //       console.log("NAVIGATING TO DriverDetails");

  //       navigation.navigate('DriverDetails');
  //     } else {
  //       Alert.alert("API ERROR", JSON.stringify(res));
  //     }

  //   } catch (err) {
  //     console.log("FETCH FAILED:", err);
  //     Alert.alert("Network Error", "Cannot reach server");
  //   }
  // };

  const handleOwnerRegister = async () => {
    console.log("NEXT BUTTON CLICKED");

    const payload = {
      firstName,
      lastName,
      mobile,
      email,
      password
    };

    console.log("REGISTER API PAYLOAD:", payload);

    if (!firstName || !lastName || !mobile || !email || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      const res = await ownerRegisterApi(payload);

      console.log("OWNER REGISTER RESPONSE:", res);

      if (res?.data?._id) {
        await AsyncStorage.setItem('ownerId', res.data._id);
        navigation.navigate('DriverDetails');
      }
    } catch (err) {
      console.log("FETCH FAILED:", err);
      Alert.alert("Network Error", "Cannot reach server");
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

      <Text style={styles.title}>Owner Registration</Text>

      <AppInput placeholder="Enter Your First Name" value={firstName} onChangeText={setFirstName} />
      <AppInput placeholder="Enter Your Last Name" value={lastName} onChangeText={setLastName} />
      <AppInput placeholder="Enter Your Mobile Number" value={mobile} onChangeText={setMobile} />
      <AppInput placeholder="Enter Your Email" value={email} onChangeText={setEmail} />
      <AppInput placeholder="Enter Password" secureTextEntry value={password} onChangeText={setPassword} />
      {password.length > 0 && password.length < 6 && (
        <Text style={{ color: 'red', fontSize: 12, marginLeft: 5, marginTop: 4 }}>
          Password length should be more than 6 characters
        </Text>
      )}

      <AppButton title="Next" onPress={handleOwnerRegister} />

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
