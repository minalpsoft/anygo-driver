import { View, Text, Alert, StyleSheet } from 'react-native';
import { useState } from 'react';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { LinearGradient } from 'expo-linear-gradient';
import AppLogo from '../components/AppLogo';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function ForgotPassword({ navigation }) {
    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState(false);

    const sendOtp = async () => {
        if (!mobile) {
            Alert.alert('Error', 'Mobile number required');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile }),
            });

            const data = await res.json();

            if (!res.ok) throw data;

            Alert.alert('Success', 'OTP sent successfully');

            navigation.navigate('ResetPassword', { mobile });

        } catch (err) {
            Alert.alert('Failed', err?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#ffffff', '#f2f6ff']} style={styles.container}>

            <AppLogo />

            <Text style={styles.title}>Forgot Password</Text>

            <AppInput
                placeholder="Enter registered mobile"
                keyboardType="number-pad"
                value={mobile}
                onChangeText={setMobile}
            />

            <AppButton
                title={loading ? 'Sending OTP...' : 'Send OTP'}
                onPress={sendOtp}
            />
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
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});
