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

  const handleDriverRegister = async () => {

    if (!firstName || !lastName || !mobile || !emergencyMobile || !password || !city) {
      Alert.alert('Error', 'All fields are required');
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
        vehicleNumber: `TEMP-${mobile}`
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

        <Text style={styles.title}>Driver Details</Text>

        <AppInput placeholder="Driver's First Name" value={firstName} onChangeText={setFirstName} />
        <AppInput placeholder="Driver's Last Name" value={lastName} onChangeText={setLastName} />
        <AppInput placeholder="Driver's Mobile Number" value={mobile} onChangeText={setMobile} />
        <AppInput placeholder="Emergency Mobile Number" value={emergencyMobile} onChangeText={setEmergencyMobile} />

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



        <AppInput placeholder="Enter Password" secureTextEntry value={password} onChangeText={setPassword} />
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
                  <Text style={styles.sectionTitle}>1. Contractual Relationship{'\n\n'}</Text>
                  <Text style={styles.modalText}>
                    • The Platform: These terms govern your access to the [Company Name] mobile
                    application and website. By using our services, you agree to these terms.{'\n\n'}
                    • Service Provider: [Company Name] provides a technology platform that connects you
                    with independent third-party drivers. [Company Name] does not provide
                    transportation services; the transportation is provided by the independent Partner
                    Driver.</Text>{'\n\n'}

                  <Text style={styles.sectionTitle}>2. User Accounts{'\n\n'}</Text>
                  • Eligibility: You must be at least 18 years old to create an account.{'\n\n'}
                  • Accuracy: You agree to provide accurate, complete, and up-to-date information (Name,
                  Phone Number, Payment Method).{'\n\n'}
                  • Security: You are responsible for all activity that occurs under your account.{'\n\n'} Notify us
                  immediately if you suspect any unauthorized access.{'\n\n'}

                  <Text style={styles.sectionTitle}>3. Use of Services{'\n\n'}</Text>
                  • Booking: A booking is confirmed once a Partner Driver accepts your request. We do not
                  guarantee that a driver will be available for every request.{'\n\n'}
                  • Passenger Conduct: You must treat drivers with respect. You may not carry illegal
                  substances, hazardous materials, or engage in behavior that endangers the driver or the
                  vehicle.{'\n\n'}
                  • Maximum Occupancy: You agree not to exceed the seating capacity of the vehicle type
                  you have booked (e.g., 4 passengers for a sedan).{'\n\n'}

                  <Text style={styles.sectionTitle}>4. Payments, Tolls, and Taxes{'\n\n'}</Text>
                  • Fares: Fares are calculated based on distance, time, and demand (surge pricing). An
                  estimated fare will be shown before you book.{'\n\n'}
                  • Tolls and Parking: Any road tolls, airport entry fees, or parking charges incurred during
                  the trip are the responsibility of the customer and will be added to the final invoice.{'\n\n'}
                  • Methods: Payments can be made via [Credit/Debit Card, Digital Wallets, or Cash].{'\n\n'}
                  • Cancellations and Waiting Fees
                  • Cancellation Fee: A fee may be charged if you cancel a trip after a driver has
                  been assigned and has traveled toward your location for more than [e.g., 2
                  minutes].{'\n\n'}
                  • Waiting Fee: Drivers will wait for a maximum of [e.g., 5 minutes] at the pickup location.{'\n\n'}
                  After this, a per-minute waiting fee may apply, or the driver may cancel the trip as a "no-
                  show," incurring a cancellation fee for you.{'\n\n'}

                  <Text style={styles.sectionTitle}>5. Damage to Vehicles{'\n\n'}</Text>
                  • Cleaning Fees: If you or your guests spill liquids, vomit, or otherwise soil the vehicle
                  interior, you will be charged a Cleaning Fee (based on local professional cleaning rates)
                  to compensate the driver for their loss of earnings and cleaning costs.{'\n\n'}
                  • Repair: You are responsible for the cost of repair for any damage to the vehicle caused
                  by your intentional or negligent actions.{'\n\n'}

                  <Text style={styles.sectionTitle}>6. Limitation of Liability{'\n\n'}</Text>
                  • [Company Name] is not liable for indirect, incidental, or consequential damages,
                  including lost profits or personal injury, arising out of the use of the third-party
                  transportation service.{'\n\n'}
                  • We are not responsible for items left behind in vehicles. However, we will provide a "Lost
                  and Found" assistance feature to help you contact the driver.{'\n\n'}

                  <Text style={styles.sectionTitle}>7. Privacy Policy{'\n\n'}</Text>
                  • Your location data is tracked during the trip to ensure safety and accurate billing. Please
                  refer to our [Privacy Link] for details on how we protect your data.{'\n\n'}
                </Text>
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
