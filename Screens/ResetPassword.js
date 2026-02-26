import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { LinearGradient } from 'expo-linear-gradient';
import AppLogo from '../components/AppLogo';
import { Ionicons } from '@expo/vector-icons';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function ResetPassword({ route, navigation }) {
    const { mobile } = route.params;

    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const resetPassword = async () => {
        if (!otp || !newPassword) {
            Alert.alert('Error', 'All fields required');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mobile,
                    otp,
                    newPassword,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw data;

            Alert.alert('Success', 'Password reset successfully');

            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });

        } catch (err) {
            Alert.alert('Failed', err?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#ffffff', '#f2f6ff']} style={styles.container}>

            <View style={styles.backContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={28} color="#000" />
                </TouchableOpacity>
            </View>

            <AppLogo />

            <Text style={styles.title}>Reset Password</Text>

            <AppInput
                placeholder="Enter OTP"
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
            />

            <AppInput
                placeholder="Enter New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                rightIcon={showNewPassword ? "eye-off" : "eye"}
                onRightIconPress={() => setShowNewPassword(!showNewPassword)}
            />

            <AppButton
                title={loading ? 'Resetting...' : 'Reset Password'}
                onPress={resetPassword}
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
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});
