import { View, Text, StyleSheet } from 'react-native';
import AppLogo from '../components/AppLogo';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { COLORS } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { loginApi } from '../api/authService';
import { useState } from 'react';

export default function LoginScreen() {
  const navigation = useNavigation();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async () => {
    if (!mobile || !password) {
      Alert.alert("Error", "Mobile and password required");
      return;
    }

    try {
      setLoading(true);
      const res = await loginApi(mobile, password);

      if (res.token) {
        // success
        navigation.replace("DriverDashboard"); // Dashboard / Tabs
      } else {
        Alert.alert("Login Failed", res.message || "Invalid credentials");
      }
    } catch (err) {
      Alert.alert("Error", "Server error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <LinearGradient
      colors={['#ffffff', '#f2f6ff']}
      style={styles.container}
    >

      {/* <AppLogo /> */}

      <Text style={styles.title}>Driver Login</Text>

      <AppInput placeholder="Enter Mobile Number" keyboardType="number-pad"
        onChangeText={setMobile} />
      <AppInput placeholder="Enter Password" secureTextEntry onChangeText={setPassword} />

      <AppButton title={loading ? "Please wait..." : "Submit"} onPress={handleLogin} />

      <View style={styles.links}>
        <Text style={styles.link} onPress={() => navigation.navigate('ForgotPassword')}>Forgot Password</Text>
        <Text style={styles.link} onPress={() => navigation.navigate('DriverDetails')} >Create Account</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
    marginTop: 40,
    marginBottom: 30,
  },
  // card: {
  //   backgroundColor: '#fff',
  //   borderRadius: 20,
  //   padding: 20,
  //   marginTop: 20,
  //   elevation: 5,
  //   shadowColor: '#000',
  //   shadowOpacity: 0.1,
  //   shadowRadius: 10,
  // },

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

});
