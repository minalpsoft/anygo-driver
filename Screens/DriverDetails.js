import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppLogo from '../components/AppLogo';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { COLORS } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerDriverApi, getCitiesApi } from '../api/authService';
import { Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useEffect } from 'react';
import { Axios } from 'axios';
import Checkbox from 'expo-checkbox';

export default function DriverDetails() {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [emergencyMobile, setEmergencyMobile] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [cities, setCities] = useState([]);
  const [accepted, setAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const nameRegex = /^[A-Za-z ]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!firstName.trim()) return "First name is required";
    if (!nameRegex.test(firstName)) return "First name can contain only letters";

    if (!lastName.trim()) return "Last name is required";
    if (!nameRegex.test(lastName)) return "Last name can contain only letters";

    if (!mobile) return "Mobile number is required";
    if (!mobileRegex.test(mobile)) return "Enter valid 10-digit mobile";

    if (!emergencyMobile) return "Emergency mobile is required";
    if (!mobileRegex.test(emergencyMobile)) return "Enter valid emergency mobile";

    if (mobile === emergencyMobile)
      return "Emergency number must be different from driver mobile";

    if (!city) return "Please select city";

    if (!password) return "Password is required";
    if (password.length < 6)
      return "Password must be at least 6 characters";

    if (!accepted)
      return "Please accept Terms & Conditions";

    return null;
  };

  const handleDriverRegister = async () => {

    const error = validateForm();
    if (error) {
      Alert.alert("Validation Error", error);
      return;
    }

    if (!accepted) {
      Alert.alert('Terms Required', 'Please accept Terms & Conditions to continue');
      return;
    }

    try {
      const res = await registerDriverApi({
        firstName,
        lastName,
        mobile,
        emergencyMobile,
        password,
        city,
        // vehicleNumber: `TEMP-${mobile}`
      });

      console.log('DRIVER REGISTER RESPONSE:', res);

      // ✅ ONLY CHECK TOKEN
      if (res?.token) {
        await AsyncStorage.setItem('driverToken', res.token);
        await AsyncStorage.setItem('otp_mobile', mobile);
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

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      console.log("LOADING CITIES...");
      const data = await getCitiesApi();
      console.log("CITIES API RESPONSE:", data);

      setCities(data); // directly set array of strings
    } catch (err) {
      console.log("CITY API ERROR:", err);
      Alert.alert('Error', 'Failed to load cities');
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
          paddingBottom: 250,
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

        <Text style={styles.title}>Driver Details</Text>

        <AppInput
          placeholder="Driver's First Name"
          value={firstName}
          onChangeText={(t) => setFirstName(t.replace(/[^A-Za-z ]/g, ""))}
        />

        <AppInput
          placeholder="Driver's Last Name"
          value={lastName}
          onChangeText={(t) => setLastName(t.replace(/[^A-Za-z ]/g, ""))}
        />

        <AppInput
          placeholder="Driver's Mobile Number"
          keyboardType="number-pad"
          value={mobile}
          onChangeText={(t) => setMobile(t.replace(/[^0-9]/g, ""))}
        />

        <AppInput
          placeholder="Emergency Mobile Number"
          keyboardType="number-pad"
          value={emergencyMobile}
          onChangeText={(t) => setEmergencyMobile(t.replace(/[^0-9]/g, ""))}
        />

        <View style={styles.inputWrapper}>
          <Picker
            selectedValue={city}
            onValueChange={(value) => setCity(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select City" value="" />
            {cities.map((c) => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        </View>

        <AppInput
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          rightIcon={showPassword ? "eye-off" : "eye"}
          onRightIconPress={() => setShowPassword(!showPassword)}
        />
        {password.length > 0 && password.length < 6 && (
          <Text style={{ color: 'red', fontSize: 12, marginLeft: 5, marginTop: 4 }}>
            Password length should be more than 6 characters
          </Text>
        )}



        <View style={styles.checkboxContainer}>
          <Checkbox
            value={accepted}
            onValueChange={setAccepted}
            color={accepted ? COLORS.primary : undefined}
          />

          <View>
            <Text style={styles.termsText}>
              I agree to accept Terms & Conditions
            </Text>

            <Text style={styles.termsText}>
              <Text
                style={styles.link}
                onPress={() => setShowTerms(true)}
              >
                Click here
              </Text>{' '}
              to read Terms and Conditions and Privacy Policy
            </Text>
          </View>

        </View>




        <AppButton title="Next" onPress={handleDriverRegister} />

        <Modal
          visible={showTerms}
          animationType="slide"
          transparent
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>
                <Text style={styles.modalHeading}>
                  Terms & Conditions
                </Text>
              </Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalText}>
                  {/* Customer Terms and Conditions{'\n\n'} */}
                  <Text style={styles.sectionTitle}>1. Introduction and Scope {'\n\n'}</Text>
                  <Text style={styles.modalText}>
                    • By accessing [Company Name] (the "Site") or booking any travel services through us, you agree
                    to be bound by these Terms and Condi ons. These terms apply to all visitors, users, and
                    customer.{'\n\n'}</Text>

                  <Text style={styles.sectionTitle}>2. Cancellations and Refunds{'\n\n'}</Text>
                  • Cancellations are governed by both [Company Name]’s policies and the specific Provider’s
                  policies. {'\n\n'}
                  • Service Fees: [Company Name] may charge a non-refundable processing fee for
                  bookings and cancellations. {'\n\n'}
                  • Refund Timeline: Refunds, if applicable, will be processed only a er we receive the
                  funds back from the Provider. This may take [Number, e.g., 7-14] business days.{'\n\n'}

                  • Non-Refundable Rates: Some bookings (e.g., "Basic Economy" or "Last Minute Deals")
                  are strictly non-refundable.{'\n\n'}

                  <Text style={styles.sectionTitle}>3. Changes and Force Majeure{'\n\n'}</Text>
                  • Changes by You: Requests to change travel dates or names are subject to availability and
                  Provider fees.{'\n\n'}
                  • Force Majeure: [Company Name] is not liable for failure to perform its obliga ons due to
                  events beyond our control, including but not limited to: natural disasters, pandemics,
                  war, strikes, or government restric ons. {'\n\n'}

                  <Text style={styles.sectionTitle}>4. User Conduct and Prohibited Activities {'\n\n'}</Text>
                  You agree not to - {'\n\n'}
                  • Use the site for any specula ve, false, or fraudulent bookings.{'\n\n'}
                  • Use automated systems (bots) to scrape data from our platform.{'\n\n'}
                  • Cancellations and Waiting Fees
                  • Violate any local or interna onal laws during your travel. .{'\n\n'}

                  <Text style={styles.sectionTitle}>5. Limitation of Liability {'\n\n'}</Text>
                  • To the maximum extent permi ed by law, [Company Name] shall not be liable for any direct,
                  indirect, or consequen al loss arising from your use of our services or the failure of any Third
                  Party Provider.{'\n\n'}

                  <Text style={styles.sectionTitle}>6. Governing Law{'\n\n'}</Text>
                  • These terms are governed by the laws of [Insert State/Country]. Any disputes shall be resolved
                  in the courts of [Insert City/Region].{'\n\n'}</Text>
              </ScrollView>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setShowTerms(false)}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 8,
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
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    marginLeft: 10,
    marginRight: 10
  },
  termsText: {
    marginLeft: 10,
    color: COLORS.black,
  },
  link: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  inputWrapper: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    justifyContent: 'center',
  },

  picker: {
    height: 56,              // same visual height as TextInput
    paddingHorizontal: 16,
    color: '#333',
  },

  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 6,
  },
  link: {
    color: '#1E88E5',
    fontSize: 14,
    fontWeight: '500',
  },
  termsText: {
    fontSize: 13,
    color: '#555',
    textAlign: 'left',
    marginStart: 10
  },

  link: {
    color: '#1E90FF',
    fontWeight: '600',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },

  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 6,
  },

  modalText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 20,
  },


  modalText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },

  closeBtn: {
    marginTop: 15,
    backgroundColor: '#E31E24',
    paddingVertical: 10,
    borderRadius: 8,
  },

  closeText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },


});
